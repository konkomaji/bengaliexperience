export type Era = "retro" | "90s" | "2000s" | "2010s" | "2020s";

export type Mood =
  | "nostalgic"
  | "romantic"
  | "upbeat"
  | "melancholy"
  | "adda"
  | "rain"
  | "road";

export interface Song {
  id: string;
  title: string;
  titleRomanized: string;
  artist: string;
  youtubeId: string;
  publisher: string;
  year: number;
  era: Era;
  mood: Mood;
}

export const ERA_LABELS: Record<Era, string> = {
  retro: "Retro",
  "90s": "'90s",
  "2000s": "2000s",
  "2010s": "2010s",
  "2020s": "2020s",
};
