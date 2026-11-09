# bengaliexperience.wtf

The Bengali Experience project (the bus playlist, Mahalaya, Tarakeswar,
Kabir Suman, Uttam Kumar and the Marvel Multiverse Atlas) was retired on
2026-11-09. Its full source is kept at the git tag
`archive/bengaliexperience-final`.

The domain now serves two static pages on Cloudflare Pages while new work on
Bengal and West Bengal is being made:

- `/` — a "coming soon" page with an interactive alpana (`site/alpana.js`).
- every other URL — a sorry page (`site/404.html`, with a diya in `site/diya.js`).
  `functions/_middleware.js` sends it with HTTP **410 Gone**, so search
  engines drop the ~920 old URLs.

```sh
npm install
npm run dev      # local preview at http://localhost:8788
npm run deploy   # publish to Cloudflare Pages (project: bengaliexperience)
```

By [Konko M](https://konkomaji.com).
