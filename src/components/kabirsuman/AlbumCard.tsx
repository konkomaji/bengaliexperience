import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

export function AlbumCard({ album, index = 0 }: { album: Album; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 280, damping: 26, delay: (index % 12) * 0.03 }}
      whileHover={{ y: -4, rotate: index % 2 === 0 ? -0.7 : 0.7 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        to={`${KABIRSUMAN_ALBUM_PREFIX}/${album.slug}`}
        className="group flex flex-col overflow-hidden rounded-[var(--radius-sm)] border-2 border-ks-ink bg-ks-paper-bright shadow-[0_2px_0_var(--color-ks-ink)] transition-shadow hover:shadow-[0_4px_0_var(--color-ks-ink)]"
      >
        <div className="relative aspect-square w-full overflow-hidden border-b-2 border-ks-ink bg-ks-paper-container">
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
          <span className="ks-mono absolute right-1.5 top-1.5 rounded-full bg-ks-ink px-2 py-0.5 text-[10px] font-semibold text-ks-paper-bright">
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
    </motion.div>
  );
}
