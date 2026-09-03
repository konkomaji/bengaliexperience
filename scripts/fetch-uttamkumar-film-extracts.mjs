/**
 * Ingest, part two: for every film in the filmography that Wikipedia's own
 * table already links to its own article (136 of 211 — see `wikiTarget` in
 * scripts/fetch-uttamkumar-filmography.mjs's cache), pull that article's own
 * lead extract via the MediaWiki API's `prop=extracts`.
 *
 * This is how the site gets past "44 films with a real synopsis, 167 with
 * just a year and a role" without inventing a single plot summary: where
 * Wikipedia has already written a sourced paragraph about a film, that
 * paragraph is reused (with attribution — see prepare-uttamkumar.mjs and
 * /uttamkumar/credits) instead of this project guessing.
 *
 * Wikipedia's text is CC BY-SA 4.0. Reusing it requires attribution, a link
 * to the license, and noting if it was adapted — done in the credits page
 * and on every film page that uses one of these extracts, not just here.
 *
 * Batches 20 titles per request (the API's practical limit for `extracts`),
 * with `redirects=1` so a retitled article still resolves, and records which
 * targets came back `missing` (a wikilink to a page that doesn't actually
 * exist — normal on Wikipedia, MediaWiki doesn't validate links) so those
 * films correctly fall back to year/role only rather than erroring.
 *
 * Usage: node scripts/fetch-uttamkumar-film-extracts.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = path.join(ROOT, "scripts", ".cache");
const FILMOGRAPHY = path.join(CACHE_DIR, "uttamkumar-filmography.json");
const OUT = path.join(CACHE_DIR, "uttamkumar-extracts.json");

const UA = "bengaliexperience.wtf archive ingest (one-off, contact via github.com/konkomaji)";
const API = "https://en.wikipedia.org/w/api.php";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function main() {
  const filmography = JSON.parse(fs.readFileSync(FILMOGRAPHY, "utf8"));
  const targets = [...new Set(filmography.acting.map((f) => f.wikiTarget).filter(Boolean))];
  console.log(`${targets.length} distinct linked titles to fetch extracts for`);

  const extracts = {}; // title -> { extract, missing }
  for (const batch of chunk(targets, 20)) {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "2",
      prop: "extracts",
      exintro: "1",
      explaintext: "1",
      exsentences: "3",
      redirects: "1",
      titles: batch.join("|"),
    });
    const data = await getJson(`${API}?${params}`);
    for (const page of data.query?.pages ?? []) {
      // `page.title` is the resolved (post-redirect) title; map every
      // requested alias that redirected to it back to the same extract via
      // the `redirects` list the API returns alongside `pages`.
      extracts[page.title] = { extract: page.extract ?? null, missing: !!page.missing };
    }
    for (const r of data.query?.redirects ?? []) {
      if (extracts[r.to]) extracts[r.from] = extracts[r.to];
    }
    process.stdout.write(`  batch of ${batch.length} done\n`);
    await sleep(300);
  }

  const withExtract = Object.values(extracts).filter((e) => e.extract).length;
  fs.writeFileSync(OUT, JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), extracts }, null, 2));
  console.log(`wrote ${OUT} — ${withExtract}/${targets.length} titles had a usable extract`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
