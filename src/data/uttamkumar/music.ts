/**
 * The three credits Wikipedia's own filmography article lists under
 * "As playback singer and composer" — a small, real set, not padded out.
 * Most of what people call "his songs" are really Hemanta Mukherjee singing
 * playback for him on screen (see the shap-mochan-1955 note in films.ts);
 * these three are the credits where Uttam Kumar himself is the singer or
 * composer of record.
 */
export interface MusicCredit {
  year: number;
  film: string;
  role: "playback singer" | "composer";
  note: string;
}

export const MUSIC_CREDITS: MusicCredit[] = [
  {
    year: 1956,
    film: "Nabajanma",
    role: "playback singer",
    note: "His only screen playback-singing credit, six verses of Vaishnava Padavali.",
  },
  {
    year: 1966,
    film: "Kal Tumi Aleya",
    role: "composer",
    note: "His composing debut, for a film he also directed uncredited.",
  },
  {
    year: 1977,
    film: "Sabyasachi",
    role: "composer",
    note: "Credited alongside Rabindranath Tagore, Kazi Nazrul Islam and Dwijendralal Ray on the same soundtrack.",
  },
];
