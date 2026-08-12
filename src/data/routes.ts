/**
 * Four famous West Bengal bus routes. Each is a "world": its own hero
 * illustration, its own colour of light, its own line of copy. The playlist
 * is shared across all of them — the route only changes the scenery you're
 * watching go past.
 *
 * Distances are the real, well-known road distances for these runs.
 */

export type RouteId = "kolkata" | "digha" | "darjeeling" | "shantiniketan";

export interface RouteDef {
  id: RouteId;
  nameBn: string;
  nameEn: string;
  /** small caps line under the wordmark */
  ticker: string;
  /** all-caps punchline under the big hero title */
  punchline: string;
  taglineBn: string;
  taglineEn: string;
  distanceKm: number;
  /** hero image filename in /public/hero/ */
  hero: string;
  /** emoji used on the route pill */
  glyph: string;
}

export const ROUTES: RouteDef[] = [
  {
    id: "kolkata",
    nameBn: "কলকাতা",
    nameEn: "Kolkata",
    ticker: "Howrah – Esplanade – Gariahat",
    punchline: "ALL NIGHT IN THE CITY",
    taglineBn: "হাওড়া ব্রিজ পেরিয়ে, ট্রামলাইন ধরে শহরের বুকে",
    taglineEn: "Over Howrah Bridge and down the tram lines, through the heart of the city",
    distanceKm: 18,
    hero: "/hero/hero-kolkata.jpg",
    glyph: "🌉",
  },
  {
    id: "digha",
    nameBn: "দীঘা",
    nameEn: "Digha",
    ticker: "Esplanade – Digha · NH116B",
    punchline: "ALL THE WAY TO THE SEA",
    taglineBn: "ঝাউবনের পাশ দিয়ে, সমুদ্রের হাওয়ায় দীঘার পথে",
    taglineEn: "Past the casuarina groves, salt wind all the way down to the Bay",
    distanceKm: 183,
    hero: "/hero/hero-digha.jpg",
    glyph: "🌊",
  },
  {
    id: "darjeeling",
    nameBn: "দার্জিলিং",
    nameEn: "Darjeeling",
    ticker: "Siliguri – Darjeeling · Hill Cart Road",
    punchline: "ALL THE WAY UP THE HILLS",
    taglineBn: "চা বাগান আর পাইন পেরিয়ে, কুয়াশা ভেদ করে পাহাড়ে",
    taglineEn: "Up through the tea gardens and pines, climbing into the mist",
    distanceKm: 77,
    hero: "/hero/hero-darjeeling.jpg",
    glyph: "⛰️",
  },
  {
    id: "shantiniketan",
    nameBn: "শান্তিনিকেতন",
    nameEn: "Shantiniketan",
    ticker: "Kolkata – Bolpur · Birbhum Road",
    punchline: "ALL DAY ON THE RED ROAD",
    taglineBn: "লাল মাটির পথ, তালগাছের সারি — বীরভূমের দিকে",
    taglineEn: "Red laterite roads and rows of palm, out into Birbhum",
    distanceKm: 152,
    hero: "/hero/hero-shantiniketan.jpg",
    glyph: "🌾",
  },
];

export const DEFAULT_ROUTE: RouteId = "kolkata";

export function getRoute(id: RouteId): RouteDef {
  return ROUTES.find((r) => r.id === id) ?? ROUTES[0];
}
