# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **"Who's driving?" card** — curator credit in the header: avatar, name, bio
  and an Instagram follow button, matching the reference site's layout.
- **Visible ambient motion.** The scene previously had only a 90-second cloud
  drift at 0.13 opacity — technically running, but imperceptible, so the page
  read as a dead screenshot. Now the hero image has a slow Ken Burns push-in,
  the frame rides an engine bob, blurred streaks rush along the road surface,
  and a warm light bloom breathes over everything. The bus is painted into the
  image and cannot be moved on its own, so the scene moves around it instead.
- **The horn now has a visual.** Pressing it (or `H`) rattles the whole scene
  with a damped shake and flashes a "HORN OK PLEASE" callout, alongside the
  existing synthesized honk.
- Clock now shows **seconds and AM/PM**, ticking every second.
- Live listener count animates when the number changes.

### Changed
- **All visible copy is English.** The on-screen brand is "Bengali Experience";
  the "Bengali Bus Driver Playlist" phrasing is kept only in title/meta/JSON-LD,
  where the search intent actually lives.
- Route pills no longer carry emoji.
- Song titles display romanized only. Bengali script stays in the data for
  structured data and search.

### Fixed
- The `H` horn shortcut appeared in the on-screen legend but was never wired up.

### To do
- Verify layout on real mobile hardware (narrow-viewport rendering has not yet
  been visually confirmed — see Known issues).
- Register the real domain and replace the `.pages.dev` placeholder in
  `src/data/brand.ts`, `public/robots.txt` and `public/sitemap.xml`.
- Create the `ABOARD` KV namespace and fill in the ids in `wrangler.toml`.
- Optional `clouds.png` overlay asset (the scene currently falls back to an
  inline haze, which looks fine).

## [0.1.0] — 2026-08-13

First working build.

### Added
- **Four route pages** at crawlable URLs — Kolkata (`/`), Digha (`/digha`),
  Darjeeling (`/darjeeling`), Shantiniketan (`/shantiniketan`) — each with its
  own hero illustration, ticker, punchline and SEO copy, sharing one playlist.
- **45-track Bengali playlist** spanning retro through the 2020s: Hemanta
  Mukherjee, Manna Dey and Kishore Kumar; Kabir Suman, Nachiketa, Anjan Dutt
  and Mohiner Ghoraguli; Kumar Sanu, Fossils, Chandrabindoo, Cactus and Bhoomi;
  Zubeen Garg, Shreya Ghoshal, Arijit Singh, Shaan; Anupam Roy, Iman
  Chakraborty, Somlata, Nikhita Gandhi and Lagnajita Chakraborty.
- **Image-driven hero scene** — one pre-rendered illustration per route,
  framed with a breakpoint-panned `--hero-position`, a drifting cloud layer,
  legibility washes and film grain.
- **Player** built on the YouTube IFrame API used as an audio-only engine, with
  the iframe parked off-screen and a spinning vinyl record shown instead.
  Play/pause, seek, previous/next, shuffle, repeat (off/all/one), volume with
  persistence, and automatic skip past unplayable videos.
- **Queue sheet** with era filter chips (retro / '90s / 2000s / 2010s / 2020s).
- **Ticket sheet** — a bus-ticket-styled share card with seat code, barcode and
  perforation, using the Web Share API with a clipboard fallback.
- **Horn** easter egg — a two-tone bus horn synthesized with Web Audio, so
  there's no audio asset to license or host.
- **Live "aboard" counter** — a Cloudflare Pages Function backed by KV with
  self-expiring keys; anonymous, no cookies, no PII.
- **Live IST clock** in the header — the bus runs on Kolkata time regardless of
  where the listener is.
- **Keyboard shortcuts**: space, arrows, `N`/`P`, `Q`, `T`, `H`, with an
  on-screen legend.
- **SEO / AEO / GEO**: per-route title, meta, canonical and schema.org
  `MusicPlaylist` JSON-LD listing every track, rewritten at the edge by
  `functions/_middleware.ts` so crawlers and AI answer engines get correct tags
  without executing JavaScript. Plus `sitemap.xml`, `robots.txt` (explicitly
  allowing AI crawlers), `llms.txt` and a web manifest.
- Reduced-motion support and safe-area insets for notched devices.

### Notes on decisions
- **The scene is an image, not code.** An earlier attempt drew the bus and
  landscape as animated SVG with parallax; it never looked convincing. The site
  this project takes inspiration from turned out to use a single pre-rendered
  illustration with a static vehicle, and adopting that approach fixed the
  problem outright while costing nothing at runtime.
- **Every YouTube id was validated via oEmbed before being committed.** A video
  can be live and still refuse to embed (oEmbed returns `401`), in which case
  the player silently plays nothing. Ten of the first 42 candidate tracks
  failed this check and were replaced.
- **The modals avoid `AnimatePresence`.** Under framer-motion v13 with React 19,
  its exit transition did not flush on its own — sheets stayed mounted until an
  unrelated re-render (the header clock ticking) forced them out, so a modal
  visibly refused to close. Plain conditional rendering unmounts reliably; the
  enter animation is kept and only the exit fade is lost.
- Hero PNGs are converted to quality-82 mozjpeg at build-prep time, cutting
  each from ~2 MB to ~200 KB. Originals live in `design/source/` and are
  gitignored.

### Known issues
- Narrow-viewport rendering has not been visually verified. The development
  environment's window-resize control reported success but never actually
  changed the viewport, so mobile layout is currently defensive-by-construction
  rather than confirmed. Please check on a real phone.
- A handful of tracks sit on unofficial uploader channels (`Bengali Folk Mp3`,
  `Bengali Music Directory`, `Antaheen`), which are more likely than label
  channels to disappear over time. Re-run the oEmbed validation periodically.
- Release years for several older non-film tracks are best-estimate album
  dates; the era buckets are correct even where the exact year is approximate.
