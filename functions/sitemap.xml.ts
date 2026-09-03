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
import { KABIRSUMAN_ALBUM_PREFIX, KABIRSUMAN_SONG_PREFIX, PAGE_PATH, UTTAMKUMAR_FILM_PREFIX, type PageId } from "../src/data/seo";
import { BLOG_POSTS } from "../src/data/tarakeswar/blog";
import { ALBUMS, SONGS } from "../src/data/kabirsuman/catalogue";
import { FILMS } from "../src/data/uttamkumar/films";

export const onRequest: PagesFunction = () => {
  const pages = Object.keys(PAGE_PATH) as PageId[];

  const pageUrls = pages.map((id) => {
    const loc = `${BRAND.url}${PAGE_PATH[id]}`;
    const lastmod = LAST_MODIFIED[id];
    return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
  });

  // Blog posts aren't PageIds (see src/data/seo.ts), so they aren't in
  // PAGE_PATH; each carries its own lastmod instead of a git-derived one.
  const blogUrls = BLOG_POSTS.map((p) => {
    const loc = `${BRAND.url}${PAGE_PATH.tarakeswarBlog}/${p.slug}`;
    const lastmod = p.updatedDate ?? p.publishedDate;
    return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
  });

  // The Marvel Multiverse Atlas is deliberately absent. It is a separate
  // static app with 327 pages of its own and it keeps its own sitemap at
  // /marvelmultiverseatlas/sitemap.xml, which robots.txt lists alongside this
  // one. Listing it here as well would either duplicate every URL or, worse,
  // list one Marvel row in a sitemap that otherwise describes a Bengali
  // culture site and invite a crawler to read the two as one property.

  // Kabir Suman's albums and songs aren't PageIds (see src/data/seo.ts), so
  // like the Tarakeswar blog posts they get their own rows here rather than
  // through PAGE_PATH. No per-item lastmod: 347 rows is too many for a
  // git-log query each to be worth it, and the archive they are sourced from
  // changes rarely enough that an omitted date costs little.
  const albumUrls = ALBUMS.map((a) => `  <url><loc>${BRAND.url}${KABIRSUMAN_ALBUM_PREFIX}/${a.slug}</loc></url>`);
  const songUrls = SONGS.map((s) => `  <url><loc>${BRAND.url}${KABIRSUMAN_SONG_PREFIX}/${s.slug}</loc></url>`);

  // Uttam Kumar's 211 films, same reasoning: no per-item lastmod, the source
  // filmography changes rarely enough that an omitted date costs little.
  const filmUrls = FILMS.map((f) => `  <url><loc>${BRAND.url}${UTTAMKUMAR_FILM_PREFIX}/${f.slug}</loc></url>`);

  const urls = [...pageUrls, ...blogUrls, ...albumUrls, ...songUrls, ...filmUrls].join("\n");

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
