import type { PageSeo, QA } from "../seo";
import { FIRST_YEAR, LATEST_YEAR, TOTAL_FILMS } from "./counts.generated";
import { LANDMARK_FILMS } from "./films";

/**
 * Per-page SEO and FAQ copy for the nine fixed Uttam Kumar pages, kept out
 * of src/data/seo.ts the way kabirsuman/seo.ts is: this section is large
 * enough to deserve its own file. Merged into PAGE_SEO / PAGE_FAQ there.
 *
 * /uttamkumar/film/:slug (211 films, one page per credit, ~44 of them with
 * real detail) is not a PageId, the same reason Kabir Suman's albums/songs
 * and Tarakeswar's blog posts aren't — its per-page copy is generated
 * directly in src/lib prerender/jsonld from films.ts and dynamicSeo.ts.
 */

const RANGE = `${FIRST_YEAR}–${LATEST_YEAR}`;

export type UttamKumarPageId =
  | "uttamkumar"
  | "uttamkumarLife"
  | "uttamkumarFilms"
  | "uttamkumarSuchitra"
  | "uttamkumarAwards"
  | "uttamkumarBooks"
  | "uttamkumarCentenary"
  | "uttamkumarWords"
  | "uttamkumarSources"
  | "uttamkumarCredits";

export const PAGE_SEO_UTTAMKUMAR: Record<UttamKumarPageId, PageSeo> = {
  uttamkumar: {
    title: "Uttam Kumar at 100: The Mahanayak's Complete Filmography and Life",
    description: `Uttam Kumar (1926–1980), Bengali cinema's Mahanayak, on his 2026 birth centenary — all ${TOTAL_FILMS} films (${RANGE}), his life, the Uttam-Suchitra pairing, awards, books about him, and what the centenary year actually looks like.`,
    keywords: [
      "uttam kumar",
      "uttam kumar 100th birthday",
      "uttam kumar centenary",
      "uttam kumar birth centenary 2026",
      "mahanayak uttam kumar",
      "uttam kumar films list",
      "uttam kumar suchitra sen",
      "uttam kumar biography",
      "bengali cinema legend",
    ],
    h1: "Uttam Kumar",
    intro: `Uttam Kumar, born Arun Kumar Chattopadhyay on 3 September 1926, is the actor Bengali cinema calls Mahanayak — the great hero — across a 32-year career and ${TOTAL_FILMS} credited films, ${RANGE}. His hundredth birth anniversary fell on 3 September 2026, mid-way through West Bengal's own year-long "Satabarshe Mahanayak" centenary programme. This is a complete, sourced catalogue of that life and work: every film, the Uttam-Suchitra Sen pairing, his awards, the books written about him, and what the centenary year is actually doing.`,
    facts: [
      `${TOTAL_FILMS} credited films, ${RANGE}, cross-checked against Wikipedia's own filmography table.`,
      "First-ever recipient of the National Film Award for Best Actor, 1967 (Antony Firingee and Chiriyakhana).",
      "Won the Bengal Film Journalists' Association Best Actor award eight times, a record at the time.",
      "His centenary, September 2026, is a year-long West Bengal government programme, not a single event.",
      "An independent tribute, not affiliated with Uttam Kumar's family, estate, or the West Bengal government's own centenary committee.",
    ],
  },
  uttamkumarLife: {
    title: "Uttam Kumar: A Life, 1926–2026",
    description: "A sourced, chronological life of Uttam Kumar — Ahiritola to the Calcutta Port Trust clerk's desk, the 'Flop Master General' years, Mahanayak stardom, two marriages, the 1976 radio controversy, and the centenary a century on.",
    keywords: ["uttam kumar biography", "uttam kumar life story", "uttam kumar wife", "uttam kumar death", "uttam kumar family"],
    h1: "A Life",
    intro:
      "Port Trust clerk to Flop Master General to Mahanayak, in one chronological line — including the two marriages he never resolved, the 1976 radio reading that turned public opinion against him for a season, and the honours that followed his death. Every entry is sourced; the harder parts are stated plainly rather than left out.",
    facts: [
      "Born 3 September 1926, Ahiritola, Calcutta, as Arun Kumar Chattopadhyay.",
      "Worked as a Calcutta Port Trust clerk until his first hit, Basu Paribar (1952), let him act full time.",
      "Married Gauri Chatterjee in 1948, then Supriya Devi in 1963, without divorcing the first.",
      "Died 24 July 1980, aged 53, mid-shoot of Ogo Bodhu Shundori.",
    ],
  },
  uttamkumarFilms: {
    title: `Uttam Kumar Filmography: All ${TOTAL_FILMS} Films (${RANGE}), Sorted by Year`,
    description: `The complete Uttam Kumar filmography, ${RANGE}: all ${TOTAL_FILMS} credited films sorted chronologically, ${LANDMARK_FILMS.length} of them with a full synopsis, director and co-star detail — plus his most acclaimed work and where to actually start watching.`,
    keywords: ["uttam kumar films list", "uttam kumar all movies", "uttam kumar best films", "uttam kumar filmography", "uttam kumar movies to watch"],
    h1: "The Filmography",
    intro: `Every credited role, sorted the way it happened: ${TOTAL_FILMS} films from 1948's Drishtidan to 2024's VFX-built Oti Uttam, with ${LANDMARK_FILMS.length} of them — the ones with a real, checkable story behind the credit — given a full page. A film with no page here isn't cut; it's listed by year and role, honestly, rather than filled in with an invented plot.`,
    facts: [
      `${TOTAL_FILMS} films, ${RANGE}, in the order Wikipedia's own filmography table lists them.`,
      `${LANDMARK_FILMS.length} films have a full detail page: synopsis, director, co-stars, and the award or box-office note that made them worth writing about.`,
      "A 'most acclaimed' set and a 'where to start' viewing guide sit at the top of this page for anyone new to his work.",
    ],
  },
  uttamkumarSuchitra: {
    title: "Uttam Kumar and Suchitra Sen: The Complete Pairing",
    description: "Uttam Kumar and Suchitra Sen, the defining pairing of Bengali commercial cinema — around 30 films together from Sharey Chuattor (1953) to Saptapadi's wartime epic, and the off-screen rumor examined honestly.",
    keywords: ["uttam kumar suchitra sen", "uttam suchitra films", "uttam kumar suchitra sen love story", "uttam suchitra pairing"],
    h1: "Uttam & Suchitra",
    intro:
      "No pairing defined Bengali commercial cinema more completely. This page is the pairing as its own subject: the films, commonly cited at around 30 together, and the persistent off-screen rumor — addressed directly rather than either repeated as fact or quietly dropped.",
    facts: [
      "First shared a film in Sharey Chuattor (1953); the pairing peaked through the 1950s and 60s.",
      "Agni Pariksha (1954) was marketed with both their real signatures as \"Witness of Our Real Love.\"",
      "Both were married throughout — Sen to Dibanath Sen, Kumar to Gauri Chatterjee — and no source establishes the off-screen romance beyond rumor.",
    ],
  },
  uttamkumarAwards: {
    title: "Uttam Kumar's Awards: National Film Award, BFJA, Filmfare",
    description: "Every award Uttam Kumar won: the first-ever National Film Award for Best Actor (1967), eight BFJA Best Actor wins, Filmfare, and the honours named for him since his death.",
    keywords: ["uttam kumar awards", "uttam kumar national award", "uttam kumar bfja award", "mahanayak samman"],
    h1: "Awards & Honours",
    intro:
      "The record, not the reputation: every National Film Award, BFJA and Filmfare win by year and film, plus the honours — a metro station, a lifetime-achievement award, four statues — instituted in his name since 1980.",
    facts: [
      "First-ever National Film Award for Best Actor, 1967 — the category's inaugural year.",
      "Eight BFJA Best Actor awards, a record at the time of the eighth, in 1976.",
      "Tollygunge Metro station was renamed Mahanayak Uttam Kumar Metro Station in 2009.",
    ],
  },
  uttamkumarBooks: {
    title: "Books on Uttam Kumar: His Own Writing and the Biographies",
    description: "The two unfinished autobiographies Uttam Kumar began, and the definitive modern biography, Sayandeb Chowdhury's Uttam Kumar: A Life in Cinema (Bloomsbury, 2021).",
    keywords: ["uttam kumar books", "uttam kumar autobiography", "uttam kumar biography book", "aamar ami uttam kumar"],
    h1: "The Reading Room",
    intro:
      "What he wrote about himself, twice, and never finished either time — and the one book that has since done the job properly. No cover images here: the modern biography is still under copyright, so it's cited rather than pictured.",
    facts: [
      "He began two autobiographies, Aamar Ami and Harano Dinguli Mor, neither completed.",
      "Sayandeb Chowdhury's Uttam Kumar: A Life in Cinema (Bloomsbury, 2021) is described as the first definitive critical biography.",
    ],
  },
  uttamkumarCentenary: {
    title: "Uttam Kumar Centenary 2026: What's Actually Happening",
    description: "A dated, sourced record of the 2026 Uttam Kumar birth centenary: the West Bengal government's Satabarshe Mahanayak programme, the new Film Centre, the commemorative stamp and coin, and the year-long events still to come.",
    keywords: ["uttam kumar centenary 2026", "uttam kumar 100th birthday events", "satabarshe mahanayak", "uttam kumar film centre"],
    h1: "The Centenary, 2026",
    intro:
      "Dated on purpose: this covers what has actually happened and been reported for Uttam Kumar's hundredth birth anniversary, not a wishlist of what a centenary should include. Built to be extended through the rest of the year rather than frozen at launch.",
    facts: [
      "His hundredth birth anniversary fell on 3 September 2026.",
      "The West Bengal government ran a four-day programme, 3–6 September, and a year-long set of events beyond it.",
      "A new Uttam Kumar Film Centre broke ground in New Town during the programme.",
    ],
  },
  uttamkumarWords: {
    title: "What They Said About Uttam Kumar: Ray, Bachchan, Soumitra and More",
    description: "Uttam Kumar in the words of the people who worked with him and followed him: Satyajit Ray, Soumitra Chatterjee, Amitabh Bachchan, Rajesh Khanna, Dilip Kumar, Tapan Sinha.",
    keywords: ["uttam kumar quotes", "what people said about uttam kumar", "satyajit ray on uttam kumar"],
    h1: "Voices",
    intro:
      "Not this site's paraphrase of his stature — the words of the people who actually watched him work, from the director who wrote a film for him to the co-star he spent two decades being compared against.",
    facts: [],
  },
  uttamkumarSources: {
    title: "Sources: The Uttam Kumar Centenary Tribute",
    description: "Every source behind this Uttam Kumar tribute: Wikipedia's biography and filmography, 2026 centenary press coverage from The Week, Millennium Post, The Statesman and others, and the published biography this section draws on.",
    keywords: ["uttam kumar sources", "uttam kumar fact check"],
    h1: "Sources and Credits",
    intro:
      "Deliberately not Wikipedia-only. The biography and the 211-film catalogue are cross-checked against Wikipedia's own articles; the 2026 centenary coverage and the book bibliography are drawn from independent press and publisher sources, each listed here rather than folded into one vague credit line.",
    facts: [
      "The 211-film catalogue is parsed directly from Wikipedia's own filmography wikitext, not summarised or retyped by hand.",
      "Centenary coverage is drawn from ten independent news sources, not one.",
      "This is an independent tribute, not affiliated with Uttam Kumar's family, estate, or the West Bengal government's centenary committee.",
    ],
  },
  uttamkumarCredits: {
    title: "Image Credits: Every Photo and Sketch on This Uttam Kumar Tribute",
    description: "Full attribution for every self-hosted image on this Uttam Kumar tribute — an official India Post stamp, two artist-dedicated portrait sketches, and a photograph of a real testimonial he signed — plus which Commons files were rejected and why.",
    keywords: ["uttam kumar image credits", "uttam kumar photo attribution", "wikimedia commons uttam kumar"],
    h1: "Image Credits",
    intro:
      "Four images are self-hosted on this tribute, each chosen and verified individually rather than pulled wholesale from a category listing. This page names every one — photographer or artist, licence, source — and explains which Commons files were left out and why, so a gap in the gallery reads as a decision rather than an oversight.",
    facts: [
      "Four images: an official 2009 India Post stamp (GODL-India), two CC0 artist-dedicated portrait sketches, and a CC0 photo of a real signed testimonial.",
      "Six other files in Wikimedia Commons' Uttam Kumar category were reviewed and rejected — a rephotographed print, a film-still screenshot, a misfiled photo of a different actor, an unusable night photo, and one with an unverifiable chain of custody.",
      "No film stills or posters are used anywhere on this site; see /uttamkumar/sources and the reasoning in scripts/prepare-uttamkumar-images.mjs.",
    ],
  },
};

