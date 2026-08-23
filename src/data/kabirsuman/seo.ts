import type { PageSeo, QA } from "../seo";
// From counts.generated.ts, NOT catalogue.ts: this file is reached eagerly
// from every page (src/data/seo.ts imports it directly), and catalogue.ts
// pulls in the full ~160KB album+song index. See that file's own comment.
import { FIRST_YEAR, LATEST_YEAR, TOTAL_ALBUMS, TOTAL_SONGS } from "./counts.generated";

/**
 * Per-page SEO and FAQ copy for the five fixed Kabir Suman pages, kept out of
 * src/data/seo.ts the way src/data/tarakeswar/jsonld.ts and prerender.ts are:
 * this section is large enough to deserve its own file rather than growing
 * the shared one indefinitely. Merged into PAGE_SEO / PAGE_FAQ there.
 *
 * The two dynamic collections — /kabirsuman/album/:slug and
 * /kabirsuman/song/:slug — are not here; they are not PageIds (see
 * src/data/seo.ts) and get their per-page copy generated directly from the
 * catalogue in src/lib prerender/jsonld, the same split Tarakeswar's blog
 * posts use.
 */

const RANGE = `${FIRST_YEAR}–${LATEST_YEAR}`;

export type KabirSumanPageId = "kabirsuman" | "kabirsumanLife" | "kabirsumanWorks" | "kabirsumanWords" | "kabirsumanSources";

export const PAGE_SEO_KABIRSUMAN: Record<KabirSumanPageId, PageSeo> = {
  kabirsuman: {
    title: "Kabir Suman: The Complete Works, Catalogued",
    description:
      `Every album and every lyric the sumanami.co.uk archive holds for Kabir Suman (b. 1949) — ${TOTAL_ALBUMS} records, ${TOTAL_SONGS} songs, ${RANGE} — plus the life around them: journalist, broadcaster, MP, and the songwriter usually credited with starting jibonmukhi gaan.`,
    keywords: [
      "kabir suman",
      "kabir suman songs",
      "kabir suman all songs",
      "kabir suman discography",
      "kabir suman lyrics",
      "jibonmukhi gaan",
      "tomake chai",
      "suman chatterjee",
      "nagorik kabiyal",
      "bengali khayal",
    ],
    h1: "Kabir Suman",
    intro:
      `Kabir Suman, born Suman Chattopadhyay in 1949, is the Bengali singer, songwriter, journalist and broadcaster usually credited — not without argument — with starting jibonmukhi gaan, "life-facing song", when Tomake Chai reset what a Bengali record could be about in 1992. This is a catalogue of everything the sumanami.co.uk archive preserves of his work: ${TOTAL_ALBUMS} albums, ${TOTAL_SONGS} songs with their lyrics in Bengali, and the broadcasting, print and political life that runs alongside the music.`,
    facts: [
      `${TOTAL_ALBUMS} albums catalogued, ${RANGE}.`,
      `${TOTAL_SONGS} songs with full Bengali lyrics, sourced from the sumanami.co.uk fan archive.`,
      "Also a former All India Radio and Deutsche Welle broadcaster, a Voice of America journalist, a Lok Sabha MP for Jadavpur (2009–2014), and a National Film Award winner (Best Music Direction, Jaatishwar, 2014).",
      "Every song plays from its official YouTube upload; nothing here is hosted or re-encoded.",
      "An independent tribute, not affiliated with Kabir Suman, his label, or the sumanami.co.uk archive.",
    ],
    favicon: "/kabirsuman/favicon.svg",
  },
  kabirsumanLife: {
    title: "Kabir Suman: A Life, 1949–2026",
    description:
      "A verified, chronological life of Kabir Suman — Cuttack to Kolkata, All India Radio and Voice of America, Tomake Chai in 1992, the conversion and the years as an MP, to the Bangla khayal project he is still working on.",
    keywords: ["kabir suman biography", "kabir suman life", "kabir suman age", "kabir suman mp", "kabir suman family"],
    h1: "A Life",
    intro:
      "Cuttack to Kolkata, All India Radio to Cologne to Nicaragua, a debut album at 43 that changed what Bengali song could be about, five years in the Lok Sabha, and a late turn to composing Bengali khayal that he is still at work on. Every date below is sourced; where sources disagree, both readings are given rather than one silently chosen.",
    facts: [
      "Born 16 March 1949, Cuttack, Odisha, as Suman Chattopadhyay.",
      "Worked as a broadcaster for All India Radio, Deutsche Welle (Cologne) and the Voice of America before recording a note of his own music commercially.",
      "Released Tomake Chai in 1992, at age 43.",
      "Elected to the Lok Sabha for Jadavpur in 2009, serving until 2014.",
      "Took the name Kabir by affidavit in 2000, after 1999's decision to give up his Hindu Brahmin identity — though he has denied the change was itself a conversion to Islam.",
    ],
    favicon: "/kabirsuman/favicon.svg",
  },
  kabirsumanWorks: {
    title: `Kabir Suman Discography: All ${TOTAL_ALBUMS} Albums, ${RANGE}`,
    description: `Every Kabir Suman album, ${RANGE}, in order: studio records, film scores, the Sabina Yasmin collaboration, and the Tagore collection — ${TOTAL_SONGS} songs in total, each with its lyrics.`,
    keywords: ["kabir suman albums", "kabir suman discography", "kabir suman all albums list", "tomake chai album", "gaanola"],
    h1: "The Discography",
    intro: `${TOTAL_ALBUMS} albums, ${RANGE}: the studio records that defined jibonmukhi gaan in the 1990s, the protest albums built around Nandigram and Rizwanur Rahman in the 2000s, the Sabina Yasmin duet record, and the film scores, arranged in the order they were made.`,
    facts: [
      `${TOTAL_ALBUMS} albums cover ${RANGE}.`,
      "Every album cover shown is the real release artwork, from the sumanami.co.uk archive.",
      "Two albums share the title Jatishwar — a 1997 studio record and the unrelated 2014 Jaatishwar film score — kept distinct on this site rather than merged.",
    ],
    favicon: "/kabirsuman/favicon.svg",
  },
  kabirsumanWords: {
    title: "শব্দকোষ — The Suman Lexicon: Every Word He Ever Sang, Counted",
    description:
      "Every recurring word across 317 Kabir Suman songs, and every song it appears in — the first searchable index of his vocabulary as a lyricist, built from the full lyric archive.",
    keywords: ["kabir suman lyrics search", "kabir suman word index", "kabir suman concordance", "bengali lyrics search"],
    h1: "শব্দকোষ · The Lexicon",
    intro:
      `Not a concordance in the academic sense so much as a way of reading a songwriter by his own most-used words: every one that recurs across the ${TOTAL_SONGS} songs here, how often, in which decade, and in which of them. Built directly from the lyric text rather than curated, so it shows what actually recurs — pronouns and connectives aside — rather than what a summary would guess.`,
    facts: [
      `Built from all ${TOTAL_SONGS} songs' full lyric text — ${TOTAL_SONGS} songs distilled to one index.`,
      "Function words (pronouns, postpositions, common verbs) are excluded by an explicit list, not by frequency, since some of his most repeated words are also his most thematic.",
      "No stemming: inflected forms are counted separately, since merging them without a proper morphological analyser would corrupt the count.",
    ],
    favicon: "/kabirsuman/favicon.svg",
  },
  kabirsumanSources: {
    title: "Sources and Credits: The Kabir Suman Archive",
    description:
      "Where every fact, lyric and year on this site comes from — the sumanami.co.uk archive, the corrections made to it, and the research behind the biography.",
    keywords: ["kabir suman sources", "sumanami archive", "kabir suman fact check"],
    h1: "Sources and Credits",
    intro:
      "This section exists because of one archive, sumanami.co.uk, built and maintained by fans of Kabir Suman's work over many years. What follows is which facts came from there, which were corrected and against what, and what every other claim on this site traces back to.",
    facts: [
      "The lyric text for all 317 songs and the 30 album covers come from sumanami.co.uk.",
      "Biographical and discographical facts are cross-checked against at least two independent sources; disagreements are stated rather than silently resolved.",
      "This is an independent tribute project, not affiliated with Kabir Suman, his estate, his label, or sumanami.co.uk.",
    ],
    favicon: "/kabirsuman/favicon.svg",
  },
};

