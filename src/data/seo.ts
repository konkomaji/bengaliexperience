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
  /** the page's real heading — also the only <h1> a JS-less crawler sees */
  h1: string;
  /**
   * Two or three sentences an answer engine can quote verbatim. Written to
   * stand alone: an AI summary shows this without the page around it, so it
   * has to say what the site is, not just set a mood.
   */
  intro: string;
  /** short factual lines — the shape LLMs lift most readily */
  facts: string[];
  /**
   * Alt text for the route's hero and social card. Describes the illustration,
   * not the page: it is read aloud by screen readers and is the only account
   * of the image an indexer or an answer engine ever gets.
   */
  imageAlt: string;
}

/**
 * Answer-engine questions.
 *
 * The searches behind this site are of two kinds. Navigational/keyword ones
 * ("bengali bus driver playlist", "bangla gaan nonstop") are served by the
 * title and description. Question-shaped ones — what people actually type
 * into ChatGPT, Perplexity and Google's AI box — need an answer in the HTML,
 * short enough to be quoted whole. That is what this is for; it is emitted as
 * both visible text and FAQPage structured data.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "What is the Bengali Bus Driver Playlist?",
    a: "It is a free website that plays curated Bengali music nonstop, staged as a night bus ride through West Bengal. It borrows its name from the mixed, unpredictable Bangla music you hear on a Kolkata bus — golden-age film songs next to 90s band anthems next to this year's hits.",
  },
  {
    q: "Is it free, and do I need an account?",
    a: "It is completely free and needs no login, no signup and no app. Open the page and the music starts; the sound switches on with your first tap or click, because browsers block audible autoplay until you interact.",
  },
  {
    q: "What kind of Bengali songs does it play?",
    a: "Bangla adhunik and film songs from the golden age, the Bangla band era of the 90s and 2000s, and modern Bengali hits — Hemanta Mukherjee, Manna Dey and Kishore Kumar through Kabir Suman, Nachiketa, Anjan Dutt and Fossils to Anupam Roy, Arijit Singh and Iman Chakraborty.",
  },
  {
    q: "Where does the music come from?",
    a: "Every track streams from its official upload on YouTube. Nothing is rehosted or downloaded, and the playlists update themselves — a song added on YouTube appears on the site immediately.",
  },
  {
    q: "What are the four routes?",
    a: "Kolkata (Howrah–Esplanade–Gariahat), Digha (down NH116B to the Bay of Bengal), Darjeeling (Hill Cart Road up from Siliguri) and Shantiniketan (Kolkata to Bolpur across Birbhum). Each is its own page with its own scene, and changing route changes the music.",
  },
  {
    q: "Does it work on a phone?",
    a: "Yes. It runs in any modern mobile browser with no install, and playback continues while you scroll. Keyboard shortcuts — space to play, N and P for tracks, H for the horn — are there on desktop.",
  },
];

export const ROUTE_SEO: Record<RouteId, RouteSeo> = {
  kolkata: {
    title: BRAND.seoTitle,
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
    ],
    h1: "Bengali Bus Driver Playlist",
    intro:
      "The Bengali Bus Driver Playlist is a free, no-login site that plays Bengali music nonstop, staged as a night bus ride through Kolkata. It runs the way a bus driver's own playlist runs — golden-age film songs, 90s Bangla band anthems and modern hits in the same breath, shuffled fresh so no two rides are alike.",
    facts: [
      "Free to use, no account, no app, no download.",
      "Nonstop Bengali songs from the 1950s golden age to the 2020s.",
      "The Kolkata route runs Howrah Bridge to Esplanade to Gariahat.",
      "Every track streams from its official upload on YouTube.",
    ],
    imageAlt:
      "A yellow and red Kolkata bus with luggage roped to its roof, stopped on wet tram lines at dusk with the Howrah Bridge and an Ambassador taxi behind it.",
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
    h1: "Digha Road Trip Playlist",
    intro:
      "The Digha route of the Bengali Bus Driver Playlist scores the Kolkata-to-Digha run down NH116B — a nonstop Bengali road trip playlist for the long stretch past the casuarina groves to the Bay of Bengal. Free, no login, and the music changes when you change route.",
    facts: [
      "Made for the Esplanade to Digha bus run on NH116B.",
      "Bengali road trip songs spanning the 90s to the 2020s.",
      "Free, no account, plays straight through on mobile data.",
    ],
    imageAlt:
      "The same yellow and red bus on the coast road at sunset, luggage on the roof and the driver at the wheel, casuarina trees bent by the wind and the surf of the Bay of Bengal behind them.",
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
    h1: "Darjeeling Hill Route Playlist",
    intro:
      "The Darjeeling route of the Bengali Bus Driver Playlist follows Hill Cart Road up from Siliguri, through the tea gardens and into the mist. It leans on nostalgic Bangla band and adhunik songs — the ones that suit a slow climb — and plays nonstop for free.",
    facts: [
      "Follows Hill Cart Road, Siliguri to Darjeeling.",
      "Bangla band era and nostalgic adhunik songs.",
      "Free, no login, nonstop playback.",
    ],
    imageAlt:
      "The bus climbing a hill road cut through terraced tea gardens and pines, a mist-filled valley below and the snow peaks of the Kanchenjunga range lit orange on the horizon.",
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
    h1: "Shantiniketan Route Playlist",
    intro:
      "The Shantiniketan route of the Bengali Bus Driver Playlist rides the Kolkata-to-Bolpur road across Birbhum's red laterite country. It is a free, nonstop Bengali playlist for the trip out to Shantiniketan, mixing folk-inflected adhunik with modern Bangla songs.",
    facts: [
      "Runs Kolkata to Bolpur, across Birbhum.",
      "Bengali folk-leaning adhunik and modern Bangla songs.",
      "Free, no account needed.",
    ],
    imageAlt:
      "The bus on a red laterite road through Birbhum at sunset, trunks and bundles roped to the roof, fan palms and low village huts beyond the fields.",
  },
};
