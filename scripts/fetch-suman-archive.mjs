/**
 * Ingest: pull the sumanami.co.uk archive into a local cache.
 *
 * sumanami.co.uk is a fan-run archive of Kabir Suman's work — 30 album
 * categories, 317 song lyrics, and several hundred interviews, articles and
 * essays. It runs WordPress with the REST API left open, which means the
 * catalogue can be read structurally instead of scraped out of rendered HTML:
 * `/wp-json/wp/v2/categories` is the album list and `/wp-json/wp/v2/posts` is
 * every lyric, each already tagged with the album it belongs to.
 *
 * Two things are deliberately NOT done here:
 *
 *   - **No re-fetch on build.** The output is written to scripts/.cache, which
 *     is gitignored, and the *derived* files it feeds (src/data/kabirsuman/,
 *     public/kabirsuman/) are committed. A deploy must not depend on somebody
 *     else's WordPress being up, and their server should not be hit once per
 *     build for content that changes a few times a year.
 *   - **No hammering.** One request per page of 100, a short pause between
 *     each, a plain identifying user agent. This runs by hand, occasionally.
 *
 * Provenance is the point of the cache: prepare-suman.mjs records which fields
 * came from here so /kabirsuman/sources can credit the archive per field
 * rather than with one vague thank-you at the bottom of a page.
 *
 * Usage: node scripts/fetch-suman-archive.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = path.join(ROOT, "scripts", ".cache");
const OUT = path.join(CACHE_DIR, "suman-archive.json");
const COVER_DIR = path.join(ROOT, "public", "kabirsuman", "covers");

const ORIGIN = "https://sumanami.co.uk";
const UA = "bengaliexperience.wtf archive ingest (one-off, contact via github.com/konkomaji)";

/** the WordPress category that every album category hangs off */
const ALBUM_PARENT_SLUG_HINT = "অ্যালবাম";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function getText(url) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

/** every page of a WP collection, 100 at a time */
async function getAll(endpoint, fields) {
  const out = [];
  for (let page = 1; page <= 20; page++) {
    const url = `${ORIGIN}/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}&orderby=id&order=asc${
      fields ? `&_fields=${fields}` : ""
    }`;
    const batch = await getJson(url);
    if (!Array.isArray(batch) || batch.length === 0) break;
    out.push(...batch);
    process.stdout.write(`  ${endpoint} page ${page}: ${batch.length}\n`);
    if (batch.length < 100) break;
    await sleep(400);
  }
  return out;
}

/**
 * The album covers.
 *
 * The homepage renders the album grid as `<a href=category><img src=albumN
 * alt="<category name>"></a>`, so the alt text carries the category name
 * verbatim. Pairing on that rather than on document order means the mapping
 * proves itself: if the grid is ever reordered, the pairing still holds, and
 * if a name stops matching we find out instead of silently shipping the wrong
 * sleeve on an album.
 */
function coversFromHome(html) {
  const re =
    /<a[^>]*href="([^"]*\/category\/[^"]*)"[^>]*>\s*<img[^>]*src="([^"]*\/(album\d+)\.(png|jpg|jpeg|webp))"[^>]*alt="([^"]*)"[^>]*\/?>\s*<\/a>/g;
  const found = [];
  let m;
  while ((m = re.exec(html))) {
    found.push({ categoryName: decodeEntities(m[5]), url: m[2], file: `${m[3]}.${m[4]}` });
  }
  return found;
}

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function main() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.mkdirSync(COVER_DIR, { recursive: true });

  console.log("categories…");
  const categories = await getAll("categories", "id,count,name,slug,parent,link");

  console.log("posts…");
  const posts = await getAll(
    "posts",
    "id,date,modified,slug,link,title,categories,excerpt,content",
  );

  console.log("homepage (album covers)…");
  const home = await getText(`${ORIGIN}/`);
  const covers = coversFromHome(home);

  const albumParent = categories.find(
    (c) => c.parent === 0 && decodeEntities(c.name).includes(ALBUM_PARENT_SLUG_HINT),
  );
  if (!albumParent) throw new Error("could not find the album parent category");

  const albumCats = categories.filter((c) => c.parent === albumParent.id);
  const unmatched = albumCats.filter(
    (c) => !covers.some((v) => v.categoryName === decodeEntities(c.name)),
  );

  console.log(
    `\n${albumCats.length} album categories, ${covers.length} covers on the homepage, ` +
      `${unmatched.length} without a cover`,
  );
  for (const c of unmatched) console.log(`  no cover: ${decodeEntities(c.name)}`);

  console.log("\ncovers…");
  let downloaded = 0;
  for (const cover of covers) {
    const dest = path.join(COVER_DIR, cover.file);
    if (fs.existsSync(dest)) continue;
    const res = await fetch(cover.url, { headers: { "user-agent": UA } });
    if (!res.ok) {
      console.log(`  FAILED ${cover.file}: ${res.status}`);
      continue;
    }
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    downloaded++;
    await sleep(200);
  }
  console.log(`  ${downloaded} downloaded, ${covers.length - downloaded} already present`);

  fs.writeFileSync(
    OUT,
    JSON.stringify(
      {
        fetchedAt: new Date().toISOString(),
        origin: ORIGIN,
        albumParentId: albumParent.id,
        categories,
        posts,
        covers,
      },
      null,
      1,
    ),
  );

  const bytes = fs.statSync(OUT).size;
  console.log(
    `\nwrote ${path.relative(ROOT, OUT)} — ${categories.length} categories, ` +
      `${posts.length} posts, ${(bytes / 1024 / 1024).toFixed(1)} MB`,
  );
  console.log("next: node scripts/prepare-suman.mjs");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
