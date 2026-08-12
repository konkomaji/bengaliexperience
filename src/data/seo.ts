import { BRAND } from "./brand";
import type { RouteId } from "./routes";

/**
 * One source of truth for URLs + per-page SEO/AEO/GEO copy. Imported by the
 * React app AND by functions/_middleware.ts (the edge HTML rewriter), so a
 * path is only ever declared once.
 *
 * "/" is the flagship (Kolkata, matches the brand). Every other route gets a
 * real crawlable URL rather than hiding behind client-only state.
 */

export const ROUTE_PATH: Record<RouteId, string> = {
  kolkata: "/",
  digha: "/digha",
  darjeeling: "/darjeeling",
  shantiniketan: "/shantiniketan",
};

/** every servable path -> route (aliases included, kept out of the sitemap) */
export const PATH_TO_ROUTE: Record<string, RouteId> = {
  "/": "kolkata",
  "/kolkata": "kolkata",
  "/digha": "digha",
  "/darjeeling": "darjeeling",
  "/shantiniketan": "shantiniketan",
};

export interface RouteSeo {
  title: string;
  description: string;
  keywords: string[];
}

export const ROUTE_SEO: Record<RouteId, RouteSeo> = {
  kolkata: {
    title: BRAND.title,
    description:
      "Press play on the Bengali bus driver playlist — nonstop Bangla bangers from the 90s to the 20s, Kumar Sanu and Nachiketa to Anupam Roy and Arijit. Free, no login, straight through Kolkata at night.",
    keywords: [
      "bengali bus driver playlist",
      "bangla gaan playlist",
      "bengali songs 90s",
      "bangla hit songs nonstop",
      "kumar sanu bengali songs",
      "anupam roy songs",
      "arijit singh bengali songs",
      "kolkata bus playlist",
      "বাংলা গান প্লেলিস্ট",
    ],
  },
  digha: {
    title: `Digha Road Trip Playlist — Bangla Bangers to the Sea | ${BRAND.nameEn}`,
    description:
      "The Kolkata–Digha bus playlist — nonstop Bengali songs from the 90s to the 20s for the long run down NH116B to the Bay of Bengal. Free, no login.",
    keywords: [
      "digha road trip songs",
      "kolkata to digha bus",
      "bengali travel playlist",
      "bangla road trip songs",
      "sea beach playlist bengali",
    ],
  },
  darjeeling: {
    title: `Darjeeling Hill Route Playlist — Bangla Songs | ${BRAND.nameEn}`,
    description:
      "Climb Hill Cart Road from Siliguri to Darjeeling with a nonstop Bengali playlist — 90s Bangla band classics through modern hits, past the tea gardens and into the mist.",
    keywords: [
      "darjeeling playlist",
      "hill cart road",
      "siliguri darjeeling bus",
      "bengali mountain songs",
      "bangla nostalgic songs",
    ],
  },
  shantiniketan: {
    title: `Shantiniketan Route Playlist — Bangla Songs | ${BRAND.nameEn}`,
    description:
      "The Kolkata–Bolpur run through Birbhum's red laterite country, with a nonstop Bengali playlist from the 90s to the 20s. Free, no login.",
    keywords: [
      "shantiniketan playlist",
      "bolpur birbhum road",
      "bengali folk adhunik songs",
      "bangla countryside playlist",
    ],
  },
};
