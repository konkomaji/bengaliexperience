/**
 * Turns the delivered art in design/source/ into the layers the driving scene
 * actually runs on, in public/scene/.
 *
 * Run by hand after new art lands, and the output is committed, so a normal
 * build needs neither sharp nor this script:
 *
 *   node scripts/prepare-scene.mjs
 *
 * Four jobs, each fixing something the art cannot be expected to arrive with:
 *
 *  1. **Cut the bus out.** It was delivered flattened onto white, no alpha
 *     channel at all. A plain white key would eat the cream skirt and the
 *     window frames, so the background is found by flood fill inward from the
 *     border: only white that is connected to the outside goes.
 *
 *  2. **Find the axles.** The wheel arches are open at the bottom, so they are
 *     part of that same background region. Reading the silhouette's lower
 *     profile finds each arch as a dome, and a dome's centre is the axle. That
 *     is what makes the separate wheels sit in the arches instead of near
 *     them, and it means no reference image is needed.
 *
 *  3. **Centre the wheel.** Delivered 5.5px high of centre. Invisible at rest
 *     and a visible wobble once it is rotating, so it is re-cropped around its
 *     own bounding box.
 *
 *  4. **Close the tiling seams.** The road and the far and mid layers tile
 *     honestly. bg-near does not, by roughly nine times a normal column join.
 *     Each layer gets a wrap blend: the tail is crossfaded over the head and
 *     the overlap is cropped off, so the new edges are guaranteed to meet.
 *
 *  5. **Trim the optional extras.** The overtaking taxi and lorry and the
 *     exhaust puff each get cropped to their own alpha bounding box so the
 *     sprite carries no dead margin. Traffic keeps its wheels attached — it
 *     passes too fast to read a slip — so it needs none of the axle work. The
 *     puff is squared and centred like the bus wheel, because the scene scales
 *     it about its own middle. All three are skipped cleanly if absent, so the
 *     main scene still builds before the optional art has been delivered.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const at = (p) => fileURLToPath(new URL(p, import.meta.url));
const SRC = (f) => at(`../design/source/${f}`);
const OUT = at("../public/scene/");

mkdirSync(OUT, { recursive: true });

/** Background is light and unsaturated. The bus has cream panels, so this is
 *  deliberately tight; connectivity does the rest of the work. */
const isBackground = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return min > 228 && max - min < 14;
};

/**
 * Alpha from a flood fill inward from every border pixel.
 *
 * Connectivity is the whole point: white enclosed by the bus (the skirt, the
 * window frames, the shirt of a passenger) is never reached, so it survives.
 */
function backgroundMask(data, W, H, channels) {
  const bg = new Uint8Array(W * H);
  const stack = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = y * W + x;
    if (bg[i]) return;
    const p = i * channels;
    if (!isBackground(data[p], data[p + 1], data[p + 2])) return;
    bg[i] = 1;
    stack.push(x, y);
  };

  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }

  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  return bg;
}

/**
 * Where the axles are.
 *
 * Walks the underside of the silhouette. Most of it sits on one baseline; the
 * arches are the stretches that lift well above it. Each arch is read as a
 * dome, so its span is the diameter and its centre is the axle.
 */
