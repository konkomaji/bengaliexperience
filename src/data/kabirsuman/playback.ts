/**
 * Verified YouTube identifiers, filled in by hand as they are confirmed.
 *
 * Deliberately empty-by-default rather than guessed: a wrong video ID plays
 * the wrong song, which is worse than a song with no player at all. Every
 * key here was checked against a real fetch (the video exists, is public,
 * and is the song it claims to be) before being added — see
 * public/kabirsuman/sources.json for what was checked and when.
 *
 * `SongPlayer` (src/components/kabirsuman/SongPlayer.tsx) falls back to a
 * plain "search on YouTube" link for any song not listed here, so the site
 * ships correctly with a partial list and grows as more are confirmed.
 */

/** song slug -> a verified, embeddable YouTube video id */
export const SONG_VIDEO: Record<string, string> = {
  "tomake-chai": "JZ1CReueASQ",
  "petokati-chandiyal": "_vP7lB2rOSA",
  "dosh-phut-bai-dosh-phut": "2tLBBBdwfc0",
  "chaichhi-tomar-bondhuta": "crtNIi70BNU",
  jatismor: "CIsNYA4ZMuo",
  "khodar-kosom-jan-2014": "6tpdQT4uGeU",
  "mon-kharap-kora": "wrEVq5Qm6tk",
  "chena-dukh-chena-sukh": "RCdWGmZ4svU",
  "amader-jonj": "_K1tKnu48Ps",
  "prothom-sobokichhu": "jLzFDT9NQYs",
  "sabas-pulish": "_bYiWsvupTM",
};

/** album slug -> a verified YouTube playlist id covering that album */
export const ALBUM_PLAYLIST: Record<string, string> = {};

/** Kabir Suman's own or an official label channel, for the "more" link */
export const OFFICIAL_CHANNELS: { name: string; url: string }[] = [
  { name: "Saregama Bengali", url: "https://www.youtube.com/channel/UCRh-4WUJx8M86gUYL2pyKSQ" },
  { name: "T-Series Bangla", url: "https://www.youtube.com/channel/UCPH9W_9ZDQ1gemcCaIxOvCw" },
];
