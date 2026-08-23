/**
 * Treat the sumanami.co.uk album covers for display.
 *
 * The archive serves cassette- and CD-sleeve scans at a single fixed
 * 166×166 — the size WordPress happened to crop them to in 2019, not a
 * size anyone chose for a modern screen. Two sizes are produced from each,
 * both real photography (see the "real covers" decision — nothing here is
 * redrawn or recoloured):
 *
 *   plate/<slug>.webp   480px, for the album page and the discography grid
 *   chip/<slug>.webp    96px,  for the concordance and inline references
 *
 * `sharp`'s default (Lanczos3) resize handles the upscale; a light
 * `sharpen()` pass after it recovers some of the edge definition a 166px
 * JPEG re-encode loses, which matters more here than on a downscale because
 * every plate on the page is enlarging a small source, not shrinking a
 * large one.
 *
 * Run after scripts/fetch-suman-archive.mjs has populated
 * public/kabirsuman/covers/. Output is committed; run again only when the
 * archive is re-fetched.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(ROOT, "public", "kabirsuman", "covers");
const CATALOGUE = path.join(ROOT, "src", "data", "kabirsuman", "catalogue.generated.ts");
const PLATE_DIR = path.join(ROOT, "public", "kabirsuman", "covers", "plate");
const CHIP_DIR = path.join(ROOT, "public", "kabirsuman", "covers", "chip");

if (!fs.existsSync(CATALOGUE)) {
  console.error("no catalogue — run: node scripts/prepare-suman.mjs first");
  process.exit(1);
}

const src = fs.readFileSync(CATALOGUE, "utf8");
const albums = JSON.parse(src.match(/ARCHIVE_ALBUMS: ArchiveAlbum\[\] = (\[[\s\S]*?\n\]);/)[1]);

fs.mkdirSync(PLATE_DIR, { recursive: true });
fs.mkdirSync(CHIP_DIR, { recursive: true });

async function writeAtomic(dest, buffer) {
  const tmp = dest + ".tmp";
  fs.writeFileSync(tmp, buffer);
  fs.renameSync(tmp, dest);
}

let done = 0;
for (const a of albums) {
  if (!a.cover) {
    console.log(`  no source cover: ${a.slug}`);
    continue;
  }
  const source = path.join(SRC_DIR, a.cover);
  if (!fs.existsSync(source)) {
    console.log(`  MISSING FILE: ${a.cover} (${a.slug})`);
    continue;
  }

  const plate = await sharp(source)
    .resize(480, 480, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 90 })
    .toBuffer();
  await writeAtomic(path.join(PLATE_DIR, `${a.slug}.webp`), plate);

  const chip = await sharp(source)
    .resize(96, 96, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.4 })
    .webp({ quality: 85 })
    .toBuffer();
  await writeAtomic(path.join(CHIP_DIR, `${a.slug}.webp`), chip);

  done++;
}

console.log(`\n${done}/${albums.length} covers treated -> covers/plate (480px) + covers/chip (96px)`);
