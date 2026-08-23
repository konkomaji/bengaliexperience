/**
 * Tributes: a third shelf, distinct from both the others.
 *
 * EXPERIENCES (src/data/experiences.ts) put you inside one recurring Bengali
 * moment — a bus ride, a broadcast — something anyone's version of Bengali
 * life contains. EXPERIMENTS (src/data/experiments.ts) are the same way of
 * building pointed at something that is not Bengali at all. A tribute is
 * neither: it is a reference built around one real person's whole body of
 * work, which is Bengali culture in the most direct sense but is not a
 * moment you sit inside — it is a catalogue you go looking through.
 *
 * Linked from the home page, in its own section, the way the Atlas is linked
 * under "Also built here" rather than folded into a shelf whose ItemList
 * would otherwise misdescribe what it is. Not on the EXPERIENCES shelf, and
 * not called an experiment either.
 */

export interface Tribute {
  id: string;
  name: string;
  subtitle: string;
  path: string;
  blurb: string;
  cta: string;
}

export const TRIBUTES: Tribute[] = [
  {
    id: "kabirsuman",
    name: "Kabir Suman",
    subtitle: "The complete works, catalogued",
    path: "/kabirsuman",
    blurb:
      "Every album, every lyric the archive holds, and the life around them — the journalist and broadcaster before the songwriter, the politics inside the songs, the late turn to Bengali khayal — for the man who is usually credited with starting jibonmukhi gaan on his own.",
    cta: "Open the archive",
  },
];
