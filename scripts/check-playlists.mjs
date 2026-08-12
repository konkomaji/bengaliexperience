/**
 * Which playlists can the site actually play?
 *
 * The embedded YouTube player will not load every list you can open in a
 * browser tab. Two things get refused with `onError` 150 and an empty
 * tracklist, and neither is visible from the YouTube UI:
 *
 *   - playlists created in **YouTube Music** rather than on youtube.com
 *   - playlists that are Unlisted or Private
 *
 * YouTube's oEmbed endpoint answers 200 only for a list the embed can use, so
 * it is a cheap proxy for "will this play on the site". Individual tracks can
 * still be blocked by their label (Saregama, T-Series and most "- Topic" art
 * tracks are), which the player steps over at runtime — this script checks the
 * lists, not every video inside them.
 *
 *   npm run check:playlists
 */
import { PLAYLISTS } from "../src/data/playlists.ts";

const oembed = (id) =>
  `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(
    `https://www.youtube.com/playlist?list=${id}`,
  )}`;

const results = await Promise.all(
  PLAYLISTS.map(async (p) => {
    try {
      const res = await fetch(oembed(p.id));
      return { ...p, code: res.status, ok: res.ok };
    } catch (err) {
      return { ...p, code: 0, ok: false, err: String(err) };
    }
  }),
);

const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad("LABEL", 20)}${pad("SOURCE", 9)}${pad("EMBEDS", 11)}ID`);
for (const r of results) {
  console.log(
    `${pad(r.label, 20)}${pad(r.source ?? "?", 9)}${pad(r.ok ? "yes" : `NO (${r.code})`, 11)}${r.id}`,
  );
}

const dead = results.filter((r) => !r.ok);
if (dead.length) {
  console.log(
    `\n${dead.length}/${results.length} unplayable. Recreate them as public ` +
      `playlists on youtube.com — a YouTube Music list cannot be embedded, ` +
      `whatever its visibility says.`,
  );
  process.exitCode = 1;
} else {
  console.log("\nAll playlists embed.");
}
