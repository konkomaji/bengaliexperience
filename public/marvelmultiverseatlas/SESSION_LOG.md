# Session Log — Marvel Multiverse Atlas

**Date:** 21 August 2026
**Scope:** mobile performance, a live in-universe clock, real streaming data, a Comics view, a cinematic Multiverse Map, poster corrections, and repository hygiene.

This log records what was asked, what was changed, and the technical detail behind each change. Files touched: `assets/app.js`, `assets/style.css`, `index.html`, `credits.html`, `tools/build_data.ps1`, `data/comics.json` (new), `tools/tmdb_enrich.py` (new), `tools/tmdb_enrich.json` (generated), `.gitignore` (new), `README.md`.

---

## 1. Mobile performance — keep every effect, make it smooth

**Problem:** scrolling and interaction were laggy on mobile. The brief was explicit: *do not remove the animations* — make them cheap.

**Root causes found:**
- `.aurora` — a fixed, full-viewport element with `filter: blur(30px)` **and** an infinite transform animation, forcing the compositor to re-blur the whole viewport every frame.
- `backdrop-filter: blur(20–24px)` on the sticky top bar **and** the mobile bottom nav — recomputed on every scroll frame.
- `will-change: transform` on all 183 `.card`s — 183 permanent compositor layers.
- A full-viewport `#fx-canvas` particle loop and per-scroll `getBoundingClientRect` reads.

**Fixes (desktop visuals unchanged):**
- Promoted `.aurora` to its own GPU layer (`will-change: transform; translateZ(0); backface-visibility: hidden`) so the blur rasterises once and only the transform composites — drift preserved, per-frame re-blur gone.
- Trimmed backdrop-blur radius on touch/≤720px (`blur(20px)→12px`, `24px→14px`) — same glass look, cost scales with radius².
- Scoped `will-change: transform` on `.card` to `:hover` only; added `content-visibility: auto` + `contain-intrinsic-size` so offscreen cards skip layout/paint.
- `#fx-canvas` now rasterises at `dpr ≤ 1.5` on mobile (unchanged to the eye) and pauses when the tab is hidden.
- rAF-throttled the Chronicle scroll-spine handler; skip the pointer-shine on `pointerType === 'touch'`.

## 2. TVA Sacred Timeline clock (`#mclock`)

A live readout of the current date/time **inside** the Marvel Universe, on the Nexus hero, styled as a Time Variance Authority monitor.

**Logic:** the clock reads the leading edge of the Sacred Timeline directly from the data — the furthest-forward in-universe year among `universe === 'mcu'` entries (currently *Spider-Man: Brand New Day*, 2028) — anchors "now" to that year on today's date, and ticks 1:1 with real time via `setInterval`. The offset is derived, not hardcoded, so it tracks the data as titles are added. Anchor correction was made after confirming in-data that the leading edge is 2028 (not 2025); *Thunderbolts\** and *Brave New World* are the 2027 confirmed edge.

## 3. Real "where to watch" (streaming providers)

The detail sheet's watch section was rebuilt (`watchRow`) to show **only the real US streaming services** a title is on, as brand badges with logos — no generic search buttons. Data comes from TMDB `/watch/providers` (JustWatch-powered), stored per entry as `providers: [{name, logo}]` + `providerLink`. Titles with no subscription streaming show an honest "Not on a US streaming subscription right now." 150 of 183 titles resolved providers.

## 4. Detail-sheet fixes

- **Connection rows** now show the connected title's poster thumbnail (`.cthumb`, with a 2-letter fallback), plus type badge, title, year and note — realigned into a clean thumbnail + column layout.
- **Platform badge** gained an `onerror` fallback: a missing wordmark (e.g. Disney XD) degrades to a coloured text badge instead of an empty circle.

## 5. Poster corrections (TMDB API)

`tools/tmdb_enrich.py` verifies every entry's stored `tmdbId` against TMDB's title+year and re-searches mismatches. **6 genuinely wrong posters fixed**, e.g. `corman-fantastic-four` (was resolving to "Federal Man-Hunt", 1938 → correct 1994 Corman FF, id 22059) and `tv-incredible-hulk-1977` (was "A Series of Unfortunate Events" → the 1977 series, tv id 648). One false-positive re-resolution was caught and reverted: `fantastic-four-first-steps` (TMDB titles it "The Fantastic 4", which the verifier flagged) was kept on its correct id 617126 rather than a "World Premiere" event.

## 6. Comics view — *The Source Material*