export const PAGE_FAQ_KABIRSUMAN: Record<KabirSumanPageId, QA[]> = {
  kabirsuman: [
    {
      q: "Is this Kabir Suman's official website?",
      a: "No. This is an independent tribute and reference catalogue, built from the sumanami.co.uk fan archive and cross-checked public sources. It is not affiliated with Kabir Suman, his label, or the archive.",
    },
    {
      q: "Can I actually listen to the songs here?",
      a: "Where an official YouTube upload could be verified, yes — the song plays in place from that upload. Nothing is hosted or re-encoded on this site.",
    },
    {
      q: `How many songs and albums does this cover?`,
      a: `${TOTAL_ALBUMS} albums and ${TOTAL_SONGS} songs, spanning ${RANGE}, all sourced from the sumanami.co.uk archive.`,
    },
  ],
  kabirsumanLife: [
    {
      q: "What does the \"sources disagree\" note mean?",
      a: "It marks a fact where independent sources genuinely give different readings — not a year in dispute so much as what an event itself meant, such as what his 2000 name change to Kabir was meant to signal. Both readings are shown rather than one being silently picked as fact.",
    },
  ],
  kabirsumanWorks: [
    {
      q: "Why are there two albums both called Jatishwar?",
      a: "The 1997 studio album and the 2014 Jaatishwar film score share a title by coincidence. They are kept as separate entries here rather than merged.",
    },
    {
      q: "What order are the albums in?",
      a: "Chronological, by the year each was released.",
    },
  ],
  kabirsumanWords: [
    {
      q: "Why isn't a word like আমার (\"my\") or আছে (\"is\") in the index?",
      a: "Pronouns, postpositions and a short list of the most common verbs are excluded on purpose — they recur in every song by anyone, in any language, and indexing them would bury the words that actually distinguish one song from another.",
    },
    {
      q: "Why are আমার and আমি listed separately instead of as one entry?",
      a: "Bengali inflects heavily, and merging inflected forms correctly needs a proper morphological analyser. Counting surface forms separately is less tidy but more honest than a suffix-stripping guess that might merge two different words.",
    },
  ],
  kabirsumanSources: [],
};
