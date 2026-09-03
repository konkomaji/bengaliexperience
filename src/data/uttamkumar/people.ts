/**
 * The recurring names — directors and co-stars whose collaboration with him
 * was substantial enough to be a subject of its own, not a cast credit.
 * Suchitra Sen gets a dedicated page (src/data/uttamkumar/suchitra.ts,
 * /uttamkumar/suchitra) rather than an entry here — this is everyone else.
 */
export interface Collaborator {
  name: string;
  role: string;
  blurb: string;
  filmSlugs: string[];
}

export const COLLABORATORS: Collaborator[] = [
  {
    name: "Satyajit Ray",
    role: "Director",
    blurb:
      "Two films only, but they bookend how seriously art cinema was willing to take him: Nayak (1966), written with Uttam Kumar specifically in mind, and Chiriyakhana (1967), casting him as detective Byomkesh Bakshi. Ray called him simply \"a real star\" — no contemporary matched his popularity.",
    filmSlugs: ["nayak-1966", "chiriyakhana-1967"],
  },
  {
    name: "Tapan Sinha",
    role: "Director",
    blurb:
      "Four films across a decade, moving him furthest from the matinee-idol image: an amnesiac patient in Hrad, an ageing servant in Khokababur Pratyabartan, a swashbuckling triple role in Jhinder Bondi, a collapsing marriage in Jatugriha.",
    filmSlugs: ["khokababur-pratyabartan-1960", "jhinder-bondi-1961", "jatugriha-1964"],
  },
  {
    name: "Soumitra Chatterjee",
    role: "Co-star",
    blurb:
      "Bengali cinema's other titan of the same decades, and the pairing critics and audiences never stopped measuring against each other. Jhinder Bondi (1961) was their first major screen pairing. Soumitra's own verdict on him: \"If Uttam Kumar committed a crime and then he gave that smile, I was ready to believe he was innocent.\"",
    filmSlugs: ["jhinder-bondi-1961"],
  },
  {
    name: "Hemanta Mukherjee",
    role: "Playback singer",
    blurb:
      "Not a co-star but the voice audiences heard as his for two decades of musical romances — Shap Mochan (1955) onward — a pairing of face and voice so complete that Bengali audiences treated it as one performer.",
    filmSlugs: ["shap-mochan-1955"],
  },
  {
    name: "Supriya Devi",
    role: "Co-star and, from 1963, wife",
    blurb:
      "His co-star from his first hit, Basu Paribar (1952), through to the films he was still making in 1980 — and, from 1963, his second wife, a marriage he never formalised a divorce to make possible (see /uttamkumar/life).",
    filmSlugs: ["basu-paribar-1952", "bon-palashir-padabali-1973"],
  },
];