function findAxles(bg, W, H) {
  const bottom = new Int32Array(W).fill(-1);
  for (let x = 0; x < W; x++) {
    for (let y = H - 1; y >= 0; y--) {
      if (!bg[y * W + x]) { bottom[x] = y; break; }
    }
  }

  const solid = [...bottom].filter((v) => v > 0).sort((a, b) => a - b);
  const baseline = solid[Math.floor(solid.length * 0.9)];
  const lifted = [...bottom].map((v) => v > 0 && baseline - v > 18);

  const arches = [];
  let start = -1;
  for (let x = 0; x <= W; x++) {
    if (lifted[x]) { if (start < 0) start = x; }
    else if (start >= 0) {
      const span = x - start;
      if (span > W * 0.05) {
        let apex = H;
        for (let i = start; i < x; i++) if (bottom[i] > 0 && bottom[i] < apex) apex = bottom[i];
        const r = span / 2;
        arches.push({ x: Math.round(start + r), y: Math.round(apex + r), r: Math.round(r), span });
      }
      start = -1;
    }
  }

  // The bumper corners lift off the baseline too, and read as small arches.
  // A bus has exactly two axles and they are the two widest openings, so take
  // the largest pair and put them back in road order.
  const axles = arches
    .sort((a, b) => b.span - a.span)
    .slice(0, 2)
    .sort((a, b) => a.x - b.x);

  // Refine each one by fitting a circle to the arch itself.
  //
  // The rough pass measures where the underside lifts off the baseline, which
  // reads narrower than the opening really is and gave a radius 16% short:
  // wheels visibly too small for their arches, with the dark arch showing
  // around the tyre. The arch is a circle, so measure its half-width at two
  // heights and solve for the centre and radius directly. This also recovers
  // an axle that sits below the sprite's bottom edge, which is the usual case
  // and cannot be observed any other way.
  const halfWidthAt = (cx, y) => {
    if (y < 0 || y >= H) return null;
    let left = cx, right = cx;
    if (!bg[y * W + cx]) return null; // not inside the opening
    while (left > 0 && bg[y * W + (left - 1)]) left--;
    while (right < W - 1 && bg[y * W + (right + 1)]) right++;
    return { hw: (right - left) / 2, cx: (left + right) / 2 };
  };

  for (const a of axles) {
    // Measured up from the underside of the bus, not the bottom of the image.
    // The image has empty space below the vehicle, and sampling there just
    // reads open background on both rows.
    const y1 = baseline - 14;
    const y2 = baseline - 60;
    const m1 = halfWidthAt(a.x, y1);
    const m2 = halfWidthAt(a.x, y2);
    if (!m1 || !m2 || m1.hw <= m2.hw) continue; // not a dome; keep the estimate

    const cy = (m1.hw ** 2 - m2.hw ** 2 + y1 ** 2 - y2 ** 2) / (2 * (y1 - y2));
    const R = Math.sqrt(m1.hw ** 2 + (y1 - cy) ** 2);
    if (!Number.isFinite(cy) || !Number.isFinite(R) || R < a.r) continue;

    a.x = Math.round(m1.cx);
    a.y = Math.round(cy);
    a.r = Math.round(R);
  }

  return { baseline, arches: axles };
}

/** Crossfade the tail over the head, then crop the overlap off, so the two
 *  new edges are the same pixels and the strip repeats forever.
 *
 *  `trimVertical` also crops the empty top and bottom away, down to the rows
 *  that actually carry paint. The road is delivered floating in a much taller
 *  frame — kerb and asphalt in a band, blank above and below — and the scene
 *  treats this strip as solid ground laid at the foot of the screen, so that
 *  blank has to go or it shows as a dead gap under the bus. The parallax
 *  layers keep their transparent margins on purpose, so they never pass this. */
async function makeSeamless(file, out, { blendFraction = 0.12, trimVertical = false } = {}) {
  const img = sharp(SRC(file)).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // Rows that carry paint: opaque and not the near-white the art floats on.
  let top = 0, bot = H - 1;
  if (trimVertical) {
    const painted = (y) => {
      let n = 0;
      for (let x = 0; x < W; x++) {
        const p = (y * W + x) * C;
        const r = data[p], g = data[p + 1], b = data[p + 2];
        if (data[p + 3] > 30 && !(r > 235 && g > 235 && b > 235)) n++;
      }
      return n > W * 0.02;
    };
    let t = H, b = -1;
    for (let y = 0; y < H; y++) if (painted(y)) { if (y < t) t = y; if (y > b) b = y; }
    if (b >= t) { top = t; bot = b; }
  }

  const B = Math.round(W * blendFraction);
  const newW = W - B;
  const outBuf = Buffer.alloc(newW * H * C);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < newW; x++) {
      const src = (y * W + x) * C;
      const dst = (y * newW + x) * C;
      if (x < B) {
        const t = 1 - x / B; // 1 at the join, 0 by the end of the blend band
        const tail = (y * W + (x + newW)) * C;
        for (let c = 0; c < C; c++) {
          outBuf[dst + c] = Math.round(data[src + c] * (1 - t) + data[tail + c] * t);
        }
      } else {
        for (let c = 0; c < C; c++) outBuf[dst + c] = data[src + c];
      }
    }
  }

  const outH = bot - top + 1;
  await sharp(outBuf, { raw: { width: newW, height: H, channels: C } })
    .extract({ left: 0, top, width: newW, height: outH })
    .webp({ quality: 86, alphaQuality: 90, effort: 5 })
    .toFile(`${OUT}${out}.webp`);

  return { file: out, from: `${W}x${H}`, to: `${newW}x${outH}`, blended: B };
}

// ── 1. the bus ────────────────────────────────────────────────────────────
const busSrc = sharp(SRC("bus-body.png"));
const busMeta = await busSrc.metadata();
const { data: busData, info: busInfo } = await busSrc.raw().toBuffer({ resolveWithObject: true });
const { width: BW, height: BH, channels: BC } = busInfo;

