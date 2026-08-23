/**
 * Editorial metadata for each album: the judgement calls the archive at
 * sumanami.co.uk cannot make about itself. Keyed by the slug
 * scripts/prepare-suman.mjs derives, so a mismatch here is a build-time
 * lookup failure rather than a silently wrong page.
 *
 * What lives here and nowhere else:
 *   - the hand-set Roman title (the machine transliteration in
 *     catalogue.generated.ts is the fallback for the 300-song tail nobody
 *     would romanise the same way twice; every album gets a real one)
 *   - an English gloss of the title, for a reader with no Bengali at all
 *   - the record type and, where it could be confirmed, the label
 *   - the corrected year, and — where sources genuinely disagree — both
 *     readings with which source says what, rather than a silent pick
 *
 * See public/kabirsuman/sources.json for the citation each correction rests
 * on; this file carries the conclusion, that one carries the argument.
 */

export type RecordType =
  | "studio"
  | "film"
  | "live"
  | "collaboration"
  | "tagore"
  | "compilation"
  | "digital";

export interface AlbumMeta {
  /** English gloss of the Bengali title — what it means, not a translation of the songs */
  englishTitle: string;
  /** hand-set Roman title, overriding the machine transliteration for display */
  roman: string;
  year: number;
  /** true when `year` is this site's best placement rather than a stated release date */
  yearUncertain?: boolean;
  type: RecordType;
  label?: string;
  /**
   * Set only where two or more sources genuinely disagree on the year.
   * `year` above is the one this site prints; this records what the
   * disagreement actually is, for the /kabirsuman/sources page.
   */
  yearDispute?: string;
  /** one or two sentences of context: why this record exists, not what is on it */
  note?: string;
}

