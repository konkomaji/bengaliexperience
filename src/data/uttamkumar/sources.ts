/**
 * What this section rests on. Deliberately not Wikipedia-only: the
 * biography and filmography are cross-checked there, but the 2026 centenary
 * coverage, the book bibliography and several award/legacy facts are drawn
 * from independent press and publisher sources, listed below rather than
 * folded into one vague citation.
 */
export interface Source {
  name: string;
  url: string;
  usedFor: string;
}

export const PRIMARY_SOURCES: Source[] = [
  {
    name: "Wikipedia — Uttam Kumar",
    url: "https://en.wikipedia.org/wiki/Uttam_Kumar",
    usedFor: "Biography, career narrative, awards, quotes about him, posthumous honours.",
  },
  {
    name: "Wikipedia — Uttam Kumar filmography",
    url: "https://en.wikipedia.org/wiki/Uttam_Kumar_filmography",
    usedFor:
      "The complete 211-title acting filmography (and the producer/director/composer credit tables), parsed directly from the article's own wikitext — see scripts/fetch-uttamkumar-filmography.mjs.",
  },
];

export const CENTENARY_SOURCES: Source[] = [
  { name: "The Week — \"Uttam Kumar turns 100: Bengal gears up\"", url: "https://www.theweek.in/news/entertainment/2026/08/13/uttam-kumar-turns-100-bengal-gears-up-to-celebrate-its-mahanayak.html", usedFor: "Centenary programme details." },
  { name: "The Week — PM Modi, Suvendu Adhikari pay homage", url: "https://www.theweek.in/news/india/2026/09/03/pm-modi-suvendu-adhikari-pay-homage-to-bengali-legend-uttam-kumar-on-centenary-birth-anniversary.html", usedFor: "3 September 2026 tributes and events." },
  { name: "Millennium Post — \"Birth centenary: film festival, exhibitions & new film centre\"", url: "https://www.millenniumpost.in/bengal/uttam-kumars-birth-centenary-film-festival-exhibitions-new-film-centre-674446", usedFor: "Film festival, exhibitions, Uttam Kumar Film Centre." },
  { name: "The Statesman — \"Bengal to celebrate birth centenary with year-long celebrations\"", url: "https://www.thestatesman.com/cities/kolkata/bengal-to-celebrate-uttam-kumar-birth-centenary-with-year-long-celebrations-1503627243.html/amp", usedFor: "Year-long programme: heritage walks, cake-cutting, open-air screenings." },
  { name: "Business Standard / TBS — \"Birth centenary: West Bengal plans new film centre, heritage walks\"", url: "https://www.tbsnews.net/splash/uttam-kumar-birth-centenary-west-bengal-plans-new-film-centre-heritage-walks-1514771", usedFor: "Film centre and heritage-walk plans." },
  { name: "Outlook India — \"Anatomy of an Enduring Smile: Uttam Kumar's Birth Centenary\"", url: "https://www.outlookindia.com/art-entertainment/anatomy-of-an-enduring-smile-uttam-kumars-birth-centenary", usedFor: "Retrospective context on the centenary." },
  { name: "Free Press Journal — \"Uttam Kumar At 100: Kolkata Celebrates\"", url: "https://www.freepressjournal.in/entertainment/uttam-kumar-at-100-kolkata-celebrates-the-enduring-legacy-of-bengali-cinemas-mahanayak", usedFor: "Centenary coverage." },
  { name: "India TV News — PM Modi, Suvendu Adhikari tribute", url: "https://www.indiatvnews.com/entertainment/news/pm-modi-suvendu-adhikari-pay-tribute-to-uttam-kumar-on-his-100th-birth-anniversary-2026-09-03-1053157", usedFor: "3 September 2026 tributes." },
  { name: "Indiablooms — \"Uttam Kumar at 100: The making of Bengal's 'Mahanayak'\"", url: "https://www.indiablooms.com/showbiz/uttam-kumar-at-100-the-making-of-bengals-mahanayak/details", usedFor: "Career and legacy retrospective." },
  { name: "Social News XYZ — Birth Centenary Celebrations gallery", url: "https://www.socialnews.xyz/2026/09/03/kolkata-uttam-kumar-birth-centenary-celebrations-gallery/", usedFor: "Visual record of the 3 September events." },
];

export const BOOK_SOURCES: Source[] = [
  {
    name: "Sayandeb Chowdhury, Uttam Kumar: A Life in Cinema (Bloomsbury, 2021)",
    url: "https://sayandeb.in/books/uttam-kumar-a-life-in-cinema/",
    usedFor: "Bibliography entry and framing of the book's critical approach.",
  },
];

export const OPEN_QUESTIONS: string[] = [
  "The exact commonly-cited count of Uttam Kumar–Suchitra Sen films together (usually given as 'around 30') has not been independently reconstructed title-by-title on this site — see /uttamkumar/suchitra.",
  "Full box-office figures for most 1950s–70s Bengali releases are not independently audited anywhere; 'highest-grossing' and 'blockbuster' claims here follow the framing used consistently across Wikipedia, Film Companion and Times of India retrospectives, not a verified box-office database.",
  "Only the ~44 films with a documented synopsis on this site (see films.ts) carry individual pages; the remaining acting credits are listed by year and role only, deliberately, rather than filled in with invented plot summaries.",
];
