/**
 * Generates public/marvelmultiverseatlas/atlas-og.jpg, the one social card for
 * the whole Atlas — its home page and all 327 generated pages share it, the
 * same "one card, one subject" reasoning the rest of this repo uses for
 * BRAND.ogImage and the Tarakeswar section's card.
 *
 * Drawn entirely in code rather than composited over artwork, because the
 * Atlas has no artwork of its own to composite over: every image it displays
 * is a poster or a comic cover served from TMDB or Comic Vine and belonging to
 * somebody else, and putting one of those on a share card would be claiming
 * art the project does not own. What it does own is the dataset, so the card
 * is the dataset — the numbers, on the Atlas's own dark surface with its own
 * red accent.
 *
 * Font families are the generic stacks sharp's SVG renderer can actually
 * resolve, not the webfonts the site loads; the shapes are close enough to the
 * Atlas's heavy grotesque at this size, and a missing font would render as
 * nothing at all.
 *
 * Run by hand, output committed:  node scripts/prepare-atlas-og.mjs
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";

const W = 1200;
const H = 630;

const outDir = fileURLToPath(new URL("../public/marvelmultiverseatlas/", import.meta.url));
const D = JSON.parse(readFileSync(outDir + "data/marvel-universe.json", "utf8"));

const stats = [
  [D.meta.titleCount, "Titles"],
  [D.meta.comicCount, "Comics"],
  [D.meta.universeCount, "Realities"],
  [D.meta.edgeCount, "Connections"],
];

// A deterministic starfield: the same seed every build, so a rebuild that
// changes nothing produces a byte-identical card instead of a spurious diff.
let seed = 20260821;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const stars = Array.from({ length: 90 }, () => ({
  x: (rnd() * W).toFixed(1),
  y: (rnd() * H).toFixed(1),
  r: (0.6 + rnd() * 1.5).toFixed(2),
  o: (0.12 + rnd() * 0.5).toFixed(2),
}));

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="18%" cy="16%" r="72%">
      <stop offset="0%" stop-color="#ff4a55" stop-opacity="0.30"/>
      <stop offset="55%" stop-color="#7a0018" stop-opacity="0.13"/>
      <stop offset="100%" stop-color="#0d0d12" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="86%" cy="88%" r="60%">
      <stop offset="0%" stop-color="#7cd7ff" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#0d0d12" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="title" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="8%" stop-color="#e8e6ef"/>
      <stop offset="52%" stop-color="#ff4a55"/>
      <stop offset="94%" stop-color="#ffc95c"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0d0d12"/>
  ${stars.map((s) => `<circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#e8e6ef" opacity="${s.o}"/>`).join("")}
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- the app's own brand mark -->
  <rect x="72" y="70" width="64" height="64" rx="18" fill="#ff4a55"/>
  <text x="104" y="118" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="42" font-weight="900" text-anchor="middle" fill="#35000a">M</text>

  <text x="154" y="99" font-family="Consolas, monospace" font-size="17" letter-spacing="4" fill="#a9a6b8">CINEMA · SERIES · COMICS</text>
  <text x="154" y="126" font-family="Consolas, monospace" font-size="17" letter-spacing="4" fill="#a9a6b8">TIMELINES · REALITIES</text>

  <text x="72" y="286" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="86" font-weight="900" letter-spacing="-3" fill="url(#title)">Marvel Multiverse</text>
  <text x="72" y="374" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="86" font-weight="900" letter-spacing="-3" fill="url(#title)">Atlas</text>

  <text x="74" y="424" font-family="Arial, Helvetica, sans-serif" font-size="27" fill="#a9a6b8">The Living Map of Marvel</text>

  ${stats
    .map(([n, label], i) => {
      const x = 74 + i * 200;
      return `
  <text x="${x}" y="524" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="52" font-weight="900" fill="#e8e6ef">${n}</text>
  <text x="${x + 3}" y="552" font-family="Consolas, monospace" font-size="15" letter-spacing="3" fill="#a9a6b8">${label.toUpperCase()}</text>`;
    })
    .join("")}

  <rect x="72" y="580" width="34" height="3" rx="1.5" fill="#ff4a55"/>
  <text x="120" y="586" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#ffffff" opacity="0.82">bengaliexperience.wtf/marvelmultiverseatlas</text>
</svg>
`;

const out = outDir + "atlas-og.jpg";
const tmp = out + ".tmp";
writeFileSync(tmp, await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer());
renameSync(tmp, out);

console.log("[prepare-atlas-og] wrote public/marvelmultiverseatlas/atlas-og.jpg");
