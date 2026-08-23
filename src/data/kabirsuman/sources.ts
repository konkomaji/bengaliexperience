/**
 * What this section rests on, and what to check it against.
 *
 * Not a bibliography for its own sake: the point of naming sources here is
 * that a reader — or a future edit — can tell a corrected fact from an
 * archive fact from an inference, and check any of the three.
 */

export interface Source {
  name: string;
  url: string;
  usedFor: string;
}

export const PRIMARY_SOURCES: Source[] = [
  {
    name: "sumanami.co.uk",
    url: "https://sumanami.co.uk",
    usedFor:
      "Every lyric text and every album cover image on this site. A fan-run archive, not Kabir Suman's own site — read via its public WordPress API, which lists 30 album categories and 452 posts, 317 of them song lyrics.",
  },
];

export const CROSS_CHECKED: Source[] = [
  { name: "English Wikipedia — Kabir Suman", url: "https://en.wikipedia.org/wiki/Kabir_Suman", usedFor: "Biography, discography years, awards" },
  { name: "English Wikipedia — Kabir Suman's recorded albums", url: "https://en.wikipedia.org/wiki/Kabir_Suman%27s_recorded_albums", usedFor: "Track lists, album years" },
  { name: "Bengali Wikipedia — কবীর সুমন", url: "https://bn.wikipedia.org/wiki/কবীর_সুমন", usedFor: "Discography, awards, biography, cross-checked against the English article" },
  { name: "Scroll.in — how Tomake Chai caused a culture quake", url: "https://scroll.in/article/1040994", usedFor: "The 1992 debut: how it was recorded, its songs, the Pete Seeger connection" },
];

/**
 * Where sources genuinely disagree, or a widely repeated claim could not be
 * verified. Named plainly rather than smoothed over — see the `dispute`
 * fields in src/data/kabirsuman/life.ts and albums.ts for where each of
 * these actually surfaces.
 */
export const OPEN_QUESTIONS: string[] = [
  "The year Kabir Suman returned to Kolkata from Germany, and how that squares with a second stretch in Germany reported for 1986–89.",
  "The exact year and stated cause of his conversion to Islam — sources differ between 1999 (framed as protest) and 2000 (framed as tied to his marriage).",
  "Whether Jabo Ochenaye was released in 2000 or 2001 — the archive and Bengali Wikipedia say 2000, English Wikipedia's album list says 2001.",
  "Whether Dekhchhi Toke was released in 2004 or 2005 — English Wikipedia's album list says 2004, the archive says 2005.",
  "Whether হাল ছেড়ো না বন্ধু has a documented history of use at specific protest movements, or whether that association is reputation without a citable source.",
];
