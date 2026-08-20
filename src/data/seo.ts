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

/**
 * The four `tarakeswar*` ids are a separate local guide to Tarakeswar, a
 * temple town in Hooghly district. It is not one of the Bengali Experience
 * "experiences" in src/data/experiences.ts, is not linked from the home
 * page or the header, and is not named in the README, on purpose: it earns
 * its visitors from search rather than from the site's own nav. It still
 * gets a proper sitemap row, JSON-LD and an llms.txt section, because
 * "unlinked internally" and "findable by search" are different things, and
 * only the first one is the point. See src/data/tarakeswar/.
 */
/**
 * Blog posts (src/data/tarakeswar/blog.ts) are a fifth Tarakeswar area but
 * are not PageIds: there are ten of them today and more later, each at its
 * own slug, which does not fit a fixed Record<PageId, ...> the way every
 * other page here does. Only their index gets a PageId, `tarakeswarBlog`;
 * functions/_middleware.ts, sitemap.xml.ts and src/lib/jsonld.ts each look
 * up individual posts by slug separately, alongside this map rather than
 * through it.
 */
export type PageId =
  | "home"
  | "busdriver"
  | "mahalaya"
  | "tarakeswar"
  | "tarakeswarTemple"
  | "tarakeswarFood"
  | "tarakeswarReach"
  | "tarakeswarBlog";

export const PAGE_PATH: Record<PageId, string> = {
  home: "/",
  busdriver: "/busdriver",
  mahalaya: "/mahalaya",
  tarakeswar: "/tarakeswar",
  tarakeswarTemple: "/tarakeswar/temple-and-mela",
  tarakeswarFood: "/tarakeswar/eat-and-stay",
  tarakeswarReach: "/tarakeswar/how-to-reach",
  tarakeswarBlog: "/tarakeswar/blog",
};

/** every servable path -> page */
export const PATH_TO_PAGE: Record<string, PageId> = {
  "/": "home",
  "/busdriver": "busdriver",
  "/mahalaya": "mahalaya",
  "/tarakeswar": "tarakeswar",
  "/tarakeswar/temple-and-mela": "tarakeswarTemple",
  "/tarakeswar/eat-and-stay": "tarakeswarFood",
  "/tarakeswar/how-to-reach": "tarakeswarReach",
  "/tarakeswar/blog": "tarakeswarBlog",
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
  /** optional per-page tab icon (SVG or PNG, inferred from the extension),
   *  swapped in on this page only */
  favicon?: string;
  /**
   * Optional per-page browser-chrome colour (the `theme-color` meta tag).
   * Every page so far has shared the site's dark chrome; the Tarakeswar
   * pages are a light section and set their own, restored to the default
   * dark on any other page. See useDocumentHead.
   */
  themeColor?: string;
  /**
   * Optional per-page social card, overriding BRAND.ogImage. Every page so
   * far has shared the one site-wide illustration; the Tarakeswar section
   * has no photography of its own (Google Maps embeds instead, see the
   * CHANGELOG), so it carries one generated typographic card instead,
   * shared by its four pages and every blog post. See
   * scripts/prepare-tarakeswar-og.mjs.
   */
  ogImage?: { url: string; alt: string };
}

export interface QA {
  q: string;
  a: string;
}

