# Bengali Experience

A free, no-login site that plays curated Bengali music, staged as a bus ride
through West Bengal. Four illustrated scenes — Kolkata, Digha, Darjeeling,
Shantiniketan — and nine YouTube playlists that shuffle fresh on every visit,
so no two people board the same bus.

> The `<title>` and meta carry "Bengali Bus Driver Playlist — Bangers from 90s
> to 20s". That phrasing is the search intent people actually type; the brand
> on screen is **Bengali Experience**.

Vite · React · TypeScript · Tailwind v4 · Cloudflare Pages.

---

## Quick start

```bash
npm install
npm run dev            # http://localhost:5173
```

`vite dev` serves the UI only. The Cloudflare-specific pieces — per-route SEO
rewriting at the edge and the `/api/aboard` counter — need Wrangler:

```bash
npm run cf:dev         # build + wrangler pages dev dist
```

---

## Architecture

```
index.html                 single HTML shell; its head is rewritten per route at the edge
├─ src/
│  ├─ main.tsx             mounts App inside the ErrorBoundary
│  ├─ App.tsx              routes; unknown paths fall through to the breakdown screen
│  │
│  ├─ data/                all content and configuration, no logic
│  │  ├─ brand.ts          BRAND (display name vs seoTitle) and DRIVER (the curator card)
│  │  ├─ routes.ts         the four scenes: name, ticker, punchline, tagline, hero image
│  │  ├─ playlists.ts      the nine YouTube playlist ids
│  │  └─ seo.ts            URL map + per-route title/description/keywords
│  │
│  ├─ lib/
│  │  ├─ selection.ts      which playlist opens the session (see below)
│  │  ├─ embeddable.ts     oEmbed pre-flight: will the player accept this list?
│  │  ├─ title.ts          turns messy YouTube titles into song + artist
│  │  └─ jsonld.ts         schema.org graph, shared by client and edge
│  │
│  ├─ hooks/
│  │  ├─ usePlayerEngine   the player: playlists, transport, autoplay, recovery
│  │  ├─ useYouTubeApi     loads the IFrame API exactly once
│  │  ├─ useAboardCount    polls the live listener count
│  │  ├─ useISTClock       Kolkata wall clock, ticking every second
│  │  └─ useHorn           Web Audio air horn, scene shake, music ducking
│  │
│  ├─ components/          HeroScene, Header, Hero, Player, QueueSheet,
│  │                       TicketSheet, DriverCard, BreakdownScreen, ErrorBoundary
│  └─ pages/RoutePage.tsx  composes one scene
│
├─ functions/              Cloudflare Pages Functions
│  ├─ _middleware.ts       rewrites head + JSON-LD per route, before the response ships
│  └─ api/aboard.ts        KV-backed live listener count
│
└─ scripts/
   └─ check-playlists.mjs  which playlists the embed will actually accept
```

### The scene is an image, not code

Each route's background is **one pre-rendered illustration**. An earlier
version drew the bus and landscape as animated SVG with parallax and it never
looked convincing; a single good image nails it and costs nothing at runtime.

Because the bus is painted into that image it can't be moved on its own, so
the scene moves around it: a slow Ken Burns push-in, an engine bob on the
frame, blurred streaks rushing along the road, a warm light bloom, drifting
clouds and film grain. Together they read as motion without the bus ever
translating.

`--hero-position` pans the focal point per breakpoint so the bus survives
narrow phones, since the images are 21:9 and phones are not.

### Playback

The player loads whole YouTube playlists natively (`listType: "playlist"`)
rather than embedding a hardcoded tracklist. **Add a song to the playlist on
YouTube and it appears on the site immediately, with no redeploy.**

The YouTube iframe is parked off-screen and used purely as an audio engine; a
spinning vinyl record stands in for it visually.

Changing route changes the music. The four scenes share one player, so
`RoutePage` rolls the playlist deliberately when `routeId` changes — a new
place should not sound like the old one. If no other list is usable it at
least skips to the next song.

