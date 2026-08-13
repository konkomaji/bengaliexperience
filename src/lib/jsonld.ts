import { BRAND, DRIVER } from "../data/brand";
import { PLAYLISTS, TOTAL_TRACKS } from "../data/playlists";
import type { RouteDef, RouteId } from "../data/routes";
import { DEFAULT_ROUTE, ROUTES } from "../data/routes";
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
  const image = `${BRAND.url}${route.og}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      // One named human behind the site. An answer engine asked "who made
      // this?" should not have to guess, and an unattributed page is a weaker
      // thing to cite than an attributed one. Person, not Organization,
      // because that is what this actually is.
      {
        "@type": "Person",
        "@id": `${BRAND.url}/#curator`,
        name: DRIVER.name,
        description: DRIVER.bio,
        url: BRAND.url,
        sameAs: [DRIVER.href],
      },
      {
        "@type": "WebSite",
        "@id": `${BRAND.url}/#website`,
        url: BRAND.url,
        name: BRAND.nameEn,
        alternateName: [BRAND.seoTitle, "Bengali Bus Driver Playlist"],
        description: BRAND.tagline,
        inLanguage: ["en-IN", "bn-IN"],
        publisher: { "@id": `${BRAND.url}/#curator` },
      },
      {
        "@type": "ImageObject",
        "@id": `${url}#primaryimage`,
        url: image,
        contentUrl: image,
        width: 1200,
        height: 630,
        caption: seo.imageAlt,
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
        primaryImageOfPage: { "@id": `${url}#primaryimage` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        // "Free, no login" is the site's central claim and the thing people
        // search for. Saying it in a field built for it is worth more than
        // saying it again in prose.
        isAccessibleForFree: true,
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
        isAccessibleForFree: true,
        creator: { "@id": `${BRAND.url}/#curator` },
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
      //
      // The flagship route IS the home page, so it gets a one-item trail. The
      // old two-item version listed the site and then the same URL again as
      // its own child, which is a loop dressed up as a hierarchy.
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement:
          routeId === DEFAULT_ROUTE
            ? [{ "@type": "ListItem", position: 1, name: BRAND.nameEn, item: url }]
            : [
                { "@type": "ListItem", position: 1, name: BRAND.nameEn, item: `${BRAND.url}/` },
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
