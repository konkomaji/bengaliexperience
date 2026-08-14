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

One stop is open, three are being built:

| | Experience | State |
|---|---|---|
| 🚌 | **Bengali Bus Driver Playlist** — a West Bengal night bus with the driver's music on | **live** |
| 📻 | **Mahalaya Listening** — the Mahishasuramardini broadcast at dawn | building |
| 🪔 | **Pandal Hopping** — a night walk through Durga Puja pandals | building |
| 😴 | **Sunday Afternoon** — mangshor jhol, a ceiling fan, and the nap after | building |

---

## What's live — the bus

Board a Kolkata bus at dusk. It drives — the road scrolls, the city slides past in parallax, the wheels turn, the body rides on its springs, and diesel trails off the tailpipe. Press the horn and the whole scene lurches. Behind it plays a nonstop stream of Bangla bangers from the 90s to the 20s, **shuffled fresh and dropped in at a random point on every visit**, so no two people board the same bus.

No account. No paywall. Nothing to install.

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

---

## Tech stack

| Layer | Choice |
|---|---|
| Build | **Vite 8**, **TypeScript 6**, **oxlint** |
| UI | **React 19**, **React Router 7**, **Tailwind CSS v4**, **Framer Motion** |
| Type | Baloo Da 2 · Hind Siliguri · Manrope (self-hosted via Fontsource) |
| Edge | **Cloudflare Pages** + Pages Functions + **KV** (`wrangler`) |
| Media | YouTube IFrame API (audio) · Web Audio (horn) · `sharp` (asset pipeline) |

---

## Run it locally

```bash
npm install
npm run dev            # UI only, http://localhost:5173
```

`vite dev` serves the front end. The edge pieces — per-page SEO rewriting, `/sitemap.xml`, `/llms.txt`, the live counter — need Wrangler:

```bash
npm run cf:dev         # build + wrangler pages dev dist
```

Pushing to `main` deploys, via the connected Cloudflare Pages project.

---

## Project layout

```
index.html              one HTML shell; its head + body are rewritten per page at the edge
src/
├─ components/          RoadScene (the driving engine), Player, Header, Hero, sheets…
├─ hooks/              usePlayerEngine, useHorn, useISTClock, useAboardCount…
├─ data/               all content + config, no logic (brand, scene, playlists, seo)
├─ lib/                selection, jsonld, prerender, title parsing — shared by client + edge
└─ pages/              HomePage · BusDriverPage
functions/             Cloudflare Pages Functions (_middleware, sitemap, llms.txt, api/aboard)
scripts/               prepare-scene (art → scene layers + geometry), check-playlists, stamp-lastmod
design/source/         master art PNGs (gitignored); the pipeline turns them into public/scene/*
```

---

<div align="center">

Built by one person in Kolkata, independent of any label or institution.

**[bengaliexperience.wtf](https://bengaliexperience.wtf)**

</div>
