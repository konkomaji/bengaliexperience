/**
 * Tarakeswar section identity and shared facts.
 *
 * A separate small "brand" from src/data/brand.ts on purpose: Tarakeswar is
 * its own subject with its own name, not a Bengali Experience "experience".
 * It is not listed in src/data/experiences.ts and carries no link from the
 * home page or the header, by design (see CHANGELOG); it is reachable only
 * by a direct URL or a search result, and the sitemap/llms.txt entries are
 * what get it found.
 */
export const TARAKESWAR = {
  name: "Tarakeswar",
  /** common alternate spellings people actually type, kept in one place so
   *  every page's keywords and "also spelled" copy stay in sync */
  spellings: ["Tarkeswar", "Tarakeshwar", "Tarkeshwar", "Tarakeswer"],
  district: "Hooghly district, West Bengal, India",
  pincode: "712410",
  deity: "Baba Taraknath",
  templeName: "Tarakeswar Temple (Taraknath Mandir)",
  /** Wikipedia's figure for the town: 22°53'N 88°01'E [source: en.wikipedia.org/wiki/Tarakeswar] */
  coordinates: { lat: 22.8833, lng: 88.0167 },
  /** Google Maps place query, used for every embedded/linked map on the
   *  section: one query string kept in one place, rather than a hand typed
   *  URL on every page that could quietly drift out of date. */
  mapsQuery: "Tarakeswar Temple, Tarakeswar, West Bengal 712410",
} as const;
