/**
 * Can the embedded player actually load this playlist?
 *
 * Two kinds of list look perfectly fine in a browser tab and are refused by
 * the IFrame player with `onError` 150 and an empty tracklist: lists created
 * in **YouTube Music**, and lists that are Unlisted or Private. Neither is
 * visible from the id, and finding out by loading it costs seconds of silence
 * while the visitor stares at "Boarding…".
 *
 * YouTube's oEmbed endpoint answers 200 for exactly the lists the embed will
 * take, 401 for the rest, and it allows cross-origin reads — so one ~100ms
 * request tells us up front. Answers are cached per id for the session.
 *
 * A network failure resolves to `true` on purpose: when in doubt, let the
 * player try. Being offline should not look like a broken playlist.
 */
const cache = new Map<string, Promise<boolean>>();

/** 401 unlisted/private/YouTube-Music · 403 blocked · 404 gone */
const REFUSED = new Set([401, 403, 404]);

export function canEmbedPlaylist(id: string): Promise<boolean> {
  let hit = cache.get(id);
  if (!hit) {
    const url =
      "https://www.youtube.com/oembed?format=json&url=" +
      encodeURIComponent(`https://www.youtube.com/playlist?list=${id}`);
    // Only the "we won't serve this" answers count as refused. A 429 or a 5xx
    // says something about YouTube's mood, not about the playlist, and must
    // not get cached as a dead list for the rest of the session.
    hit = fetch(url)
      .then((r) => (REFUSED.has(r.status) ? false : true))
      .catch(() => true);
    cache.set(id, hit);
  }
  return hit;
}
