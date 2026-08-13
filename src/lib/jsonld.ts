import { BRAND } from "../data/brand";
import { PLAYLISTS, TOTAL_TRACKS } from "../data/playlists";
import type { RouteDef, RouteId } from "../data/routes";
import { ROUTES } from "../data/routes";
import { FAQ, ROUTE_PATH, ROUTE_SEO } from "../data/seo";

/**
 * schema.org @graph for a route page.
 *
 * The tracklists live on YouTube and change without a redeploy, so this no
 * longer enumerates individual recordings — asserting a fixed tracklist that
 * may already be stale would be worse than not asserting one. Instead it
 * describes the collection honestly and points at the real playlists, which
 * is both accurate and still citable by answer engines.
 *
 * Used at the edge by functions/_middleware.ts for crawlers, and re-applied
 * client-side on navigation.
 */
export function buildJsonLd(routeId: RouteId, route: RouteDef) {
  const seo = ROUTE_SEO[routeId];
  const url = `${BRAND.url}${ROUTE_PATH[routeId]}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BRAND.url}/#website`,
        url: BRAND.url,
        name: BRAND.nameEn,
        alternateName: [BRAND.seoTitle, "Bengali Bus Driver Playlist"],
        description: BRAND.tagline,
        inLanguage: ["en-IN", "bn-IN"],
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": `${BRAND.url}/#website` },
        inLanguage: "en-IN",
        about: { "@type": "Thing", name: `${route.name} bus route, West Bengal` },
        mainEntity: { "@id": `${BRAND.url}/#collection` },
      },
      {
        "@type": "MusicPlaylist",
        "@id": `${BRAND.url}/#collection`,
        name: `${BRAND.nameEn} — Bengali music collection`,
        description:
          "A rotating collection of curated Bengali playlists spanning the golden age, the Bangla band era, and modern hits — shuffled fresh on every visit.",
        url: BRAND.url,
        genre: ["Bengali music", "Bangla adhunik", "Bengali film music", "Bangla band"],
        inLanguage: ["bn-IN", "en-IN"],
        numTracks: TOTAL_TRACKS,
        hasPart: PLAYLISTS.map((p) => ({
          "@type": "MusicPlaylist",
          name: p.youtubeTitle,
          url: `https://www.youtube.com/playlist?list=${p.id}`,
          numTracks: p.approxTracks,
        })),
      },
      // The questions people actually ask, in the form answer engines quote.
      // Same text as the crawlable body, so the page and the markup agree.
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      // Four sibling routes, not a hierarchy — the breadcrumb says where this
      // page sits, and the ItemList tells a crawler the other three exist
      // even before it follows a link.
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: BRAND.nameEn, item: BRAND.url },
          { "@type": "ListItem", position: 2, name: route.name, item: url },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${BRAND.url}/#routes`,
        name: "Routes",
        itemListElement: ROUTES.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: ROUTE_SEO[r.id].h1,
          url: `${BRAND.url}${ROUTE_PATH[r.id]}`,
        })),
      },
    ],
  };
}
