import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Landmark } from "../../data/kabirsuman/landmarks";
import { KABIRSUMAN_SONG_PREFIX } from "../../data/seo";

/**
 * One landmark song, styled as a cassette-tape label rather than a bordered
 * list row: two reel windows either side of the title, brass on paper, a
 * spring lift on hover for the ones that link somewhere. The "not yet a
 * page" case (songSlug null) gets the same shape but dimmed and static, so
 * the grid reads as one cassette rack rather than two different components.
 */
export function LandmarkTile({ landmark: l, index }: { landmark: Landmark; index: number }) {
  const inner = (
    <>
      <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-full border border-ks-ink/70 bg-ks-paper" />
      <span className="min-w-0 flex-1">
        <span className="ks-bengali block truncate text-[14.5px] font-semibold">{l.bn}</span>
        <span className="ks-mono block text-[10px] text-ks-ink-muted">{l.albumLabel} · {l.year}</span>
      </span>
      <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-full border border-ks-ink/70 bg-ks-paper" />
    </>
  );

  const motionProps = {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" } as const,
    transition: { type: "spring" as const, stiffness: 280, damping: 24, delay: index * 0.04 },
  };

  if (!l.songSlug) {
    return (
      <motion.div
        {...motionProps}
        className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-dashed border-ks-outline bg-ks-paper-container/60 px-3 py-2.5 text-ks-ink-muted"
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <motion.div {...motionProps} whileHover={{ y: -3, rotate: index % 2 === 0 ? -0.6 : 0.6 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={`${KABIRSUMAN_SONG_PREFIX}/${l.songSlug}`}
        className="flex items-center gap-2.5 rounded-[var(--radius-md)] border-2 border-ks-ink bg-ks-brass-container px-3 py-2.5 text-ks-on-brass-container shadow-[0_2px_0_var(--color-ks-ink)] transition-colors hover:bg-ks-brass-container/80"
      >
        {inner}
      </Link>
    </motion.div>
  );
}