/**
 * Where the background is.
 *
 * Art delivered with a real alpha channel says so itself, and its own matte is
 * always better than anything inferred from colour. Art flattened onto white
 * has to be cut out by flood fill instead. The first bus arrived flattened and
 * the second arrived with alpha, so both paths are kept: the pipeline should
 * not care which way the art comes back.
 */
const hasAlpha = BC === 4 && (() => {
  for (let i = 3; i < busData.length; i += BC) if (busData[i] < 250) return true;
  return false;
})();

const bg = hasAlpha
  ? (() => {
      const m = new Uint8Array(BW * BH);
      for (let i = 0; i < BW * BH; i++) m[i] = busData[i * BC + 3] < 40 ? 1 : 0;
      return m;
    })()
  : backgroundMask(busData, BW, BH, BC);

const rgba = Buffer.alloc(BW * BH * 4);
for (let i = 0; i < BW * BH; i++) {
  const s = i * BC;
  rgba[i * 4] = busData[s];
  rgba[i * 4 + 1] = busData[s + 1];
  rgba[i * 4 + 2] = busData[s + 2];
  rgba[i * 4 + 3] = hasAlpha ? busData[s + 3] : (bg[i] ? 0 : 255);
}

const { baseline, arches } = findAxles(bg, BW, BH);

