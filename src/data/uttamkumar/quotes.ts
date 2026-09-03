export interface Quote {
  en: string;
  speaker: string;
  source: string;
}

/** Attributed as reported in the press/Wikipedia rather than traced to a
 *  primary interview transcript for each — noted honestly per entry. */
export const QUOTES: Quote[] = [
  {
    en: "If Uttam Kumar committed a crime and then he gave that smile, I was ready to believe he was innocent.",
    speaker: "Soumitra Chatterjee",
    source: "widely quoted retrospective assessment, as reported in English Wikipedia's Uttam Kumar article",
  },
  {
    en: "There was no other actor at his time to match his popularity.",
    speaker: "Satyajit Ray",
    source: "on directing him in Nayak and Chiriyakhana, as reported in English Wikipedia's Uttam Kumar article",
  },
  {
    en: "Uttam Kumar is the original guru. The great actor.",
    speaker: "Amitabh Bachchan",
    source: "as reported in English Wikipedia's Uttam Kumar article",
  },
  {
    en: "There is no one who can ever represent the Bengali community like Uttamda did.",
    speaker: "Rajesh Khanna",
    source: "as reported in English Wikipedia's Uttam Kumar article",
  },
  {
    en: "Uttam was the best of our entire lot. A truly clean person.",
    speaker: "Dilip Kumar",
    source: "as reported in English Wikipedia's Uttam Kumar article",
  },
  {
    en: "I personally felt that the acting of Uttam Kumar could be compared to the best actor of any country. His great attribute is his diligence.",
    speaker: "Tapan Sinha",
    source: "as reported in English Wikipedia's Uttam Kumar article",
  },
];
