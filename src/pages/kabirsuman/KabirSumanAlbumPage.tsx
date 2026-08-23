import { Link, Navigate, useParams } from "react-router-dom";
import { KabirSumanLayout } from "../../components/kabirsuman/KabirSumanLayout";
import { KsDispute, KsSection } from "../../components/kabirsuman/shared";
import { ALBUM_BY_SLUG, SONGS } from "../../data/kabirsuman/catalogue";
import { albumDescription, albumTitle } from "../../data/kabirsuman/dynamicSeo";
import { ALBUM_PLAYLIST } from "../../data/kabirsuman/playback";
import { BRAND } from "../../data/brand";
import { KABIRSUMAN_ALBUM_PREFIX, KABIRSUMAN_SONG_PREFIX, PAGE_PATH } from "../../data/seo";
import { useEffect } from "react";
import { ExternalIcon } from "../../components/icons";
import { JsonLd } from "../../components/JsonLd";
import { buildKabirSumanAlbumJsonLd } from "../../data/kabirsuman/jsonld";

const TYPE_LABEL: Record<string, string> = {
  studio: "Studio album",
  film: "Film score",
  live: "Live recording",
  collaboration: "Collaboration",
  tagore: "Rabindrasangeet collection",
  compilation: "Compilation",
  digital: "Digital release",
};

export function KabirSumanAlbumPage() {
  const { slug } = useParams<{ slug: string }>();
  const album = slug ? ALBUM_BY_SLUG[slug] : undefined;

  useEffect(() => {
    if (!album) return;
    document.title = albumTitle(album);
    const desc = albumDescription(album);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = desc;
    const canon = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canon) canon.href = `${BRAND.url}${KABIRSUMAN_ALBUM_PREFIX}/${album.slug}`;
  }, [album]);

  if (!album) return <Navigate to={PAGE_PATH.kabirsumanWorks} replace />;

  const songs = SONGS.filter((s) => s.albumSlug === album.slug);
  const playlistId = ALBUM_PLAYLIST[album.slug];

  return (
    <KabirSumanLayout active="works">
      <JsonLd data={buildKabirSumanAlbumJsonLd(album, songs)} />
      <p className="text-[12px]">
        <Link to={PAGE_PATH.kabirsumanWorks} className="font-semibold text-ks-red hover:underline">
          ← All albums
        </Link>
      </p>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="w-40 shrink-0 border border-ks-ink bg-ks-paper-container sm:w-48">
          {album.cover ? (
            <img src={album.cover} alt={`Cover of ${album.roman}, ${album.year}`} width={480} height={480} className="block w-full" />
          ) : (
            <div className="ks-bengali flex aspect-square items-center justify-center p-4 text-center text-[15px] text-ks-ink-muted">
              {album.bn}
            </div>
          )}
        </div>
        <div>
          <p className="ks-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ks-red">
            {TYPE_LABEL[album.type]} · {album.year}
            {album.yearUncertain ? " (undated by the archive — placed here)" : ""}
          </p>
          <h1 style={{ fontFamily: "var(--font-ks-display)" }} className="ks-bengali mt-1 text-[30px] font-semibold leading-tight text-ks-ink sm:text-[36px]">
            {album.bn}
          </h1>
          <p className="mt-0.5 text-[15px] text-ks-ink-muted">{album.roman} — "{album.englishTitle}"</p>
          {album.label && <p className="ks-mono mt-2 text-[11px] text-ks-brass-dim">{album.label}</p>}
          {album.note && <p className="mt-3 max-w-[55ch] text-[14px] leading-relaxed text-ks-ink/90">{album.note}</p>}
          {album.yearDispute && <KsDispute>{album.yearDispute}</KsDispute>}

          {playlistId ? (
            <a
              href={`https://www.youtube.com/playlist?list=${playlistId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 border-2 border-ks-ink bg-ks-red px-4 py-2 text-[13px] font-semibold text-ks-on-red"
            >
              Play the album on YouTube <ExternalIcon size={13} />
            </a>
          ) : null}
        </div>
      </div>

      <KsSection heading={`Songs (${songs.length})`}>
        <ol className="flex flex-col divide-y divide-ks-outline-variant border-y border-ks-outline-variant">
          {songs.map((s, i) => (
            <li key={s.slug}>
              <Link
                to={`${KABIRSUMAN_SONG_PREFIX}/${s.slug}`}
                className="flex items-center gap-3 px-1 py-3 transition-colors hover:bg-ks-paper-container"
              >
                <span className="ks-mono w-6 shrink-0 text-[12px] text-ks-ink-muted">{i + 1}</span>
                <span className="ks-bengali flex-1 text-[14.5px] font-medium text-ks-ink">{s.bn}</span>
                <span className="hidden text-[12px] text-ks-ink-muted sm:block">{s.roman}</span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] text-ks-ink-muted">
          Source: <a href={album.archiveUrl} target="_blank" rel="noopener noreferrer" className="underline">sumanami.co.uk</a>
        </p>
      </KsSection>
    </KabirSumanLayout>
  );
}
