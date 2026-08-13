/**
 * /sitemap.xml — generated from src/data/seo.ts, not hand-written.
 *
 * It used to be a static file in public/, which meant the four URLs and the
 * domain were spelled out a second time and could quietly disagree with the
 * app. Now the route list has exactly one source, the same one the router and
 * the edge rewriter read, so a new route cannot be added without appearing
 * here.
 *
 * Only `<loc>` and `<lastmod>` are emitted. Google has said outright that it
 * ignores `<changefreq>` and `<priority>`, and Bing treats them as hints at
 * best; keeping them would be decoration that implies a precision the site
 * cannot back up. `<lastmod>` comes from git (see scripts/stamp-lastmod.mjs)
 * and is omitted rather than faked when the build has no history to read.
 *
 * `/kolkata` is deliberately absent: it is an alias that canonicalises to `/`,
 * and listing both would ask the crawler to index the same page twice.
 */
import { BRAND } from "../src/data/brand";
import { LAST_MODIFIED } from "../src/data/lastmod";
import { ROUTES } from "../src/data/routes";
import { ROUTE_PATH } from "../src/data/seo";

export const onRequest: PagesFunction = () => {
  const urls = ROUTES.map((r) => {
    const loc = `${BRAND.url}${ROUTE_PATH[r.id]}`;
    const lastmod = LAST_MODIFIED[r.id];
    return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      // Crawlers refetch this often; an hour at the edge is plenty and keeps a
      // fresh deploy from being masked by a stale copy.
      "cache-control": "public, max-age=3600",
    },
  });
};
