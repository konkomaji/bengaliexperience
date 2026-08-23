import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { KabirSumanLayout } from "../../components/kabirsuman/KabirSumanLayout";
import { SongPlayer } from "../../components/kabirsuman/SongPlayer";
import { KsSection } from "../../components/kabirsuman/shared";
import { BRAND } from "../../data/brand";
import { ALBUM_BY_SLUG, SONG_BY_SLUG } from "../../data/kabirsuman/catalogue";
import { songDescription, songTitle } from "../../data/kabirsuman/dynamicSeo";
import { LANDMARKS } from "../../data/kabirsuman/landmarks";
import { SONG_VIDEO } from "../../data/kabirsuman/playback";
import { KABIRSUMAN_ALBUM_PREFIX, PAGE_PATH } from "../../data/seo";
import { useSumanLyrics } from "../../hooks/useSumanLyrics";
import { JsonLd } from "../../components/JsonLd";
import { buildKabirSumanSongJsonLd } from "../../data/kabirsuman/jsonld";

export function KabirSumanSongPage() {
  const { slug } = useParams<{ slug: string }>();
  const song = slug ? SONG_BY_SLUG[slug] : undefined;
  const album = song?.albumSlug ? ALBUM_BY_SLUG[song.albumSlug] : null;
  const { stanzas, loading } = useSumanLyrics(song?.albumSlug ?? null, slug ?? "");
  const landmark = song ? LANDMARKS.find((l) => l.songSlug === song.slug) : undefined;

  useEffect(() => {
    if (!song) return;
    document.title = songTitle(song, album);
    const desc = songDescription(song, album);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = desc;
    const canon = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canon) canon.href = `${BRAND.url}/kabirsuman/song/${song.slug}`;
  }, [song, album]);

  if (!song) return <Navigate to={PAGE_PATH.kabirsumanWorks} replace />;

  return (
    <KabirSumanLayout active="works">
      <JsonLd data={buildKabirSumanSongJsonLd(song, album)} />
      <p className="text-[12px]">
        {album ? (
          <Link to={`${KABIRSUMAN_ALBUM_PREFIX}/${album.slug}`} className="font-semibold text-ks-red hover:underline">
            ← {album.roman} ({album.year})
          </Link>
        ) : (
          <Link to={PAGE_PATH.kabirsumanWorks} className="font-semibold text-ks-red hover:underline">
            ← All albums
          </Link>
        )}
      </p>

      <header className="mt-4">
        <h1 style={{ fontFamily: "var(--font-ks-display)" }} className="ks-bengali text-[30px] font-semibold leading-tight text-ks-ink sm:text-[38px]">
          {song.bn}
        </h1>
        <p className="mt-0.5 text-[14px] text-ks-ink-muted">
          {song.roman}
          {album && ` — ${album.roman}${song.year ? `, ${song.year}` : ""}`}
        </p>
      </header>

      {landmark && (
        <p className="mt-4 max-w-[60ch] border-l-2 border-ks-red/60 pl-4 text-[13.5px] leading-relaxed text-ks-ink/90">
          {landmark.note}
        </p>
      )}

      <div className="mt-6">
        <SongPlayer videoId={SONG_VIDEO[song.slug]} title={song.roman} />
      </div>

      <KsSection heading="Lyrics">
        {loading && <p className="text-[13px] text-ks-ink-muted">Loading…</p>}
        {!loading && !stanzas && (
          <p className="text-[13px] text-ks-ink-muted">
            No lyric text on file for this song. See the{" "}
            <a href={song.archiveUrl} target="_blank" rel="noopener noreferrer" className="underline">
              archive page
            </a>
            .
          </p>
        )}
        {stanzas && (
          <div className="ks-bengali flex flex-col gap-4 text-[17px] leading-[1.9] text-ks-ink">
            {stanzas.map((stanza, i) => (
              <p key={i}>
                {stanza.map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < stanza.length - 1 && <br />}
                  </span>
                ))}
              </p>
            ))}
          </div>
        )}
        <p className="mt-4 text-[11px] text-ks-ink-muted">
          Lyric text: <a href={song.archiveUrl} target="_blank" rel="noopener noreferrer" className="underline">sumanami.co.uk</a>
        </p>
      </KsSection>
    </KabirSumanLayout>
  );
}
