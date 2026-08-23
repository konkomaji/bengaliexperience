import { motion } from "framer-motion";
import type { LifeEvent } from "../../data/kabirsuman/life";

/**
 * The life spine, styled as a filmstrip/tape rather than a plain list: a
 * continuous sprocket-hole rail down the left edge, each frame springing
 * into place as it enters view instead of arriving as a flat fade. The
 * material this section keeps returning to — reel, print, dispatch — made
 * literal in the one component every page on this site reuses for "here is
 * a sequence of dated things."
 */
export function ReelTimeline({ events }: { events: LifeEvent[] }) {
  return (
    <ol className="relative flex flex-col gap-5 pl-8">
      <span
        aria-hidden
        className="absolute bottom-2 left-[7px] top-2 w-px bg-[repeating-linear-gradient(to_bottom,var(--color-ks-brass)_0,var(--color-ks-brass)_3px,transparent_3px,transparent_10px)]"
      />
      {events.map((e, i) => (
        <motion.li
          key={`${e.year}-${e.headline.slice(0, 12)}`}
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.05 }}
          className="relative grid grid-cols-[56px_1fr] items-start gap-3"
        >
          <span
            aria-hidden
            className="absolute -left-8 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-ks-brass bg-ks-paper"
          />
          <span className="ks-mono pt-0.5 text-[13px] font-semibold text-ks-red">{e.year}</span>
          <span className="text-[13.5px] leading-snug text-ks-ink">{e.headline}</span>
        </motion.li>
      ))}
    </ol>
  );
}
