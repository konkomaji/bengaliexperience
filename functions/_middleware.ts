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
import { SCENE } from "../src/data/scene";
import { buildJsonLd } from "../src/lib/jsonld";
import { renderStaticBody } from "../src/lib/prerender";
import { BRAND } from "../src/data/brand";

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

  // The site used to be four route pages, all of them the bus. Those URLs
  // were live and in a submitted sitemap, so a crawler that already knows
  // them is told where the page went rather than that it is gone.
  const moved = MOVED_PATHS[url.pathname];
  if (moved) return Response.redirect(BRAND.url + moved + url.search, 301);

  const response = await next();
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;

  const pageId = PATH_TO_PAGE[url.pathname];

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

  const rewriter = new HTMLRewriter()
    .on("title", { element: (el) => { el.setInnerContent(seo.title); } })
    .on('meta[name="description"]', setAttr("content", seo.description))
    .on('meta[name="keywords"]', setAttr("content", seo.keywords.join(", ")))
    .on('meta[property="og:title"]', setAttr("content", seo.title))
    .on('meta[property="og:description"]', setAttr("content", seo.description))
    .on('meta[property="og:url"]', setAttr("content", canonical))
    .on('meta[name="twitter:title"]', setAttr("content", seo.title))
    .on('meta[name="twitter:description"]', setAttr("content", seo.description))
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
    // The hero illustration is that page's LCP element, and React renders it,
    // so without this the browser cannot even discover it until the bundle
    // has downloaded, parsed and run. Preloading starts the fetch while the
    // HTML is still being parsed. Only on the page that has a hero.
    rewriter.on("head", {
      element: (el) => {
        el.append(
          `<link rel="preload" as="image" fetchpriority="high" href="${SCENE.hero}">`,
          { html: true },
        );
      },
    });
  }

  return rewriter.transform(response);
};
