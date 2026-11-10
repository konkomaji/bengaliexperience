# Session log: retiring Bengali Experience, launching the coming-soon page

**Dates:** 2026-11-09 to 2026-11-10
**Domain:** https://bengaliexperience.wtf
**Repo:** https://github.com/konkomaji/bengaliexperience
**Done by:** Konko Maji with Claude Code

## 1. Audit of the old site

- Stack: React 19, Vite 8, Tailwind 4, TypeScript, on Cloudflare Pages
  (project `bengaliexperience`, connected to GitHub, account `KONKO`).
- DNS on Cloudflare (`trace` / `lola.ns.cloudflare.com`). No MX records.
  TXT records: Google Search Console verification and `v=spf1 -all`.
- Sub-sites (all paths, no subdomains):
  - `/busdriver`: Kolkata night-bus scene with a YouTube Bangla playlist
  - `/mahalaya`: Mahishasuramardini dawn radio
  - `/tarakeswar/*`: travel guide and blog
  - `/kabirsuman/*`: life, works, albums, songs
  - `/uttamkumar/*`: centenary tribute, 211 film pages
  - `/marvelmultiverseatlas/*`: separate Marvel dataset app
  - `/privacy`
- Indexed URLs: 593 in the main sitemap and 328 in the Marvel sitemap (921 total).
- Pages Functions: `_middleware`, `/api/aboard`, `/api/pageview`,
  `/sitemap.xml`, `/llms.txt`.
- KV namespace `ABOARD` (plus `ABOARD_preview`) for live and page-view counters.
- Google AdSense `pub-1575101534552294` with Consent Mode; `ads.txt`.
- Microsoft Clarity `y2nocf9q82`.

## 2. Backups

- `G:\bengaliexperience-backup-2026-11-09.zip`: whole project without
  `node_modules` (88 MB, 3,983 files).
- `G:\bengaliexperience-kv-backup-2026-11-09.json`: the 17 Tarakeswar
  page-view counters exported from KV.
- The old source stays in git history at commit `93878c0`.

## 3. Takedown

- Replaced the whole site with a static `site/` folder (PR #17).
- `functions/_middleware.js` turns Pages' 404 into **410 Gone** with
  `X-Robots-Tag: noindex` for every old URL.
- Removed AdSense and `ads.txt`.
- Deleted KV namespaces `ABOARD` and `ABOARD_preview`.
- Deleted 55 old Pages deployments; their hash URLs served the old site.
- GitHub: new description, all 13 topics removed, archive tag removed,
  merged branches deleted.

## 4. New site

- `/`: coming-soon page.
  - Headline: "Something really interesting is on its way."
  - Alpana of glossy beads and petals (`site/alpana.js`): pointer pushes
    them; a tap ripples and recolours.
  - Howrah Bridge over the Hooghly with puja lights, a yellow Ambassador
    taxi (tap to honk), a drifting country boat, and paper kites you can
    fly (`site/scene.js`).
- Every other URL: sorry page with a diya you can blow out and relight
  (`site/404.html`, `site/diya.js`).
- Footer on both pages: "Created by Konko Maji | Instagram LinkedIn X
  GitHub" (links from konkomaji.com).
- Design rules from the user: Poppins, glossy Bengal colours, no Bengali
  script, no em dashes, no eyebrow chip, Bengal-rooted graphics (PR #18).

## 5. SEO, AEO, GEO (PR #19)

- JSON-LD: `WebSite`, `WebPage` (about Bengal, West Bengal, Bengalis),
  `Person` Konko Maji with `sameAs` socials.
- Open Graph and Twitter large card; `og.png` (1200×630) rendered from
  the live design.
- `sitemap.xml` lists only `/`. `robots.txt` allows search and AI
  crawlers. `llms.txt` says the old project is gone.
- Web manifest, `apple-touch-icon.png`, 192 and 512 icons.
- IndexNow key `site/fd661d1284e138703217c9109f298f74.txt`. Bing
  accepted all 921 URLs (HTTP 200). `api.indexnow.org` answered 403 just
  after the key went live.
- Kept: Microsoft Clarity `y2nocf9q82`; GSC verification by DNS TXT.

## 6. Verified on production

| URL | Status |
|---|---|
| `/` | 200 |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/og.png` | 200 |
| `/busdriver`, `/kabirsuman/life`, `/uttamkumar/film/*` | 410 |
| `/marvelmultiverseatlas/sitemap.xml`, `/ads.txt`, `/api/aboard` | 410 |
| old deployment URLs (`*.bengaliexperience.pages.dev`) | 404 |

## 7. Left for the owner (no tool access)

1. Search Console: remove the old Marvel sitemap, resubmit `/sitemap.xml`,
   optionally add prefix removals for the old sections.
2. AdSense: remove `bengaliexperience.wtf` under Sites.
3. Clarity: optionally rename project `y2nocf9q82`.

## 8. Commits

| PR | Change |
|---|---|
| #17 | Replace the old site with the static coming-soon and sorry pages |
| #18 | No Bengali text, new credit and footer, Bengal-rooted graphics |
| #19 | Full SEO, AEO and GEO reset |
| #20 | This session log |

- `main` is at merge commit `6365569`. Cloudflare Pages deployed it.
- Open item: the GitHub repo description still says "Konko M". It
  should say "Konko Maji".
