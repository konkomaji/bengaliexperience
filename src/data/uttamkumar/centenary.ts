/**
 * The living section: what is actually happening in 2026, dated, sourced,
 * built to be extended through the year rather than frozen at launch. Every
 * entry traces to a specific news source in sources.ts — this is reported
 * news, not the site's own guesswork about what a centenary "should" include.
 */
export interface CentenaryEvent {
  date: string;
  headline: string;
  detail: string;
  source: string;
}

export const CENTENARY_EVENTS: CentenaryEvent[] = [
  {
    date: "3–6 September 2026",
    headline: "\"Satabarshe Mahanayak: A Century of Stardom\" — the West Bengal government's official programme.",
    detail:
      "Opened 3 September with garlanding of his statues at Tollygunge and Ahiritola. A film festival at Nandan and Radha Studio opened with Satyajit Ray's Nayak. A programme at Rabindra Sadan felicitated Tollywood veterans.",
    source: "Millennium Post; The Week",
  },
  {
    date: "3 September 2026",
    headline: "Foundation stone laid for a new Uttam Kumar Film Centre in New Town.",
    detail: "A planned modern facility for film and cultural activities, alongside a separate renovation planned for Uttam Mancha, the South Kolkata auditorium already named after him.",
    source: "Millennium Post; Business Standard",
  },
  {
    date: "3 September 2026",
    headline: "Department of Posts releases a commemorative cover and a dedicated book.",
    detail: "A commemorative coin is also planned; the state government requested family photographs for its design.",
    source: "The Week",
  },
  {
    date: "3 September 2026",
    headline: "An exhibition of rare photographs, posters and memorabilia opens at Nandan and Gaganendra Shilpa Pradarshashala.",
    detail: "Drawn from across his career, alongside archival material from Bengali cinema of his era.",
    source: "The Week; Millennium Post",
  },
  {
    date: "3 September 2026",
    headline: "Prime Minister Narendra Modi and Leader of the Opposition Suvendu Adhikari pay public tribute.",
    detail: "Both posted homages marking the centenary; Modi's noted that his performances \"still strike a chord with audiences today.\"",
    source: "The Week",
  },
  {
    date: "Through 2026",
    headline: "Year-long programme: heritage walks, a midnight cake-cutting, open-air screenings.",
    detail: "Nostalgic walking tours of Kolkata sites associated with him, a midnight cake-cutting on his birthday, and open-air tributes screening selected films, planned to run across the centenary year rather than end with the September programme.",
    source: "The Statesman; Business Standard",
  },
];

export const CENTENARY_INTRO =
  "This page is dated on purpose. Uttam Kumar's hundredth birth anniversary fell on 3 September 2026 — this site went up the day after — and the state government's own commemoration is a year-long programme, not a single ceremony. What's below is what has actually happened and been reported, not a wishlist of what a centenary should include.";
