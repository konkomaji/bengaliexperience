<div align="center">

# 🚌 Bengali Experience

**Small, free, no-login websites that put you *inside* a single Bengali thing — not an article about it, the thing itself, running in a browser tab.**

[**bengaliexperience.wtf →**](https://bengaliexperience.wtf)

![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)

</div>

---

## The idea

Most "culture" sites hand you a gallery or an essay and leave you outside, looking in. This one tries the opposite: one ordinary Bengali moment per site, rebuilt as something you can sit inside for as long as you like, from anywhere.

Two stops are open, two are being built:

| | Experience | State |
|---|---|---|
| 🚌 | **Bengali Bus Driver Playlist** — a West Bengal night bus with the driver's music on | **live** |
| 📻 | **Mahalaya Listening** — the Mahishasuramardini broadcast at dawn | **live** |
| 🪔 | **Pandal Hopping** — a night walk through Durga Puja pandals | building |
| 😴 | **Sunday Afternoon** — mangshor jhol, a ceiling fan, and the nap after | building |

### And one experiment

Not a Bengali experience, and deliberately not on that shelf — a separate thing built with the same approach, kept at its own path with its own design:

| | | |
|---|---|---|
| 🕸️ | **[Marvel Multiverse Atlas — The Living Map of Marvel](https://bengaliexperience.wtf/marvelmultiverseatlas/)** | **live** |

Every Marvel film, series, special, one-shot and short released to date, resolved into one dataset and plotted five ways — by release, by in-universe chronology, by the connections crossing between realities, by the comics behind them, and against a live clock ticking inside the Marvel Universe. It is a self-contained static app mounted under `public/`, with its own stylesheet, its own theme and its own generated pages; the edge middleware passes its paths straight through untouched. See `public/marvelmultiverseatlas/README.md`.

---

## What's live — the bus

Board a Kolkata bus at dusk. It drives — the road scrolls, the city slides past in parallax, the wheels turn, the body rides on its springs, and diesel trails off the tailpipe. Press the horn and the whole scene lurches. Behind it plays a nonstop stream of Bangla bangers from the 90s to the 20s, **shuffled fresh and dropped in at a random point on every visit**, so no two people board the same bus.

No account. No paywall. Nothing to install.

---

## What's live — Mahalaya

A 1990s Kolkata room in the dark before dawn, an old valve radio on the barred windowsill, and the city and sky beyond it. **Press the radio** and the original *Mahishasuramardini* broadcast plays from the start — Birendra Krishna Bhadra reciting the Chandi — and across its hour and a half the sky in the window lifts from an Amavasya night to the sun cresting the South Kolkata rooftops, the way the real morning arrives while it is read. **মা আসছেন** glows in as it plays, over a live countdown to Durga Puja.

Drag the radio's tuning knob to scrub, and the dawn turns with it — because the sky is driven by how far through the broadcast you are.

---

## What's also live — the Atlas

Not a Bengali experience, and the one thing here that isn't about Bengal at all. The **[Marvel Multiverse Atlas](https://bengaliexperience.wtf/marvelmultiverseatlas/)** is every Marvel film, series, television movie, special presentation, one-shot and short released for screen — **183 titles, 103 landmark comics, 51 realities, 135 verified crossings** — resolved into one dataset and plotted five ways: by release, by when each story happens inside the Marvel Universe, by the connections that cross between realities, by the comics the screen adapted, and against a clock ticking live inside the Marvel Universe itself.

It runs off its own stylesheet and its own theme, has no React in it, and the edge middleware passes its paths through without touching them. It is a separate property that shares a domain — see `public/marvelmultiverseatlas/README.md`.

---

## Under the hood

The interesting parts are all in *how* it's built.

### The driving scene is real, not a video

The bus is a proper little physics toy, drawn straight to the DOM inside one `requestAnimationFrame` loop (`src/components/RoadScene.tsx`). React renders it once and never touches it again — sixty state updates a second would cost more than the animation.

One number drives everything: **ground speed**. Every other motion is *derived* from it rather than tuned by eye, so nothing can drift out of step:

- **Wheels** spin at `ω = v / r`, each tyre off its own measured radius — get this wrong and the wheels visibly slip.
- **Parallax** layers scroll at real depth ratios (far `0.16` → road `1.0`).
- **Suspension** is a damped spring driven by a road-roughness function of *distance travelled*, so the same pothole always hits in the same place.
- **Pitch** comes out of the spring's velocity, so the body noses down as it drops and lifts as it recovers.
- **Speed itself** is measured in the bus sprite's own pixels, not screen pixels, so the ride plays at the same apparent speed — and hits the same bumps in the same places — on a phone and a desktop alike.

The art arrives as flat PNGs; a build-time pipeline (`scripts/prepare-scene.mjs`, using `sharp`) turns it into the layers the engine runs on. It flood-fills the bus off its background, **reads the axle positions straight off the wheel arches** so the separate wheels land exactly in them, re-centres the wheel sprite, and closes the tiling seams on the scrolling layers. It emits the measured geometry and a content hash as generated TypeScript, so layout is correct on the very first painted frame.

### The Mahalaya window is painted art plus a coded dawn

The Mahalaya scene (`src/components/DawnScene.tsx`) composites delivered art with a dawn drawn entirely in code. One number runs it — how far through the ~90-minute broadcast you are — and the sky in the window is lerped from an Amavasya (moonless) night to the sun cresting the rooftops across its whole length; the sky gradient, the rising sun, a drifting cloud, twinkling stars, a CSS South Kolkata skyline, the light through the bars, the dust and a tungsten-bulb flicker are all code.

Its pipeline (`scripts/prepare-mahalaya.mjs`) does the one thing the art can't arrive with: the room is delivered flattened, its window filled with a painted grey checkerboard, so it **keys that back to real transparency** — only the light, neutral pixels inside the window, so the dark iron bars survive — and records the window's bounding box. The scene reproduces the room's `object-fit: cover` crop from that geometry, so the sky behind the glass and the click-target on the radio land exactly on the paint at any size (verified pixel-exact against the browser's own cover math).

**The radio is the control.** Click it to play or pause; drag its tuning knob to scrub — and because the dawn is driven by broadcast position, turning the knob turns the sky. The broadcast plays linearly from the start (`src/hooks/useBroadcast.ts`), because it is a ritual you sit through, not a playlist. মা আসছেন floats in the corner and glows in as it plays, over a live countdown to Durga Puja.

### Playback with no tracklist

The player loads whole YouTube playlists natively (`listType: "playlist"`) instead of embedding a hardcoded list. **Add a song on YouTube and it appears on the site immediately, no redeploy.** The iframe is parked off-screen as a pure audio engine; a spinning vinyl record stands in for it.

Two small tricks matter:
- **The play button *is* the gesture.** Browsers refuse audible autoplay, so `play()` unmutes and starts audibly on the very first press — no "click again to enable sound."
- **The ride starts somewhere random** in the list, for everyone, every visit — set through the player's `index` variable at construction, the one placement YouTube actually honours.

When a list runs out the engine rolls straight into another, so the bus never reaches a dead end.

### The horn is measured, not guessed

Three real horn recordings live in `public/horns/`, one picked at random per press. Each was **decoded and analysed** — an RMS envelope, burst rate, attack time, brightness — and the page is animated on that horn's own rhythm: a sharp single blast jolts and holds, a stuttering one shivers fast. The music ducks for the exact length of the horn (driven off the audio's `ended` event, not a timer), and the picture settles one second *before* the sound does, the way a real horn fades off down the road.

