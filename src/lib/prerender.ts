import { BRAND } from "../data/brand";
import { PLAYLISTS, TOTAL_TRACKS } from "../data/playlists";
import { getRoute, ROUTES, type RouteId } from "../data/routes";
import { FAQ, ROUTE_PATH, ROUTE_SEO } from "../data/seo";

/**
 * The version of the page a crawler sees.
 *
 * The app is a SPA, so the shipped HTML body is one empty `<div id="root">`.
 * Google renders JavaScript eventually, but the answer engines this site
 * explicitly invites in `robots.txt` — GPTBot, PerplexityBot, ClaudeBot,
 * CCBot — mostly do not. They were being handed a blank page with excellent
 * meta tags and nothing to quote, which is the worst of both worlds: allowed
 * in, nothing to say.
 *
 * So the edge injects this markup into `#root`. React's `createRoot().render()`
 * clears the container's children on first paint, so a visitor never sees it
 * and there is no hydration mismatch. It is the same claims the visible page
 * makes — the heading, what the site is, the routes, the playlists, the
 * questions people actually ask — just in a form that survives without JS.
 */
const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function renderStaticBody(routeId: RouteId): string {
  const seo = ROUTE_SEO[routeId];
  const route = getRoute(routeId);

  const facts = seo.facts.map((f) => `<li>${escape(f)}</li>`).join("");

  const routes = ROUTES.map(
    (r) =>
      `<li><a href="${ROUTE_PATH[r.id]}">${escape(r.name)}</a> — ${escape(
        ROUTE_SEO[r.id].description,
      )}</li>`,
  ).join("");

  const lists = PLAYLISTS.map(
    (p) =>
      `<li>${escape(p.youtubeTitle)} — about ${p.approxTracks} tracks</li>`,
  ).join("");

  const faq = FAQ.map(
    (f) => `<h3>${escape(f.q)}</h3><p>${escape(f.a)}</p>`,
  ).join("");

  return [
    `<h1>${escape(seo.h1)}</h1>`,
    `<p>${escape(seo.intro)}</p>`,
    `<p>${escape(route.tagline)}</p>`,
    `<ul>${facts}</ul>`,
    `<h2>Routes</h2><ul>${routes}</ul>`,
    `<h2>What plays</h2>`,
    `<p>${escape(
      `${PLAYLISTS.length} curated Bengali playlists, roughly ${TOTAL_TRACKS} tracks in total, streamed from their official YouTube uploads and reshuffled on every visit.`,
    )}</p>`,
    `<ul>${lists}</ul>`,
    `<h2>Questions</h2>${faq}`,
    `<p>${escape(BRAND.seoTitle)}</p>`,
  ].join("");
}
