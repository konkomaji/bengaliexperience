/**
 * Edge middleware. Rewrites the static index.html's title, meta, canonical
 * and JSON-LD per page BEFORE the response leaves Cloudflare, and settles
 * every question of "which URL is this really" before a crawler can get it
 * wrong.
 *
 * This is what makes per-page SEO, AEO and GEO actually work for a SPA: most
 * crawlers and AI answer engines either do not run JavaScript or run it
 * unreliably, so react-router's client-side head updates alone would leave
 * every URL sharing the front page's tags.
 *
 * Four jobs, in order:
 *   1. one host          the pages.dev origin 301s to the custom domain
 *   2. one URL per page  the old four-route paths 301 to /busdriver
 *   3. real status codes unknown paths 404 instead of soft-404ing at 200
 *   4. real content      per-page head, JSON-LD and a crawlable body
 */
import { MOVED_PATHS, PAGE_PATH, PAGE_SEO, PATH_TO_PAGE } from "../src/data/seo";
import { buildJsonLd } from "../src/lib/jsonld";
import { renderStaticBody } from "../src/lib/prerender";
import { BRAND } from "../src/data/brand";
import { SCENE_VERSION } from "../src/data/sceneGeometry";
import { getBlogPost } from "../src/data/tarakeswar/blog";
import { buildTarakeswarBlogPostJsonLd } from "../src/data/tarakeswar/jsonld";
import { renderTarakeswarBlogPostBody } from "../src/data/tarakeswar/prerender";

/**
 * The Pages project keeps answering on its own `*.pages.dev` host even after a
 * custom domain is attached, so the same site is reachable at two origins and
 * a crawler that finds the old one splits the ranking signal. Canonical tags
 * ask nicely; a 301 settles it. Matched exactly, so preview deployments
 * (`<hash>.bengaliexperience.pages.dev`) stay reachable for testing.
 */
