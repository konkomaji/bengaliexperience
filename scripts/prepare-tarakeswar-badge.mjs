/**
 * Generates public/tarakeswar/badge.webp (the header logo and hub-page
 * hero mark) and public/tarakeswar/favicon.png (the section's tab icon)
 * from design/source/tarakeswar/badge-source.png, a commissioned circular
 * illustration of Dudhpukur pond and the temple behind it, the same
 * artwork the og.jpg card is cropped from (see prepare-tarakeswar-og.mjs).
 *
 * Run by hand after the source art changes, output committed, same
 * convention as the other prepare-*.mjs scripts:
 * `node scripts/prepare-tarakeswar-badge.mjs`.
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";

const outDir = fileURLToPath(new URL("../public/tarakeswar/", import.meta.url));
mkdirSync(outDir, { recursive: true });

const source = fileURLToPath(new URL("../design/source/tarakeswar/badge-source.png", import.meta.url));

async function writeAtomic(path, buffer) {
  const tmp = path + ".tmp";
  writeFileSync(tmp, buffer);
  renameSync(tmp, path);
}

const badge = await sharp(source).resize({ width: 640 }).webp({ quality: 88 }).toBuffer();
await writeAtomic(outDir + "badge.webp", badge);
console.log("[prepare-tarakeswar-badge] wrote public/tarakeswar/badge.webp", (badge.length / 1024).toFixed(0) + "KB");

const favicon = await sharp(source).resize({ width: 64, height: 64 }).png().toBuffer();
await writeAtomic(outDir + "favicon.png", favicon);
console.log("[prepare-tarakeswar-badge] wrote public/tarakeswar/favicon.png", (favicon.length / 1024).toFixed(0) + "KB");
