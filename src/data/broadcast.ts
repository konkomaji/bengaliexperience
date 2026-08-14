/**
 * The Mahalaya broadcast, loaded natively from YouTube the same way the bus
 * loads its playlists: nothing is copied into the repo but an id, so the audio
 * streams from its upload and nothing is rehosted.
 *
 * This is *Mahishasuramardini* — the ninety-odd-minute Akashvani (All India
 * Radio) programme that has opened Mahalaya since the 1930s, Birendra Krishna
 * Bhadra reading the Chandi in the dark before dawn, between Bengali devotional
 * songs and orchestral pieces. Unlike the bus, it is not shuffled and it does
 * not start at a random point: it is a ritual you begin at the beginning and
 * sit through, and the scene's dawn is timed to its full length.
 *
 * `durationSec` is only a hint for the dawn's pacing before the player has
 * reported the real length; once the video is loaded the true duration takes
 * over. Set it close to the actual recording.
 */
export interface Broadcast {
  /** YouTube video id of the recording. */
  videoId: string;
  /** the programme's name */
  title: string;
  /** the voice everyone knows it by */
  reader: string;
  /** who carried it, and since when */
  broadcaster: string;
  /** the canonical recording's year */
  year: number;
  /** rough length in seconds, a fallback until the player reports the real one */
  durationSec: number;
  /** the IST hour it is heard at, so the sky can start where the real one does */
  startHour: number;
}

export const BROADCAST: Broadcast = {
  videoId: "A-nMCu2y_PM",
  title: "Mahishasuramardini",
  reader: "Birendra Krishna Bhadra",
  broadcaster: "Akashvani, All India Radio",
  year: 1966,
  durationSec: 5152, // 1:25:52
  /** when the broadcast is heard, and where the sun is by the end of it. */
  startHour: 4, // 4:00 a.m. IST, lights off
};

/** Whether a real recording is wired up yet. */
export const HAS_BROADCAST = BROADCAST.videoId.length > 0;

/**
 * When Durga Puja proper begins this year, in IST. Mahalaya is the countdown's
 * start; this is what it counts down to. Update it each year.
 */
export const PUJA_START = "2026-10-16T00:00:00+05:30";

