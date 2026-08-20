import { motion } from "framer-motion";
import { directoryMapsUrl, type DirectoryEntry } from "../../data/tarakeswar/directory";
import { ExternalIcon, MapPinIcon, StarIcon } from "../icons";

/**
 * One directory listing, styled as a small curated card rather than a plain
 * row: the whole card is a link straight out to that place's real Google
 * Maps listing (ratings, reviews, hours, all of it live on Google's side,
 * not reproduced or guessed here), with the editorial note underneath it as
 * the thing this page adds that Maps doesn't. The star glyph is a curation
 * mark, not a rating this site invented; see the caption under it.
 */
export function DirectoryCard({ entry, index }: { entry: DirectoryEntry; index: number }) {
  return (
    <motion.a
      href={directoryMapsUrl(entry)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, scale: 1.012 }}
      whileTap={{ scale: 0.98 }}
      // spring physics for the press/hover response specifically — the
      // expressive, slightly overshooting feel Material 3 Expressive
      // components move with, distinct from the entrance fade above
      style={{ transition: "box-shadow 0.2s ease" }}
      className="group block rounded-2xl border border-tara-outline-variant bg-tara-surface-container px-4 py-3.5 shadow-[0_1px_2px_rgba(36,28,19,0.04)] transition-colors hover:border-tara-primary/45 hover:bg-tara-primary-container/25 hover:shadow-[0_6px_20px_rgba(232,114,12,0.12)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <StarIcon size={11} />
            <p className="truncate text-[14px] font-bold text-tara-on-surface">{entry.name}</p>
          </div>
          <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-tara-secondary">
            <MapPinIcon size={11} />
            {entry.area}
          </p>
        </div>
        <span
          aria-hidden
          className="mt-0.5 flex shrink-0 items-center gap-1 rounded-full bg-tara-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-tara-on-surface-muted transition-colors group-hover:bg-tara-primary group-hover:text-tara-on-primary"
        >
          Maps
          <ExternalIcon size={10} />
        </span>
      </div>
      {entry.note && (
        <p className="mt-2 text-[12.5px] italic leading-relaxed text-tara-on-surface-muted">{entry.note}</p>
      )}
    </motion.a>
  );
}
