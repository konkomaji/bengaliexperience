/**
 * /sitemap.xml, generated from src/data/seo.ts rather than hand-written.
 *
 * It used to be a static file, which meant the page list and the domain were
 * spelled out a second time and could quietly disagree with the app. Now
 * there is exactly one source, the same one the router and the edge rewriter
 * read, so a new experience cannot go live without appearing here.
 *
 * Only `<loc>` and `<lastmod>` are emitted. Google has said outright that it
 * ignores `<changefreq>` and `<priority>`, and Bing treats them as hints at
 * best; keeping them would be decoration that implies a precision the site
 * cannot back up. `<lastmod>` comes from git (see scripts/stamp-lastmod.mjs)
 * and is omitted rather than faked when the build has no history to read.
 *
 * Planned experiences have no URL and so no row. The old four-route paths are
 * absent for the same reason: they are 301s now, and listing a redirect is
 * asking a crawler to spend its budget learning something it can be told.
 */
import { BRAND } from "../src/data/brand";
import { LAST_MODIFIED } from "../src/data/lastmod";
import { PAGE_PATH, type PageId } from "../src/data/seo";

export const onRequest: PagesFunction = () => {
  const pages = Object.keys(PAGE_PATH) as PageId[];

  const urls = pages
    .map((id) => {
      const loc = `${BRAND.url}${PAGE_PATH[id]}`;
      const lastmod = LAST_MODIFIED[id];
      return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
    })
    .join("\n");

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
