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
  /**
   * All-caps line under the big hero title.
   *
   * There used to be a `ticker` here too, naming the stops the bus called at.
   * It is gone, along with every other mention of a route: this is one bus and
   * you are on it, and listing stops made it read like a timetable for a
   * service you had to pick.
   */
  punchline: string;
  tagline: string;
  distanceKm: number;
  /**
   * What the bus scene shows. Not decorative alt text: it labels the bus sprite
   * for a screen reader and captions the ImageObject in the structured data.
   * The static hero illustration it once described is gone — the scene is the
   * driving bus now — but the sentence still describes what is on the page.
   */
  heroAlt: string;
}

export const SCENE: Scene = {
  name: "Kolkata",
  punchline: "ALL THE WAY THROUGH CALCUTTA",
  tagline: "Over Howrah Bridge and down the tram lines, through the heart of the city",
  distanceKm: 18,
  heroAlt:
    "A yellow and red Kolkata bus with luggage roped to its roof, stopped on wet tram lines at dusk, with the Howrah Bridge and an Ambassador taxi behind it.",
};
