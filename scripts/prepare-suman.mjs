/**
 * Derive the Kabir Suman catalogue from the archive cache.
 *
 * Input   scripts/.cache/suman-archive.json  (scripts/fetch-suman-archive.mjs)
 * Output  src/data/kabirsuman/catalogue.generated.ts   the index, committed
 *         public/kabirsuman/lyrics/<album>.json        the words, committed
 *
 * The split is the whole design. The index carries one line per song — id,
 * both titles, album, year, line count — and is imported by the app, the edge
 * renderer and the sitemap, so it has to stay small: 317 songs of Bengali
 * lyric is about 600 KB and has no business in a JavaScript bundle that every
 * visitor downloads. The lyrics themselves are written one file per album and
 * fetched only when a song page opens, which is also the moment they are the
 * only thing on screen.
 *
 * Editorial metadata — the corrected year, the label, the record type, the
 * hand-set Roman title, what the title means in English — lives in
 * src/data/kabirsuman/albums.ts and is NOT generated. The archive knows what
 * it holds; it does not know that its year for one album disagrees with three
 * discographies, and that judgement should sit in a file a person edits.
 *
 * Usage: node scripts/prepare-suman.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalise, toRoman, toSlug } from "./lib/bengali-roman.mjs";
import { buildConcordance } from "./lib/concordance.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, "scripts", ".cache", "suman-archive.json");
const OUT_TS = path.join(ROOT, "src", "data", "kabirsuman", "catalogue.generated.ts");
const OUT_LYRICS = path.join(ROOT, "public", "kabirsuman", "lyrics");
const OUT_CONCORDANCE = path.join(ROOT, "public", "kabirsuman", "concordance.json");
const OUT_COUNTS = path.join(ROOT, "src", "data", "kabirsuman", "counts.generated.ts");

if (!fs.existsSync(CACHE)) {
  console.error("no cache — run: node scripts/fetch-suman-archive.mjs");
  process.exit(1);
}

const archive = JSON.parse(fs.readFileSync(CACHE, "utf8"));
const { categories, posts, covers, albumParentId, fetchedAt, origin } = archive;

const decode = (s) =>
  normalise(s)
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "’")
    .replace(/&#8230;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const latinDigits = (s) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

/** "তোমাকে চাই (১৯৯২)" -> title, year, and whatever else was in the bracket */
function splitCategoryName(raw) {
  const name = decode(raw).trim();
  const m = name.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  if (!m) return { title: name, year: null, note: null };
  const year = latinDigits(m[2]).match(/(\d{4})/);
  const note = m[2]
    .replace(/[০-৯0-9]{4}/g, "")
    .replace(/^[,\s]+|[,\s]+$/g, "")
    .trim();
  return { title: m[1].trim(), year: year ? Number(year[1]) : null, note: note || null };
}

/**
 * WordPress post content -> stanzas of lines.
 *
 * The archive's lyrics are one <p> per stanza with <br> between lines, which
 * is exactly the structure a song wants, so it is kept rather than flattened:
 * a stanza break is meaning, and re-deriving it later from blank lines is
 * guesswork. Everything else — inline styles, stray spans, non-breaking
 * spaces from a word processor — is dropped.
 */
function toStanzas(html) {
  return html
    .replace(/\r/g, "")
    .split(/<\/p>/i)
    .map((block) =>
      decode(block.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""))
        .split("\n")
        .map((line) => line.replace(/ /g, " ").trim())
        .filter(Boolean),
    )
    .filter((stanza) => stanza.length > 0);
}

const albumCats = categories.filter((c) => c.parent === albumParentId);
const albumIds = new Set(albumCats.map((c) => c.id));

/** Both sides folded: the cache holds whatever the site served, this file
 *  holds whatever the editor typed, and the two disagree on ড় ঢ় য় ো ৌ. */
const coverByName = new Map(covers.map((c) => [normalise(decode(c.categoryName)), c.file]));

/** the archive's own top-level category for "this post is a song lyric" */
const LYRIC_CATEGORY = categories.find((c) => decode(c.name).startsWith(normalise("গানের লিরিক")));

// --- albums ------------------------------------------------------------
/**
 * Two albums are called জাতিস্মর — the 1997 record and the 2014 film score —
 * and they slug identically. Unhandled, the second one silently overwrites the
 * first's lyric file and the site ships one album's words under the other's
 * name. So a title used more than once takes its year, and only then.
 */
const titleCounts = new Map();
for (const c of albumCats) {
  const t = toSlug(splitCategoryName(c.name).title);
  titleCounts.set(t, (titleCounts.get(t) ?? 0) + 1);
}

