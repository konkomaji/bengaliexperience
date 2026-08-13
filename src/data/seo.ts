import { BRAND } from "./brand";
import { EXPERIENCES } from "./experiences";

/**
 * One source of truth for URLs and per-page copy. Imported by the React app,
 * by functions/_middleware.ts (the edge HTML rewriter), by the sitemap and by
 * llms.txt, so a path or an answer is only ever written down once.
 *
 * Two pages, on purpose:
 *
 *   /            the project. What Bengali Experience is, and what is on the
 *                shelf. Brand and culture intent.
 *   /busdriver   the bus. Carries the "bengali bus driver playlist" search
 *                intent, which is the highest-volume thing here and deserves
 *                a page that is only about it.
 *
 * The copy below is shaped for answer engines as much as for search results:
 * each `intro` is a self-contained direct answer that survives being quoted
 * with no page around it, each `facts` line is a single checkable claim, and
 * every FAQ answer is written to be lifted whole rather than summarised.
 */

export type PageId = "home" | "busdriver";

export const PAGE_PATH: Record<PageId, string> = {
  home: "/",
  busdriver: "/busdriver",
};

/** every servable path -> page */
export const PATH_TO_PAGE: Record<string, PageId> = {
  "/": "home",
  "/busdriver": "busdriver",
};

/**
 * Paths from the four-route version of the site, all of which were the bus.
 * They were live and in a submitted sitemap, so they get permanent redirects
 * rather than 404s: a crawler that already knows them should be told where
 * the page went, not that it is gone.
 */
export const MOVED_PATHS: Record<string, string> = {
  "/kolkata": "/busdriver",
  "/digha": "/busdriver",
  "/darjeeling": "/busdriver",
  "/shantiniketan": "/busdriver",
};

export interface PageSeo {
  title: string;
  description: string;
  keywords: string[];
  /** the page's real heading, and the only h1 a JS-less crawler sees */
  h1: string;
  /**
   * The direct answer. Two or three sentences that say what this is, written
   * to stand completely alone, because an AI summary shows this with no page
   * around it. It is the first thing in the crawlable body for the same
   * reason: the answer goes above everything, not after a mood-setting
   * paragraph.
   */
  intro: string;
  /** short factual lines, one claim each, the shape LLMs lift most readily */
  facts: string[];
}

export interface QA {
  q: string;
  a: string;
}

export const PAGE_SEO: Record<PageId, PageSeo> = {
  home: {
    title: BRAND.seoTitle,
    description:
      "Bengali Experience is a free collection of small websites that let you live one Bengali thing at a time. A night bus through Kolkata with the driver's playlist on is the first. Mahalaya, pandal hopping and the Sunday afternoon are coming. No login, no app.",
    keywords: [
      "bengali experience",
      "bengali culture website",
      "bangla culture online",
      "bengali nostalgia",
      "kolkata nostalgia",
      "bengali culture for the diaspora",
      "durga puja online experience",
      "mahalaya online",
      "bangla adda",
      "bengali interactive website",
    ],
    h1: "Bengali Experience",
    intro:
      "Bengali Experience is a free collection of small websites, each one putting you inside a single Bengali thing for as long as you want to stay. Not an article about the culture and not a photo gallery of it, but the thing itself, running in a browser tab. The first is a night bus through Kolkata with the driver's own playlist on.",
    facts: [
      "Free to use. No account, no app, no download, on every page.",
      "One experience is live now: the Bengali bus driver playlist.",
      "Three more are planned: Mahalaya listening, Durga Puja pandal hopping, and the Bengali Sunday afternoon.",
      "Everything is in English, so it works whether or not you read Bengali script.",
      "Made by one person in Kolkata, independent of any label, brand or institution.",
    ],
  },
  busdriver: {
    title: "Bengali Bus Driver Playlist: Bangla Bangers from the 90s to the 20s",
    description:
      "Press play on the Bengali bus driver playlist. Nonstop Bangla songs from the 90s to the 20s, Kumar Sanu and Nachiketa through to Anupam Roy and Arijit, on a night bus across Kolkata. Free, no login.",
    keywords: [
      "bengali bus driver playlist",
      "bangla gaan playlist",
      "bengali songs 90s",
      "bangla hit songs nonstop",
      "kumar sanu bengali songs",
      "anupam roy songs",
      "arijit singh bengali songs",
      "kolkata bus playlist",
      "bangla band songs",
      "nonstop bengali music free",
    ],
    h1: "Bengali Bus Driver Playlist",
    intro:
      "The Bengali Bus Driver Playlist is a free, no-login site that plays Bengali music nonstop while you ride a night bus across Kolkata. It runs the way a bus driver's own playlist runs, golden age film songs next to 90s band anthems next to this year's hits, shuffled fresh on every visit so no two rides are alike.",
    facts: [
      "Free to use, with no account, no app and no download.",
      "Nonstop Bengali songs spanning the 1950s golden age to the 2020s.",
      "Nine curated YouTube playlists, picked between on every visit.",
      "The route runs Howrah Bridge to Esplanade to Gariahat, at night.",
      "Every track streams from its official upload on YouTube. Nothing is rehosted.",
    ],
  },
};

