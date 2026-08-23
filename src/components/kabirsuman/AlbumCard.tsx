import { Link } from "react-router-dom";
import type { Album } from "../../data/kabirsuman/catalogue";
import { KABIRSUMAN_ALBUM_PREFIX } from "../../data/seo";

const TYPE_LABEL: Record<Album["type"], string> = {
  studio: "Studio",
  film: "Film score",
  live: "Live",
  collaboration: "Collaboration",
  tagore: "Tagore",
  compilation: "Compilation",
  digital: "Digital",
};

export function AlbumCard({ album }: { album: Album }) {
  return (
    <Link
      to={`${KABIRSUMAN_ALBUM_PREFIX}/${album.slug}`}
      className="group flex flex-col border border-ks-outline bg-ks-paper-bright transition-transform hover:-translate-y-1 hover:border-ks-ink"
    >
      <div className="relative aspect-square w-full overflow-hidden border-b border-ks-outline bg-ks-paper-container">
        {album.cover ? (
          <img
            src={album.cover}
            alt={`Cover of ${album.roman} (${album.bn}), ${album.year}`}
            loading="lazy"
            width={480}
            height={480}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center ks-bengali text-[13px] text-ks-ink-muted">
            {album.bn}
          </div>
        )}
        <span className="ks-mono absolute right-1.5 top-1.5 bg-ks-ink px-1.5 py-0.5 text-[10px] font-semibold text-ks-paper-bright">
          {album.year}{album.yearUncertain ? "?" : ""}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 px-3 py-2.5">
        <p className="ks-bengali text-[14px] font-semibold leading-tight text-ks-ink">{album.bn}</p>
        <p className="text-[11.5px] leading-tight text-ks-ink-muted">{album.roman}</p>
        <p className="ks-mono mt-1 text-[10px] uppercase tracking-wide text-ks-brass-dim">
          {TYPE_LABEL[album.type]} · {album.songCount} song{album.songCount === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}
