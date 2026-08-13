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
      "A digital collection of the small, ordinary things a Bengali grows up inside. The driver's music on the bus, the radio at four in the morning on Mahalaya, Sunday's mangsho bhaat and the sleep after it. Rebuilt to sit inside again, from anywhere.",
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
      "Bengali Experience is a digital collection of the small, ordinary things a Bengali grows up inside. The driver's music on the bus to school. The radio at four in the morning that means the pujo has started. Sunday's mangsho bhaat, mutton and rice, and the long sleep after it. None of it is an occasion, and none of it was ever noticed until it was far away. Each one is rebuilt here to sit inside again, from anywhere.",
    facts: [
      "Free to use. No account, no app, no download, on every page.",
      "One experience is open now: the Bengali bus driver playlist.",
      "Three more are being built: Mahalaya listening, Durga Puja pandal hopping, and the Bengali Sunday afternoon.",
      "Everything is in English, so it works whether or not you read Bengali script.",
      "Made by one person in Kolkata, independent of any label, brand or institution.",
    ],
  },
  busdriver: {
    title: "Bengali Bus Driver Playlist: Bangla Bangers from the 90s to the 20s",
    description:
      "Press play on the Bengali bus driver playlist. Nonstop Bangla bangers from the 90s to the 20s, the songs a West Bengal bus driver actually plays, shuffled fresh on every visit. Part of Bengali Experience.",
    keywords: [
      "bengali bus driver playlist",
      "bus driver playlist bengali",
      "bangla gaan playlist",
      "bengali songs 90s",
      "bangla bangers 90s to 20s",
      "bangla hit songs nonstop",
      "kolkata bus songs",
      "west bengal bus music",
      "bengali nonstop songs online",
      "bangla old songs playlist",
    ],
    h1: "Bengali Bus Driver Playlist",
    intro:
      "The Bengali Bus Driver Playlist puts you on a West Bengal bus with the driver's music on: nonstop Bangla bangers from the 90s to the 20s, playing the way they do on a real route. Every bus has a driver with a playlist, running off a phone at the front, loud through worn speakers for the whole journey whether anyone asked for it or not. Open the page and it is already going, shuffled fresh, the way it would be if you had just got on.",
    facts: [
      "Bangla bangers spanning the 90s to the 20s, playing nonstop.",
      "The songs actually heard on Kolkata and West Bengal buses.",
      "Shuffled on every visit, so no two people start on the same song.",
      "Free to use, with no account, no app and no download.",
      "Every track streams from its official upload on YouTube. Nothing is rehosted.",
      "One of the experiences on Bengali Experience, with more playlists being added.",
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
      a: "Bengali Experience is a digital collection of the small, everyday things a Bengali grows up inside, rebuilt one at a time as small websites. Each one is the experience rather than a description of it: you open a page and the thing is already happening. The first is a West Bengal bus with the driver's music playing.",
    },
    {
      q: "Is it free, and do I need an account?",
      a: "Everything is free, with no login, no signup and no app to install. Nothing asks for an email address and nothing is held back behind a payment. Open a page and it starts.",
    },
    {
      q: "What can I do on it right now?",
      a: "One experience is open: the Bengali Bus Driver Playlist, which puts you on a West Bengal bus with the driver's music playing, the Bangla songs that actually come out of the speakers on a Kolkata route. Three more are being built.",
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
      a: "Because Bengali culture online is almost all documentation: articles about the festivals, photo essays about the city, recipe posts about the food. The record survives and the feeling does not. And it was never the festivals that people miss most, it was the ordinary hours around them, which nobody thinks to write down because nobody thinks they are going anywhere. These rebuild the feeling rather than the record, for anyone far from home or never there in the first place.",
    },
    {
      q: "Who makes it?",
      a: "One person, working under the name konko, from Kolkata. It is independent and fan made, with no connection to any record label, artist, brand or cultural institution.",
    },
  ],
  busdriver: [
    {
      q: "What is the Bengali Bus Driver Playlist?",
      a: "It is a website that puts you on a West Bengal bus with the driver's music playing: nonstop Bangla bangers from the 90s to the 20s, shuffled fresh on every visit. It is named after the real thing, the playlist that runs off a phone or a USB stick at the front of the bus for the whole route, whether the passengers asked for it or not.",
    },
    {
      q: "What kind of Bengali songs does it play?",
      a: "Bangla bangers from the 90s through to the 20s. The film and adhunik songs that get played to death on buses, the ones everyone knows the chorus of without ever having chosen to learn it, rather than a considered best-of list.",
    },
    {
      q: "Why is the bus driver playlist a thing?",
      a: "Because for most people in India the bus is where film music is actually heard. The driver picks it, it plays loud through worn speakers for the length of the journey, and a whole generation learned the same few hundred songs that way without ever choosing them. It became an internet genre in the 2020s, first for Hindi film songs and then in every regional language, because the sound is so specific that people recognise it instantly.",
    },
    {
      q: "How does it fit with Bengali Experience?",
      a: "It is the first of them. Bengali Experience is a digital collection of the small, ordinary things a Bengali grows up inside, and the driver's music on a bus is one of those things: nobody chooses it, everybody knows it, and it is the sound of getting somewhere. Mahalaya listening, Durga Puja pandal hopping and the Sunday afternoon are being built alongside it.",
    },
    {
      q: "Is it free, and do I need an account?",
      a: "It is completely free and needs no login, no signup and no app. Open the page and the music starts. The sound switches on with your first tap or click, because browsers block audible autoplay until you interact with the page.",
    },
    {
      q: "Does the same music play every time?",
      a: "No. The playlist is shuffled on every visit and playback starts at a random point in it, so two people opening the site in the same minute begin on different songs, and coming back tomorrow does not replay today.",
    },
    {
      q: "Where does the music come from?",
      a: "Every track streams from its official upload on YouTube. Nothing is rehosted or downloadable, and the playlist updates itself, so a song added on YouTube appears on the site immediately.",
    },
    {
      q: "Will there be more playlists?",
      a: "Yes. There is one right now and more are being added. The site is built to hold several and pick between them, so new lists appear in the ride without anything else changing.",
    },
    {
      q: "Does it work on a phone?",
      a: "Yes. It runs in any modern mobile browser with no install, and playback continues while you scroll. On desktop there are keyboard shortcuts: space to play, N and P for tracks, and H for the horn.",
    },
  ],
};

/** Live experiences, for the internal link graph and the ItemList. */
export const LIVE_PATHS = EXPERIENCES.filter((e) => e.path).map((e) => e.path as string);
