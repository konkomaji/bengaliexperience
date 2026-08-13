# Bengali Experience

A free, no-login collection of small websites, each one putting you inside a
single Bengali thing for as long as you want to stay. Not articles about the
culture and not photo galleries of it, but the thing itself, running in a
browser tab.

One is built. The bus driver playlist, at `/busdriver`: nonstop Bangla bangers
from the 90s to the 20s, shuffled fresh and started at a random point on every
visit, so no two people board the same bus. Three more are named and being
worked on: Mahalaya listening, Durga Puja pandal hopping, and the Bengali
Sunday afternoon.

Live at **https://bengaliexperience.wtf**.

Vite · React · TypeScript · Tailwind v4 · Cloudflare Pages.

---

## Quick start

```bash
npm install
npm run dev            # http://localhost:5173
```

`vite dev` serves the UI only. The Cloudflare-specific pieces, per-page SEO
rewriting at the edge, `/sitemap.xml`, `/llms.txt` and the `/api/aboard`
counter, all need Wrangler:

```bash
npm run cf:dev         # build + wrangler pages dev dist
```

---

## Architecture

```
index.html                 single HTML shell; its head is rewritten per page at the edge
├─ src/
│  ├─ main.tsx             mounts App inside the ErrorBoundary
│  ├─ App.tsx              two pages, four legacy redirects, breakdown screen for the rest
│  │
│  ├─ data/                all content and configuration, no logic
│  │  ├─ brand.ts          BRAND (name, canonical origin, social card) and DRIVER
│  │  ├─ experiences.ts    the catalogue: what is live, what is being built
│  │  ├─ scene.ts          SCENE, the one Kolkata illustration and its copy
│  │  ├─ playlists.ts      the nine YouTube playlist ids
│  │  └─ seo.ts            URL map + per-page copy, facts and FAQ
│  │
│  ├─ lib/
│  │  ├─ selection.ts      which playlist opens the session (see below)
│  │  ├─ embeddable.ts     oEmbed pre-flight: will the player accept this list?
│  │  ├─ title.ts          turns messy YouTube titles into song + artist
│  │  ├─ jsonld.ts         schema.org graph per page, shared by client and edge
│  │  └─ prerender.ts      the crawlable body, shared by client and edge
│  │
│  ├─ hooks/
│  │  ├─ usePlayerEngine   the player: playlists, transport, autoplay, recovery
│  │  ├─ useYouTubeApi     loads the IFrame API exactly once
│  │  ├─ useAboardCount    polls the live listener count
│  │  ├─ useISTClock       Kolkata wall clock, ticking every second
│  │  ├─ useHorn           Web Audio air horn, scene shake, music ducking
│  │  └─ useDocumentHead   head sync for client-side navigation only
│  │
│  ├─ components/          HeroScene, Header, Hero, Player, QueueSheet,
│  │                       TicketSheet, DriverCard, BreakdownScreen, ErrorBoundary
│  └─ pages/
│     ├─ HomePage.tsx      the collection: what this is, what is on the shelf
│     └─ BusDriverPage.tsx the bus
│
├─ functions/              Cloudflare Pages Functions
│  ├─ _middleware.ts       one host, one URL per page, real status codes, real content
│  ├─ sitemap.xml.ts       sitemap, generated from src/data/seo.ts
│  ├─ llms.txt.ts          the same answers, in the format answer engines read
│  └─ api/aboard.ts        KV-backed live listener count
│
└─ scripts/
   ├─ check-playlists.mjs  which playlists the embed will actually accept
   └─ stamp-lastmod.mjs    reads git for each page's real last-modified date
```

### Two pages, on purpose

`/` is the project and `/busdriver` is the experience, and they are chasing
different searches. The front page answers "what is this", which is brand and
culture intent. The bus page carries "bengali bus driver playlist", which is
the highest-volume phrase here and deserves a page that is only about it.
Splitting them means neither has to compromise its title.

There used to be four bus pages, one per West Bengal route, with a chooser on
top. It cost more than it earned: four URLs competing for one search intent,
four illustrations to keep in step, and a menu sitting in front of an
experience whose whole point is that you do not choose, you get on. Those
paths now 301 to `/busdriver`.

### The scene is an image, not code

The background is **one pre-rendered illustration**. An earlier version drew
the bus and landscape as animated SVG with parallax and it never looked
convincing; a single good image nails it and costs nothing at runtime.

