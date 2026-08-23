import type { Album } from "./catalogue";
import type { ArchiveSong } from "./catalogue.generated";

/**
 * Per-page copy for the two dynamic collections, generated from the
 * catalogue rather than hand-written one at a time — the same trade the
 * Atlas makes for its 327 generated pages, for the same reason: 30 albums
 * and 317 songs is too many to write individually, and a template built
 * from real per-item facts (year, song count, which album a song is on)
 * beats either silence or a hand-written page for the dozen that matter
 * most and a placeholder for the rest.
 *
 * Every landmark song (src/data/kabirsuman/landmarks.ts) overrides its
 * `note` field with real critical context; everything else gets the plain
 * factual copy below.
 */

export function albumTitle(a: Album) {
  return `${a.roman} (${a.bn}), ${a.year}${a.yearUncertain ? " (undated by the archive)" : ""} — Kabir Suman`;
}

export function albumDescription(a: Album) {
  return `${a.roman}, ${a.englishTitle.toLowerCase() === a.roman.toLowerCase() ? "" : `"${a.englishTitle}", `}Kabir Suman's ${a.year} ${a.type === "film" ? "film score" : a.type === "tagore" ? "Rabindrasangeet collection" : "album"}. ${a.songCount} song${a.songCount === 1 ? "" : "s"} with full Bengali lyrics.`;
}

export function songTitle(s: ArchiveSong, album: Album | null) {
  return `${s.roman} (${s.bn}) lyrics${album ? ` — ${album.roman}, ${album.year}` : ""} — Kabir Suman`;
}

export function songDescription(s: ArchiveSong, album: Album | null) {
  return `Full Bengali lyrics for "${s.roman}" (${s.bn}) by Kabir Suman${album ? `, from ${album.roman} (${album.year})` : ""}.`;
}
