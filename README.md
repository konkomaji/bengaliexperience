# bengaliexperience.wtf

A coming-soon page. Something new about Bengal, West Bengal and Bengali
people is being made for the internet, created by
[Konko Maji](https://konkomaji.com).

**Live:** https://bengaliexperience.wtf

## What the page is

One static page on Cloudflare Pages, no framework and no build step:

- **Alpana**: rings of glossy beads and petals based on Bengali floor art.
  Move the pointer to stir it. Tap to send a ripple and change its colours.
  (`site/alpana.js`)
- **Howrah Bridge over the Hooghly**: drawn in on load, with puja lights
  along the deck, a yellow Ambassador taxi crossing (tap it to honk) and a
  country boat drifting downriver. (`site/scene.js`)
- **Paper kites**: grab one and fly it. (`site/scene.js`)
- **Sorry page**: every other URL shows a diya that can be blown out and
  relit, with a note that the old project has ended. (`site/404.html`,
  `site/diya.js`)

Type is Poppins. Colours come from Bengal: sindoor, marigold, haldi, shapla
and the Ganga. Motion respects `prefers-reduced-motion`.

## The retired project

This domain used to host **Bengali Experience**: a Kolkata bus playlist,
Mahalaya, a Tarakeswar guide, Kabir Suman and Uttam Kumar archives, and the
Marvel Multiverse Atlas. It was retired on 2026-11-09. Its full source is
still in this repo's history at commit `93878c0` (`git checkout 93878c0`).

All 920 of its URLs now answer **410 Gone** with `X-Robots-Tag: noindex`
(`functions/_middleware.js` turns Pages' 404 into a 410). People still
see the sorry page.

## SEO, AEO and GEO setup

| File | Purpose |
|---|---|
| `site/index.html` | Title, description, canonical, Open Graph, Twitter card, and JSON-LD (`WebSite`, `WebPage` about Bengal / West Bengal / Bengalis, `Person` for Konko Maji with `sameAs` socials) |
| `site/sitemap.xml` | Lists only `/`, with its image |
| `site/robots.txt` | Allows all search and AI answer-engine crawlers and points to the sitemap |
| `site/llms.txt` | Plain summary for AI answer engines. Says the old project is gone and must not be cited as live |
| `site/og.png` | 1200×630 social preview, rendered from the real page |
| `site/manifest.webmanifest`, icons | App name and icons |
| `site/<key>.txt` | IndexNow key, used to tell Bing and other engines about the 410s |

**Analytics:** Microsoft Clarity (project `y2nocf9q82`) on both pages.
**Search Console:** verified through a DNS TXT record on the zone.
**Ads:** none. AdSense and `ads.txt` were removed.

## Run and deploy

```sh
npm install
npm run dev      # local preview at http://localhost:8788
```

Cloudflare Pages (project `bengaliexperience`) is connected to this repo:
a push to `main` deploys to production. `npm run deploy` also works.