const PAGE_SEO_CORE: Record<"home" | "busdriver" | "mahalaya", PageSeo> = {
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
      "Two experiences are open now: the Bengali bus driver playlist, and Mahalaya listening.",
      "Two more are being built: Durga Puja pandal hopping, and the Bengali Sunday afternoon.",
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
  mahalaya: {
    title: "Mahalaya | Bengali Experience",
    description:
      "Listen to Mahishasuramardini, the original Mahalaya dawn broadcast, the way Bengal has since the 1930s: Birendra Krishna Bhadra reciting the Chandi in the dark while the sky slowly lightens to first light, on the new-moon morning that begins Durga Puja. Free, no login, with a live countdown to the pujo. Part of Bengali Experience.",
    keywords: [
      "mahalaya",
      "mahalaya 2026",
      "shubho mahalaya",
      "mahishasuramardini",
      "mahishasuramardini full audio",
      "mahishasuramardini original recording",
      "birendra krishna bhadra",
      "birendra krishna bhadra mahishasuramardini",
      "mahalaya birendra krishna bhadra original",
      "mahalaya listen online",
      "mahalaya radio online",
      "listen mahishasuramardini online",
      "chandipath mahalaya",
      "chandi path birendra krishna bhadra",
      "mahalaya song",
      "mahalaya amavasya",
      "mahalaya devi paksha",
      "akashvani mahalaya",
      "all india radio mahalaya",
      "durga puja 2026",
      "durga puja 2026 date",
      "when is durga puja 2026",
      "durga puja countdown",
      "maa aschen",
    ],
    favicon: "/mahalaya-radio.svg",
    h1: "Mahalaya Listening",
    intro:
      "Mahalaya Listening sits you with Mahishasuramardini, the ninety-minute Akashvani broadcast that has opened Mahalaya since the 1930s: Birendra Krishna Bhadra reading the Chandi in the dark before dawn, between Bengali devotional songs and orchestral pieces. It is the sound that tells Bengal the pujo has begun, heard at four in the morning with the lights off. Press play and the sky over the scene slowly lightens from night to first dawn across the length of the broadcast, the way the real morning does.",
    facts: [
      "Mahishasuramardini, the Mahalaya dawn broadcast, played from the start rather than shuffled.",
      "Birendra Krishna Bhadra reading the Chandi, with songs and orchestral pieces between.",
      "First aired on Akashvani, All India Radio, in the 1930s, and heard every Mahalaya since.",
      "Mahalaya marks Devi Paksha, the fortnight that ends in Durga Puja, roughly a week before the pujo.",
      "The scene's sky lightens from night to dawn across the full length of the broadcast.",
      "Mahalaya 2026 falls on Saturday, 10 October, and Durga Puja begins with Maha Shashthi on Friday, 16 October 2026.",
      "A live countdown on the page ticks down the days, hours, minutes and seconds to Durga Puja 2026.",
      "Free to use, with no account, no app and no download.",
      "The audio streams from its upload on YouTube. Nothing is rehosted.",
    ],
  },
};

/** One card for the whole Tarakeswar section, the same "one illustration,
 *  one subject" reasoning BRAND.ogImage uses site-wide. See
 *  scripts/prepare-tarakeswar-og.mjs. */
const TARAKESWAR_OG = {
  url: "/tarakeswar/og.jpg",
  alt: "An illustrated riverside view of Tarakeswar: Dudhpukur pond and the temple's domes among the town's rooftops, under a painted sky, titled Tarakeswar: Travel & Pilgrimage Guide.",
};

const PAGE_SEO_TARAKESWAR: Record<
  "tarakeswar" | "tarakeswarTemple" | "tarakeswarFood" | "tarakeswarReach" | "tarakeswarBlog",
  PageSeo