> **Every playlist must be Public on YouTube.** Unlisted is not enough: the
> IFrame player refuses an unlisted list with error 150 and loads nothing.
> See [Playlist visibility](#playlist-visibility).

### The horn

`useHorn` synthesizes an air horn rather than shipping an audio file: two
fundamentals a minor third apart, each doubled and detuned so the voices beat,
through a lowpass and a compressor. It holds for 3.4s like a real bus, and
**the music ducks under it** — down to 12% in 240ms, back up over 700ms, via
`engine.setDucked`. The visitor's own volume is never overwritten; ducking
works below it. That contrast, not raw gain, is what makes the horn read as
loud.

### How the bus chooses what to play

`src/lib/selection.ts`. Plain `Math.random()` ignores that this is explicitly
a *night bus in Kolkata*, and lets a returning visitor land on the same list
every time. Instead:

1. **Time-of-day weighting.** Each playlist declares which IST hours it suits.
   At 2am the mellow lists are far likelier; at 6pm it inverts. The bus knows
   what time it is because it shares a clock with the header.
2. **Recency avoidance.** The last three openers are remembered in
   `localStorage` and heavily penalised, so you get somewhere new.
3. **Weighted random, never ranked.** The best-fitting list is the most
   likely, not guaranteed — two people opening the site in the same minute
   still get different journeys.

Every step degrades safely: no storage, or nonsense weights, falls back to a
uniform random pick.

When a playlist runs out the engine rolls straight into another one, so the
bus never reaches a dead end — including the near-empty `bengaliexperience`
list.

### Autoplay

Playback starts automatically, **muted** — every major browser refuses to
start audible media before a user gesture, and this cannot be worked around.
A "Tap for sound" control unmutes on the first interaction. The first press of
play does the same thing, so the prompt is never a dead end.

### SEO / AEO / GEO

`functions/_middleware.ts` rewrites `<title>`, meta, canonical and JSON-LD per
route **at the edge**, before the HTML is sent. Most crawlers and AI answer
engines either don't run JavaScript or run it unreliably, so client-side head
updates alone would leave every URL sharing the homepage's tags.

The JSON-LD describes the collection and links the real playlists rather than
enumerating tracks — the tracklists change on YouTube without a redeploy, and
asserting a stale tracklist would be worse than asserting none. The graph
carries `WebSite`, `WebPage`, `MusicPlaylist`, `FAQPage`, `BreadcrumbList` and
`ItemList`.

**The body is rendered at the edge too** (`src/lib/prerender.ts`). A SPA ships
one empty `<div id="root">`, and while Google renders JavaScript, the answer
engines this site invites in `robots.txt` — GPTBot, PerplexityBot, ClaudeBot,
CCBot — mostly do not. They were being allowed in and handed a blank page.
The middleware now injects the heading, the intro, the routes, the playlists
and the FAQ into `#root`; React clears that container on first paint, so a
visitor never sees it and nothing is cloaked — the markup says exactly what
the visible page says.

Question-shaped search intent ("what is the Bengali bus driver playlist",
"is it free", "where does the music come from") is answered in one place,
`FAQ` in `src/data/seo.ts`, and emitted twice: as crawlable text and as
`FAQPage` data, so the two can never drift.

Also shipped: `sitemap.xml`, `robots.txt` (AI crawlers explicitly allowed),
`llms.txt` (same answers, in the format answer engines read), web manifest.

### Robustness

- **Error boundary** → the themed breakdown screen, which is styled with
  inline CSS and its own keyframes so it still renders if the stylesheet or
  fonts failed to load.
- **Dead videos** are stepped over automatically. A dead *list* is different:
  `nextVideo()` on an empty playlist is a no-op, so an unplayable list used to
  park the player on "Boarding…" forever. The engine now tells them apart by
  whether a tracklist exists, marks the list dead and rolls to another one.
- **A silent refusal is caught too.** `loadPlaylist` on a refused list does not
  always raise `onError` — with something already playing, YouTube can keep
  playing it while the app believes it switched, showing one playlist's name
  over another's audio. Three seconds after every load the engine asks
  `getPlaylistId()` what it actually has, and rolls on if the answer is wrong.
- **A watchdog** rolls to another list if a freshly loaded one hasn't started
  within 8s and the visitor didn't pause it. When nothing is left, the player
  reports `stalled` rather than pretending to load.
- **The aboard counter is cached.** The obvious implementation — `kv.list()`
  over every key per request — is O(n) per hit: invisible at ten listeners,
  crippling at fifty thousand. The total is computed at most once every 10s
  and cached under a single key, so reads are one `kv.get`. Scanning is capped
  at 30 pages.
- **The counter never invents a number.** If the endpoint is unavailable the
  header hides it rather than showing something false.
- **Queue titles load lazily** via IntersectionObserver and are cached, so
  opening a 100-track playlist doesn't fire 100 requests.

---

## Playlist visibility

Not every playlist you can open in a browser tab can be embedded. Two kinds
are refused with `onError` **150** and an empty tracklist, and neither is
visible from the id:

- **Playlists created in YouTube Music.** These get an ordinary `PL…` id and
  open normally on youtube.com, but the IFrame player will not take them —
  whatever their visibility says. Recreating the same songs as a playlist made
  *on youtube.com* is the fix.
- **Unlisted or Private playlists.** Only Public embeds.

On top of that, individual videos can block embedding — most label uploads
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

Status at the time of writing — the seven made in YouTube Music are all
silently unplayable:

| Site label | YouTube title | Made in | Embeds |
|---|---|---|---|
| Bengali Experience | bengaliexperience | YouTube | yes |
| Life | জীবনমুখী গান | YouTube | yes |
| 20's Bangers | 20's Bangla Bangers | YT Music | **no** |
| Aesthetics | Bengali Aesthetics | YT Music | **no** |
| To You | To You | YT Music | **no** |
| Sleeping Pills | Sleeping pills (Bengali) | YT Music | **no** |
| Band Era | Era of Bangla Bands | YT Music | **no** |
| (G)old Classics | (G)old Bengali Classics | YT Music | **no** |
| Evergreen | Bengali Evergreen | YT Music | **no** |

The app survives either way — it pre-flights each list, marks a refused one
dead and rolls to a playable one — but the ride is only as varied as the lists
that actually embed.

---

## Assets

Drop these in `public/hero/`:

| File | Size | Notes |
|---|---|---|
| `hero-kolkata.jpg` | 1920×825 | 21:9, dark, bus centred in the middle band |
| `hero-digha.jpg` | 1920×825 | |
| `hero-darjeeling.jpg` | 1920×825 | |
| `hero-shantiniketan.jpg` | 1920×825 | |
| `breakdown.jpg` | 16:9, night | the chai-break error / 404 screen |
| `../opengraph.jpg` | 1200×630 | social card, in `public/` |

Top and bottom ~25% of each hero sit under gradients and the player, so keep
the subject in the middle band. No text in the images — generators garble
lettering.

Source PNGs live in `design/source/` and are gitignored. Convert with:

```bash
node -e "require('sharp')('design/source/hero-x.png').resize(1920,825,{fit:'cover'}).jpeg({quality:82,mozjpeg:true}).toFile('public/hero/hero-x.jpg')"
```

---

## Deploy

```bash
npx wrangler login
npx wrangler kv namespace create ABOARD
npx wrangler kv namespace create ABOARD --preview
```

Paste both ids into `wrangler.toml`, then `npm run deploy` — or connect the
repo to Cloudflare Pages with build command `npm run build`, output directory
`dist`, and an `ABOARD` KV binding under Settings → Functions.

### Domain

Live at **https://bengaliexperience.wtf**, a custom domain on the same Pages
project.

`BRAND.url` in `src/data/brand.ts` is the single source for every absolute URL
the site emits — canonical links, `og:url`, JSON-LD `@id`s, breadcrumbs. Only
`index.html`, `public/robots.txt`, `public/sitemap.xml` and `public/llms.txt`
spell the domain out separately, because they are static files no build step
templates. A domain change means editing those five.

Attaching a custom domain does not retire the `*.pages.dev` one — the project
keeps answering there, which is a second origin serving identical content and
a split ranking signal. `functions/_middleware.ts` 301s
`bengaliexperience.pages.dev` to the canonical host. The match is exact, so
preview deployments at `<hash>.bengaliexperience.pages.dev` still open
normally.

After the first deploy on the real domain, submit
`https://bengaliexperience.wtf/sitemap.xml` in Google Search Console and Bing
Webmaster Tools.

---

## Notes

- Audio streams from YouTube. Nothing is rehosted.
- YouTube may show its own pre-roll on some videos. That's YouTube's ad, not
  the site's, and it isn't controllable from an embed.
- The queue and ticket sheets deliberately avoid `AnimatePresence`: under
  framer-motion v13 with React 19 its exit never flushed on its own, leaving
  modals stuck on screen until an unrelated re-render.