const albums = albumCats
  .map((c) => {
    const { title, year, note } = splitCategoryName(c.name);
    const base = toSlug(title) || `album-${c.id}`;
    const slug = titleCounts.get(base) > 1 && year ? `${base}-${year}` : base;
    return {
      catId: c.id,
      slug,
      bn: title,
      roman: toRoman(title),
      archiveYear: year,
      archiveNote: note,
      cover: coverByName.get(decode(c.name)) ?? null,
      archiveUrl: c.link,
      archiveCount: c.count,
    };
  })
  .sort((a, b) => (a.archiveYear ?? 9999) - (b.archiveYear ?? 9999) || a.bn.localeCompare(b.bn));

// --- songs -------------------------------------------------------------
const seenSlug = new Map();
/** slugs collide — Ms. Marvel #1 taught the Atlas this. Disambiguate rather
 *  than let one song silently overwrite another. */
function uniqueSlug(base, hint) {
  const first = base || "song";
  if (!seenSlug.has(first)) {
    seenSlug.set(first, 1);
    return first;
  }
  const withHint = hint ? `${first}-${hint}` : first;
  if (withHint !== first && !seenSlug.has(withHint)) {
    seenSlug.set(withHint, 1);
    return withHint;
  }
  const n = seenSlug.get(first) + 1;
  seenSlug.set(first, n);
  return `${first}-${n}`;
}

const songs = [];
const lyricsByAlbum = new Map();

const lyricPosts = posts.filter(
  (p) => LYRIC_CATEGORY && p.categories.includes(LYRIC_CATEGORY.id),
);

for (const p of lyricPosts) {
  const catId = p.categories.find((id) => albumIds.has(id)) ?? null;
  const album = catId ? albums.find((a) => a.catId === catId) : null;
  const stanzas = toStanzas(p.content.rendered);
  const lines = stanzas.reduce((n, s) => n + s.length, 0);
  const bn = decode(p.title.rendered).trim();

  const song = {
    id: p.id,
    slug: uniqueSlug(toSlug(bn), album ? String(album.archiveYear ?? "") : ""),
    bn,
    roman: toRoman(bn),
    albumSlug: album ? album.slug : null,
    year: album ? album.archiveYear : null,
    lines,
    stanzas: stanzas.length,
    archiveUrl: p.link,
  };
  songs.push(song);

  const key = album ? album.slug : "uncollected";
  if (!lyricsByAlbum.has(key)) lyricsByAlbum.set(key, {});
  lyricsByAlbum.get(key)[song.slug] = stanzas;
}

// --- prose: interviews, essays, poetry, the archive's other holdings ----
const PROSE_CATEGORIES = {
  interviews: "সাক্ষাৎকার",
  poetry: "কবিতা",
  articles: "Articles",
  sumanami: "সুমনামি",
  context: "প্রসঙ্গের প্রেক্ষাপটে",
  nationalAward: "জাতীয় পুরস্কার",
  memoir: "স্মৃতি চারণ",
  translated: "অনুবাদকৃত লিরিক",
  fromBlog: "ব্লগ থেকে",
  epaper: "ই-পেপার",
};

