/**
 * Site identity.
 *
 * Two names on purpose:
 *   `nameEn`  — what visitors see. The brand.
 *   `seoTitle`— what search engines and social cards see. Carries the
 *               high-intent "bengali bus driver playlist" phrasing people
 *               actually search for, without putting it in the UI.
 *
 * All visible copy is English; the Bengali-script song titles stay in the
 * data only, for structured data and search.
 */
export const BRAND = {
  project: "bengaliexperience",
  nameEn: "Bengali Experience",
  seoTitle: "Bengali Bus Driver Playlist — Bangers from 90s to 20s",
  tagline:
    "Press play on the Bengali bus driver playlist — nonstop Bangla bangers from the 90s to the 20s, Kumar Sanu to Arijit. Free, no login.",
  /**
   * Canonical origin. Every absolute URL the site emits — canonical links,
   * og:url, JSON-LD @ids, the sitemap — is built from this, so it is the only
   * place a domain change has to happen. No trailing slash.
   */
  url: "https://bengaliexperience.wtf",
} as const;

/** The "Who's driving?" card — the curator credit shown in the header. */
export const DRIVER = {
  name: "konko",
  bio: "What strange offspring may be born when mortal fancy lends a soul unto the work of artifice?",
  handle: "whereiskonko",
  get href() {
    return `https://instagram.com/${this.handle}`;
  },
  footnote: "New songs join the bus most weeks.",
} as const;
