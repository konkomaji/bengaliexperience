/**
 * Ingest: pull Uttam Kumar's filmography table straight from Wikipedia's own
 * wikitext, the same "read the structure, don't scrape the render" move
 * fetch-suman-archive.mjs makes against sumanami.co.uk.
 *
 * en.wikipedia.org/wiki/Uttam_Kumar_filmography carries one wikitable per
 * role — acting (211 rows, 1948–2024), producer, director/screenwriter,
 * playback singer/composer — each with `{| class="wikitable...` markup that
 * parses far more reliably than the rendered HTML or a summarising model
 * would. This script fetches the raw wikitext via action=raw and parses it
 * directly.
 *
 * Output is written to scripts/.cache (gitignored); prepare-uttamkumar.mjs
 * turns it into src/data/uttamkumar/films.generated.ts, the committed file
 * an actual build depends on. Run by hand, occasionally — the source page
 * changes a few times a year, not per deploy.
 *
 * Usage: node scripts/fetch-uttamkumar-filmography.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = path.join(ROOT, "scripts", ".cache");
const OUT = path.join(CACHE_DIR, "uttamkumar-filmography.json");

const UA = "bengaliexperience.wtf archive ingest (one-off, contact via github.com/konkomaji)";
const PAGE = "Uttam_Kumar_filmography";

async function getRawWikitext(title) {
  const url = `https://en.wikipedia.org/w/index.php?title=${encodeURIComponent(title)}&action=raw`;
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

/** The wikilink target of a title cell, if it has one — `[[Target|Shown]]`
 *  or `[[Target]]` -> "Target"; a bare `''Title''` with no link -> null,
 *  meaning no Wikipedia article exists to pull a synopsis from. */
function wikiTarget(s) {
  if (!s) return null;
  const m = s.match(/\[\[([^|\]#]+)/);
  return m ? m[1].trim() : null;
}

/** Strip a wikilink/italics/ref soup down to plain display text.
 *  `[[Target|Shown]]` -> Shown, `[[Target]]` -> Target, `''x''`/`'''x'''` ->
 *  x, `<ref>...</ref>` and `{{Efn|...}}` dropped, `{{!}}` -> "|". */
function plain(s) {
  if (!s) return "";
  return s
    .replace(/<ref[^>]*\/>/g, "")
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "")
    .replace(/\{\{Efn\|[^}]*\}\}/g, "")
    .replace(/\{\{Tooltip\|([^|}]*)\|[^}]*\}\}/g, "$1")
    .replace(/\{\{!\}\}/g, "|")
    .replace(/\[\[([^|\]]*)\|([^\]]*)\]\]/g, "$2")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/'''([^']*)'''/g, "$1")
    .replace(/''([^']*)''/g, "$1")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * The acting-credits table: `!Year / !Title / !Role / !Notes / !Ref`, with
 * `rowspan="N"` on the Year cell for years that had more than one release —
 * so a year cell is only present on the first row of its run and has to be
 * carried forward for the rest.
 */
function parseActingTable(wikitext) {
  const start = wikitext.indexOf('{| class="wikitable plainrowheaders sortable"');
  const end = wikitext.indexOf("\n|}", start);
  const table = wikitext.slice(start, end);
  const rows = table.split(/\n\|-/).slice(1); // drop the header-row chunk before the first "|-"

  const films = [];
  let currentYear = null;
  let order = 0;

  for (const row of rows) {
    const lines = row.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    let yearLine = null;
    let titleLine = null;
    let roleLine = null;
    let notesLine = null;
    const dataLines = []; // year / title / role / notes, in the order they appear (year+title use different markers)

    for (const l of lines) {
      if (l.startsWith("|") && !l.startsWith("! scope")) dataLines.push(l.replace(/^\|/, "").trim());
      else if (l.startsWith("! scope=\"row\"")) dataLines.push({ isTitle: true, text: l.replace(/^! scope="row"\s*\|/, "").trim() });
    }

    // dataLines is now: [year?] [title(as object)] [role] [notes] [ref(usually empty)]
    for (const d of dataLines) {
      if (typeof d === "object" && d.isTitle) {
        titleLine = d.text;
      } else if (titleLine === null) {
        yearLine = d; // appears only on a rowspan's first row
      } else if (roleLine === null) {
        roleLine = d;
      } else if (notesLine === null) {
        notesLine = d;
      }
    }

    if (yearLine) {
      const y = yearLine.match(/rowspan="\d+"\s*\|\s*(\d{4})/) ?? yearLine.match(/(\d{4})/);
      if (y) currentYear = Number(y[1]);
    }
    if (!titleLine) continue;

    const title = plain(titleLine);
    if (!title) continue;
    order += 1;
    films.push({
      order,
      year: currentYear,
      title,
      role: plain(roleLine ?? ""),
      note: plain(notesLine ?? ""),
      slug: `${slugify(title)}-${currentYear ?? "u"}`,
      wikiTarget: wikiTarget(titleLine),
    });
  }
  return films;
}

/** The three small role tables (producer / director & screenwriter /
 *  playback singer & composer): `No || Year || Movie || Director || Co-stars
 *  || Music Director || Banner || Role`, one row per line, `||` separated. */
function parseCreditTable(wikitext, heading) {
  const h = wikitext.indexOf(`==${heading}==`);
  if (h === -1) return [];
  const tblStart = wikitext.indexOf("{|", h);
  const tblEnd = wikitext.indexOf("\n|}", tblStart);
  const table = wikitext.slice(tblStart, tblEnd);
  const rows = table.split(/\n\|-/).slice(1);

  const credits = [];
  let currentYear = null;
  for (const row of rows) {
    const line = row.replace(/\n/g, " ").trim();
    if (!line || line.startsWith("!")) continue;
    const cells = line.split("||").map((c) => c.trim());
    // cells[0] is "No", may carry a leading "|"
    const rest = cells.slice(1);
    if (!rest.length) continue;
    const yearCell = rest[0]?.match(/(\d{4})/);
    if (yearCell) currentYear = Number(yearCell[1]);
    const movie = plain(rest[1] ?? "");
    if (!movie) continue;
    credits.push({
      year: currentYear,
      title: movie,
      director: plain(rest[2] ?? ""),
      coStars: plain(rest[3] ?? ""),
      musicDirector: plain(rest[4] ?? ""),
      banner: plain(rest[5] ?? ""),
      role: plain(rest[6] ?? ""),
    });
  }
  return credits;
}

async function main() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  console.log(`fetching wikitext: ${PAGE}…`);
  const wikitext = await getRawWikitext(PAGE);

  const acting = parseActingTable(wikitext);
  const producer = parseCreditTable(wikitext, "As producer");
  const director = parseCreditTable(wikitext, "As director and screenwriter");
  const composer = parseCreditTable(wikitext, "As playback singer and composer");

  const out = {
    fetched: new Date().toISOString().slice(0, 10),
    source: `https://en.wikipedia.org/wiki/${PAGE}`,
    counts: { acting: acting.length, producer: producer.length, director: director.length, composer: composer.length },
    acting,
    producer,
    director,
    composer,
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`wrote ${OUT}`);
  console.log(out.counts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
