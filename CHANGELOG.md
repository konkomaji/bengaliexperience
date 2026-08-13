# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **The player runs on YouTube playlists, not a hardcoded tracklist.** The
  45-track array in `src/data/songs.ts` is gone; the engine loads nine real
  playlists natively (`listType: "playlist"`), so adding a song on YouTube
  makes it appear on the site with no redeploy. `src/lib/title.ts` turns messy
  uploader titles into song + artist for display.
- **Weighted opener selection** (`src/lib/selection.ts`) — IST hour affinity
  and recency (last three openers, remembered in `localStorage`) bias which
  playlist starts the session, weighted rather than ranked, so two people
  boarding in the same minute still get different journeys. Every step falls
  back to a uniform random pick.
- **Breakdown screen + error boundary.** A crash or an unknown URL now lands on
  a themed chai-break scene instead of a white page or a generic 404. Styled
  with inline CSS and its own keyframes, so it renders even if the stylesheet
  and fonts failed to load; the backdrop is `public/hero/breakdown.jpg`.
- **"Who's driving?" card** — curator credit in the header: avatar, name, bio
  and an Instagram follow button, matching the reference site's layout.
- **Visible ambient motion.** The scene previously had only a 90-second cloud
  drift at 0.13 opacity — technically running, but imperceptible, so the page
  read as a dead screenshot. Now the hero image has a slow Ken Burns push-in,
  the frame rides an engine bob, blurred streaks rush along the road surface,
  and a warm light bloom breathes over everything. The bus is painted into the
  image and cannot be moved on its own, so the scene moves around it instead.
- **A real bus horn.** The old two-tone beep lasted a fifth of a second and sat
  under the music. It is now a 3.4-second air horn — two fundamentals a minor
  third apart, each doubled and detuned so the voices beat, through a lowpass
  and a compressor — and **the music ducks under it**, down to 12% in 240ms
  and back up over 700ms. The visitor's own volume is never overwritten.
  Pressing it (or `H`) also rattles the scene and holds a "HORN OK PLEASE"
  callout for the length of the blast.
- **New place, new music.** The four routes share one player, so changing
  scene now deliberately rolls the playlist; with only one usable list left it
  at least skips to another song.
- **The breakdown screen has something to look at.** Embers drift off the
  stove, headlights sweep past down the road and the photograph breathes on a
  34-second cycle, so a screen you might sit on for a while never reads as
  frozen. All of it is inline CSS with its own keyframes — this screen has to
  render even when the stylesheet did not load.
- `npm run check:playlists` — one command that says which playlists the
  embedded player will actually accept, and why the others are refused.
- **A crawlable page body.** The site is a SPA, so the HTML it served had
  perfect meta tags wrapped around an empty `<div id="root">`. Google renders
  JavaScript; the answer engines `robots.txt` explicitly invites — GPTBot,
  PerplexityBot, ClaudeBot, CCBot — mostly do not, so they were being let in
  and shown nothing. The edge middleware now injects the heading, intro,
  route list, playlist list and FAQ into `#root`, which React clears on first
  paint: invisible to visitors, quotable by machines, and identical in
  substance to what the page shows.
- **`FAQPage`, `BreadcrumbList` and `ItemList` structured data**, plus an `h1`
  and standalone intro copy per route, all sourced from `src/data/seo.ts` so
  the visible text, the JSON-LD and `llms.txt` cannot drift apart.
- Clock now shows **seconds and AM/PM**, ticking every second.
- Live listener count animates when the number changes.

### Changed
- **Live on a real domain: `https://bengaliexperience.wtf`.** The
  `.pages.dev` placeholder is gone from `BRAND.url`, `index.html`,
  `robots.txt`, `sitemap.xml` and `llms.txt`, so canonical links, `og:url`,
  the JSON-LD `@id`s and the sitemap now all name the same origin.
  A custom domain does not switch the `*.pages.dev` one off, so the edge
  middleware 301s `bengaliexperience.pages.dev` to the canonical host rather
  than leaving two origins serving identical pages; the match is exact, so
  preview deployments still resolve.
- **All visible copy is English.** The on-screen brand is "Bengali Experience";
  the "Bengali Bus Driver Playlist" phrasing is kept only in title/meta/JSON-LD,
  where the search intent actually lives.
- Route pills no longer carry emoji.
- Song titles display romanized only. Bengali script stays in the data for
  structured data and search.

### Fixed
- **The site never played.** It sat on "Boarding…" forever. Three separate
  causes, all now handled:
  1. Seven of the nine playlists were created in **YouTube Music**. Those get
     an ordinary `PL…` id and open fine on youtube.com, but the IFrame player
     refuses them with error 150 and an empty tracklist, whatever their
     visibility is set to. (Confirmed against YouTube's oEmbed endpoint: 401
     for all seven, 200 for the two made on YouTube proper.)
  2. `onError` on a refused *list* was handled as if a single video had died,
     and `nextVideo()` on an empty playlist does nothing — so the player sat
     there. Empty tracklist now means the list is dead, not the track.
  3. The player only muted itself in `onReady`. Chrome decides whether to
     honour autoplay when the iframe loads, before that ever fires, so
     `mute: 1` is now a player var.
- **The playlist name could lie.** `loadPlaylist` on a refused list does not
  reliably raise `onError`, and `getPlaylistId()` echoes back whatever it was
  asked for — so the header showed one playlist while a different one played.
  Every load is now checked against the tracklist it replaced (by membership,
  since shuffle reorders the array) and rolled on if nothing changed.
- **Dead lists are now caught before they cost silence.** YouTube's oEmbed
  endpoint allows cross-origin reads and answers 200 only for lists the embed
  will take, so a refused list is skipped in ~100ms instead of several seconds
  of dead air. A watchdog still covers anything that slips through, and when
  nothing is left the engine reports `stalled` instead of pretending to load.
- The `H` horn shortcut appeared in the on-screen legend but was never wired up.

### To do
- Recreate the seven YouTube Music playlists as public playlists **on
  youtube.com** — until then the site rides on two lists. Verify with
  `npm run check:playlists`.
- Verify layout on real mobile hardware (narrow-viewport rendering has not yet
  been visually confirmed — see Known issues).
- Submit `https://bengaliexperience.wtf/sitemap.xml` to Google Search Console
  and Bing Webmaster Tools.
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