New view (nav + `#view-comics`), backed by a new `data/comics.json` (fields+rows schema, folded into `window.MARVEL.comics` by `build_data.ps1`).

- **103 curated landmark comics**, 1939–2020, across five ages (Golden/Silver/Bronze/Copper/Modern), filterable by era, sorted on the page-timeline.
- Each card: a generated **era-styled cover tile** (no external image — legal and never broken), issue, creators, significance, characters, an **On screen →** chip that opens the adaptation's sheet (matched by title), and **where to read** links (Marvel Unlimited / in print).
- **Honesty note:** a *complete* catalogue is tens of thousands of issues with no offline source; this is the source-material spine, labelled as such. Real cover art / full catalogue needs a Marvel or ComicVine API key.
- `credits.html` updated with Grand Comics Database + Marvel Database comics sources.

## 7. Cinematic Multiverse Map

The force-directed graph was dressed as a living simulation, all in GPU-friendly CSS (transform/opacity/`stroke-dashoffset`), with a reduced-motion opt-out:
- A drifting **nebula** (four screen-blended radial clouds) and a deterministic **150-star starfield** (every 5th star twinkles) behind the panning graph.
- **Breathing node halos** and a soft glow filter.
- **Energy pulses** travelling along all 36 connection paths (`.edge-flow`, animated dash), following the same dim/isolate logic as the base edges.

## 8. Repository hygiene / secrets

- The TMDB token is read only from `$env:TMDB_TOKEN` at runtime; it is written to **no** file in the repo (verified by scan).
- Added `.gitignore` for `.env`, `*.secret`, and local token files.
- `tools/tmdb_enrich.py` was saved to the repo with the token read from the environment — no embedded secret.

## 9. Known limitations / honest gaps

- **In-universe "estimated" dates** cannot be replaced with canon Marvel never stated; they remain flagged as estimates with an in-app explanation of the method. Confirmed dates are marked `official`.
- **Comics** are a curated spine, not every issue; **comic covers** are generated tiles, not scanned art — both gated on a comics API key.

---

### Build / verify commands used

```powershell
$env:TMDB_TOKEN = "<v4 read token>"; python tools\tmdb_enrich.py
powershell -ExecutionPolicy Bypass -File tools\build_data.ps1
node --check assets/app.js
```

Final dataset: **183 titles · 103 comics · 51 realities · 135 connections · 0 missing posters.**

---

## Round 2 — confirmed dates + real comic covers

### Confirmed in-universe dates
Audited all 25 `inferred` dates against Marvel's official chronology. Promoted **7 to `official`** where Marvel has genuinely confirmed the year — sourced to *"The Marvel Cinematic Universe: An Official Timeline"* (DK, made with Marvel Studios) and Disney+ placement, verified by web research:

| Title | Was | Now |
|---|---|---|
| Moon Knight | inferred 2025 | **official 2025** |
| Ms. Marvel | inferred 2025 | **official 2025** |
| Thor: Love and Thunder | inferred 2025 | **official 2025** |
| She-Hulk: Attorney at Law | inferred 2025 | **official 2024–2025** |
| The Marvels | inferred 2026 | **official 2026** |
| Ant-Man and the Wasp: Quantumania | inferred 2025–2026 | **official 2026** |
| Guardians of the Galaxy Vol. 3 | inferred 2025–2026 | **official 2026** |

The other 18 stay `inferred` **on purpose** — Marvel Television (Netflix Defenders, Inhumans, Runaways, Cloak & Dagger) is not dated by the Studios timeline, and Echo / Secret Invasion / Ironheart / the 2027–28 slate have no confirmed year. Marking them "official" would be fabrication. Result: **54 official / 18 inferred.**

### Real comic cover art (Comic Vine)
Wired the Comic Vine API (`tools/comicvine_covers.py`, key read from `COMICVINE_KEY` env — never committed). Two matching passes recovered **88 of 103 covers** (volume-name + issue-number + cover-date scoring). `comicCover()` now renders the generated era-styled tile as an always-present base with the real cover overlaid on top (`onload`→fade-in, `onerror`→remove) — a slow or failed image never leaves an empty box. The 15 unmatched (mostly multi-issue story arcs) show their generated tile. `credits.html` credits Comic Vine; `README` updated.

