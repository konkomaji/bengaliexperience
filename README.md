# bengaliexperience

**Bengali Bus Driver Playlist — Bangers from 90s to 20s**

A free, no-login site that plays a curated queue of Bengali songs from the
1990s to the 2020s, staged as a bus ride along four famous West Bengal
routes: Kolkata, Digha, Darjeeling and Shantiniketan.

Vite + React + TypeScript + Tailwind v4, deployed as a static site plus one
tiny edge function on Cloudflare Pages.

## Develop

```bash
npm install
npm run dev            # http://localhost:5173
```

To exercise the Cloudflare-only pieces (per-route SEO rewriting, the
`/api/aboard` counter), build first and serve through Wrangler:

```bash
npm run cf:dev         # build + wrangler pages dev dist
```

## Deploy

One-time:

```bash
npx wrangler login
npx wrangler kv namespace create ABOARD
npx wrangler kv namespace create ABOARD --preview
```

Paste both returned ids into `wrangler.toml`. Then either `npm run deploy`,
or connect the repo to Cloudflare Pages with build command `npm run build`,
output directory `dist`, and an `ABOARD` KV binding under
Settings → Functions.

Set the real domain in `src/data/brand.ts` (`BRAND.url`) and in
`public/robots.txt` / `public/sitemap.xml` before going live — they're
currently pointed at the `.pages.dev` placeholder.

## How the scene works

The background is **one pre-rendered illustration per route**, not coded
graphics. This is the same approach the site that inspired this one uses,
and it's the whole trick: drawing a convincing bus in SVG is a losing battle,
while a single generated image nails it and costs nothing at runtime.

`src/components/HeroScene.tsx` layers, back to front: a dusk gradient (also
the fallback while the image loads or if it's missing) → the hero image,
`object-cover`, focal point panned per breakpoint via `--hero-position` so
the bus survives narrow phones → a drifting cloud strip → legibility washes
→ film grain.

Drop images in `public/hero/`:

| file | size | notes |
|---|---|---|
| `hero-kolkata.jpg` | 1920×825 | 21:9, dark and moody, bus centred in the middle band |
| `hero-digha.jpg` | 1920×825 | |
| `hero-darjeeling.jpg` | 1920×825 | |
| `hero-shantiniketan.jpg` | 1920×825 | |
| `clouds.png` | 1600×1000 | transparent background, soft wisps |
| `../opengraph.jpg` | 1200×630 | in `public/`, for social cards |

Top and bottom ~25% of each hero get covered by gradients and the player, so
keep the subject in the middle band. No text in the images — generators
garble lettering.

## Playlist

`src/data/songs.ts`. Every `youtubeId` was verified against YouTube's oEmbed
endpoint and returned HTTP 200, meaning the video exists **and** permits
embedding. That check is not optional — a video can be live but refuse to
embed (oEmbed `401`), in which case the player silently plays nothing. Ten
tracks were cut from the first draft for exactly that reason.

Before adding a track:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json"
```

`200` good · `401` embedding blocked · `404` gone.

## Layout

- `src/data/` — routes, songs, brand, per-route SEO copy
- `src/components/` — scene, header, hero, player, queue + ticket sheets
- `src/hooks/` — player engine, YouTube API loader, IST clock, aboard count, horn
- `functions/_middleware.ts` — rewrites title/meta/canonical/JSON-LD per route
  at the edge, so crawlers and AI answer engines get correct tags without
  running JavaScript
- `functions/api/aboard.ts` — KV-backed live listener count

## Notes

- Audio streams from official YouTube uploads through the IFrame API; the
  iframe is parked off-screen and a spinning record is shown instead. Nothing
  is rehosted.
- YouTube may show its own pre-roll on some tracks. That's YouTube's ad, not
  the site's, and it isn't controllable from the embed.
- The queue and ticket modals deliberately avoid `AnimatePresence`. Under
  framer-motion v13 + React 19 its exit never flushed on its own, leaving
  modals stuck on screen until an unrelated re-render; plain conditional
  rendering unmounts reliably.
