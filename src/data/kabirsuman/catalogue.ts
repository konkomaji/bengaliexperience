/**
 * The merged catalogue: the archive's structural facts
 * (catalogue.generated.ts) plus this project's editorial judgement
 * (albums.ts), joined and validated once here rather than at every call
 * site.
 */
import { ARCHIVE_ALBUMS, ARCHIVE_PROSE, ARCHIVE_SONGS, type ArchiveSong } from "./catalogue.generated";
import { ALBUM_META, type RecordType } from "./albums";

export interface Album {
  slug: string;
  bn: string;
  roman: string;
  englishTitle: string;
  year: number;
  yearUncertain?: boolean;
  type: RecordType;
  label?: string;
  yearDispute?: string;
  note?: string;
  cover: string | null;
  archiveUrl: string;
  songCount: number;
}

// Fail the build rather than ship a page with no editorial title: every
// archive album must have a matching entry in albums.ts.
const missing = ARCHIVE_ALBUMS.filter((a) => !ALBUM_META[a.slug]);
if (missing.length) {
  throw new Error(
    `src/data/kabirsuman/albums.ts is missing an entry for: ${missing.map((a) => a.slug).join(", ")}. ` +
      `Every album scripts/prepare-suman.mjs finds in the archive needs one.`,
  );
}

export const ALBUMS: Album[] = ARCHIVE_ALBUMS.map((a) => {
  const meta = ALBUM_META[a.slug];
  return {
    slug: a.slug,
    bn: a.bn,
    roman: meta.roman,
    englishTitle: meta.englishTitle,
    year: meta.year,
    yearUncertain: meta.yearUncertain,
    type: meta.type,
    label: meta.label,
    yearDispute: meta.yearDispute,
    note: meta.note,
    cover: a.cover ? `/kabirsuman/covers/plate/${a.slug}.webp` : null,
    archiveUrl: a.archiveUrl,
    songCount: ARCHIVE_SONGS.filter((s) => s.albumSlug === a.slug).length,
  };
}).sort((a, b) => a.year - b.year || a.bn.localeCompare(b.bn, "bn"));

export const ALBUM_BY_SLUG: Record<string, Album> = Object.fromEntries(ALBUMS.map((a) => [a.slug, a]));

export const SONGS: ArchiveSong[] = ARCHIVE_SONGS;
export const SONG_BY_SLUG: Record<string, ArchiveSong> = Object.fromEntries(SONGS.map((s) => [s.slug, s]));

export const PROSE = ARCHIVE_PROSE;

export const TOTAL_SONGS = SONGS.length;
export const TOTAL_ALBUMS = ALBUMS.length;
export const FIRST_YEAR = Math.min(...ALBUMS.map((a) => a.year));
export const LATEST_YEAR = Math.max(...ALBUMS.map((a) => a.year));
