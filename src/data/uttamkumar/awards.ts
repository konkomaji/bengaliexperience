export interface Award {
  year: number;
  award: string;
  film?: string;
  note?: string;
}

export const NATIONAL_AWARDS: Award[] = [
  { year: 1957, award: "Certificate of Merit, Third Best Feature Film in Bengali", film: "Harano Sur", note: "As producer." },
  { year: 1961, award: "Certificate of Merit, Second Best Feature Film in Bengali", film: "Saptapadi", note: "As producer." },
  { year: 1963, award: "Best Feature Film in Bengali", film: "Uttar Falguni", note: "As producer." },
  { year: 1963, award: "Third Best Feature Film in Bengali", film: "Jatugriha", note: "As producer." },
  {
    year: 1967,
    award: "National Film Award for Best Actor",
    film: "Antony Firingee and Chiriyakhana",
    note: "The very first year the category existed — he was its first-ever recipient.",
  },
];

export const BFJA_AWARDS: Award[] = [
  { year: 1955, award: "BFJA Award for Best Actor", film: "Hrad" },
  { year: 1962, award: "BFJA Award for Best Actor", film: "Saptapadi" },
  { year: 1967, award: "BFJA Award for Best Actor", film: "Nayak" },
  { year: 1968, award: "BFJA Award for Best Actor", film: "Grihadaha" },
  { year: 1972, award: "BFJA Award for Best Actor", film: "Ekhane Pinjar" },
  { year: 1973, award: "BFJA Award for Best Actor", film: "Stree" },
  { year: 1975, award: "BFJA Award for Best Actor", film: "Amanush" },
  { year: 1976, award: "BFJA Award for Best Actor", film: "Banhishikha", note: "An eighth win — a record at the time." },
];

export const FILMFARE_AWARDS: Award[] = [
  { year: 1975, award: "Filmfare Award for Best Actor (East)", film: "Amanush" },
  { year: 1976, award: "Filmfare Special Award", film: "Amanush" },
  { year: 1978, award: "Filmfare Award for Best Actor (East)", film: "Dhanraj Tamang" },
];

export const POSTHUMOUS_HONORS: { year: number; honor: string; detail: string }[] = [
  { year: 1993, honor: "Statue, Tollygunge", detail: "Erected by the Government of West Bengal." },
  {
    year: 2009,
    honor: "Mahanayak Uttam Kumar Metro Station",
    detail: "Tollygunge Metro station renamed in his honour, with a life-size statue installed nearby; a postage stamp released the same year for his 83rd birth anniversary.",
  },
  {
    year: 2012,
    honor: "Mahanayak Samman",
    detail: "A lifetime-achievement award in Bengali cinema, instituted by the Government of West Bengal, presented annually on his death anniversary.",
  },
  { year: 2019, honor: "Statue, Ahiritola", detail: "Inaugurated at his birthplace on Ahiritola Street by Kolkata's mayor." },
  { year: 2020, honor: "Statue, Bardhaman", detail: "Installed on his 94th birth anniversary." },
  {
    year: 2026,
    honor: "Uttam Kumar Film Centre (planned)",
    detail: "Foundation stone laid in New Town during the birth-centenary programme; a commemorative postal cover, book and coin were also released. See /uttamkumar/centenary.",
  },
];