// Trim to the bus itself so the sprite has no dead margin, and record the
// offset, because the axle coordinates have to move with it.
let minX = BW, minY = BH, maxX = 0, maxY = 0;
for (let y = 0; y < BH; y++) {
  for (let x = 0; x < BW; x++) {
    if (!bg[y * BW + x]) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
}
const busW = maxX - minX + 1;
const busH = maxY - minY + 1;

await sharp(rgba, { raw: { width: BW, height: BH, channels: 4 } })
  .extract({ left: minX, top: minY, width: busW, height: busH })
  // A one-pixel blur on alpha only would need a separate pass; the fill edge
  // is already clean because the background is flat, so this stays crisp.
  .webp({ quality: 92, alphaQuality: 100, effort: 5 })
  .toFile(`${OUT}bus.webp`);

// ── 2. the wheel, exactly centred ─────────────────────────────────────────
const wheelSrc = sharp(SRC("bus-wheel.png")).ensureAlpha();
const { data: wData, info: wInfo } = await wheelSrc.raw().toBuffer({ resolveWithObject: true });
let wMinX = wInfo.width, wMinY = wInfo.height, wMaxX = 0, wMaxY = 0;
for (let y = 0; y < wInfo.height; y++) {
  for (let x = 0; x < wInfo.width; x++) {
    if (wData[(y * wInfo.width + x) * 4 + 3] > 40) {
      if (x < wMinX) wMinX = x; if (x > wMaxX) wMaxX = x;
      if (y < wMinY) wMinY = y; if (y > wMaxY) wMaxY = y;
    }
  }
}
const wheelSize = Math.max(wMaxX - wMinX, wMaxY - wMinY) + 1;
await sharp(SRC("bus-wheel.png"))
  .ensureAlpha()
  .extract({
    left: Math.round((wMinX + wMaxX) / 2 - wheelSize / 2),
    top: Math.round((wMinY + wMaxY) / 2 - wheelSize / 2),
    width: wheelSize,
    height: wheelSize,
  })
  .webp({ quality: 92, alphaQuality: 100, effort: 5 })
  .toFile(`${OUT}wheel.webp`);

// ── 2b. optional traffic and exhaust sprites ──────────────────────────────
/**
 * Crop a sprite to its own alpha bounding box.
 *
 * `square` re-crops around the centre of that box instead, for anything the
 * scene rotates or scales about its middle: an off-centre puff would drift as
 * it grows, the same wobble the bus wheel is centred to avoid.
 */
async function trimSprite(file, out, { square = false } = {}) {
  const { data, info } = await sharp(SRC(file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > 40) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }

  let left = minX, top = minY, w = maxX - minX + 1, h = maxY - minY + 1;
  if (square) {
    const s = Math.max(w, h);
    left = Math.round((minX + maxX) / 2 - s / 2);
    top = Math.round((minY + maxY) / 2 - s / 2);
    w = h = s;
  }
  // Clamp inside the source: a bounding box that reaches an edge could push a
  // squared crop off it, and sharp treats that as an error rather than padding.
  left = Math.max(0, Math.min(left, W - w));
  top = Math.max(0, Math.min(top, H - h));

  await sharp(SRC(file))
    .ensureAlpha()
    .extract({ left, top, width: w, height: h })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(`${OUT}${out}.webp`);

  return { file: out, w, h };
}

const sprites = {};
for (const [file, out, opts] of [
  // The overtaking taxi and lorry were dropped from the scene; only the
  // exhaust puff is still cut. Their source art stays in design/source, so
  // re-adding a line here brings either back.
  ["exhaust-puff.png", "exhaust", { square: true }],
]) {
  if (!existsSync(SRC(file))) continue;
  const s = await trimSprite(file, out, opts);
  sprites[out] = { w: s.w, h: s.h };
}

// ── 3. the scrolling layers ───────────────────────────────────────────────
const layers = [];
for (const [file, out, opts] of [
  ["road.png", "road", { trimVertical: true }],
  ["bg-far.png", "bg-far", {}],
  ["bg-mid.png", "bg-mid", {}],
  ["bg-near.png", "bg-near", {}],
]) {
  layers.push(await makeSeamless(file, out, opts));
}

// ── 4. what the engine needs to know ──────────────────────────────────────
const geometry = {
  bus: { width: busW, height: busH },
  // Axle centres and arch radius, in the trimmed sprite's own pixel space.
  axles: arches.map((a) => ({ x: a.x - minX, y: a.y - minY, r: a.r })),
  wheel: { size: wheelSize },
  layers: Object.fromEntries(layers.map((l) => [l.file, l.to])),
  sprites,
};

writeFileSync(`${OUT}geometry.json`, `${JSON.stringify(geometry, null, 2)}\n`);

// A content fingerprint of everything the scene ships. The files keep stable
// names — bus.webp, road.webp — so the app appends `?v=<this>` to each URL: a
// changed layer changes the hash and so busts its own cached copy, which lets
// the CDN and the browser cache the art forever instead of re-checking it on
// every visit. Deterministic from the bytes, so a rebuild with no art change
// keeps the same version and nobody re-downloads anything.
const hash = createHash("sha1");
for (const f of readdirSync(OUT).filter((f) => f.endsWith(".webp")).sort()) {
  hash.update(readFileSync(`${OUT}${f}`));
}
hash.update(JSON.stringify(geometry));
const version = hash.digest("hex").slice(0, 8);

// The engine needs these at build time, not over the wire: they decide layout
// on the very first frame, and fetching them would mean a frame of the bus in
// the wrong place.
const dims = (s) => ({ w: Number(s.split("x")[0]), h: Number(s.split("x")[1]) });
writeFileSync(
  at("../src/data/sceneGeometry.ts"),
  `// GENERATED by scripts/prepare-scene.mjs. Do not edit by hand.
//
// Measured off the delivered art: the bus sprite after its background was cut
// away and trimmed, the axle centres read from its own wheel arches, and each
// scrolling layer's size after the tiling seam was closed.

/** Content fingerprint of the scene art, appended to each asset URL as ?v= so
 *  the files can be cached immutably yet still update the moment they change. */
export const SCENE_VERSION = "${version}";

export const SCENE_GEOMETRY = {
  bus: { w: ${busW}, h: ${busH} },
  /** axle centres in the bus sprite's pixel space, and the arch radius */
  axles: ${JSON.stringify(geometry.axles)},
  wheel: { size: ${wheelSize} },
  layers: {
${layers.map((l) => `    "${l.file}": { w: ${dims(l.to).w}, h: ${dims(l.to).h} },`).join("\n")}
  },
  /** optional overtaking traffic and the exhaust puff, in their own pixels */
  sprites: {
${Object.entries(sprites).map(([k, v]) => `    "${k}": { w: ${v.w}, h: ${v.h} },`).join("\n")}
  },
} as const;
`,
);

console.log(`[scene] bus      ${busW}x${busH} (trimmed from ${busMeta.width}x${busMeta.height})`);
console.log(`[scene] baseline y=${baseline}, arches found: ${arches.length}`);
for (const a of geometry.axles) console.log(`[scene]   axle x=${a.x} y=${a.y} r=${a.r}`);
console.log(`[scene] wheel    ${wheelSize}x${wheelSize}`);
for (const l of layers) console.log(`[scene] ${l.file.padEnd(8)} ${l.from} -> ${l.to} (blended ${l.blended}px)`);
console.log(`[scene] version  ${version}`);
for (const [k, v] of Object.entries(sprites)) console.log(`[scene] ${k.padEnd(8)} ${v.w}x${v.h}`);
if (!Object.keys(sprites).length) console.log("[scene] no optional sprites present");
