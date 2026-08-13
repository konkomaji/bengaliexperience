/**
 * The bus, and the one place it drives through.
 *
 * There used to be four of these, one per famous West Bengal bus route, and
 * changing route changed the scenery and rerolled the playlist. It was a
 * feature that cost more than it earned: four pages competing for the same
 * search intent, four illustrations to keep in step, and a chooser sitting on
 * top of an experience whose whole point is that you do not choose, you just
 * get on. One bus, one city, one night.
 *
 * Kolkata is the one that stayed, because it is the one the music is about.
 */

export interface Scene {
  name: string;
  /** small caps line under the wordmark */
  ticker: string;
  /** all-caps punchline under the big hero title */
  punchline: string;
  tagline: string;
  distanceKm: number;
  /** hero illustration in /public/hero/ */
  hero: string;
  /**
   * What the illustration shows. Not decorative alt text: this image is the
   * entire visual content of the page, so the same sentence serves the screen
   * reader, the social card and the ImageObject in the structured data.
   */
  heroAlt: string;
}

export const SCENE: Scene = {
  name: "Kolkata",
  ticker: "Howrah · Esplanade · Gariahat",
  punchline: "ALL NIGHT IN THE CITY",
  tagline: "Over Howrah Bridge and down the tram lines, through the heart of the city",
  distanceKm: 18,
  hero: "/hero/hero-kolkata.jpg",
  heroAlt:
    "A yellow and red Kolkata bus with luggage roped to its roof, stopped on wet tram lines at dusk, with the Howrah Bridge and an Ambassador taxi behind it.",
};
