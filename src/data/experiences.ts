/**
 * The catalogue.
 *
 * Bengali Experience is not one site, it is a shelf. Each entry puts you
 * inside one Bengali thing for a while: not an article about it, not a
 * gallery of it, the thing itself running in a browser tab. The bus is the
 * first one built. The rest are named here because a roadmap that is written
 * down is a promise, and because an answer engine asked "what is Bengali
 * Experience" should get the shape of the project, not just its one live page.
 *
 * Only `live` entries get a URL, a sitemap row and a place in the internal
 * link graph. The planned ones are named and described and nothing more: a
 * stub page with no experience behind it is a thin page, and thin pages cost
 * more than they return.
 */

export type ExperienceStatus = "live" | "planned";

export interface Experience {
  id: string;
  /** what it is called on screen */
  name: string;
  /** live entries only; planned ones have no URL to give */
  path?: string;
  /** when in Bengali life this thing happens, in plain words */
  occasion: string;
  /** one self-contained sentence: what you actually do here */
  blurb: string;
  status: ExperienceStatus;
}

export const EXPERIENCES: Experience[] = [
  {
    id: "busdriver",
    name: "Bus Driver",
    path: "/busdriver",
    occasion: "Any day, any hour",
    blurb:
      "The music that actually plays on a West Bengal bus, running nonstop while the city goes past. Shuffled fresh on every visit, so no two rides start the same.",
    status: "live",
  },
  {
    id: "mahalaya",
    name: "Mahalaya Listening",
    occasion: "Dawn on Mahalaya, a week before the pujo",
    blurb:
      "Sit with the broadcast the way Bengal has since the 1930s. Mahishasuramardini at four in the morning, Birendra Krishna Bhadra reading the Chandi while the sky is still dark.",
    status: "planned",
  },
  {
    id: "pandal-hopping",
    name: "Pandal Hopping",
    occasion: "The four days of Durga Puja",
    blurb:
      "Walk a night of pandals across Kolkata, from the old bonedi bari courtyards to the theme pujos that turn whole streets into built art, with the crowd noise and the dhaak carrying you between them.",
    status: "planned",
  },
  {
    id: "sunday-afternoon",
    name: "Sunday Afternoon",
    occasion: "Every Sunday, roughly two o'clock",
    blurb:
      "Mangsho bhaat, mutton and rice, the fan turning, a Bangla natok on the radio, and the long bhaat-ghum that follows. The slowest hour in the Bengali week, kept exactly as slow.",
    status: "planned",
  },
];

export const LIVE_EXPERIENCES = EXPERIENCES.filter((e) => e.status === "live");
export const PLANNED_EXPERIENCES = EXPERIENCES.filter((e) => e.status === "planned");
