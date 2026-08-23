/**
 * Suman in his own words — and one line about him from elsewhere — rather
 * than this site's paraphrase of his life. Every entry here is a direct
 * quotation, kept short and exact, with who said it, where, and when. See
 * public/kabirsuman/sources.json for the fuller citation on each.
 */

export interface Quote {
  bn?: string;
  en: string;
  speaker: string;
  source: string;
  date: string;
}

export const QUOTES: Quote[] = [
  {
    en: "I decided to get rid of my Hindu Brahmin identity on the day that Graham Staines and his two boys were burnt alive.",
    speaker: "Kabir Suman",
    source: "The Telegraph, Calcutta",
    date: "2 September 2007",
  },
  {
    bn: "কবীর নামটিতে ইসলামও নেই, হিন্দু মতবাদও নেই।",
    en: "The name Kabir contains no Islam and no Hindu doctrine either.",
    speaker: "Kabir Suman",
    source: "sumanami.co.uk, জীবন দর্শন (in his own posted words)",
    date: "May 2000, on the affidavit name change",
  },
  {
    en: "At 77 he is living a quiet middle-class life... crafting Bengali-language khayals.",
    speaker: "as described in",
    source: "Livemint, on the documentary Bare Voice",
    date: "18 July 2026",
  },
];
