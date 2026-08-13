/**
 * Edge middleware — rewrites the static index.html's title/meta/canonical
 * and JSON-LD per route BEFORE the response leaves Cloudflare.
 *
 * This is what makes per-page SEO/AEO/GEO actually work for a SPA: most
 * crawlers and AI answer engines either don't run JavaScript or run it
 * unreliably, so react-router's client-side head updates alone would leave
 * every URL sharing the homepage's tags.
 */
import { PATH_TO_ROUTE, ROUTE_SEO } from "../src/data/seo";
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
  if (!routeId) return response; // unknown path — SPA fallback handles it

  const seo = ROUTE_SEO[routeId];
  const canonical = BRAND.url + url.pathname;
  const jsonLd = buildJsonLd(routeId, getRoute(routeId));

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
    .on('meta[name="twitter:title"]', setAttr("content", seo.title))
    .on('meta[name="twitter:description"]', setAttr("content", seo.description))
    .on('link[rel="canonical"]', setAttr("href", canonical))
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