export const PAGE_FAQ_UTTAMKUMAR: Record<UttamKumarPageId, QA[]> = {
  uttamkumar: [
    {
      q: "Is this Uttam Kumar's official website?",
      a: "No. This is an independent tribute and reference catalogue, built from Wikipedia's biography and filmography, independent press coverage of the 2026 centenary, and the published biography Uttam Kumar: A Life in Cinema. It is not affiliated with his family, estate, or the West Bengal government's centenary committee.",
    },
    {
      q: "When was Uttam Kumar's 100th birthday?",
      a: "3 September 2026 — 3 September 1926 was his birth date. His centenary is being marked by the West Bengal government with a year-long programme, not a single day of events.",
    },
    {
      q: "How many films did Uttam Kumar act in?",
      a: `${TOTAL_FILMS} credited acting roles, 1948 to 2024, per Wikipedia's own filmography table — the last, Oti Uttam, released 44 years after his death using VFX-composited archive footage.`,
    },
  ],
  uttamkumarLife: [
    {
      q: "Why does this page mention his marriages and the 1976 radio controversy?",
      a: "Because a tribute that only lists achievements isn't a complete life. Both are real, sourced events — he married Supriya Devi in 1963 without divorcing his first wife, and public backlash followed his 1976 reading of the Mahalaya Chandi Path on All India Radio — reported here plainly rather than left out or sensationalised.",
    },
  ],
  uttamkumarFilms: [
    {
      q: "Why don't all 211 films have their own page?",
      a: "Because a page needs a real, checkable story behind it. Roughly 44 of his films are documented well enough across independent sources to write an honest synopsis, director credit and co-star list; the rest are listed by year and role, which is the truth about what's verifiable for them, rather than an invented plot filling the gap.",
    },
    {
      q: "What's the best Uttam Kumar film to start with?",
      a: "See the 'Where to Start' section on this page — it groups a handful of films by mood (Ray's art-cinema Nayak, the Suchitra Sen romances, the Jhinder Bondi/Chiriyakhana genre turns, the Amanush-era blockbusters) rather than handing over one single 'best' title.",
    },
  ],
  uttamkumarSuchitra: [
    {
      q: "Were Uttam Kumar and Suchitra Sen actually in a relationship?",
      a: "Not established by any source beyond a persistent, widely repeated rumor. Both were married to other people throughout their careers together. This page states that plainly rather than repeating the rumor as settled fact or pretending it was never asked.",
    },
  ],
  uttamkumarAwards: [],
  uttamkumarBooks: [
    {
      q: "Why are there no book cover images?",
      a: "Uttam Kumar: A Life in Cinema (2021) is still under copyright, and this site runs ads — using its cover without a rights arrangement isn't a risk worth taking for a book that's easy enough to link to instead.",
    },
  ],
  uttamkumarCentenary: [
    {
      q: "Is this page kept up to date through the centenary year?",
      a: "It's built to be — West Bengal's own programme runs across the whole of 2026, not just the September anniversary, and this page is structured to have entries added rather than rewritten from scratch.",
    },
  ],
  uttamkumarWords: [],
  uttamkumarSources: [],
  uttamkumarCredits: [
    {
      q: "Why are there only four images on the whole site?",
      a: "Because that's how many could actually be verified as safely reusable. This site runs ads, and Indian photograph copyright runs 60 years from publication, so nearly every real photo of Uttam Kumar from his working life is still under copyright. These four survived individual review — an official government stamp, two artist-dedicated sketches, and a photo of a real testimonial — everything else in Commons' own Uttam Kumar category was rejected on inspection, listed on this page with the specific reason.",
    },
  ],
};