> = {
  tarakeswar: {
    title: "Tarakeswar Travel Guide: Temple, Timings and How to Reach",
    description:
      "A complete Tarakeswar guide: Taraknath temple history and timings, the Shravani Mela and Bol Bom pilgrimage, how to reach from Kolkata and Howrah, and where to eat and stay. Independent and fact checked.",
    keywords: [
      "tarakeswar",
      "tarakeswar temple",
      "tarkeswar",
      "tarakeshwar",
      "tarkeshwar",
      "tarakeswar travel guide",
      "tarakeswar tourist places",
      "things to do in tarakeswar",
      "tarakeswar temple timings",
      "how to reach tarakeswar",
      "tarakeswar to kamarpukur distance",
      "baba taraknath temple",
      "tarakeswar shivratri mela",
      "tarakeswar shravani mela",
      "bol bom tarakeswar",
      "tarakeswar west bengal",
      "tarakeswar hooghly",
    ],
    h1: "Tarakeswar: A Complete Travel and Pilgrimage Guide",
    intro:
      "Tarakeswar is a temple town in Hooghly district, West Bengal, built around the Taraknath Mandir, one of Bengal's most visited Shiva temples. This guide covers the temple and its timings, the Gajan, Shivratri and Shravani Mela festival calendar, how to reach Tarakeswar from Kolkata and Howrah, and where to eat, stay and find essentials in town.",
    facts: [
      "Tarakeswar sits in Hooghly district, West Bengal, roughly 58 km from Kolkata and Howrah.",
      "The Taraknath Mandir is dedicated to Baba Taraknath, a fierce form of Lord Shiva, in a shivalinga believed to be swayambhu, or self manifested.",
      "The temple is usually dated to around 1729, though old accounts differ on who built it: some name Raja Bharamalla Rao, others describe a devotee called Vishnu Das.",
      "The Shravani Mela, held through the Bengali month of Shravan (roughly mid July to mid August), is described by the state government as the longest and largest mela in West Bengal.",
      "Direct EMU trains run from Howrah to Tarakeswar station through the day, a ride of about 1.5 hours.",
      "This guide is independent, made for travellers and pilgrims, and is not affiliated with the temple trust or any government tourism body.",
    ],
    themeColor: "#e8720c",
    ogImage: TARAKESWAR_OG,
    favicon: "/tarakeswar/favicon.png",
  },
  tarakeswarTemple: {
    title: "Taraknath Mandir Tarakeswar: History, Timings and Mela Calendar",
    description:
      "The Taraknath Mandir at Tarakeswar: its history and two competing founding legends, atchala architecture, darshan timings, Dudhpukur pond, and the Gajan, Shivratri and Shravani Mela (Bol Bom) festival calendar.",
    keywords: [
      "tarakeswar temple history",
      "taraknath temple",
      "taraknath mandir",
      "tarakeswar temple timings",
      "tarakeswar darshan timings",
      "dudhpukur tarakeswar",
      "tarakeswar shivratri mela",
      "tarakeswar gajan",
      "shravani mela tarakeswar",
      "bol bom tarakeswar",
      "tarakeswar shrabani mela",
      "tarakeswar entry fee",
      "is photography allowed in tarakeswar temple",
      "who built tarakeswar temple",
    ],
    h1: "Taraknath Mandir: Temple, Timings and the Mela Calendar",
    intro:
      "The Taraknath Mandir at Tarakeswar is dedicated to Baba Taraknath, worshipped as a fierce form of Lord Shiva, in a self manifested shivalinga at the centre of an atchala style temple. It is one of the most visited Shiva temples in Bengal, busiest during the Shravani Mela in the month of Shravan, when lakhs of Bol Bom pilgrims walk in on foot carrying Ganga water.",
    facts: [
      "Old accounts of who built the temple do not agree. One names Raja Bharamalla Rao; another describes a devotee, Vishnu Das, who is said to have found the shivalinga after a cow was seen pouring milk over a buried stone. Most accounts date the temple to around 1729.",
      "The temple is built in Bengal's atchala style, a tiered, sloping roof, with a natmandir (prayer hall) in front and smaller shrines to Kali and Lakshmi-Narayan within the same complex.",
      "Dudhpukur, the pond north of the temple, is where pilgrims are traditionally believed to bathe or pray before darshan.",
      "Darshan is commonly reported as roughly 5 to 5:30 in the morning until 1 to 1:30 in the afternoon, reopening from around 4 until 7 to 8:30 in the evening, with longer hours on Shivratri, Gajan and the Mondays of Shravan. No official temple source publishes fixed timings, so treat this as a guide and check locally if your visit depends on exact hours.",
      "Entry is commonly reported as free, though this is not officially confirmed by any temple source either.",
      "Two festivals get mixed up online: Maha Shivratri, in the Bengali month of Phalgun (February to March), is a single busy night. The Shravani Mela, through all of Shravan (mid July to mid August), is the much larger month-long pilgrimage. They are not the same event.",
      "Gajan runs for up to five days, ending on Chaitra Sankranti in mid April, when devotees take temporary ascetic vows and perform Charak Puja.",
    ],
    themeColor: "#e8720c",
    ogImage: TARAKESWAR_OG,
    favicon: "/tarakeswar/favicon.png",
  },
  tarakeswarFood: {
    title: "Where to Eat and Stay in Tarakeswar: Restaurants, Hotels, Essentials",
    description:
      "A working directory for Tarakeswar: real restaurants and cafes, sweet shops, a state tourism lodge, dharamshalas and hotels for pilgrims, plus pharmacies, clinics, ATMs and banks in town.",
    keywords: [
      "best place to eat in tarakeswar",
      "tarakeswar restaurants",
      "tarakeswar hotels",
      "where to stay in tarakeswar",
      "tarakeswar dharamshala",
      "tarakeswar lodge",
      "tarakeswar tourist lodge",
      "tarakeswar pharmacy",
      "tarakeswar hospital",
      "tarakeswar atm",
      "tarakeswar sweet shop",
      "tarakeswar restaurant amantran",
    ],
    h1: "Where to Eat and Stay in Tarakeswar",
    intro:
      "This is a working directory for Tarakeswar, built from real, checkable listings rather than a paid or generated list. It covers restaurants and cafes, places to stay from a state tourism lodge to a pilgrim dharamshala, and essentials like pharmacies, clinics, ATMs and banks in town, each with a rough location so you can actually find it.",
    facts: [
      "Amantran (A2), opposite the bus stand gate, is the most reviewed sit-down restaurant in Tarakeswar.",
      "Accommodation ranges from Nataraj Tourism Property, the former West Bengal Tourism lodge, to the Tarakeswar Municipality Guest House and Sri Chaitanya Saraswat Math, a pilgrim ashram.",
      "Two Apollo Pharmacy branches operate in town, at Chaulpatty and on Post Office Road.",
      "Tarakeswar Rural Hospital is the government hospital; Care & Cure Nursing Home, on Station Road, is open 24 hours.",
      "Six bank branches with ATMs, including State Bank of India, HDFC Bank and Bandhan Bank, operate in and around the town centre.",
      "Tea stalls and most sweet shops in Tarakeswar trade informally with no online listing to point to; this page says so honestly rather than inventing names.",
    ],
    themeColor: "#1868b0",
    ogImage: TARAKESWAR_OG,
    favicon: "/tarakeswar/favicon.png",
  },
  tarakeswarReach: {
    title: "How to Reach Tarakeswar from Kolkata and Howrah: Train, Road, Bus",
    description:
      "The clearest guide to reaching Tarakeswar: direct EMU trains from Howrah station, road distance and driving time from Kolkata, state and private buses, and getting around town once you arrive.",
    keywords: [
      "how to reach tarakeswar",
      "tarakeswar train",
      "howrah to tarakeswar train",
      "tarakeswar train timetable",
      "tarakeswar distance from kolkata",
      "tarakeswar by road",
      "bus to tarakeswar",
      "tarakeswar railway station",
      "kolkata to tarakeswar distance",
    ],
    h1: "How to Reach Tarakeswar",
    intro:
      "Tarakeswar is easiest to reach by train: direct EMU locals run from Howrah station to Tarakeswar all day, a ride of about an hour and a half. This page also covers the road route from Kolkata, bus options, and getting around once you are there. Distance figures for Tarakeswar vary a fair bit between map tools; that is said plainly below rather than picking one number and hoping it holds.",
    facts: [
      "Tarakeswar Railway Station is the terminus of the Howrah-Tarakeswar branch line, opened in 1885, roughly 58 km from Howrah.",
      "The train ride takes about 1.5 hours, with somewhere around 35 to 38 direct EMU locals running each day, so there is rarely a long wait.",
      "By road, most map tools show somewhere between 55 and 65 km from central Kolkata, mainly along State Highway 2 or State Highway 15, a drive of roughly 1 to 2 hours depending on traffic.",
      "State-run SBSTC buses and private buses run from Esplanade and Babughat, as well as from Arambagh and Serampore, taking about 2.5 to 3.5 hours.",
      "Inside Tarakeswar, toto (e-rickshaw) is the usual way to cover the roughly 1 km from the railway station to the temple, about a 10-minute ride.",
      "Flying in, Netaji Subhas Chandra Bose International Airport in Kolkata is the nearest airport. The official Tarakeswar Shrabani Mela government site gives the distance as about 70 km, roughly 2 hours by prepaid taxi, though the same site separately gives 65 km by road, so treat this as an approximate range rather than an exact figure.",
    ],
    themeColor: "#1868b0",
    ogImage: TARAKESWAR_OG,
    favicon: "/tarakeswar/favicon.png",
  },
  tarakeswarBlog: {
    title: "Tarakeswar Blog: Guides on the Temple, Mela, Travel and Food",
    description:
      "Ten in-depth guides on Tarakeswar: temple history, timings, the Shravani Mela and Bol Bom, how to get there, where to eat and stay, and the best day trips nearby.",
    keywords: [
      "tarakeswar blog",
      "tarakeswar guide",
      "tarakeswar travel blog",
      "tarakeswar tips",
      "tarakeswar articles",
    ],
    h1: "The Tarakeswar Blog",
    intro:
      "Ten guides on Tarakeswar, each answering one specific question rather than repeating the same overview: the temple's real history, its timings, the Shravani Mela, how to actually get there, where to eat and stay, and the best day trips nearby.",
    facts: [
      "Ten posts, covering temple history, timings, travel, the mela calendar, food, stay and day trips.",
      "Every fact traces back to a real, checkable source, noted honestly where sources disagree.",
      "Written in plain English for a first-time visitor, not for someone who already knows the town.",
    ],
    themeColor: "#e8720c",
    ogImage: TARAKESWAR_OG,
    favicon: "/tarakeswar/favicon.png",
  },
};

