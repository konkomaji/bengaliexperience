/**
 * Site identity.
 *
 * Bengali Experience is the umbrella: a set of small sites that each put you
 * inside one Bengali thing for a while. The bus driver playlist is the first
 * of them, not the whole of it, so the brand-level copy here talks about the
 * project and the per-experience copy lives in `src/data/seo.ts`.
 *
 * All visible copy is English; the Bengali-script song titles stay in the
 * data only, for structured data and search.
 */
export const BRAND = {
  project: "bengaliexperience",
  nameEn: "Bengali Experience",
  seoTitle: "Bengali Experience: Bengal, Bangla Culture and Nostalgia, Free",
  tagline:
    "Small free experiences that put you inside something Bengali for a while. A night bus through Kolkata with the radio on, and more to come.",
  /**
   * Canonical origin. Every absolute URL the site emits, canonical links,
   * og:url, JSON-LD @ids, the sitemap, is built from this, so it is the only
   * place a domain change has to happen. No trailing slash.
   */
  url: "https://bengaliexperience.wtf",
  /**
   * The single social card. There is one illustration in the project and both
   * pages are about the same thing, so shipping two near-identical crops would
   * be duplication dressed up as thoroughness.
   */
  ogImage: "/opengraph.jpg",
  ogImageAlt:
    "A yellow and red Kolkata bus with luggage roped to its roof, stopped on wet tram lines at dusk, with the Howrah Bridge and an Ambassador taxi behind it.",
} as const;

/** The "Who's driving?" card, the curator credit shown in the header. */
export const DRIVER = {
  name: "konko",
  bio: "What strange offspring may be born when mortal fancy lends a soul unto the work of artifice?",
  handle: "whereiskonko",
  get href() {
    return `https://instagram.com/${this.handle}`;
  },
  footnote: "New songs join the bus most weeks.",
} as const;