/**
 * Answer-engine questions, per page.
 *
 * The searches behind this site are of two kinds. Keyword ones ("bengali bus
 * driver playlist", "bangla gaan nonstop") are served by the title and
 * description. Question-shaped ones, which is what people actually type into
 * ChatGPT, Perplexity and Google's AI box, need an answer sitting in the HTML,
 * short enough to be quoted whole and specific enough to be worth quoting.
 *
 * Each answer is emitted three ways: as crawlable text, as FAQPage structured
 * data, and as llms.txt prose. One source, so they cannot drift apart.
 */
export const PAGE_FAQ: Record<PageId, QA[]> = {
  home: [
    {
      q: "What is Bengali Experience?",
      a: "Bengali Experience is a free collection of small websites, each built around one Bengali thing you would otherwise have to be in Bengal to have. Each one is an experience rather than a description of it: you open a page and the thing is already happening. The first is a night bus through Kolkata with the driver's playlist playing.",
    },
    {
      q: "Is it free, and do I need an account?",
      a: "Everything is free, with no login, no signup and no app to install. Nothing asks for an email address and nothing is held back behind a payment. Open a page and it starts.",
    },
    {
      q: "What can I do on it right now?",
      a: "One experience is live: the Bengali Bus Driver Playlist, which puts you on a night bus across Kolkata with nonstop Bangla music from the 1950s to the 2020s. Three more are being built.",
    },
    {
      q: "What is coming next?",
      a: "Three more experiences are planned. Mahalaya Listening, which sits with the Mahishasuramardini broadcast at dawn the way Bengal has since the 1930s. Pandal Hopping, a night walk through Durga Puja pandals across Kolkata. Sunday Afternoon, which is mangshor jhol, a ceiling fan, and the long nap that follows.",
    },
    {
      q: "Do I need to read Bengali to use it?",
      a: "No. Every page is written in English. Bengali appears where it belongs, in the music and in song titles, and never as something you have to read to find your way around.",
    },
    {
      q: "Why does this exist?",
      a: "Because most of Bengali culture online is documentation: articles about the festivals, photo essays about the city, recipe posts about the food. Very little of it lets you actually sit inside any of it for an hour. These are attempts to rebuild the feeling of a thing rather than the record of it, for anyone who is far from home or was never there to begin with.",
    },
    {
      q: "Who makes it?",
      a: "One person, working under the name konko, from Kolkata. It is independent and fan made, with no connection to any record label, artist, brand or cultural institution.",
    },
  ],
  busdriver: [
    {
      q: "What is the Bengali Bus Driver Playlist?",
      a: "It is a free website that plays curated Bengali music nonstop, staged as a night bus ride across Kolkata. It borrows its name from the mixed, unpredictable Bangla music you hear on a Kolkata bus, where golden age film songs sit next to 90s band anthems next to this year's hits.",
    },
    {
      q: "Is it free, and do I need an account?",
      a: "It is completely free and needs no login, no signup and no app. Open the page and the music starts. The sound switches on with your first tap or click, because browsers block audible autoplay until you interact with the page.",
    },
    {
      q: "What kind of Bengali songs does it play?",
      a: "Bangla adhunik and film songs from the golden age, the Bangla band era of the 90s and 2000s, and modern Bengali hits. That covers Hemanta Mukherjee, Manna Dey and Kishore Kumar, through Kabir Suman, Nachiketa, Anjan Dutt and Fossils, to Anupam Roy, Arijit Singh and Iman Chakraborty.",
    },
    {
      q: "Where does the music come from?",
      a: "Every track streams from its official upload on YouTube. Nothing is rehosted or downloadable, and the playlists update themselves, so a song added on YouTube appears on the site immediately.",
    },
    {
      q: "Does the same music play every time?",
      a: "No. Nine curated playlists sit behind the bus and one is chosen on each visit, weighted by the hour in Kolkata and biased away from the last few you were given. Two people opening the site in the same minute get different rides.",
    },
    {
      q: "Does it work on a phone?",
      a: "Yes. It runs in any modern mobile browser with no install, and playback continues while you scroll. On desktop there are keyboard shortcuts: space to play, N and P for tracks, and H for the horn.",
    },
  ],
};

/** Live experiences, for the internal link graph and the ItemList. */
export const LIVE_PATHS = EXPERIENCES.filter((e) => e.path).map((e) => e.path as string);