export const PAGE_SEO: Record<PageId, PageSeo> = { ...PAGE_SEO_CORE, ...PAGE_SEO_TARAKESWAR };

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
const PAGE_FAQ_CORE: Record<"home" | "busdriver" | "mahalaya", QA[]> = {
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
      a: "Two experiences are open. The Bengali Bus Driver Playlist puts you on a West Bengal bus with the driver's music playing, the Bangla songs that actually come out of the speakers on a Kolkata route. Mahalaya Listening sits you with the Mahishasuramardini dawn broadcast, Birendra Krishna Bhadra reading the Chandi while the sky slowly lightens. Two more are being built.",
    },
    {
      q: "What is coming next?",
      a: "Two more experiences are planned. Pandal Hopping, a night walk through Durga Puja pandals across Kolkata. Sunday Afternoon, which is mangshor jhol, a ceiling fan, and the long nap that follows. Mahalaya Listening, the dawn broadcast, has just opened alongside the bus.",
    },
    {
      q: "Do I need to read Bengali to use it?",
      a: "No. Every page is written in English. Bengali appears where it belongs, in the music and in song titles, and never as something you have to read to find your way around.",
    },
    {
      q: "Why does this exist?",
      a: "Because Bengali culture online is almost all documentation: articles about the festivals, photo essays about the city, recipe posts about the food. The record survives and the feeling does not. And it was never the festivals that people miss most, it was the ordinary hours around them, which nobody thinks to write down because nobody thinks they are going anywhere. These rebuild the feeling rather than the record, for anyone far from home or never there in the first place.",
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
      a: "It is the first of them. Bengali Experience is a digital collection of the small, ordinary things a Bengali grows up inside, and the driver's music on a bus is one of those things: nobody chooses it, everybody knows it, and it is the sound of getting somewhere. Mahalaya listening, the Mahishasuramardini dawn broadcast, is open alongside it, with Durga Puja pandal hopping and the Sunday afternoon still being built.",
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
  mahalaya: [
    {
      q: "What is Mahalaya Listening?",
      a: "It is a website that sits you with Mahishasuramardini, the Mahalaya dawn broadcast, the way Bengal has since the 1930s. You press play and the ninety-minute programme runs from the start while the sky over the scene slowly lightens from night to first dawn, the way the real morning does. It is one of the experiences on Bengali Experience.",
    },
    {
      q: "What is Mahishasuramardini?",
      a: "Mahishasuramardini is the Akashvani, All India Radio, programme broadcast before dawn on Mahalaya: Birendra Krishna Bhadra reciting the Chandi, the Sanskrit invocation of the goddess Durga, woven through Bengali devotional songs and orchestral pieces. It has opened Mahalaya since the 1930s and is the sound that tells Bengal the pujo has begun.",
    },
    {
      q: "What is Mahalaya?",
      a: "Mahalaya is the day that marks the start of Devi Paksha, the fortnight that ends in Durga Puja, roughly a week before the pujo. By tradition Bengalis wake before dawn to hear the Mahishasuramardini broadcast, and it is the moment the countdown to Durga Puja really begins.",
    },
    {
      q: "Who was Birendra Krishna Bhadra?",
      a: "Birendra Krishna Bhadra was the radio broadcaster whose voice reading the Chandi became inseparable from Mahalaya. The recording most people know and listen for is his, and hearing anyone else read it is, for most Bengalis, not quite Mahalaya.",
    },
    {
      q: "Is it free, and do I need an account?",
      a: "It is completely free and needs no login, no signup and no app. Open the page, press play, and it starts. The sound switches on with your first tap or click, because browsers block audible autoplay until you interact with the page.",
    },
    {
      q: "Where can I listen to the original Mahishasuramardini recording?",
      a: "You can listen to it right here, free and from the start: this page plays the original Mahishasuramardini broadcast, Birendra Krishna Bhadra reciting the Chandi, streamed from its upload on YouTube. Press the radio and it begins. Nothing is rehosted or downloadable.",
    },
    {
      q: "How long is the Mahishasuramardini broadcast?",
      a: "The broadcast runs about an hour and a half, roughly 1 hour and 26 minutes. On this page the sky in the window lightens from night to sunrise across its full length, so the morning arrives as the reading closes.",
    },
    {
      q: "Where does the audio come from?",
      a: "The broadcast streams from its upload on YouTube. Nothing is rehosted or downloadable. It plays from the beginning rather than shuffled, because it is a ritual you sit through from the start, not a playlist.",
    },
    {
      q: "When is Durga Puja 2026?",
      a: "Durga Puja 2026 runs in mid-October: Maha Shashthi on Friday 16 October, Maha Saptami on Saturday 17 October, Maha Ashtami on Sunday 18 October, Maha Navami on Monday 19 October, and Vijaya Dashami on Wednesday 21 October 2026 (some regional calendars place Dashami on Tuesday 20 October). The page shows a live countdown to it.",
    },
    {
      q: "When is Mahalaya 2026?",
      a: "Mahalaya 2026 falls on Saturday, 10 October 2026, about a week before Durga Puja begins with Maha Shashthi on 16 October. It marks the start of Devi Paksha, and by tradition Bengalis wake before dawn to hear the Mahishasuramardini broadcast that morning.",
    },
    {
      q: "What does Maa Aschen mean?",
      a: "Maa Aschen (মা আসছেন) means 'the Mother is coming' in Bengali, said of the goddess Durga in the days before the pujo as she is believed to be returning to her parental home. It is the feeling Mahalaya begins: the countdown to her arrival.",
    },
    {
      q: "How does it fit with Bengali Experience?",
      a: "Bengali Experience is a digital collection of the small, ordinary things a Bengali grows up inside. The bus driver's music is one; the Mahalaya broadcast at dawn is another. Both are the thing itself rather than an article about it, rebuilt to sit inside again from anywhere.",
    },
  ],
};

