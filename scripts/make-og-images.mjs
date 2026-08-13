/**
 * Builds public/og/og-<route>.jpg — the social card for each route.
 *
 * Every route used to share one /opengraph.jpg, so four different pages
 * previewed identically in a share sheet and the link gave no clue which ride
 * it opened. The hero illustrations already exist and already say where you
 * are, so the cards are cropped from them.
 *
 * The heroes are 1920×825 (2.33:1) and a social card is 1200×630 (1.90:1), so
 * this crops width, not height — the bus is painted near the middle of each
 * illustration and survives, while the top and bottom bands that the page
 * hides under gradients stay visible here, where nothing is layered over them.
 *
 * Run by hand after changing a hero; the output is committed like the heroes
 * themselves, so a normal build needs neither sharp nor this script:
 *   node scripts/make-og-images.mjs
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROUTES = ["kolkata", "digha", "darjeeling", "shantiniketan"];
const at = (p) => fileURLToPath(new URL(p, import.meta.url));

mkdirSync(at("../public/og/"), { recursive: true });

for (const id of ROUTES) {
  const from = at(`../public/hero/hero-${id}.jpg`);
  const to = at(`../public/og/og-${id}.jpg`);

  await sharp(from)
    // Centre crop, not sharp's entropy/attention picker: the bus is composed
    // into the middle of every hero on purpose, and letting an algorithm hunt
    // for "interest" would frame a different part of each one.
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(to);

  console.log(`[og] og-${id}.jpg`);
}