const prose = Object.fromEntries(
  Object.entries(PROSE_CATEGORIES).map(([key, prefix]) => {
    const cat = categories.find((c) => decode(c.name).startsWith(normalise(prefix)));
    if (!cat) return [key, []];
    const items = posts
      .filter((p) => p.categories.includes(cat.id))
      .map((p) => ({
        id: p.id,
        bn: decode(p.title.rendered).trim(),
        roman: toRoman(decode(p.title.rendered).trim()),
        date: p.date.slice(0, 10),
        archiveUrl: p.link,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
    return [key, items];
  }),
);

// --- concordance -------------------------------------------------------
const concordance = buildConcordance(
  songs.map((s) => ({
    slug: s.slug,
    year: s.year,
    stanzas: lyricsByAlbum.get(s.albumSlug ?? "uncollected")[s.slug],
  })),
);

// --- write -------------------------------------------------------------
fs.mkdirSync(OUT_LYRICS, { recursive: true });
fs.mkdirSync(path.dirname(OUT_TS), { recursive: true });

for (const [key, map] of lyricsByAlbum) {
  fs.writeFileSync(path.join(OUT_LYRICS, `${key}.json`), JSON.stringify(map));
}

fs.writeFileSync(
  OUT_CONCORDANCE,
  JSON.stringify({ stats: concordance.stats, entries: concordance.entries }),
);

const collected = songs.filter((s) => s.albumSlug).length;
const banner = `// Generated by scripts/prepare-suman.mjs from the sumanami.co.uk archive.
// Do not edit by hand. Editorial metadata lives in ./albums.ts.
// Archive read ${fetchedAt.slice(0, 10)} from ${origin}.
`;

const ts = `${banner}
export interface ArchiveAlbum {
  /** the archive's WordPress category id, the join key back to source */
  catId: number;
  slug: string;
  bn: string;
  /** machine transliteration; albums.ts overrides every one of these */
  roman: string;
  /** the year in the archive's own category name, before any correction */
  archiveYear: number | null;
  /** anything else the bracket held, e.g. "সাবিনা ইয়াসমিনের সঙ্গে" */
  archiveNote: string | null;
  /** filename under /kabirsuman/covers/ */
  cover: string | null;
  archiveUrl: string;
  /** how many lyrics the archive files under this album */
  archiveCount: number;
}

export interface ArchiveSong {
  id: number;
  slug: string;
  bn: string;
  roman: string;
  /** null for the songs the archive holds outside any album */
  albumSlug: string | null;
  year: number | null;
  lines: number;
  stanzas: number;
  archiveUrl: string;
}

export interface ProseItem {
  id: number;
  bn: string;
  roman: string;
  date: string;
  archiveUrl: string;
}

export const ARCHIVE_READ_AT = ${JSON.stringify(fetchedAt.slice(0, 10))};
export const ARCHIVE_ORIGIN = ${JSON.stringify(origin)};

export const ARCHIVE_ALBUMS: ArchiveAlbum[] = ${JSON.stringify(albums, null, 2)};

export const ARCHIVE_SONGS: ArchiveSong[] = ${JSON.stringify(songs, null, 2)};

export const ARCHIVE_PROSE: Record<string, ProseItem[]> = ${JSON.stringify(prose, null, 2)};
`;

fs.writeFileSync(OUT_TS, ts);

// --- report ------------------------------------------------------------
const size = (p) => (fs.statSync(p).size / 1024).toFixed(0);
console.log(`albums            ${albums.length}  (covers: ${albums.filter((a) => a.cover).length})`);
console.log(`songs             ${songs.length}  (${collected} on albums, ${songs.length - collected} uncollected)`);
console.log(`lyric files       ${lyricsByAlbum.size}`);
for (const [key, items] of Object.entries(prose)) {
  if (items.length) console.log(`prose.${key.padEnd(13)} ${items.length}`);
}
console.log(`\n${path.relative(ROOT, OUT_TS)}  ${size(OUT_TS)} KB`);
const lyricBytes = fs
  .readdirSync(OUT_LYRICS)
  .reduce((n, f) => n + fs.statSync(path.join(OUT_LYRICS, f)).size, 0);
console.log(`${path.relative(ROOT, OUT_LYRICS)}/  ${(lyricBytes / 1024).toFixed(0)} KB across ${lyricsByAlbum.size} files`);
fs.writeFileSync(
  OUT_COUNTS,
  `// Generated by scripts/prepare-suman.mjs. Do not edit by hand.
// A handful of plain-literal counts, split out from catalogue.generated.ts
// so that src/data/kabirsuman/seo.ts — reached eagerly from every page via
// src/data/seo.ts — can quote them without pulling the ~160KB catalogue
// (all 30 albums and 317 songs) into the main JS bundle. See
// src/App.tsx's lazy-loaded Kabir Suman routes for the other half of this.
export const TOTAL_ALBUMS = ${albums.length};
export const TOTAL_SONGS = ${songs.length};
export const FIRST_YEAR = ${Math.min(...albums.filter((a) => a.archiveYear).map((a) => a.archiveYear))};
export const LATEST_YEAR = ${Math.max(...albums.filter((a) => a.archiveYear).map((a) => a.archiveYear))};
`,
);

console.log(
  `${path.relative(ROOT, OUT_CONCORDANCE)}  ${size(OUT_CONCORDANCE)} KB — ` +
    `${concordance.stats.tokens.toLocaleString("en")} tokens, ` +
    `${concordance.stats.uniqueForms.toLocaleString("en")} forms, ` +
    `${concordance.stats.indexed.toLocaleString("en")} indexed`,
);

const dupes = songs.filter((s, i) => songs.findIndex((o) => o.slug === s.slug) !== i);
if (dupes.length) {
  console.error(`\nSLUG COLLISIONS (${dupes.length}):`, dupes.map((d) => d.slug).join(", "));
  process.exit(1);
}
const noAlbumCover = albums.filter((a) => !a.cover);
if (noAlbumCover.length) console.log(`\nalbums without a cover: ${noAlbumCover.map((a) => a.bn).join(", ")}`);
