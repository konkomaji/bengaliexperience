import { escape, facts } from "../../lib/prerender";
import { PAGE_PATH, type PageId } from "../seo";
import { ALBUM_BY_SLUG, ALBUMS, SONGS } from "./catalogue";
import type { Album } from "./catalogue";
import type { ArchiveSong } from "./catalogue.generated";
import { albumDescription, songDescription } from "./dynamicSeo";
import { LANDMARKS } from "./landmarks";
import { LIFE_EVENTS } from "./life";
import { TOTAL_ALBUMS, TOTAL_SONGS } from "./counts.generated";

/**
 * Crawlable body for the five fixed Kabir Suman pages, called from
 * src/lib/prerender.ts's renderStaticBody, the same split Tarakeswar uses.
 * Albums and songs are not PageIds (30 and 317 of them), so
 * functions/_middleware.ts calls renderKabirSumanAlbumBody /
 * renderKabirSumanSongBody directly instead, by slug, alongside this map
 * rather than through it.
 */
export function renderKabirSumanBody(pageId: PageId): string[] {
  switch (pageId) {
    case "kabirsuman":
      return hubBody();
    case "kabirsumanLife":
      return lifeBody();
    case "kabirsumanWorks":
      return worksBody();
    case "kabirsumanWords":
      return wordsBody();
    case "kabirsumanSources":
      return sourcesBody();
    default:
      return [];
  }
}

function hubBody(): string[] {
  const landmarks = LANDMARKS.filter((l) => l.songSlug)
    .map((l) => `<li><a href="/kabirsuman/song/${l.songSlug}">${escape(l.bn)}</a> (${l.year}). ${escape(l.note)}</li>`)
    .join("");

  return [
    `<h2>The discography</h2>`,
    `<p>${escape(`${TOTAL_ALBUMS} albums and ${TOTAL_SONGS} songs, catalogued from the sumanami.co.uk archive.`)}</p>`,
    `<p><a href="${PAGE_PATH.kabirsumanWorks}">All albums</a> &middot; <a href="${PAGE_PATH.kabirsumanLife}">The full life</a> &middot; <a href="${PAGE_PATH.kabirsumanWords}">Search the lyrics</a></p>`,
    `<h2>Where to start</h2>`,
    `<ul>${landmarks}</ul>`,
  ];
}

function lifeBody(): string[] {
  const items = LIFE_EVENTS.map(
    (e) =>
      `<li><strong>${e.year}${e.date ? `, ${escape(e.date)}` : ""}</strong>: ${escape(e.headline)}${e.detail ? ` ${escape(e.detail)}` : ""}${e.dispute ? ` <em>Sources disagree: ${escape(e.dispute)}</em>` : ""}</li>`,
  ).join("");
  return [`<ol>${items}</ol>`];
}

function worksBody(): string[] {
  const items = ALBUMS.map(
    (a) =>
      `<li><a href="/kabirsuman/album/${a.slug}">${escape(a.bn)} (${a.roman})</a>, ${a.year}${a.yearUncertain ? " (undated by the archive)" : ""}. ${a.songCount} songs.${a.note ? ` ${escape(a.note)}` : ""}</li>`,
  ).join("");
  return [`<ol>${items}</ol>`];
}

function wordsBody(): string[] {
  return [
    `<p>${escape("A concordance of every recurring word across all 317 Kabir Suman songs, and every song each one appears in — searchable on the live page.")}</p>`,
  ];
}

function sourcesBody(): string[] {
  return [
    `<p>${escape("All lyric text and album cover images come from the fan-run archive sumanami.co.uk. Biographical and discographical facts are cross-checked against English and Bengali Wikipedia and, for the 1992 debut, Scroll.in's account of its recording. Full citations are on this page.")}</p>`,
  ];
}

/** One album, called directly by slug from functions/_middleware.ts. */
export function renderKabirSumanAlbumBody(album: Album): string {
  const songs = SONGS.filter((s) => s.albumSlug === album.slug);
  const items = songs
    .map((s) => `<li><a href="/kabirsuman/song/${s.slug}">${escape(s.bn)}</a> (${escape(s.roman)})</li>`)
    .join("");
  return [
    `<div id="prerender">`,
    `<h1>${escape(`${album.roman} (${album.bn})`)}</h1>`,
    `<p>${escape(albumDescription(album))}</p>`,
    facts([
      `Year: ${album.year}${album.yearUncertain ? " (undated by the archive — placed here, not confirmed)" : ""}`,
      ...(album.label ? [`Label: ${album.label}`] : []),
      `${songs.length} song${songs.length === 1 ? "" : "s"}`,
    ]),
    album.note ? `<p>${escape(album.note)}</p>` : "",
    `<h2>Songs</h2><ol>${items}</ol>`,
    `<p><a href="${PAGE_PATH.kabirsumanWorks}">All albums</a></p>`,
    `</div>`,
  ].join("");
}

/** One song, called directly by slug. */
export function renderKabirSumanSongBody(song: ArchiveSong, stanzas: string[][] | null): string {
  const album = song.albumSlug ? ALBUM_BY_SLUG[song.albumSlug] : null;
  const lyricHtml = stanzas
    ? stanzas.map((st) => `<p>${st.map(escape).join("<br>")}</p>`).join("")
    : `<p>${escape("Lyric text not on file for this song.")}</p>`;
  return [
    `<div id="prerender">`,
    `<h1>${escape(`${song.roman} (${song.bn})`)}</h1>`,
    `<p>${escape(songDescription(song, album))}</p>`,
    lyricHtml,
    `<p><a href="${album ? `/kabirsuman/album/${album.slug}` : PAGE_PATH.kabirsumanWorks}">${
      album ? escape(`Back to ${album.roman}`) : "All albums"
    }</a></p>`,
    `</div>`,
  ].join("");
}
