# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **The site is a collection now, and the bus is one thing in it.** `/` is a
  front page for Bengali Experience itself: what the project is, why it
  exists, and what is on the shelf. `src/data/experiences.ts` is that shelf,
  with the bus live and three more named and in progress: Mahalaya listening,
  Durga Puja pandal hopping, and the Bengali Sunday afternoon. Planned entries
  carry no URL anywhere, including in the structured data, because a stub page
  with no experience behind it is a thin page and thin pages cost more than
  they return.
- **The bus moved to `/busdriver`.** The two pages chase different searches.
  The front page answers "what is this", which is brand and culture intent;
  the bus page carries "bengali bus driver playlist", the highest-volume
  phrase here, and now gets a page that is only about it. Neither has to
  compromise its title for the other.
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
- **One playlist, honestly, instead of nine that mostly did not work.** Seven
  of the nine were made in YouTube Music, which the IFrame player silently
  refuses, so the site advertised nine and was really running on two. They are
  all gone, replaced by one list that definitely plays: **OG Kumar Sanu**, 93
  tracks. More will be added; nothing around `PLAYLISTS` cares how long the
  array is.
- **A random start on every visit, for everyone.** Shuffle was being set on
  `onReady` and a random track requested with `playVideoAt`, and both were
  silently ignored during startup, so every visitor opened on track one while
  the code read as though it were working. The opening position is now set
  through the `index` player variable when the player is built, which is the
  only moment YouTube honours it. `setShuffle` still runs, but only once
  `getPlaylist()` answers, since it is a no-op before the tracklist lands.
- **The horn is a bus horn now.** Indian commercial vehicles run
  ARAI-certified dual-tone horns at 420 Hz and 560 Hz, a perfect fourth apart,
  and that interval is what makes the sound placeable. It was a minor third,
  which read as a foghorn. The blast is **1.2s** rather than 3.4s, because a
  driver taps the horn instead of leaning on it, with a faster attack, a
  shorter release, and the lowpass opened from 2.6kHz to 4.2kHz because the
  brightness is the part that carries. Ducking was retimed to match.
- **Four routes became one.** Digha, Darjeeling and Shantiniketan are gone,
  along with the route pills and the reroll-on-route-change. The chooser was a
  menu sitting in front of an experience whose whole point is that you do not
  choose, you get on, and four near-identical pages were competing for one
  search intent. `/kolkata`, `/digha`, `/darjeeling` and `/shantiniketan` all
  301 to `/busdriver`. Everything else the bus does is untouched: nine
  playlists, weighted opener selection, the horn and its ducking, the queue,
  the ticket, the aboard counter, the scene motion.
- **One social card instead of four.** With one illustration left in the
  project, per-page crops of it would have been duplication dressed up as
  thoroughness. `public/opengraph.jpg` serves both pages, and
  `scripts/make-og-images.mjs` is gone with the routes it existed for.
- **No em dashes in any visible copy.** Commas, full stops and colons only.
  Code comments are unaffected.
- **`sitemap.xml` and `llms.txt` are generated, not maintained.** Both were
  static files that repeated the route list, the domain and the whole FAQ, so
  every one of those facts existed twice and could quietly disagree with the
  app. They are Pages Functions now, reading the same `src/data/seo.ts` the
  router and the edge rewriter read. The sitemap drops `changefreq` and
  `priority` — Google ignores both — and gains `<lastmod>` taken from `git log`
  per route at build time, omitted rather than faked when the build has no
  history (`scripts/stamp-lastmod.mjs`).
- **A social card per route.** All four pages previewed with the same image, so
  a shared link said nothing about which ride it opened. `npm run make:og`
  centre-crops one card per route out of that route's own hero, and the edge
  swaps it in along with `og:image:alt`.
- **The hero has real alt text.** It was `alt=""` — reasonable for decoration,
  wrong for the one illustration that is the entire visual content of the page.
  The same `imageAlt` now feeds the `<img>`, the social card and an
  `ImageObject` in the graph.
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
- **A single slow start could end the ride permanently.** The 8s watchdog
  marked a playlist unplayable and rolled on, which is correct with nine lists
  and fatal with one: the only list got written off over a slow network and the
  player sat on "Boarding…" with nothing left to try. It now checks whether an
  alternative exists before declaring anything dead, and reloads the same list
  from a different point up to three times when none does. Reaching the end of
  the last list reshuffles instead of stalling.
- **`/kolkata` declared itself canonical.** It is an alias that the router
  redirects to `/`, but the edge built the canonical link from the requested
  path, so the alias pointed at itself and competed with the page it aliases —
  while the JSON-LD on the same response correctly said `/`. Both are built
  from the route's own path now.
- **Unknown URLs returned 200.** `_redirects` sends everything to `index.html`
  so the router can show the breakdown screen; the side effect was that every
  typo and every junk URL was a soft 404 — status 200 tells a crawler the page
  is real, so they accumulate in the index as duplicates of the home page.
  Unmatched paths now return a real 404 and `noindex, follow`, and still render
  the breakdown screen. The existing robots tags are rewritten rather than a
  second one appended, so the page never carries two contradicting directives.
- **The home page's breadcrumb listed itself as its own child** — the site,
  then the same URL again at position 2. It is a single item on `/` now.
- **The hero was invisible to the preloader.** It is the LCP element but React
  renders it, so the browser could not discover it until the JavaScript bundle
  had downloaded, parsed and run. The edge now injects a
  `<link rel="preload" as="image">` for the route's hero.
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
- Add more playlists. There is one, which is honest but thin for a site whose
  whole pitch is that no two rides are alike. Any new list must be made **on
  youtube.com**, not in YouTube Music, or the embed will refuse it silently;
  verify with `npm run check:playlists` before adding it to `PLAYLISTS`.
- Verify layout on real mobile hardware (narrow-viewport rendering has not yet
  been visually confirmed — see Known issues).
- Submit `https://bengaliexperience.wtf/sitemap.xml` to Google Search Console
  and Bing Webmaster Tools, and re-submit after the move to `/busdriver` so
  the four retired paths are recrawled and the 301s are seen.
- Build the three planned experiences. Until one of them ships, the front page
  is promising more than the site delivers, which is fine for a month and not
  fine for a year.
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
