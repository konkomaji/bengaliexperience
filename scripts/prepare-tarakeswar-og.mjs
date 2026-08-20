/**
 * Generates public/tarakeswar/og.jpg, the one social share card for the
 * whole Tarakeswar section (all four pages and every blog post share it,
 * the same "one card, one subject" reasoning src/data/brand.ts uses for the
 * rest of the site's single og:image).
 *
 * The background is the section's own commissioned illustration
 * (design/source/tarakeswar/og-source.png, a wide crop of the same artwork
 * as the header badge, public/tarakeswar/badge.webp) rather than a stock
 * photo or a flat gradient: Dudhpukur pond and the temple domes behind it,
 * painted, not photographed. A bottom gradient and the title are
 * composited on top with sharp, the same tool the rest of the asset
 * pipeline uses (scripts/prepare-scene.mjs). The source PNG lives under
 * design/, gitignored like every other delivered master file; only the
 * generated og.jpg is committed.
 *
 * Run by hand after the source art changes, output committed, same
 * convention as the other prepare-*.mjs scripts:
 * `node scripts/prepare-tarakeswar-og.mjs`.
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";

const W = 1200;
const H = 630;

const outDir = fileURLToPath(new URL("../public/tarakeswar/", import.meta.url));
mkdirSync(outDir, { recursive: true });

const sourceArt = fileURLToPath(new URL("../design/source/tarakeswar/og-source.png", import.meta.url));

const overlaySvg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a1108" stop-opacity="0"/>
      <stop offset="55%" stop-color="#1a1108" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#1a1108" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <text x="64" y="482" font-family="Georgia, 'Noto Serif', serif" font-size="92" font-weight="700" fill="#fffaf5">Tarakeswar</text>
  <text x="66" y="536" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="#ffcf9e" letter-spacing="1">Travel &amp; Pilgrimage Guide</text>
  <text x="66" y="580" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#ffffff" opacity="0.85">bengaliexperience.wtf/tarakeswar</text>
</svg>
`;

const base = await sharp(sourceArt).resize(W, H, { fit: "cover", position: "attention" }).toBuffer();
const composed = await sharp(base)
  .composite([{ input: Buffer.from(overlaySvg) }])
  .jpeg({ quality: 90 })
  .toBuffer();

const outPath = outDir + "og.jpg";
const tmpPath = outPath + ".tmp";
writeFileSync(tmpPath, composed);
renameSync(tmpPath, outPath);

console.log("[prepare-tarakeswar-og] wrote public/tarakeswar/og.jpg");