Because the bus is painted into that image it cannot be moved on its own, so
the scene moves around it: a slow Ken Burns push-in, an engine bob on the
frame, blurred streaks rushing along the road, a warm light bloom, drifting
clouds and film grain. Together they read as motion without the bus ever
translating.

`--hero-position` pans the focal point per breakpoint so the bus survives
narrow phones, since the image is 21:9 and phones are not.

### Playback

The player loads whole YouTube playlists natively (`listType: "playlist"`)
rather than embedding a hardcoded tracklist. **Add a song to the playlist on
YouTube and it appears on the site immediately, with no redeploy.**

The YouTube iframe is parked off-screen and used purely as an audio engine; a
spinning vinyl record stands in for it visually.

> **Every playlist must be Public on YouTube.** Unlisted is not enough: the
> IFrame player refuses an unlisted list with error 150 and loads nothing.
> See [Playlist visibility](#playlist-visibility).

### The horn

`useHorn` synthesizes the horn rather than shipping an audio file. The two
tones are not invented: Indian commercial vehicles run ARAI-certified
dual-tone horns, and the standard pairing is **420 Hz and 560 Hz**, a perfect
fourth apart. That interval is why the sound is instantly placeable. An
earlier version used a minor third, which sat dark and mournful, more foghorn
than bus. Each tone is doubled and detuned so the voices beat the way two real
trumpets never quite agree, through a lowpass and a compressor.

It holds for **1.2s**, because a driver taps the horn rather than leaning on
it. The first version held for 3.4 seconds, which was impressive once and
tiring twice.

**The music ducks under it**, down to 12% in ~180ms and back up over ~420ms,
via `engine.setDucked`. The visitor's own volume is never overwritten; ducking
works below it. That contrast, not raw gain, is what makes the horn read as
loud.

### Autoplay and shuffle

Playback starts on its own and starts **somewhere random in the list**, every
visit, for everyone.

The random start is set through the `index` player variable when the player is
constructed, and that placement is the whole trick. `setShuffle(true)` only
governs where *next* goes, and `playVideoAt()` issued during startup is quietly
ignored, so an earlier version that shuffled and jumped on `onReady` left every
single visitor on track one while looking, in code, exactly like it was
working. `setShuffle` is still called, but only once `getPlaylist()` answers,
since it is a silent no-op before the tracklist arrives.

### How the bus chooses what to play

`src/lib/selection.ts`. There is one playlist right now, so the weighting below
is dormant rather than gone: it resolves to "the only list" and starts
mattering again the moment a second is added. Plain `Math.random()` ignores
that this is explicitly a *bus in Kolkata*, and lets a returning visitor land
on the same list every time. Instead:

1. **Time-of-day weighting.** Each playlist declares which IST hours it suits.
   At 2am the mellow lists are far likelier; at 6pm it inverts. The bus knows
   what time it is because it shares a clock with the header.
2. **Recency avoidance.** The last three openers are remembered in
   `localStorage` and heavily penalised, so you get somewhere new.
3. **Weighted random, never ranked.** The best-fitting list is the most
   likely, not guaranteed. Two people opening the site in the same minute
   still get different journeys.

Every step degrades safely: no storage, or nonsense weights, falls back to a
uniform random pick.

When a playlist runs out the engine rolls straight into another one, so the
bus never reaches a dead end.

### Autoplay

Playback starts automatically, **muted**. Every major browser refuses to start
audible media before a user gesture, and this cannot be worked around. A "Tap
for sound" control unmutes on the first interaction. The first press of play
does the same thing, so the prompt is never a dead end.

---

## SEO, AEO and GEO

`functions/_middleware.ts` does four things, in order, before the response
leaves Cloudflare.

**One host.** A custom domain does not switch the `*.pages.dev` one off, so
the same site answers at two origins and a crawler that finds the old one
splits the ranking signal. `bengaliexperience.pages.dev` gets a 301. The match
is exact, so preview deployments still resolve.

**One URL per page.** The four retired route paths 301 to `/busdriver`, and
canonical links are built from the page's own path rather than the requested
one, so an alias can never declare itself canonical and compete with the page
it stands in for.

**Real status codes.** `_redirects` sends every unmatched path to `index.html`
with a 200 so the router can show the breakdown screen. Right for a visitor,
a soft 404 for a crawler: a 200 says "this URL is a real page", so typos and
junk accumulate in the index as duplicates of the front page. Unmatched paths
now return a real 404 and `noindex, follow`, and still render the breakdown
screen. The existing robots tags are rewritten rather than a second appended,
so the page never carries two contradicting directives.

**Real content.** Title, meta, canonical and JSON-LD are rewritten per page,
and **the body is rendered at the edge too** (`src/lib/prerender.ts`). A SPA
ships one empty `<div id="root">`, and while Google renders JavaScript, the
answer engines this site invites in `robots.txt`, GPTBot and PerplexityBot and
ClaudeBot and CCBot, mostly do not. They were being allowed in and handed a
blank page. The middleware injects the heading, the direct answer, the facts,
the catalogue or the playlists, and the FAQ into `#root`; React clears that
container on first paint, so a visitor never sees it and nothing is cloaked.
The markup says exactly what the visible page says.

### Written to be quoted

Answer engines synthesise rather than link, so the copy in `src/data/seo.ts`
is shaped for extraction as much as for ranking:

- every page's `intro` is a **self-contained direct answer** that still makes
  sense with no page around it, and it sits at the top of both the visible
  page and the crawlable body, before any scene setting
- `facts` are one checkable claim per line
- `FAQ` answers are written to be lifted whole rather than summarised, and
  match question-shaped searches ("what is bengali experience", "is it free",
  "where does the music come from")

Each answer exists **once** and is emitted three ways: as crawlable text, as
`FAQPage` structured data, and as `llms.txt` prose. They cannot drift.

### Nothing is written down twice

`sitemap.xml` and `llms.txt` are Pages Functions that read `src/data/seo.ts`,
not static files kept in step by hand. A new experience cannot go live without
appearing in both.

The sitemap emits only `<loc>` and `<lastmod>`. Google has said outright that
it ignores `<changefreq>` and `<priority>`, and it uses `<lastmod>` only while
it stays truthful, so the date comes from `git log` at build time
(`scripts/stamp-lastmod.mjs`) and is **omitted rather than invented** when the
build has no history to read.

### Structured data

Both pages carry `WebSite`, `WebPage`, `Person`, `FAQPage`, `BreadcrumbList`
and `ImageObject`. What differs is the subject: the front page's `mainEntity`
is an `ItemList` of the experiences, the bus page's is the `MusicPlaylist`.

`isAccessibleForFree` is set because "free, no login" is the central claim of
every page here and there is a field built to say it. The curator is a real
`Person` with a `sameAs` link, because an attributed page is a stronger thing
to cite than an anonymous one. Planned experiences appear in the `ItemList`
**without a URL**, which is the honest way to say "this is real and not built
yet" in structured data.

Tracklists are deliberately not enumerated. They live on YouTube and change
without a redeploy, so asserting a fixed one would mean asserting something
already going stale.

### Performance

The hero illustration is the bus page's LCP element and React renders it, so
the browser could not discover it until the bundle had downloaded, parsed and
run. The edge injects a `<link rel="preload" as="image">` for it, on that page
only.

Also shipped: `robots.txt` with AI crawlers explicitly allowed, and a web
manifest.

---

## Robustness

- **Error boundary** leads to the themed breakdown screen, which is styled
  with inline CSS and its own keyframes so it still renders if the stylesheet
  or fonts failed to load.
- **Dead videos** are stepped over automatically. A dead *list* is different:
  `nextVideo()` on an empty playlist is a no-op, so an unplayable list used to
  park the player on "Boarding…" forever. The engine now tells them apart by
  whether a tracklist exists, marks the list dead and rolls to another one.
- **A silent refusal is caught too.** `loadPlaylist` on a refused list does not
  always raise `onError`. With something already playing, YouTube can keep
  playing it while the app believes it switched, showing one playlist's name
  over another's audio. Three seconds after every load the engine asks
  `getPlaylistId()` what it actually has, and rolls on if the answer is wrong.
- **A watchdog** rolls to another list if a freshly loaded one has not started
  within 8s and the visitor did not pause it. When nothing is left, the player
  reports `stalled` rather than pretending to load.
- **The aboard counter is cached.** The obvious implementation, `kv.list()`
  over every key per request, is O(n) per hit: invisible at ten listeners,
  crippling at fifty thousand. The total is computed at most once every 10s
  and cached under a single key, so reads are one `kv.get`. Scanning is capped
  at 30 pages.
- **The counter never invents a number.** If the endpoint is unavailable the
  header hides it rather than showing something false.
- **Queue titles load lazily** via IntersectionObserver and are cached, so
  opening a 100-track playlist does not fire 100 requests.

---

## Playlist visibility

Not every playlist you can open in a browser tab can be embedded. Two kinds
are refused with `onError` **150** and an empty tracklist, and neither is
visible from the id:

- **Playlists created in YouTube Music.** These get an ordinary `PL…` id and
  open normally on youtube.com, but the IFrame player will not take them,
  whatever their visibility says. Recreating the same songs as a playlist made
  *on youtube.com* is the fix.
- **Unlisted or Private playlists.** Only Public embeds.

On top of that, individual videos can block embedding. Most label uploads
(Saregama, T-Series) and "- Topic" art tracks do. Those are skipped at
runtime, so a list plays around them.

Check every list at once:

```bash
npm run check:playlists
```

or one by hand:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/playlist?list=<LIST_ID>"
# 200 = the embed will take it · 401 = it will not
```

This is why there is one playlist. The site shipped with nine, seven of them
made in YouTube Music, which meant seven were silently unplayable and the ride
was really running on two. Advertising nine and playing two is a lie the
visitor can hear, so the shelf is honest instead:

| Site label | YouTube title | Tracks | Embeds |
|---|---|---|---|
| OG Kumar Sanu | KUMAR SANU SPECIAL BENGALI SONGS | 93 | yes |

More are being added. Everything around `PLAYLISTS` keeps working unchanged at
any length: the weighted opening pick, roll-on-death, the queue chips. Adding
an entry to the array is the whole job.

**With one list, "the list is dead" needs care.** The 8s watchdog used to mark
a slow-starting list unplayable and roll on, which is right when there is
somewhere to roll to and fatal when there is not: the only list gets written
off over a slow network and the player sits on "Boarding…" forever with
nothing left to try. `abandonCurrentPlaylist` now checks whether an
alternative exists at all, and when none does it reloads the same list from a
different point, up to three times, before admitting defeat. The same applies
at the end of the list: nothing to roll into is not a breakdown, so it
reshuffles and keeps driving.

---

## Assets

| File | Size | Notes |
|---|---|---|
| `public/hero/hero-kolkata.jpg` | 1920×825 | 21:9, dark, bus centred in the middle band |
| `public/hero/breakdown.jpg` | 16:9, night | the chai-break error / 404 screen |
| `public/opengraph.jpg` | 1200×630 | the social card, shared by both pages |

Top and bottom ~25% of the hero sit under gradients and the player, so keep
the subject in the middle band. No text in the images, since generators garble
lettering.

Source PNGs live in `design/source/` and are gitignored. Convert with:

```bash
node -e "require('sharp')('design/source/hero-x.png').resize(1920,825,{fit:'cover'}).jpeg({quality:82,mozjpeg:true}).toFile('public/hero/hero-kolkata.jpg')"
```

---

## Deploy

The repo is connected to Cloudflare Pages, so **pushing to `main` deploys**.
`npm run deploy` exists for a manual push but is redundant on a git-connected
project and will simply produce a second identical deployment.

First-time setup:

```bash
npx wrangler login
npx wrangler kv namespace create ABOARD
npx wrangler kv namespace create ABOARD --preview
```

Paste both ids into `wrangler.toml`, or connect the repo to Cloudflare Pages
with build command `npm run build`, output directory `dist`, and an `ABOARD`
KV binding under Settings → Functions.

### Domain

`BRAND.url` in `src/data/brand.ts` is the single source for every absolute URL
the site emits. Only `index.html` and `public/robots.txt` spell the domain out
separately, because they are static files no build step templates. A domain
change means editing those three.

After a deploy that changes URLs, submit
`https://bengaliexperience.wtf/sitemap.xml` in Google Search Console and Bing
Webmaster Tools.

---

## Notes

- Audio streams from YouTube. Nothing is rehosted.
- YouTube may show its own pre-roll on some videos. That is YouTube's ad, not
  the site's, and it is not controllable from an embed.
- The queue and ticket sheets deliberately avoid `AnimatePresence`: under
  framer-motion v13 with React 19 its exit never flushed on its own, leaving
  modals stuck on screen until an unrelated re-render.
- Visible copy contains no em dashes, on purpose. Commas, full stops and
  colons only.