const PAGE_FAQ_TARAKESWAR: Record<
  "tarakeswar" | "tarakeswarTemple" | "tarakeswarFood" | "tarakeswarReach" | "tarakeswarBlog",
  QA[]
> = {
  tarakeswar: [
    {
      q: "What is Tarakeswar famous for?",
      a: "Tarakeswar is famous for the Taraknath Mandir, a Shiva temple in Hooghly district, West Bengal, and for the Shravani Mela, when lakhs of Bol Bom pilgrims walk in through the month of Shravan carrying Ganga water for the shivalinga.",
    },
    {
      q: "How do I reach Tarakeswar from Kolkata or Howrah?",
      a: "The easiest way is a direct EMU train from Howrah station to Tarakeswar, about 1.5 hours. By road it is roughly 55 to 65 km depending on the route, a drive of 1 to 2 hours. See the how to reach page for trains, buses and road detail.",
    },
    {
      q: "What are Tarakeswar temple's darshan timings?",
      a: "Darshan is commonly reported as roughly 5 to 5:30 in the morning until 1 to 1:30 in the afternoon, then again from about 4 until 7 to 8:30 in the evening, with longer hours during Shivratri, Gajan and the Mondays of Shravan. No official source publishes fixed timings, so this is a guide, not a promise.",
    },
    {
      q: "Is the Tarakeswar Shivratri mela the same as the Shravani Mela?",
      a: "No, and the two get mixed up online. Shivratri is one busy night in the Bengali month of Phalgun (February to March). The Shravani Mela runs through the whole month of Shravan (roughly mid July to mid August) and is by far the bigger event, described by the state government as the longest and largest mela in West Bengal.",
    },
    {
      q: "Can I visit Tarakeswar and Kamarpukur in one day?",
      a: "Yes, most people do. Kamarpukur, the birthplace of Sri Ramakrishna, is commonly given as around 40 km from Tarakeswar, sources vary a little, and is usually reached by road in under an hour and a half, easily combined with a temple visit on the same day.",
    },
    {
      q: "Is there an entry fee at Tarakeswar temple?",
      a: "Entry is commonly reported as free, though no official temple source confirms this directly.",
    },
    {
      q: "Is Tarakeswar safe for solo travellers?",
      a: "There is no Tarakeswar-specific source, positive or negative, addressing this directly, so it would be dishonest to claim either way with any authority. The ordinary common sense that applies to any busy Indian pilgrimage town, sticking to well-lit, populated areas, keeping valuables close in a crowd, applies here too.",
    },
  ],
  tarakeswarTemple: [
    {
      q: "Who built Tarakeswar temple and when?",
      a: "Accounts do not fully agree. Most date the temple to around 1729. One account names Raja Bharamalla Rao as the builder; another describes a devotee, Vishnu Das, who is said to have found the shivalinga after a cow was seen pouring milk over a buried stone in the forest, followed by a dream telling him to build a temple over it. Both versions are told locally, and neither is independently confirmed by a primary source.",
    },
    {
      q: "What is Dudhpukur?",
      a: "Dudhpukur, meaning milk pond, is the pond just north of the Taraknath Mandir. Pilgrims traditionally bathe in it or pray beside it before darshan.",
    },
    {
      q: "Is photography allowed inside Tarakeswar temple?",
      a: "Photography and video are commonly reported as not allowed inside the inner sanctum, the garbhagriha, though allowed elsewhere on the temple grounds. This is what visitors and travel guides report, not an official temple rule, so it is worth checking with temple staff on the day.",
    },
    {
      q: "What is the Shravani Mela at Tarakeswar?",
      a: "The Shravani Mela runs through the Bengali month of Shravan, roughly mid July to mid August. Pilgrims known as Bol Bom or Kanwariyas carry Ganga water on foot, commonly from Baidyabati on the Hooghly river, a walk of around 38 to 40 km, to pour over the Tarakeswar shivalinga. The state government calls it the longest and largest mela in West Bengal; Hooghly district administration figures put attendance at roughly 24 to 30 lakh devotees across the full month, with single-day peaks around 1.6 lakh.",
    },
    {
      q: "What is Gajan at Tarakeswar?",
      a: "Gajan is a Shaiva folk festival running up to five days, ending on Chaitra Sankranti in mid April. Devotees take temporary ascetic vows, known as Gajan Sannyasis, and perform penances that end in Charak Puja.",
    },
    {
      q: "Do I need to dress a certain way to enter the temple?",
      a: "Travel guides commonly report that men are expected to remove their shirts before entering the inner sanctum, a common rule at Shiva temples in Bengal. There is no strict dress code reported for women, though modest traditional wear such as a saree or salwar kameez is the norm, and leather items are commonly avoided in the inner precinct, which pilgrims enter barefoot. This is not an official temple policy published anywhere, so being ready to follow instructions from temple staff is the safer approach.",
    },
    {
      q: "Where can I park at Tarakeswar temple?",
      a: "Paid car parking is commonly reported at the Rajbari ground and the Kalibari ground, both near the temple. Parking gets noticeably tighter on Mondays and during the Shravani Mela and Shivratri, so arriving early or on foot from your accommodation is worth planning for on those days.",
    },
    {
      q: "Is there VIP or special darshan at Tarakeswar temple?",
      a: "No VIP or special darshan scheme is documented anywhere for Tarakeswar, unlike some larger temples elsewhere in India. Everyone is expected to go through the same queue.",
    },
    {
      q: "Is Tarakeswar temple wheelchair accessible?",
      a: "This is genuinely not documented anywhere online, by the temple or by any other source found in research for this guide. If accessibility is a concern for your visit, it is worth calling ahead to the Tarakeswar Municipality or asking locally rather than assuming either way.",
    },
    {
      q: "Can foreigners visit Tarakeswar temple?",
      a: "The temple is generally described as open to all visitors and pilgrims, but no source addresses foreigner-specific rules, identification requirements or etiquette directly, so treat this as unconfirmed rather than assume it works exactly like a temple built for tourist visits.",
    },
  ],
  tarakeswarFood: [
    {
      q: "What is the best place to eat in Tarakeswar?",
      a: "Amantran (A2), opposite the bus stand gate, is the most reviewed sit-down restaurant in town. Tarakeswar Coffee House, Jam Jam Cafe and Dawat are other listed options nearby.",
    },
    {
      q: "Where can pilgrims stay in Tarakeswar?",
      a: "Options range from Nataraj Tourism Property, the former West Bengal Tourism lodge, and the Tarakeswar Municipality Guest House, to Tarapada Bhavan and Sri Chaitanya Saraswat Math, a pilgrim ashram with basic rooms.",
    },
    {
      q: "Are there pharmacies and hospitals in Tarakeswar?",
      a: "Yes. Two Apollo Pharmacy branches operate in town, at Chaulpatty and on Post Office Road. Tarakeswar Rural Hospital is the government hospital, and Care & Cure Nursing Home on Station Road is open 24 hours.",
    },
    {
      q: "Are there ATMs in Tarakeswar?",
      a: "Yes, several bank branches with ATMs operate in town, including State Bank of India, HDFC Bank, Axis Bank, Bandhan Bank, Bank of Baroda and Bank of India.",
    },
    {
      q: "Where can I get tea or sweets in Tarakeswar?",
      a: "Both are everywhere in Tarakeswar but mostly sold by small, local shops and roadside stalls that keep no online listing. Ask locally near the station approach or the temple's main gate rather than looking for a named shop online.",
    },
  ],
  tarakeswarReach: [
    {
      q: "Is there a direct train from Howrah to Tarakeswar?",
      a: "Yes. Tarakeswar Railway Station is the terminus of the Howrah-Tarakeswar branch line, with direct EMU locals running through the day, roughly 35 to 38 trains daily, no change needed.",
    },
    {
      q: "How long does the train from Howrah to Tarakeswar take?",
      a: "About 1.5 hours.",
    },
    {
      q: "How far is Tarakeswar from Kolkata by road?",
      a: "Map tools disagree by quite a bit, anywhere from about 55 to 65 km depending on the exact route and starting point, mainly along State Highway 2 or State Highway 15. Treat any single number with some caution and check your maps app on the day.",
    },
    {
      q: "Can I reach Tarakeswar by bus?",
      a: "Yes. State-run SBSTC buses and private buses run from Esplanade and Babughat in Kolkata, as well as from Arambagh and Serampore, taking roughly 2.5 to 3.5 hours.",
    },
    {
      q: "How do I get from Tarakeswar station to the temple?",
      a: "The temple is about 1 km from the railway station. A toto, the local e-rickshaw, covers it in about 10 minutes for a small fare.",
    },
    {
      q: "What is the nearest airport to Tarakeswar?",
      a: "Netaji Subhas Chandra Bose International Airport in Kolkata. The official government mela site gives the distance as about 70 km, roughly 2 hours by prepaid taxi, though it separately cites 65 km by road elsewhere on the same site, so treat the figure as approximate.",
    },
  ],
  tarakeswarBlog: [
    {
      q: "How is the blog different from the temple, food and how to reach pages?",
      a: "Those three pages are the neutral reference: facts, timings and listings. The blog posts each answer one narrower, specific question, like whether Tarakeswar and Kamarpukur can be done in one day, or which is faster, train or car.",
    },
    {
      q: "Are the blog posts kept up to date?",
      a: "Each post carries the date it was written. Facts likely to shift, mela dates, timings, prices, are written with that in mind and flagged where sources disagree.",
    },
  ],
};

export const PAGE_FAQ: Record<PageId, QA[]> = { ...PAGE_FAQ_CORE, ...PAGE_FAQ_TARAKESWAR };

/** Live experiences, for the internal link graph and the ItemList. */
export const LIVE_PATHS = EXPERIENCES.filter((e) => e.path).map((e) => e.path as string);