const LEGACY_HOST = "bengaliexperience.pages.dev";

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);

  if (url.hostname === LEGACY_HOST) {
    return Response.redirect(BRAND.url + url.pathname + url.search, 301);
  }

  // /marvelmultiverseatlas is a whole separate static app — its own head, its
  // own JSON-LD, its own crawlable markup, all generated already. It isn't a
  // PageId and wants none of this rewriter's work, so it is handled here and
  // returned before the PATH_TO_PAGE lookup below can treat it as an unknown
  // path and noindex it.
  if (url.pathname === "/marvelmultiverseatlas" || url.pathname.startsWith("/marvelmultiverseatlas/")) {
    const atlas = await next();

    // An Atlas path that matches no file falls through `_redirects` to the
    // SPA shell at status 200: the wrong site, served as though it were the
    // right one, and a soft 404 that puts junk URLs in the index as
    // duplicates of the Bengali front page. `_redirects` cannot fix this
    // (Pages ignores any status there other than 200 and the 3xx family), so
    // the fallback is detected by what came back and answered with the
    // Atlas's own 404 page at a real 404. Every generated Atlas page carries
    // `class="atlas-page"`; the app's own index.html carries
    // `id="atlas-prerender"`. The SPA shell has neither.
    const type = atlas.headers.get("content-type") ?? "";
    if (type.includes("text/html") && atlas.status === 200) {
      const html = await atlas.text();
      const isAtlas = html.includes("atlas-page") || html.includes("atlas-prerender");
      if (!isAtlas) {
        const notFound = await next(
          new Request(new URL("/marvelmultiverseatlas/404.html", request.url), request),
        );
        return new Response(await notFound.text(), {
          status: 404,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
      return new Response(html, { status: atlas.status, headers: atlas.headers });
    }
    return atlas;
  }

  // The site used to be four route pages, all of them the bus. Those URLs
  // were live and in a submitted sitemap, so a crawler that already knows
  // them is told where the page went rather than that it is gone.
  const moved = MOVED_PATHS[url.pathname];
  if (moved) return Response.redirect(BRAND.url + moved + url.search, 301);

  const response = await next();
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;

  const pageId = PATH_TO_PAGE[url.pathname];

  // A Tarakeswar blog post: not a PageId (there are eleven of these and more
  // later, one per slug, which does not fit the fixed Record<PageId, ...>
  // every other page uses), so it is matched and rewritten here, alongside
  // rather than through the PATH_TO_PAGE lookup above.
  const blogSlug = url.pathname.startsWith(`${PAGE_PATH.tarakeswarBlog}/`)
    ? url.pathname.slice(PAGE_PATH.tarakeswarBlog.length + 1)
    : null;
  const blogPost = blogSlug ? getBlogPost(blogSlug) : undefined;

  if (blogPost) {
    const canonical = `${BRAND.url}${PAGE_PATH.tarakeswarBlog}/${blogPost.slug}`;
    const jsonLd = buildTarakeswarBlogPostJsonLd(blogPost);
    const setAttr = (attr: string, value: string) => ({
      element: (el: Element) => { el.setAttribute(attr, value); },
    });
    // Every post shares the section's one generated card; see
    // scripts/prepare-tarakeswar-og.mjs and PAGE_SEO.tarakeswar.ogImage.
    const ogImage = PAGE_SEO.tarakeswar.ogImage!;

    return new HTMLRewriter()
      .on("title", { element: (el) => { el.setInnerContent(blogPost.title); } })
      .on('meta[name="description"]', setAttr("content", blogPost.description))
      .on('meta[name="keywords"]', setAttr("content", blogPost.keywords.join(", ")))
      .on('meta[name="theme-color"]', setAttr("content", "#e8720c"))
      .on('meta[property="og:title"]', setAttr("content", blogPost.title))
      .on('meta[property="og:description"]', setAttr("content", blogPost.description))
      .on('meta[property="og:url"]', setAttr("content", canonical))
      .on('meta[property="og:image"]', setAttr("content", BRAND.url + ogImage.url))
      .on('meta[property="og:image:alt"]', setAttr("content", ogImage.alt))
      .on('meta[name="twitter:title"]', setAttr("content", blogPost.title))
      .on('meta[name="twitter:description"]', setAttr("content", blogPost.description))
      .on('meta[name="twitter:image"]', setAttr("content", BRAND.url + ogImage.url))
      .on('meta[name="twitter:image:alt"]', setAttr("content", ogImage.alt))
      .on('link[rel="canonical"]', setAttr("href", canonical))
      .on("#ld-json", { element: (el) => { el.setInnerContent(JSON.stringify(jsonLd), { html: false }); } })
      .on("#root", { element: (el) => { el.setInnerContent(renderTarakeswarBlogPostBody(blogPost), { html: true }); } })
      .transform(response);
  }

  if (blogSlug && !blogPost) {
    // A blog path that doesn't match any post: real 404, same treatment as
    // any other unknown path below, rather than a second code path.
    const noindex = { element: (el: Element) => { el.setAttribute("content", "noindex, follow"); } };
    return new HTMLRewriter()
      .on('meta[name="robots"]', noindex)
      .on('meta[name="googlebot"]', noindex)
      .transform(new Response(response.body, { status: 404, headers: response.headers }));
  }

  if (!pageId) {
    // `_redirects` sends every unmatched path to index.html with a 200 so the
    // router can show the breakdown screen. To a visitor that is right; to a
    // crawler it is a soft 404, because the status says "this URL is a real
    // page", so junk and mistyped URLs accumulate in the index as duplicates
    // of the front page. The body still renders; only the status and the
    // robots tag change, which is the combination that gets them dropped.
    //
    // The existing tags are rewritten rather than a noindex appended: two
    // robots directives on one page is a contradiction the crawler has to
    // break a tie on, and there is no reason to make it guess.
    const noindex = { element: (el: Element) => { el.setAttribute("content", "noindex, follow"); } };
    return new HTMLRewriter()
      .on('meta[name="robots"]', noindex)
      .on('meta[name="googlebot"]', noindex)
      .transform(new Response(response.body, { status: 404, headers: response.headers }));
  }

  const seo = PAGE_SEO[pageId];
  // Built from the page's own path, never from the URL that was requested, so
  // an alias can never declare itself canonical and compete with the page it
  // stands in for.
  const canonical = BRAND.url + PAGE_PATH[pageId];
  const jsonLd = buildJsonLd(pageId);

  const setAttr = (attr: string, value: string) => ({
    element: (el: Element) => { el.setAttribute(attr, value); },
  });

  // Every page so far has shared BRAND's one site-wide illustration as its
  // social card; the Tarakeswar pages carry their own instead (see
  // PageSeo.ogImage), so this falls back to the default only when a page
  // doesn't set one, rather than needing every page to repeat it.
  const ogImage = seo.ogImage ?? { url: BRAND.ogImage, alt: BRAND.ogImageAlt };

  const rewriter = new HTMLRewriter()
    .on("title", { element: (el) => { el.setInnerContent(seo.title); } })
    .on('meta[name="description"]', setAttr("content", seo.description))
    // The site is dark everywhere except the Tarakeswar section, which sets
    // its own; every other page keeps index.html's default.
    .on('meta[name="theme-color"]', setAttr("content", seo.themeColor ?? "#150803"))
    .on('meta[name="keywords"]', setAttr("content", seo.keywords.join(", ")))
    .on('meta[property="og:title"]', setAttr("content", seo.title))
    .on('meta[property="og:description"]', setAttr("content", seo.description))
    .on('meta[property="og:url"]', setAttr("content", canonical))
    .on('meta[property="og:image"]', setAttr("content", BRAND.url + ogImage.url))
    .on('meta[property="og:image:alt"]', setAttr("content", ogImage.alt))
    .on('meta[name="twitter:title"]', setAttr("content", seo.title))
    .on('meta[name="twitter:description"]', setAttr("content", seo.description))
    .on('meta[name="twitter:image"]', setAttr("content", BRAND.url + ogImage.url))
    .on('meta[name="twitter:image:alt"]', setAttr("content", ogImage.alt))
    .on('link[rel="canonical"]', setAttr("href", canonical))
    .on("#ld-json", {
      element: (el) => { el.setInnerContent(JSON.stringify(jsonLd), { html: false }); },
    })
    // The body a JavaScript-less crawler gets. React wipes #root on first
    // render, so this is invisible to visitors. See src/lib/prerender.ts for
    // why it has to exist at all.
    .on("#root", {
      element: (el) => { el.setInnerContent(renderStaticBody(pageId), { html: true }); },
    });

  if (pageId === "busdriver") {
    // The driving scene is that page's first paint, and React renders it, so
    // without this the browser cannot discover its art until the bundle has
    // downloaded, parsed and run. Preload the two layers on screen from the
    // first frame — the bus and the road under it — while the HTML is still
    // being parsed. The parallax backgrounds, traffic and exhaust are left to
    // load normally so they do not compete with these two. Scoped to this
    // page: it is the only one that mounts the scene.
    rewriter.on("head", {
      element: (el) => {
        el.append(
          `<link rel="preload" as="image" fetchpriority="high" href="/scene/bus.webp?v=${SCENE_VERSION}">` +
            `<link rel="preload" as="image" href="/scene/road.webp?v=${SCENE_VERSION}">`,
          { html: true },
        );
      },
    });
  }

  return rewriter.transform(response);
};
