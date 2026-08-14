/**
 * Turns the single page images in design/source/ into the files the site
 * ships, in public/. Run by hand after new art lands; the output is committed,
 * so a normal build needs neither sharp nor this script:
 *
 *   node scripts/prepare-pages.mjs
 *
 * These are the images that are NOT part of the scrolling driving scene (that
 * is prepare-scene.mjs). Each is delivered as a tall, flat PNG and has to be
 * cut to the exact file the browser or a social platform asks for.
 *
 *  1. **opengraph.jpg** — the social card. One flat 1200x630 JPEG, the size
 *     link-preview crawlers expect, quality kept high because it is the first
 *     thing anyone sees of the site.
 *
 *  2. **hero/breakdown.jpg** — the pulled-over / 404 backdrop. A portrait JPEG
 *     laid full-bleed behind the "Chai break" screen, so it stays dark and is
 *     only lightly compressed.
 *
 *  3. **the favicon set** — the delivered art arrives transparent, but a tab
 *     icon, an iOS home-screen icon and a PWA icon all want a solid tile, so
 *     each size is flattened onto the brand ground first. Emitted at the sizes
 *     the head and the manifest reference.
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const at = (p) => fileURLToPath(new URL(p, import.meta.url));
const SRC = (f) => at(`../design/source/${f}`);
const PUB = at("../public/");

mkdirSync(at("../public/hero/"), { recursive: true });

/** The brand ground, so a transparent icon never lands on black or white. */
const GROUND = { r: 21, g: 8, b: 3 }; // #150803

// ── 1. the social card ────────────────────────────────────────────────────
await sharp(SRC("opengraph.png"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(`${PUB}opengraph.jpg`);

// ── 2. the pulled-over backdrop ───────────────────────────────────────────
// object-fit: cover crops it live, so it is shipped at its delivered size
// (capped so it is not needlessly heavy) and left to the CSS to place.
await sharp(SRC("breakdown.png"))
  .resize({ width: 1200, height: 1500, fit: "inside", withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${PUB}hero/breakdown.jpg`);

// ── 3. the favicon set ────────────────────────────────────────────────────
// Flattened onto the brand ground: a tab, an iOS tile and a PWA icon all show
// the corners, and a transparent margin there reads as black or white.
const icon = (size, out) =>
  sharp(SRC("favicon.png"))
    .resize(size, size, { fit: "contain", background: { ...GROUND, alpha: 1 } })
    .flatten({ background: GROUND })
    .png()
    .toFile(`${PUB}${out}`);

await icon(32, "favicon-32.png");
await icon(180, "apple-touch-icon.png");
await icon(192, "icon-192.png");
await icon(512, "icon-512.png");

console.log("[pages] opengraph.jpg          1200x630");
console.log("[pages] hero/breakdown.jpg     <=1200 wide");
console.log("[pages] favicon-32 / apple-touch-icon(180) / icon-192 / icon-512");