### Rendered at the edge

It's a single-page app, but a Cloudflare Pages Function (`functions/_middleware.ts`) rewrites the response before it ships: one canonical host, one URL per page with real status codes, and — crucially — **the page body is rendered at the edge**, not just the `<head>`. Answer engines that don't run JavaScript get the heading, the direct answer, the facts and the FAQ as real markup instead of an empty `<div id="root">`. Every answer is written once in `src/data/seo.ts` and emitted three ways — crawlable HTML, `schema.org` structured data, and `llms.txt` — so they can't drift. The sitemap and `llms.txt` are generated from the same data, never hand-kept.

### Built to not break

- An **error boundary** falls to a themed "chai break" screen, styled with inline CSS so it renders even if the stylesheet failed to load.
- Dead videos are stepped over; a dead *playlist* is told apart from a slow one and rolled past.
- A **watchdog** catches silent playback refusals by asking the player what it *actually* loaded three seconds later.
- The live "aboard" listener count is cached in KV so a read is one `kv.get`, not a full scan — and it hides itself rather than inventing a number when the endpoint is down.

### Cached hard, updated instantly

Scene files keep stable names, so the pipeline stamps a content hash and the app appends `?v=<hash>` to every asset URL. That lets `/scene/*` be served **`immutable`** at the edge while still updating the moment the art changes: a changed layer is a new URL, an unchanged one is cached forever.

### The Atlas is published twice

The Atlas renders six views client-side out of one HTML file. That's the right shape for exploring it and the wrong shape for everything else: one URL for the whole dataset means nothing in it can be linked to or cited, and a client that doesn't run JavaScript sees an empty shell.

