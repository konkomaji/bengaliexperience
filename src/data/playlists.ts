/**
 * The source playlists, curated on YouTube and loaded natively by the player.
 *
 * Nothing is copied into this repo but the ids: the player loads each list
 * with `listType: "playlist"`, so adding a song on YouTube shows up on the
 * site immediately with no redeploy.
 *
 * **There is one list right now.** There were nine, and seven of them were
 * made in YouTube Music, which means the IFrame player silently refuses them
 * (see below). A site that advertises nine playlists and can actually play two
 * is lying to its visitors, so the shelf is honest instead: one list that
 * definitely works, shuffled fresh on every visit. The array shape stays
 * because more will be added back, and every piece of machinery around it,
 * weighted opening pick, roll-on-death, the queue chips, keeps working
 * unchanged whether there is one entry or nine.
 *
 * Each list must be **Public** on YouTube. Unlisted opens fine from a share
 * link, so it looks correct, but the IFrame player refuses an unlisted list
 * with error 150 and loads no tracks at all. `usePlayerEngine` detects that
 * and rolls to another list, so the site keeps playing. See the README's
 * "Playlist visibility" section for the one-line curl check.
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
   * `PL…` id and opens fine on youtube.com, but the IFrame player refuses it,
   * so this is the first thing to check when one never plays.
   * `npm run check:playlists` tells you which are which.
   */
  source: "youtube" | "ytmusic";
}

export const PLAYLISTS: PlaylistDef[] = [
  {
    id: "PLSM1cw8guacZUvwhGL6F651j1skSEdjKw",
    label: "OG Kumar Sanu",
    youtubeTitle: "KUMAR SANU SPECIAL BENGALI SONGS",
    approxTracks: 93,
    source: "youtube",
  },
];

export const TOTAL_TRACKS = PLAYLISTS.reduce((n, p) => n + p.approxTracks, 0);

/** A different playlist for every visitor, on every load. */
export function randomPlaylist(exceptId?: string): PlaylistDef {
  const pool = exceptId ? PLAYLISTS.filter((p) => p.id !== exceptId) : PLAYLISTS;
  const from = pool.length ? pool : PLAYLISTS;
  return from[Math.floor(Math.random() * from.length)];
}
