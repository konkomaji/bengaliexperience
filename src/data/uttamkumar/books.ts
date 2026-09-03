/**
 * The reading room: what he wrote, and what's been written about him. No
 * cover scans — the one substantial modern biography is a 2021 Bloomsbury
 * title still under copyright, so it's cited, not pictured. See
 * /uttamkumar/sources for how each entry here was checked.
 */
export interface Book {
  title: string;
  titleBn?: string;
  author: string;
  year: number;
  kind: "autobiography" | "biography";
  note: string;
  /** true if never completed/published in full during his lifetime */
  unfinished?: boolean;
  link?: string;
}

export const BOOKS: Book[] = [
  {
    title: "Aamar Ami",
    titleBn: "আমার আমি",
    author: "Uttam Kumar",
    year: 1972,
    kind: "autobiography",
    unfinished: true,
    note:
      "His own attempt at an autobiography, begun and left incomplete — one of two such manuscripts he started and never finished.",
  },
  {
    title: "Harano Dinguli Mor",
    titleBn: "হারিয়ে যাওয়া দিনগুলি মোর",
    author: "Uttam Kumar",
    year: 2013,
    kind: "autobiography",
    unfinished: true,
    note:
      "A second, later autobiographical manuscript, begun around 1960–61 and also left unfinished. Its original pages were reportedly stolen on the day of his death and recovered years later for publication at the 2010 Kolkata Book Fair.",
  },
  {
    title: "Uttam Kumar: A Life in Cinema",
    author: "Sayandeb Chowdhury",
    year: 2021,
    kind: "biography",
    note:
      "Published by Bloomsbury — described as the first definitive cultural and critical biography of Uttam Kumar, placing his star persona inside the post-Partition Bengali bhadralok world rather than treating his career as a list of hits.",
    link: "https://www.bloomsbury.com/in/uttam-kumar-9789390358939/",
  },
];