export const ALBUM_META: Record<string, AlbumMeta> = {
  "tomake-chai": {
    englishTitle: "I Want You",
    roman: "Tomake Chai",
    year: 1992,
    type: "studio",
    label: "HMV (The Gramophone Company of India)",
    note:
      "The debut. Written, composed, sung and largely played by Suman alone on a four-track recorder — an approach with no real precedent in Bengali commercial recording — it is the record the term jibonmukhi gaan (‘life-facing song’) was coined for.",
  },
  "bose-anko": {
    englishTitle: "Sit and Draw",
    roman: "Bose Anko",
    year: 1993,
    type: "studio",
    label: "HMV",
    note: "Named for the sit-and-draw competitions of Bengali childhood; the second album continued the debut's method of building songs from small civic and domestic scenes.",
  },
  "ichchhe-hol": {
    englishTitle: "I Wished",
    roman: "Ichchhe Holo",
    year: 1993,
    type: "studio",
    label: "HMV",
  },
  ganola: {
    englishTitle: "The Song-Seller",
    roman: "Gaanola",
    year: 1994,
    type: "studio",
    label: "HMV",
    note:
      "Released internationally as Suman the One Man Band. The title track, addressed to a street song-seller, gave Suman the public persona — an itinerant vendor of songs — he is still described by.",
  },
  krishnochura: {
    englishTitle: "Flame of the Forest",
    roman: "Krishnachura",
    year: 1995,
    type: "film",
    note: "Film music; the archive holds one song from it.",
  },
  "ghumoo-baundule": {
    englishTitle: "Sleep, Wanderer",
    roman: "Ghumoo Baundule",
    year: 1995,
    type: "studio",
    label: "HMV",
    note: "A lullaby album, its title track addressed to a drifter rather than a child.",
  },
  "chaichhi-tomar-bondhuta": {
    englishTitle: "I Want Your Friendship",
    roman: "Chaichhi Tomar Bondhuta",
    year: 1996,
    type: "studio",
    label: "HMV",
    note:
      "Proposes friendship rather than romance as the relation being asked for, an unusual frame for a Bengali title track, and carries একুশে ফেব্রুয়ারী (Ekushe February), on the 1952 Bengali Language Movement killings in Dhaka.",
  },
  "chhot-bor-mile": {
    englishTitle: "Small and Big Together",
    roman: "Chhoto Bawro Mile",
    year: 1996,
    type: "studio",
  },
  "jatismor-1997": {
    englishTitle: "The One Who Remembers Past Lives",
    roman: "Jatishwar",
    year: 1997,
    type: "studio",
    label: "HMV",
    note:
      "Not to be confused with the 2014 Srijit Mukherji film Jaatishwar, for which Suman later wrote the score — the two share a title and nothing else.",
  },
  "ei-prothomo": {
    englishTitle: "This Is the First Time...",
    roman: "Ei Prothom...",
    year: 1997,
    type: "studio",
  },
  "nishiddh-istehar": {
    englishTitle: "The Forbidden Manifesto",
    roman: "Nishiddho Istehar",
    year: 1998,
    type: "studio",
    label: "HMV",
    note: "The album that marks Suman's turn toward explicitly oppositional material, its title track a manifesto by name.",
  },
  "pagola-sanai": {
    englishTitle: "The Mad Shehnai",
    roman: "Pagla Sanai",
    year: 1999,
    type: "studio",
  },
  "ochena-chhuti": {
    englishTitle: "The Unfamiliar Holiday",
    roman: "Ochena Chhuti",
    year: 1999,
    type: "studio",
  },
  "nagorik-kobiyal": {
    englishTitle: "The Urban Bard",
    roman: "Nagorik Kabiyal",
    year: 2000,
    type: "studio",
    note:
      "The self-description Suman is most associated with — nagorik kabiyal invokes the kobigaan tradition of the extempore duelling bard (Bhola Moira, Antony Firingee), claimed here as an urban, modern equivalent.",
  },
  "jabo-ochenay": {
    englishTitle: "I Will Go to the Unknown",
    roman: "Jabo Ochenaye",
    year: 2000,
    type: "studio",
    yearDispute:
      "The archive and Bengali Wikipedia both give 2000; English Wikipedia's album list gives 2001. This site follows the two Bengali-language sources.",
  },
  adab: {
    englishTitle: "Greetings",
    roman: "Aadab",
    year: 2002,
    type: "studio",
    note: "Aadab is the Perso-Arabic greeting current among Bengali Muslims — the title sits close in time to Suman's conversion to Islam.",
  },
  "reaching-out": {
    englishTitle: "Reaching Out",
    roman: "Reaching Out",
    year: 2003,
    type: "studio",
    note: "Suman's one English-language album.",
  },
  "onek-din-por": {
    englishTitle: "After a Long Time",
    roman: "Onek Din Por",
    year: 2005,
    type: "studio",
  },
  "dekhochhi-toke": {
    englishTitle: "I See You",
    roman: "Dekhchhi Toke",
    year: 2005,
    type: "studio",
    yearDispute:
      "English Wikipedia's album list gives 2004; the archive and its own site copy give 2005. This site follows the archive.",
  },
  tero: {
    englishTitle: "Thirteen",
    roman: "Tero",
    year: 2006,
    type: "collaboration",
    note: "A duet record with the Bangladeshi playback singer Sabina Yasmin, whom Suman married.",
  },
  nondigram: {
    englishTitle: "Nandigram",
    roman: "Nandigram",
    year: 2007,
    type: "studio",
    note:
      "Written and released within months of the 2007 police firing on protesters at Nandigram during the land-acquisition agitation; its সাবাস পুলিশ (Sabash Police, ‘well done, police’) is bitterly sarcastic by title alone.",
  },
  protirodh: {
    englishTitle: "Resistance",
    roman: "Protirodh",
    year: 2008,
    type: "studio",
  },
  "rijoyanur-britt": {
    englishTitle: "The Rizwanur Circle",
    roman: "Rizwanur Britto",
    year: 2008,
    type: "studio",
    note:
      "An entire album on the death of Rizwanur Rahman, a young Kolkata man who died in September 2007 weeks after a marriage that crossed class and religious lines — unusual subject matter for a commercial Bengali record.",
  },
  "chhotrodhorer-gan": {
    englishTitle: "Chhatradhar's Songs",
    roman: "Chhatradharer Gaan",
    year: 2010,
    type: "studio",
    note: "Written around Chhatradhar Mahato and the Lalgarh movement in West Midnapore.",
  },
  "lalomohoner-lash": {
    englishTitle: "Lalmohan's Corpse",
    roman: "Lalmohoner Lash",
    year: 2010,
    type: "studio",
  },
  "suprobhat-bishonnota": {
    englishTitle: "Good Morning, Melancholy",
    roman: "Suprabhat Bishonnota",
    year: 2010,
    type: "studio",
  },
  "63-te": {
    englishTitle: "At Sixty-Three",
    roman: "63 Te",
    year: 2012,
    type: "studio",
    note: "Titled for Suman's own age the year it was recorded.",
  },
  gonodabi: {
    englishTitle: "The People's Demand",
    roman: "Gonodabi",
    year: 2013,
    type: "studio",
    note:
      "Among the last conventionally produced albums; Suman has recorded largely at home and released digitally since, rather than through a studio album cycle.",
  },
  "jatismor-2014": {
    englishTitle: "Jaatishwar (film score)",
    roman: "Jaatishwar",
    year: 2014,
    type: "film",
    label: "SVF",
    note:
      "The score for Srijit Mukherji's film, for which Suman won the National Film Award for Best Music Direction at the 61st National Film Awards — unrelated to his own 1997 album of the same name.",
  },
  "sumoner-konthe-robindronath": {
    englishTitle: "Tagore, in Suman's Voice",
    roman: "Sumoner Konthe Robindronath",
    // The archive page itself says as much: "এটি কোন অ্যালবাম নয়" ("this is
    // not an album") — a curated selection, not one dated release. Most of
    // its 13 songs trace to Saregama's 1996 "Amar Ei Path Chaoatei Ananda"
    // (a match on 6 of 13 titles) and one more to the 1997 "Sanchayan"
    // compilation that repackages it, so 1996 is the best available date for
    // the bulk of it, not for the collection as a whole.
    year: 1996,
    yearUncertain: true,
    type: "tagore",
    note:
      "Not a studio album but the archive's own curated selection of Suman's scattered Rabindra Sangeet recordings — Tagore's own songs, sung by Suman rather than written by him, the one record here that is entirely someone else's composition. Most of its songs trace to Saregama's 1996 release Amar Ei Path Chaoatei Ananda; a few do not match any known release and remain undated.",
  },
};
