import { BRAND } from "../data/brand";
import type { RouteDef, RouteId } from "../data/routes";
import { ROUTE_PATH, ROUTE_SEO } from "../data/seo";
import type { Song } from "../data/songs.types";

/**
 * schema.org @graph for a route page: WebSite, WebPage and a MusicPlaylist
 * carrying every track. Listing the full tracklist is what lets search and
 * AI answer engines cite the actual songs rather than guessing.
 *
 * Used on both sides: functions/_middleware.ts injects it at the edge for
 * crawlers, and JsonLd.tsx keeps it in sync during client-side navigation.
 */
export function buildJsonLd(routeId: RouteId, route: RouteDef, songs: Song[]) {
  const seo = ROUTE_SEO[routeId];
  const url = `${BRAND.url}${ROUTE_PATH[routeId]}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BRAND.url}/#website`,
        url: BRAND.url,
        name: BRAND.title,
        alternateName: [BRAND.nameEn, BRAND.nameBn, BRAND.titleBn],
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
        about: { "@type": "Thing", name: `${route.nameEn} bus route, West Bengal` },
        mainEntity: { "@id": `${url}#playlist` },
      },
      {
        "@type": "MusicPlaylist",
        "@id": `${url}#playlist`,
        name: seo.title,
        description: seo.description,
        url,
        genre: ["Bengali music", "Bangla adhunik", "Bengali film music", "Bangla band"],
        inLanguage: ["bn-IN", "en-IN"],
        isPartOf: { "@id": `${BRAND.url}/#website` },
        numTracks: songs.length,
        track: songs.map((s) => ({
          "@type": "MusicRecording",
          name: s.titleRomanized,
          alternateName: s.title,
          url: `https://www.youtube.com/watch?v=${s.youtubeId}`,
          datePublished: String(s.year),
          byArtist: s.artist.split(",").map((n) => ({ "@type": "Person", name: n.trim() })),
          publisher: { "@type": "Organization", name: s.publisher },
        })),
      },
    ],
  };
}
