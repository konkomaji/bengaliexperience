/**
 * Edge middleware — rewrites the static index.html's title/meta/canonical
 * and JSON-LD per route BEFORE the response leaves Cloudflare.
 *
 * This is what makes per-page SEO/AEO/GEO actually work for a SPA: most
 * crawlers and AI answer engines either don't run JavaScript or run it
 * unreliably, so react-router's client-side head updates alone would leave
 * every URL sharing the homepage's tags.
 */
import { PATH_TO_ROUTE, ROUTE_PATH, ROUTE_SEO } from "../src/data/seo";
import { getRoute } from "../src/data/routes";
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

  const response = await next();
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;

  const routeId = PATH_TO_ROUTE[url.pathname];

  if (!routeId) {
    // `_redirects` sends every unmatched path to index.html with a 200 so the
    // router can show the breakdown screen. To a visitor that is right; to a
    // crawler it is a soft 404 — the status says "this URL is a real page",
    // so junk and mistyped URLs accumulate in the index as duplicates of the
    // home page. The body still renders; only the status and robots tag
    // change, which is the combination that actually gets them dropped.
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

  const seo = ROUTE_SEO[routeId];
  const route = getRoute(routeId);

  // Built from the route's own path, never from the URL that was requested:
  // `/kolkata` is an alias of `/`, and echoing the request back would have it
  // declare itself canonical and compete with the page it is an alias for.
  const canonical = BRAND.url + ROUTE_PATH[routeId];
  const ogImage = BRAND.url + route.og;
  const jsonLd = buildJsonLd(routeId, route);

  const setAttr = (attr: string, value: string) => ({
    element: (el: Element) => { el.setAttribute(attr, value); },
  });

  return new HTMLRewriter()
    .on("title", { element: (el) => { el.setInnerContent(seo.title); } })
    .on('meta[name="description"]', setAttr("content", seo.description))
    .on('meta[name="keywords"]', setAttr("content", seo.keywords.join(", ")))
    .on('meta[property="og:title"]', setAttr("content", seo.title))
    .on('meta[property="og:description"]', setAttr("content", seo.description))
    .on('meta[property="og:url"]', setAttr("content", canonical))
    // Each route has its own social card, cropped from its own scene, so a
    // shared link previews the ride it opens instead of all four looking the
    // same in the share sheet.
    .on('meta[property="og:image"]', setAttr("content", ogImage))
    .on('meta[property="og:image:alt"]', setAttr("content", seo.imageAlt))
    .on('meta[name="twitter:title"]', setAttr("content", seo.title))
    .on('meta[name="twitter:description"]', setAttr("content", seo.description))
    .on('meta[name="twitter:image"]', setAttr("content", ogImage))
    .on('meta[name="twitter:image:alt"]', setAttr("content", seo.imageAlt))
    .on('link[rel="canonical"]', setAttr("href", canonical))
    .on("head", {
      element: (el) => {
        // The hero illustration is the LCP element, and React renders it — so
        // without this the browser cannot even discover it until the ~130 kB
        // of JavaScript has downloaded, parsed and run. Preloading lets the
        // fetch start while the HTML is still being parsed.
        el.append(
          `<link rel="preload" as="image" fetchpriority="high" href="${route.hero}">`,
          { html: true },
        );
      },
    })
    .on("#ld-json", {
      element: (el) => { el.setInnerContent(JSON.stringify(jsonLd), { html: false }); },
    })
    // The body a JS-less crawler gets. React wipes #root on first render, so
    // this is invisible to visitors — see src/lib/prerender.ts for why it has
    // to exist at all.
    .on("#root", {
      element: (el) => { el.setInnerContent(renderStaticBody(routeId), { html: true }); },
    })
    .transform(response);
};
