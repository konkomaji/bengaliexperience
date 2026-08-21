# Marvel Multiverse Atlas — The Living Map of Marvel

> Every Marvel film, series, television movie, special presentation, one-shot and short **released as of 21 August 2026** — resolved into a single dataset and plotted five ways: by the day it came out, by when it happens inside the story, by the connections that cross between realities, by the comics it was born from, and against a live clock ticking inside the Marvel Universe itself.

**Live at [bengaliexperience.wtf/marvelmultiverseatlas](https://bengaliexperience.wtf/marvelmultiverseatlas/)** — an experiment by [BengaliExperience.wtf](https://bengaliexperience.wtf).

Open `index.html` in a browser. No build step, no server required — it runs straight off `file://`, and is served here unmodified as a static mount under the Bengali Experience domain.

---

## The five views

- **Nexus** — the overview. The most-connected titles, all 51 realities, the pre-shared-universe origins, and the **TVA Sacred Timeline clock** (see below).
- **Release Timeline** — real-world order by year, filterable by studio era.
- **Chronicle** — in-universe order. The Sacred Timeline follows Marvel's own published chronology, grouped into seven narrative eras; every other reality is ordered on its internal evidence. Dates Marvel has never stated on screen are tagged `≈ estimated setting`.
- **Comics** — *The Source Material.* The landmark comics the screen has mined for sixty years, on the page-timeline: foundational first appearances and the storylines each film and series adapts, each with an **On screen →** link to the adaptation and **where to read** it.
- **Multiverse Map** — a cinematic, force-directed simulation. Every reality is a node sized by how many titles live there; every line is a verified crossing, with energy pulsing along it. A drifting nebula and starfield sit behind the graph. Drag to pan, scroll/pinch to zoom, tap to isolate.
- **Archive** — the full searchable, filterable, sortable dataset.

## The numbers

| | |
|---|---|
| Screen titles | **183** |
| Landmark comics | **103** |
| Realities (Earth designations) | **51** |
| Verified cross-property connections | **135** |
| Span | 1939 – 2028 (in-universe) · 1966 – 2026 (released) |

Coverage: the 38 released MCU films · all Marvel Studios Disney+ series and Special Presentations · the 9 Marvel One-Shots and shorts · the 6 Netflix Defenders-era shows · Marvel Television's ABC/Hulu/Freeform slate · Legion and The Gifted · all three live-action Spider-Man continuities · Sony's Spider-Man Universe · both Spider-Verse films · the 13 Fox X-Men films · all four Fantastic Four productions including the unreleased 1994 Corman cut · the Blade trilogy and series · both Ghost Rider films · Daredevil/Elektra · three Punisher films · Hulk (2003) and the Bixby TV run · Howard the Duck, Captain America (1990), Man-Thing, Big Hero 6 · and 40 notable animated series from *The Marvel Super Heroes* (1966) to *Iron Man and His Awesome Friends* (2025) — plus a curated spine of **103 landmark comics** from *Marvel Comics #1* (1939) to *King in Black* (2020).

Unreleased screen titles are excluded by design; the Comics view deliberately carries a few post-2024 tie-ins where a landmark comic maps to a coming film.

## Signature features

- **TVA Sacred Timeline clock** — a live, ticking readout of *the current date inside the Marvel Universe.* It reads the leading edge of the Sacred Timeline straight from the data (the furthest-forward in-universe year any MCU story has reached — currently *Spider-Man: Brand New Day*, 2028), anchors "now" there, and runs on second-by-second against your own clock. Styled as a Time Variance Authority monitor.
- **Where to watch** — every title's detail sheet shows the **real US streaming services** it is on right now (Disney+, Hulu, Prime Video…), pulled from TMDB/JustWatch provider data. No generic "search somewhere" buttons — only where it genuinely streams.
- **Comics ↔ screen links** — each landmark comic links to the film or series it was adapted into, and opens that title's sheet. Cover art comes from Comic Vine (88 of 103 issues), with a generated era-styled tile behind every one as a fallback.
- **Cinematic Multiverse Map** — nebula, starfield, breathing node halos and energy flowing along every verified crossing.
- **Built to be smooth on a phone** — every animation and effect is kept, but composited cheaply: the blurred ambient layers are promoted to their own GPU texture, backdrop-blur radius is trimmed on touch, offscreen cards skip painting (`content-visibility`), and the timeline canvas rasterises at a lower pixel-ratio on mobile.

## Files

```
index.html                      the app
credits.html                    sources & credits
404.html                        generated — the Atlas's own not-found page
assets/style.css                Material 3 Expressive design system
assets/pages.css                the generated pages, built on the same tokens
assets/app.js                   application (plain script, no modules)
assets/data.js                  generated — window.MARVEL
data/entries.json               SOURCE: hand-authored screen-title table
data/graph.json                 SOURCE: realities, connections, chronology
data/comics.json                SOURCE: curated landmark comics
data/marvel-universe.json       generated — full dataset
data/marvel-universe.csv        generated — flat title table
data/marvel-connections.csv     generated — edge list
titles/ comics/ realities/
phases/ eras/ watch-order/      generated — 327 static reference pages
sitemap.xml · llms.txt          generated — the Atlas's own, separate from the host site's
atlas-og.jpg                    generated — the one social card
```

The pipeline that builds `data/` (`build_data.ps1`, `tmdb_enrich.py`,
`comicvine_covers.py`, `scrape_posters.ps1`) is not published with the site.
It needs API keys, no visitor loads it, and there is no reason to serve build
scripts off a CDN — it stays with the source dataset.

## The static pages

The app renders all six views client-side out of one HTML file. That is the
right shape for exploring it and the wrong shape for everything else: one URL
for the whole dataset means nothing can be linked to or cited, and a client
that does not run JavaScript sees an empty shell.

So the same data is emitted a second way — one static page per thing worth
linking to, generated by `scripts/prepare-atlas.mjs` in the host repository:

| Path | Pages | What it is |
|---|---|---|
| `titles/<id>/` | 183 | one per title: dates, chronology, box office, connections, source comics, live streaming |
| `comics/<slug>/` | 92 | one per landmark comic **that maps to a released title** — the mapping is the page |
| `realities/<earth>/` | 25 | one per reality with more than one title, or at least one verified crossing |
| `eras/<saga>/` | 11 | one per saga with three or more titles, in release order |
| `phases/<phase>/` | 6 | one per MCU phase |
| `watch-order/<order>/` | 4 | release order, chronological order, Spider-Man, X-Men |
| six hubs | 6 | the index for each of the above |

Three gates drop real rows on purpose: a reality with a designation and nothing
behind it, a comic with no released adaptation, and a saga of two titles each
restate something said better elsewhere, so they stay browsable in the app
instead of becoming a page nobody needed.

Every date those pages state carries its certainty with it, confirmed or
estimated. That distinction is the one thing this dataset has that no other
reference in this space does, and it evaporates the moment a page rounds an
estimate up into a fact.

Regenerate after the dataset changes:

```bash
npm run atlas       # the pages, sitemap.xml, llms.txt, and index.html's crawlable body
npm run atlas:og    # the social card — only when the counts change
```

## Rebuilding

The dataset pipeline lives with the source data rather than in the published
site (see above); run it from there.

```powershell
# refresh posters + streaming providers (needs a TMDB API read token)
$env:TMDB_TOKEN = "<your TMDB v4 read token>"
python tools\tmdb_enrich.py

# merge every source into the shipped dataset
powershell -ExecutionPolicy Bypass -File tools\build_data.ps1
```

`build_data.ps1` validates that every connection endpoint resolves to a real title, applies the TMDB enrichment (verified id/poster corrections + streaming providers), folds in the comics, and reports any missing posters.

```powershell
# refresh comic cover art (needs a Comic Vine API key)
$env:COMICVINE_KEY = "<your Comic Vine api key>"
python tools\comicvine_covers.py
```

> **Secrets:** API keys are only ever read from environment variables (`TMDB_TOKEN`, `COMICVINE_KEY`) — they are never written to any file in the repo, and `.gitignore` blocks `.env`, `*.secret` and local token files. The generated `tmdb_enrich.json` and `comicvine_covers.json` contain only ids, poster paths, provider names and image URLs — no keys.

## Data notes & caveats

Compiled from Wikipedia, Marvel.com, the Marvel Database (marvel.fandom.com), the Grand Comics Database, TMDB, JustWatch and Box Office Mojo. See `credits.html` for the full list.

- **Comics coverage is a curated spine, not the whole catalogue.** Marvel has printed tens of thousands of issues; there is no offline dataset for all of them. This is the source-material spine — the most significant issues across every era — labelled as such. 88 of 103 carry real Comic Vine cover art; the rest fall back to a generated tile.
- **In-universe dates.** Marvel rarely puts a year on screen. Anything not confirmed by Marvel's published chronology carries `dateCertainty: "inferred"` and is shown as `≈ estimated setting`; the rest are marked `official`. Titles dated by Marvel's *"The Marvel Cinematic Universe: An Official Timeline"* book (made with Marvel Studios) were promoted to confirmed — Moon Knight, Ms. Marvel and Thor: Love and Thunder (2025), She-Hulk (2024–2025), The Marvels, Quantumania and GotG Vol. 3 (2026) — joining *Thunderbolts\** and *Brave New World* (2027). *Spider-Man: Brand New Day* (2028) stays inferred; the remaining 18 estimates are the consensus of press/fan research and are labelled as such. Marvel Television (Netflix Defenders, Runaways, Inhumans…) is not dated by the Studios timeline and stays inferred.
- **Earth designations** follow the Marvel Database. Two are unofficial community designations, marked in the data: `Earth-TRN414` (*The New Mutants*) and `Earth-TRN836` (*Helstrom*).
- **35 titles have no assigned reality** and are grouped as `Unclassified` rather than given a fabricated number.
- Poster artwork and streaming-provider logos are served from TMDB at runtime, so the page needs a network connection to show art; titles fall back to a generated typographic card if an image fails.

Marvel, all title names and all character names are trademarks of Marvel Characters, Inc. and their respective rights holders. Unofficial, non-commercial reference project.

---

<div align="center">

An experiment by **[BengaliExperience.wtf](https://bengaliexperience.wtf)**

</div>
