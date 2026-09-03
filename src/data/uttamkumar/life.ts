/**
 * A chronological life, cross-checked against English Wikipedia's Uttam
 * Kumar article, contemporary press coverage of the 2026 centenary, and
 * Sayandeb Chowdhury's Uttam Kumar: A Life in Cinema (Bloomsbury, 2021) —
 * see /uttamkumar/sources for what each entry rests on.
 *
 * This includes the parts a tribute page can be tempted to leave out: two
 * marriages he never resolved with a divorce, the persistent Suchitra Sen
 * rumor, and the one real public controversy of his career (the 1976 radio
 * reading). Marked `sensitive` rather than omitted — see /uttamkumar/life's
 * "Beyond the Screen" section, and src/data/uttamkumar/suchitra.ts for the
 * rumor's own fuller treatment.
 */
export interface LifeEvent {
  year: number;
  date?: string;
  headline: string;
  detail?: string;
  dispute?: string;
  era: "early-life" | "the-struggle" | "stardom" | "personal" | "final-years" | "posthumous";
  /** surfaced in "Beyond the Screen" as well as the main timeline — the
   *  candid, not-purely-celebratory material */
  sensitive?: boolean;
}

export const LIFE_EVENTS: LifeEvent[] = [
  {
    year: 1926,
    date: "3 September",
    headline: "Born Arun Kumar Chattopadhyay, in Ahiritola, north Calcutta.",
    detail:
      "Father Satkari Chattopadhyay was a projectionist at Metro Cinema; mother Chapala Devi kept house. His maternal grandfather's pet name for him, \"Uttam,\" became the name a nation would know him by.",
    era: "early-life",
  },
  {
    year: 1936,
    headline: "Co-founds a school theatre troupe, the Lunar Club, staging Tagore's Mukut.",
    era: "early-life",
  },
  {
    year: 1942,
    headline: "Matriculates from South Suburban School, then studies commerce at Government Commercial College.",
    era: "early-life",
  },
  {
    year: 1947,
    headline: "First film work: an uncredited extra in the unreleased Hindi film Maya Dore.",
    era: "early-life",
  },
  {
    year: 1948,
    date: "1 June",
    headline: "Marries Gauri Chatterjee.",
    detail: "A son, Gautam, is born on 7 September 1950.",
    era: "personal",
  },
  {
    year: 1948,
    headline: "Screen debut, credited as Arun Kumar Chattopadhyay, in Drishtidan.",
    era: "the-struggle",
  },
  {
    year: 1951,
    headline: "Adopts the name Uttam Kumar for good, in Sahajatri, on the advice of actor Pahari Sanyal.",
    detail:
      "A string of failures under his birth name and two earlier stage names (\"Uttam Chatterjee,\" \"Arup Kumar\") had already earned him the nickname \"Flop Master General.\" He kept working as a clerk at Calcutta Port Trust throughout.",
    era: "the-struggle",
  },
  {
    year: 1952,
    headline: "Basu Paribar is a hit; he resigns his clerk's job at the Port Trust to act full time.",
    era: "the-struggle",
  },
  {
    year: 1953,
    headline: "Sharey Chuattor, his first film with Suchitra Sen, becomes the year's highest-grossing Bengali release.",
    era: "stardom",
  },
  {
    year: 1954,
    date: "3 September",
    headline: "Agni Pariksha, released on his 28th birthday, fixes the Uttam-Suchitra pairing as a genre of its own.",
    era: "stardom",
  },
  {
    year: 1959,
    headline: "The film magazine Ultorath first calls him \"Mahanayak\" — the great hero.",
    era: "stardom",
  },
  {
    year: 1963,
    headline: "Marries Supriya Devi.",
    dispute:
      "He never divorced Gauri Chatterjee. Both relationships continued, unresolved, for the rest of his life — reported here plainly rather than smoothed into a simple remarriage.",
    era: "personal",
    sensitive: true,
  },
  {
    year: 1967,
    headline: "First-ever recipient of the National Film Award for Best Actor, for Antony Firingee and Chiriyakhana.",
    detail: "The award's inaugural year.",
    era: "stardom",
  },
  {
    year: 1968,
    headline: "Leaves the actors' body Abhinetri Sangha to found Shilpi Sangshad, aiding poor artists and technicians.",
    detail: "Serves as its president until his death, working in its productions without salary.",
    era: "personal",
  },
  {
    year: 1974,
    headline: "Amanush becomes the biggest hit of his career — a run of 96-plus weeks.",
    era: "stardom",
  },
  {
    year: 1975,
    headline: "All six of his releases that year are box-office successes.",
    era: "stardom",
  },
  {
    year: 1976,
    headline: "Reads the Mahalaya Chandi Path on All India Radio, replacing Birendra Krishna Bhadra — and is met with public backlash.",
    detail:
      "Audience anger over the substitution led Kumar to apologise publicly and Bhadra was reinstated. The episode later inspired the 2019 film Mahalaya, with Jishu Sengupta playing Kumar.",
    era: "personal",
    sensitive: true,
  },
  {
    year: 1979,
    headline: "Organises and captains a charity cricket match for 1978 flood relief, against a Bombay film industry team led by Dilip Kumar.",
    era: "personal",
  },
  {
    year: 1980,
    date: "23 July",
    headline: "Falls seriously ill on the set of Ogo Bodhu Shundori; admitted to Belle Vue Clinic in the early hours.",
    era: "final-years",
  },
  {
    year: 1980,
    date: "24 July",
    headline: "Dies at Belle Vue Clinic, aged 53.",
    detail:
      "Anandabazar Patrika's headline the next day: \"Cholochitre Indrapatan\" — cinema loses its titan. Ogo Bodhu Shundori, Kalankini Kankabati and several other films were completed and released posthumously.",
    era: "final-years",
  },
  {
    year: 1993,
    headline: "The Government of West Bengal erects a statue of him at Tollygunge.",
    era: "posthumous",
  },
  {
    year: 2009,
    headline: "Tollygunge Metro station is renamed Mahanayak Uttam Kumar Metro Station; a postage stamp marks his 83rd birth anniversary.",
    era: "posthumous",
  },
  {
    year: 2012,
    headline: "The Government of West Bengal institutes the Mahanayak Samman, a lifetime achievement award in Bengali cinema.",
    era: "posthumous",
  },
  {
    year: 2024,
    headline: "Oti Uttam gives him a new, VFX-composited performance built from 54 of his old films — his first screen appearance in 37 years.",
    era: "posthumous",
  },
  {
    year: 2026,
    date: "3–6 September",
    headline: "\"Satabarshe Mahanayak: A Century of Stardom\": the West Bengal government's four-day birth-centenary programme.",
    detail:
      "Statues garlanded at Tollygunge and Ahiritola; a film festival at Nandan and Radha Studio opening with Ray's Nayak; the foundation stone laid for a new Uttam Kumar Film Centre in New Town; a commemorative postal cover, book and coin announced. See /uttamkumar/centenary for the full programme.",
    era: "posthumous",
  },
];

export const SENSITIVE_EVENTS = LIFE_EVENTS.filter((e) => e.sensitive);
