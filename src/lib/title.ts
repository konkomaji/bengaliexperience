/**
 * YouTube titles arrive stuffed with promo furniture —
 * "Song | Official Video | Movie | Singer | Label 2019 | 4K". Playlists are
 * user-curated so there's no clean metadata to fall back on; this trims the
 * noise down to something that fits a player bar.
 */

/** segments that are never the song name */
const JUNK = /^(official|full|hd|4k|lyrical|lyric|audio|video|song|new|latest|exclusive|music|teaser|promo|trailer|reprise|cover|bengali|bangla|movie|film|jukebox|status|remix|version|feat\.?.*|ft\.?.*|\d{4})\b/i;

const BRACKETS = /\s*[([【][^)\]】]*[)\]】]/g;

/** Strip bracketed asides and trailing label/format noise. */
export function cleanTitle(raw: string): string {
  if (!raw) return "";
  const parts = raw
    .replace(BRACKETS, "")
    .split(/[|•·–—]/)
    .map((p) => p.trim())
    .filter(Boolean);

  // the first segment that isn't obvious furniture is almost always the song
  const name = parts.find((p) => !JUNK.test(p)) ?? parts[0] ?? raw;
  return name.replace(/\s{2,}/g, " ").trim();
}

/**
 * Best-effort split of a YouTube title into song + artist.
 *
 * Falls back to the channel name for the artist, which for label channels
 * ("Saregama Bengali", "SVF") is at least truthful about the source.
 */
export function splitTitle(raw: string, author: string): { title: string; artist: string } {
  if (!raw) return { title: "", artist: author ?? "" };

  const segments = raw
    .replace(BRACKETS, "")
    .split(/[|•·–—]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const title = cleanTitle(raw);

  // look for a segment that reads like a performer credit
  const credit = segments.find(
    (s) => s !== title && !JUNK.test(s) && /^[\p{L}\s.'&,-]{3,40}$/u.test(s),
  );

  const channel = (author ?? "").replace(/\s*-\s*Topic$/i, "").trim();
  return { title, artist: credit ?? channel };
}
