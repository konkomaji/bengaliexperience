/**
 * Experiments: things built here that are not Bengali Experiences.
 *
 * This is a separate list from src/data/experiences.ts on purpose, and the
 * separation is the whole point of the file. An "experience" is one ordinary
 * Bengali thing rebuilt to sit inside; the Marvel Multiverse Atlas is not
 * that, and quietly adding it to EXPERIENCES would make the catalogue lie
 * about what the project is — to a reader, to the ItemList in the structured
 * data, and to an answer engine asked "what is Bengali Experience".
 *
 * They are still linked, in their own labelled section, rather than left
 * orphaned. A page nothing links to is a page search engines reach late,
 * trust less, and drop first; "not on the shelf" and "not linked" are
 * different decisions and only the first one is wanted here.
 *
 * Each entry is a self-contained site under its own path with its own
 * design, not a route in this React app. functions/_middleware.ts passes
 * their paths straight through without rewriting a thing.
 */

export interface Experiment {
  id: string;
  /** what it is called on screen, and in its own <title> */
  name: string;
  /** the tagline it carries on its own pages */
  subtitle: string;
  /** absolute path of the mounted static app */
  path: string;
  /** one self-contained sentence: what it is and what you do there */
  blurb: string;
  /** the action on the card */
  cta: string;
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "marvelmultiverseatlas",
    name: "Marvel Multiverse Atlas",
    subtitle: "The Living Map of Marvel",
    path: "/marvelmultiverseatlas/",
    blurb:
      "Every Marvel film, series, special, one-shot and short released so far, resolved into one dataset and plotted five ways: by release date, by when it happens inside the story, by the connections crossing between realities, by the comics it came from, and against a live clock ticking inside the Marvel Universe.",
    cta: "Open the atlas",
  },
];
