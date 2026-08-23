/**
 * A chronological life, cross-checked against English and Bengali
 * Wikipedia and the archive's own biography page. Where those sources
 * genuinely disagree, both readings are kept rather than one silently
 * chosen — see `dispute` below and /kabirsuman/sources for what each side
 * actually says.
 *
 * This file is a living draft: it will grow and tighten as the dedicated
 * biography research pass is folded in, but every entry already here rests
 * on at least one identifiable source, never on inference.
 */

export interface LifeEvent {
  year: number;
  /** month/day if known, for display only, e.g. "23 April" */
  date?: string;
  headline: string;
  detail?: string;
  /** set when two or more sources genuinely disagree on this event */
  dispute?: string;
  era: "before-music" | "the-albums" | "politics" | "later-work";
}

export const LIFE_EVENTS: LifeEvent[] = [
  {
    year: 1949,
    date: "16 March",
    headline: "Born Suman Chattopadhyay, in Cuttack, Odisha.",
    era: "before-music",
  },
  {
    year: 1973,
    headline: "A first spell abroad, teaching Indian classical music in France.",
    era: "before-music",
  },
  {
    year: 1975,
    headline: "Moves to Cologne, West Germany, working for Deutsche Welle's Bengali service.",
    detail: "A first stretch through 1979, before a second spell in Germany later in the 1980s.",
    era: "before-music",
  },
  {
    year: 1979,
    headline: "Teaches German at the Ramakrishna Mission Institute of Culture, Kolkata.",
    era: "before-music",
  },
  {
    year: 1980,
    headline: "Moves to Washington, D.C., to work for Voice of America's Bengali service.",
    detail:
      "Reports on the Sandinista revolution in Nicaragua during this posting — the basis for his book মুক্ত নিকারাগুয়া (Mukto Nicaragua), published 1987.",
    era: "before-music",
  },
  {
    year: 1985,
    headline: "Returns to Kolkata from the United States.",
    era: "before-music",
  },
  {
    year: 1986,
    date: "September",
    headline: "A second period in West Germany, into early 1989.",
    era: "before-music",
  },
  {
    year: 1990,
    date: "December",
    headline: "First professional performance as a singer, in Kolkata.",
    era: "before-music",
  },
  {
    year: 1992,
    date: "23 April",
    headline: "Tomake Chai released on HMV.",
    detail:
      "Written, composed, sung and largely recorded alone on a four-track machine. The album that the term jibonmukhi gaan, \"life-facing song\", was coined for.",
    era: "the-albums",
  },
  {
    year: 1996,
    headline: "Pete Seeger performs in Kolkata, on the strength of Tomake Chai's reception.",
    era: "the-albums",
  },
  {
    year: 1997,
    headline: "BFJA Award for Best Lyrics, for the film Bhai.",
    era: "the-albums",
  },
  {
    year: 1999,
    headline: "Decides to give up his Hindu Brahmin identity, following the killing of Graham Staines.",
    detail:
      "\"I decided to get rid of my Hindu Brahmin identity on the day that Graham Staines and his two boys were burnt alive,\" he told The Telegraph in 2007, referring to the January 1999 killing of the Australian missionary and his sons by a Bajrang Dal member.",
    era: "the-albums",
  },
  {
    year: 2000,
    date: "May",
    headline: "Formally changes his name to Kabir Suman by affidavit.",
    dispute:
      "Widely described as a conversion to Islam, but Suman has denied that reading directly: \"the name Kabir contains no Islam and no Hindu doctrine either,\" he wrote later, describing himself as an atheist. The name change and the 1999 decision above are two milestones of the same break, not a dating conflict — but what the name itself is meant to signal remains contested, by Suman's own account.",
    era: "the-albums",
  },
  {
    year: 2000,
    headline: "Marries the Bangladeshi playback singer Sabina Yasmin.",
    era: "the-albums",
  },
  {
    year: 2006,
    headline: "Becomes prominently involved in the Singur and Nandigram land agitations.",
    detail: "The following year's album, Nandigram, is written directly out of this.",
    era: "politics",
  },
  {
    year: 2009,
    date: "May",
    headline: "Elected to the Lok Sabha for Jadavpur, standing for the Trinamool Congress.",
    detail: "Defeated the CPI(M)'s Sujan Chakraborty.",
    era: "politics",
  },
  {
    year: 2010,
    date: "April",
    headline: "A falling-out with the Trinamool leadership, and a resignation threat, are resolved.",
    detail:
      "Following a dispute that began in November 2009, Suman threatened to resign his seat in March 2010; the writer Mahasweta Devi intervened, and he withdrew the threat on 7 April 2010.",
    era: "politics",
  },
  {
    year: 2014,
    headline: "Wins the National Film Award for Best Music Direction, for Jaatishwar.",
    detail: "Also named Composer and Lyricist of the Year at the Mirchi Music Awards Bangla for the same film.",
    era: "later-work",
  },
  {
    year: 2015,
    headline: "Awarded the Sangeet Mahasamman by the Government of West Bengal.",
    era: "later-work",
  },
  {
    year: 2018,
    headline: "Awarded an honorary D.Litt by Kalyani University.",
    era: "later-work",
  },
  {
    year: 2020,
    headline: "Bangla Kheyal, his project setting Hindustani khayal to Bengali, released.",
    era: "later-work",
  },
  {
    year: 2024,
    date: "29 January",
    headline: "Hospitalized in Kolkata after chest pain and breathing difficulty.",
    detail:
      "Treated at Calcutta Medical College, briefly on oxygen support and later moved to the CCU; Chief Minister Mamata Banerjee visited him during his stay.",
    era: "later-work",
  },
  {
    year: 2024,
    headline: "Composes for two Srijit Mukherji films, Padatik and Tekka.",
    era: "later-work",
  },
  {
    year: 2025,
    headline: "New songs released, including for Lawho Gouranger Naam Rey and Ami Jokhon Hema Malini.",
    era: "later-work",
  },
  {
    year: 2026,
    date: "May",
    headline: "A police complaint is filed against him in Kolkata over years-old remarks.",
    detail:
      "Filed at Netaji Nagar police station by an organisation called Jatir Kotha, alleging that comments of his — from a viral 2022 phone-call clip — insulted women and Hindu sentiment. No FIR had been registered as of reporting, and the matter remained under investigation.",
    era: "later-work",
  },
  {
    year: 2026,
    headline: "Bare Voice, a documentary on his life and music directed by Jaideep Varma, is released.",
    era: "later-work",
  },
];
