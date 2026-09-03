/**
 * The only self-hosted photography in the whole Uttam Kumar section, and
 * every file here was chosen, not just found. Category:Uttam Kumar on
 * Wikimedia Commons holds ten files; six were rejected on inspection
 * despite carrying a "Public domain" or "own work" tag, because the tag
 * doesn't survive looking at the actual image:
 *
 *   - Two ("Basanta Chowdhury & Uttam Kumar", "Ukinnishithe") are visibly a
 *     re-photographed vintage print and a film-still respectively — an
 *     "own work" claim over a photo of an existing photo, or a screenshot of
 *     a film frame, doesn't create a new free licence over the underlying
 *     work. Commons' own tag is wrong; using it would be too.
 *   - One ("Durgadas-bannerjee") is a different actor entirely — Durgadas
 *     Bandopadhyay, a much earlier stage actor — mis-filed into this
 *     category. Using it would misattribute a real person's photo to Uttam
 *     Kumar, not just a licensing problem.
 *   - One ("UttamKumar.jpg") is a genuine own-work CC BY-SA photo, but of a
 *     Kolkata street at night with an indistinct statue far in frame — real
 *     licence, useless as an image of him.
 *   - "The signature by Uttam Kumar.png" has a legitimate license claim but
 *     a shaky chain of custody (sourced from a third party's Facebook post);
 *     skipped for a cleaner credits page rather than argued into inclusion.
 *
 * The four kept are each independently defensible on their own terms, not
 * just "Commons said free": an official government stamp under India's own
 * open licence, two original artist tributes dedicated CC0 by their makers,
 * and a CC0 photograph of a real, physical museum exhibit (not of him, but
 * of an artifact connected to him — a testimonial he actually signed).
 * Full attribution: src/data/uttamkumar/credits.ts, /uttamkumar/credits.
 *
 * Usage: node scripts/prepare-uttamkumar-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "uttamkumar", "photos");
const UA = "bengaliexperience.wtf image ingest (one-off, contact via github.com/konkomaji)";

const IMAGES = [
  {
    slug: "centenary-stamp",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/31/Uttam_Kumar_2009_stamp_of_India.jpg",
    maxWidth: 700,
  },
  {
    slug: "portrait-sketch-murty",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Uttam_Kumar%2C_legendary_actor_of_Bengali_cinema_-_charcoal_pencil_sketch.jpg",
    maxWidth: 700,
  },
  {
    slug: "portrait-sketch-ghosh",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Utttam-Sapta.jpg",
    maxWidth: 700,
  },
  {
    slug: "morgan-house-testimonial",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Morgan_House_Kalimpong_Testimonial_of_Mahanayak_Uttam_Kumar_and_Supriya.jpg",
    maxWidth: 900,
  },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const img of IMAGES) {
    const res = await fetch(img.url, { headers: { "user-agent": UA } });
    if (!res.ok) throw new Error(`${res.status} fetching ${img.url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const outPath = path.join(OUT_DIR, `${img.slug}.webp`);
    await sharp(buf)
      .resize({ width: img.maxWidth, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(outPath);
    console.log(`wrote ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
