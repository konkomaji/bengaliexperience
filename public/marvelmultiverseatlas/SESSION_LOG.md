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