> Note: cover images did not render inside the automated test browser (its sandbox blocks cross-origin images), but `curl` returns HTTP 200 and there is no page CSP, so they load in a normal browser — verified visually (e.g. Fantastic Four #1's cover displayed).

Final: **183 titles · 103 comics (88 with cover art) · 54 official / 18 inferred dates.**

---

# Round 3 — moved to bengaliexperience.wtf, and published twice

**Date:** 21 August 2026
**Scope:** the Atlas moved out of its own repository onto a live domain, and the dataset made findable and citable — search-intent research first, then 327 generated pages, then the wiring that keeps two unrelated properties from being read as one.

The Atlas now lives at **[bengaliexperience.wtf/marvelmultiverseatlas](https://bengaliexperience.wtf/marvelmultiverseatlas/)**, mounted under `public/` in the [bengaliexperience](https://github.com/konkomaji/bengaliexperience) repository. Its own repository keeps the dataset pipeline; the site keeps the dataset and the app.

## 1. The move

Cloned in, `.git` stripped, dropped into `public/marvelmultiverseatlas/`. The build pipeline (`build_data.ps1`, `tmdb_enrich.py`, `comicvine_covers.py`, `scrape_posters.ps1`) was **not** brought across: it needs API keys, no visitor loads it, and there is no reason to serve build scripts off a CDN. It stays in the Atlas's own repo, which is where the dataset is regenerated before the result is committed to the site.

The design was left alone on purpose. The generated pages load the Atlas's own `style.css`, its Material 3 Expressive tokens, its per-universe accent themes and its own header, brand and footer. Nothing from the host site bleeds in, and nothing Marvel bleeds out.

## 2. Search-intent research, before writing anything

A research pass ran first, against live SERPs rather than assumption. Three findings changed what got built:

- **The head queries reward narrative ordered lists, not tables.** "marvel movies in order", "mcu chronological order" and "spider-man movies in order" are won by curated, numbered list articles with a short "why this order" framing — Rotten Tomatoes, Space.com, TechRadar, TheWrap. A 183-row sortable database loses to that format regardless of how good the data is. Hence `watch-order/`, which is the dataset presented narratively rather than as a table.
- **Where this cannot win, and it is worth saying so.** JustWatch owns "where to watch *X*"; IMDb owns "*X* runtime / box office". Those queries are answered honestly on the title pages and are not chased.
- **Where the gap is real.** Wikipedia's own *List of films based on Marvel Comics publications* does **not** link a film to the issue it adapts, and nothing found in the SERP maps comics to adaptations systematically. Nor does any incumbent — Wikipedia, IMDb, ScreenRant, marvelwatchlist.com — mark which in-universe dates Marvel actually confirmed and which are inference, despite several outlets writing about the MCU timeline being contradictory. That distinction is this dataset's one defensible advantage.

## 3. 327 generated pages

The app renders six views client-side out of one HTML file. Right for exploring, wrong for everything else: one URL for the whole dataset means nothing in it can be linked to or cited, and a client that does not run JavaScript sees an empty shell.

`scripts/prepare-atlas.mjs` (in the host repo) emits the same data a second way:

| Path | Pages |
|---|---|
| `titles/<id>/` | 183 |
| `comics/<slug>/` | 92 |
| `realities/<earth>/` | 25 |
| `eras/<saga>/` | 11 |
| `phases/<phase>/` | 6 |
| `watch-order/<order>/` | 4 |
| hubs | 6 |

Each page carries its facts as real markup, a **direct answer in prose at the top** — an answer engine shows one paragraph with no page around it, so the answer has to survive being quoted alone — and `schema.org` that asserts only what the page actually shows: `Movie` / `TVSeries` / `ComicIssue` / `ItemList` / `FAQPage` / `BreadcrumbList`, plus a `Dataset` node on the home page describing the downloadable JSON and CSV.

**Three gates drop real rows on purpose**, because a page per row is how programmatic SEO turns into index bloat:

- **realities** — only where the reality has more than one title or takes part in at least one verified connection. 26 dropped; a designation with nothing behind it restates a one-line wiki entry.
- **comics** — only where the issue maps to a *released* title. 11 dropped; the mapping is the page's whole reason to exist.
- **eras** — only sagas with three or more titles. Two titles is a sentence, not a page.

## 4. The copy is derived, not written down

Every date on every page carries its certainty — confirmed against Marvel's published chronology, or marked estimated. That is the dataset's differentiator, and it evaporates the moment a page rounds an estimate up into a fact, so anything the data can answer is answered *from* the data.

This was not theoretical. A hardcoded FAQ answer — "the first Marvel story chronologically is Captain America: The First Avenger" — was already false: *Eyes of Wakanda* opens in 1260 BC. The received answer and the dataset disagreed, and only one of them was checkable. The chronological extremes, the counts, the first and last entry of every ordered list and the era date ranges are all computed now.

Two other bugs surfaced the same way:

- **A comic slug collision.** *Ms. Marvel #1* is both Carol Danvers (1977) and Kamala Khan (2014); the two produced the same slug and one page silently overwrote the other. The year now disambiguates, appended only where it has to be.
- **9 unresolved comic-to-title links**, caused by the two tables spelling names differently (`Marvel's Jessica Jones` vs `Jessica Jones`, `Dark Phoenix` vs `X-Men: Dark Phoenix`). A candidate ladder resolves them, accepting a looser form only when it matches exactly one title. 92 of 94 now resolve; the remaining two are *Avengers: Secret Wars*, which is unreleased and correctly has nothing to link to.

## 5. Two properties, one host

The Atlas is not about Bengal, and the wiring says so rather than hoping a crawler works it out:

- **Its own `WebSite` entity, `sitemap.xml`, `llms.txt` and social card.** The host site's sitemap omits the Atlas entirely; `robots.txt` lists both so the two are crawled as two things. 327 Marvel URLs in a sitemap that otherwise describes a Bengali culture site would say the opposite.
- **Linked from an "Also built here" section**, below the host's FAQ — never its nav, never its catalogue. `src/data/experiments.ts` exists to make that separation structural rather than a matter of remembering.
- **A real 404.** `functions/_middleware.ts` passes Atlas paths through unrewritten, and answers an unmatched one with the Atlas's own 404 page at status 404. `_redirects` cannot do this: Cloudflare Pages silently ignores any status there outside 200 and the 3xx family, so the rule looked correct and did nothing while the SPA catch-all served the *Bengali* site at 200 under a Marvel URL. Caught by `wrangler pages dev`, which warns about it explicitly.
- **`_headers`** gives the Atlas a revalidating cache rather than `immutable`, because its filenames are stable rather than content-hashed.

## 6. Changes to the app itself

- `index.html` gained a **crawlable body** (`#atlas-prerender`), hidden the instant the `js` class lands so no visitor sees it, holding the counts, the answers and a link to every generated page. It is also the app's internal link graph — without it the 327 pages would be reachable only from the sitemap.
- Full Open Graph and Twitter card tags, a canonical link, and `atlas-og.jpg`: a 1200×630 card drawn entirely in code from the Atlas's own palette. Nothing composited over artwork, because every image the Atlas displays is a poster or a cover belonging to somebody else.
- `assets/pages.css` — breadcrumbs, the numbered watch-order list, long-form prose and the FAQ block, all built from tokens already in `style.css`. Nothing in it overrides a class the app uses.
- The footers of `index.html` and `credits.html` now read *An experiment by BengaliExperience.wtf*.

## 7. Verified

- `tsc -b`, `oxlint` and `vite build` clean, no new warnings.
- **All 4,307 internal links** across the generated pages resolve.
- **330 JSON-LD blocks** parse; every claimed type present.
- Every title tag inside the pixel limit but one — *Marvel One-Shot: A Funny Thing Happened on the Way to Thor's Hammer*, which is simply that long. Descriptions are clamped centrally, at word boundaries.
- Routed through `wrangler pages dev`: every Atlas path 200, an unknown one 404, the host site's own routes unaffected.

### Commands

```bash
npm run atlas       # 327 pages + sitemap.xml, llms.txt, and the app's crawlable body
npm run atlas:og    # the social card, only when the counts change
npm run cf:dev      # build + wrangler pages dev dist
```

## 8. Known limitations, still honest

- **Streaming providers are a build-time snapshot**, not a live feed. Rights move; the pages say so rather than implying currency they cannot guarantee.
- **The 18 estimated dates stay estimated.** Marvel Television and the 2027–28 slate have no confirmed year, and promoting them would be exactly the fabrication the certainty flag exists to prevent.
- **Comics remain a curated spine**, 103 issues of tens of thousands, and only the 92 with a released adaptation get a page.
- **The host domain lends no topical authority.** The Atlas and the Bengali site share a host and nothing else; neither inherits the other's standing, which is the intended trade for keeping them cleanly separate.

Final: **183 titles · 103 comics (92 with adaptation pages) · 51 realities · 135 connections · 54 official / 18 inferred dates · 327 generated pages.**

Shipped in [#8](https://github.com/konkomaji/bengaliexperience/pull/8) and [#9](https://github.com/konkomaji/bengaliexperience/pull/9).
