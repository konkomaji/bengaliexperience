/**
 * Four famous West Bengal bus routes. Each is a "world": its own hero
 * illustration, its own colour of light, its own line of copy. The playlist
 * is shared across all of them — the route only changes the scenery you're
 * watching go past.
 *
 * All visible copy is English.
 */

export type RouteId = "kolkata" | "digha" | "darjeeling" | "shantiniketan";

export interface RouteDef {
  id: RouteId;
  name: string;
  /** small caps line under the wordmark */
  ticker: string;
  /** all-caps punchline under the big hero title */
  punchline: string;
  tagline: string;
  distanceKm: number;
  /** hero image in /public/hero/ */
  hero: string;
  /**
   * Social card in /public/og/, cropped from the hero by
   * `scripts/make-og-images.mjs`. Per route, so a shared link previews the
   * ride it actually opens instead of all four looking identical.
   */
  og: string;
}

export const ROUTES: RouteDef[] = [
  {
    id: "kolkata",
    name: "Kolkata",
    ticker: "Howrah – Esplanade – Gariahat",
    punchline: "ALL NIGHT IN THE CITY",
    tagline: "Over Howrah Bridge and down the tram lines, through the heart of the city",
    distanceKm: 18,
    hero: "/hero/hero-kolkata.jpg",
    og: "/og/og-kolkata.jpg",
  },
  {
    id: "digha",
    name: "Digha",
    ticker: "Esplanade – Digha · NH116B",
    punchline: "ALL THE WAY TO THE SEA",
    tagline: "Past the casuarina groves, salt wind all the way down to the Bay",
    distanceKm: 183,
    hero: "/hero/hero-digha.jpg",
    og: "/og/og-digha.jpg",
  },
  {
    id: "darjeeling",
    name: "Darjeeling",
    ticker: "Siliguri – Darjeeling · Hill Cart Road",
    punchline: "ALL THE WAY UP THE HILLS",
    tagline: "Up through the tea gardens and pines, climbing into the mist",
    distanceKm: 77,
    hero: "/hero/hero-darjeeling.jpg",
    og: "/og/og-darjeeling.jpg",
  },
  {
    id: "shantiniketan",
    name: "Shantiniketan",
    ticker: "Kolkata – Bolpur · Birbhum Road",
    punchline: "ALL DAY ON THE RED ROAD",
    tagline: "Red laterite roads and rows of palm, out into Birbhum",
    distanceKm: 152,
    hero: "/hero/hero-shantiniketan.jpg",
    og: "/og/og-shantiniketan.jpg",
  },
];

export const DEFAULT_ROUTE: RouteId = "kolkata";

export function getRoute(id: RouteId): RouteDef {
  return ROUTES.find((r) => r.id === id) ?? ROUTES[0];
}