So `scripts/prepare-atlas.mjs` emits the same data a second way — **327 static pages**, built from the Atlas's own design tokens so a page arrived at from a search result reads as the same product as the app it links into. One per title (183), per comic (92), per reality (25), per era (11), per MCU phase (6), per watch order (4), plus six hubs. Each carries its facts as real markup, a direct answer in prose at the top, and `schema.org` that asserts only what the page actually shows.

Three gates **drop real rows on purpose**, because a page per row is how programmatic SEO turns into index bloat: a reality with a designation and nothing behind it, a comic with no released adaptation, and a saga of two titles each restate something said better elsewhere, so they stay browsable in the app instead of becoming a page nobody needed.

**Every date carries its certainty.** Marvel rarely puts a year on screen; 54 in-universe dates here are confirmed against Marvel's published chronology and 18 are marked estimated. No other reference in this space makes that distinction, which is precisely why the pages can't be allowed to round an estimate up into a fact — so the prose is *derived from the dataset* rather than written down. That isn't theoretical: a hardcoded "the first Marvel story chronologically is Captain America: The First Avenger" was already false, because *Eyes of Wakanda* opens in 1260 BC.

### Two properties, one host

The Atlas is not about Bengal, and everything about how it's wired says so rather than hoping a crawler works it out:

- Its own `WebSite` entity, `sitemap.xml`, `llms.txt` and social card — the site's own sitemap omits it entirely, and `robots.txt` lists both so the two are read as two things.
- Linked from an **"Also built here"** section, never the nav or the shelf, so `EXPERIENCES` and its `ItemList` keep meaning what they say (`src/data/experiments.ts` exists to make that separation structural rather than a matter of remembering).
- The middleware returns Atlas paths untouched, and answers an unmatched one with the **Atlas's own 404 at a real 404 status**. `_redirects` can't do this: Pages silently ignores any status there outside 200 and the 3xx family, so the rule would have looked correct and done nothing while the SPA catch-all served the Bengali site at 200 under a Marvel URL.
- `_headers` gives it a revalidating cache rather than `immutable`, because its filenames are stable rather than content-hashed.

---

## Tech stack

| Layer | Choice |
|---|---|
| Build | **Vite 8**, **TypeScript 6**, **oxlint** |
| UI | **React 19**, **React Router 7**, **Tailwind CSS v4**, **Framer Motion** |
| Type | Baloo Da 2 · Hind Siliguri · Manrope (self-hosted via Fontsource) |
| Edge | **Cloudflare Pages** + Pages Functions + **KV** (`wrangler`) |
| Media | YouTube IFrame API (audio) · Web Audio (horn) · `sharp` (asset pipeline) |
| The Atlas | no framework — plain ES5-era script, hand-written CSS on Material 3 Expressive tokens, pages generated by a Node script |

---

## Run it locally

```bash
npm install
npm run dev            # UI only, http://localhost:5173
```

`vite dev` serves the front end. The edge pieces — per-page SEO rewriting, `/sitemap.xml`, `/llms.txt`, the live counter, and the Atlas's 404 — need Wrangler:

```bash
npm run cf:dev         # build + wrangler pages dev dist
```

The Atlas's static pages are generated, not hand-written, and the output is committed. Re-run after its dataset changes:

```bash
npm run atlas          # 327 pages + its sitemap.xml, llms.txt and the app's crawlable body
npm run atlas:og       # its social card — only when the counts change
```

Pushing to `main` deploys, via the connected Cloudflare Pages project.

---

## Project layout

```
index.html              one HTML shell; its head + body are rewritten per page at the edge
src/
├─ components/          RoadScene (the bus engine), DawnScene (the Mahalaya window), Player, Header…
├─ hooks/              usePlayerEngine, useBroadcast, useHorn, useCountdown, useISTClock, useViewport…
├─ data/               all content + config, no logic (brand, scene, playlists, broadcast, seo)
├─ lib/                selection, jsonld, prerender, mahalayaLayout — shared by client + edge
└─ pages/              HomePage · BusDriverPage · MahalayaPage
functions/             Cloudflare Pages Functions (_middleware, sitemap, llms.txt, api/aboard)
scripts/               prepare-scene + prepare-mahalaya (art → layers + geometry), prepare-atlas
                       (dataset → the Atlas's static pages), check-playlists, stamp-lastmod
design/source/         master art PNGs (gitignored); the pipelines turn them into public/scene/*
public/marvelmultiverseatlas/
                       the Marvel Multiverse Atlas: a self-contained static app with its own
                       stylesheet and theme, served verbatim; not part of the React bundle
```

---

<div align="center">

**[bengaliexperience.wtf](https://bengaliexperience.wtf)**

</div>
