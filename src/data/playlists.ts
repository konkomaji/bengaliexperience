/**
 * The source playlists — curated on YouTube, loaded natively by the player.
 *
 * Nothing is copied into this repo but the ids: the player loads each list
 * with `listType: "playlist"`, so adding a song on YouTube shows up on the
 * site immediately with no redeploy.
 *
 * There is deliberately NO route→playlist mapping. On every page load a
 * playlist is picked at random and shuffled, so two people opening the site
 * at the same moment hear different things.
 *
 * Each list must be **Public** on YouTube. Unlisted opens fine from a share
 * link, so it looks correct — but the IFrame player refuses an unlisted list
 * with error 150 and loads no tracks at all. `usePlayerEngine` detects that
 * and rolls to another list, so the site keeps playing, but an unlisted
 * playlist is dead weight. See the README's "Playlist visibility" section for
 * the one-line curl check.
 */
export interface PlaylistDef {
  id: string;
  /** short label for the queue chips */
  label: string;
  /** the list's real title on YouTube, for reference */
  youtubeTitle: string;
  /** approximate track count at time of writing, for display only */
  approxTracks: number;
  /**
   * Where the list was made. A list created in YouTube Music has an ordinary
   * `PL…` id and opens fine on youtube.com, but the IFrame player refuses it
   * — so this is the first thing to check when one never plays.
   * `npm run check:playlists` tells you which are which.
   */
  source: "youtube" | "ytmusic";
}

export const PLAYLISTS: PlaylistDef[] = [
  { id: "PLWzyF_ApjghE", label: "Bengali Experience", youtubeTitle: "bengaliexperience", approxTracks: 1, source: "youtube" },
  { id: "PL4IRGlqSrXU7ivggI5cW7DgvX2q8v-wUs", label: "Life", youtubeTitle: "জীবনমুখী গান", approxTracks: 200, source: "youtube" },
  // Made in YouTube Music — these do not embed. Recreating each one as a
  // public playlist on youtube.com is what brings them back.
  { id: "PLnQRIdwY8diCFEi6ekCSm1u1EJ1J7-TTZ", label: "20's Bangers", youtubeTitle: "20's Bangla Bangers", approxTracks: 55, source: "ytmusic" },
  { id: "PLnQRIdwY8diCMRCkSXI1EGwQzt5uya1J1", label: "Aesthetics", youtubeTitle: "Bengali Aesthetics", approxTracks: 100, source: "ytmusic" },
  { id: "PLnQRIdwY8diA0LxQeemuQWFhItFix_ejO", label: "To You", youtubeTitle: "To You", approxTracks: 98, source: "ytmusic" },
  { id: "PLnQRIdwY8diBEpkTck_TeBRNS4Li6KDre", label: "Sleeping Pills", youtubeTitle: "Sleeping pills (Bengali)", approxTracks: 27, source: "ytmusic" },
  { id: "PLnQRIdwY8diBYtMHUxRUzYD7AK2yUe3y4", label: "Band Era", youtubeTitle: "Era of Bangla Bands", approxTracks: 54, source: "ytmusic" },
  { id: "PLnQRIdwY8diBdGXo-oIe3PVpnhc17-YhS", label: "(G)old Classics", youtubeTitle: "(G)old Bengali Classics", approxTracks: 43, source: "ytmusic" },
  { id: "PLnQRIdwY8diDj2qzl00YUcMQinJPTzzFs", label: "Evergreen", youtubeTitle: "Bengali Evergreen", approxTracks: 48, source: "ytmusic" },
];

export const TOTAL_TRACKS = PLAYLISTS.reduce((n, p) => n + p.approxTracks, 0);

/** A different playlist for every visitor, on every load. */
export function randomPlaylist(exceptId?: string): PlaylistDef {
  const pool = exceptId ? PLAYLISTS.filter((p) => p.id !== exceptId) : PLAYLISTS;
  const from = pool.length ? pool : PLAYLISTS;
  return from[Math.floor(Math.random() * from.length)];
}
