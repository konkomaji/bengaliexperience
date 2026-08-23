import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LifeEvent } from "../../data/kabirsuman/life";
import { KsDispute } from "./shared";

/**
 * The life spine, styled as a filmstrip/tape rather than a plain list: a
 * continuous sprocket-hole rail down the left edge, each frame springing
 * into place as it enters view instead of arriving as a flat fade. The
 * material this section keeps returning to — reel, print, dispatch — made
 * literal in the one component every page on this site reuses for "here is
 * a sequence of dated things."
 *
 * `full`, plus an optional `groupLabel`, turns on the fuller frame used by
 * the Life page itself: date-of-month, detail paragraph, and a dispute
 * callout, with a brass section header wherever the group changes. The hub
 * page's five-event highlight reel uses the plain compact frame instead.
 */
export function ReelTimeline({
  events,
  full = false,
  groupLabel,
}: {
  events: LifeEvent[];
  full?: boolean;
  groupLabel?: (e: LifeEvent) => string;
}) {
  let lastGroup: string | null = null;

  return (
    <div className="flex flex-col">
      {events.map((e, i) => {
        const group = groupLabel?.(e) ?? null;
        const newGroup = group !== null && group !== lastGroup;
        lastGroup = group;
        return (
          <Frame key={`${e.year}-${e.headline.slice(0, 20)}`} gapped={!full}>
            {newGroup && (
              <p className="ks-mono mb-3 mt-9 text-[10px] font-semibold uppercase tracking-[0.2em] text-ks-brass first:mt-0">
                {group}
              </p>
            )}
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: (i % 8) * 0.05 }}
              className="relative grid grid-cols-[56px_1fr] items-start gap-3 pl-8 sm:grid-cols-[76px_1fr]"
            >
              <span
                aria-hidden
                className="absolute bottom-0 left-[7px] top-0 w-px bg-[repeating-linear-gradient(to_bottom,var(--color-ks-brass)_0,var(--color-ks-brass)_3px,transparent_3px,transparent_10px)]"
              />
              <span
                aria-hidden
                className="absolute left-0 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-ks-brass bg-ks-paper"
              />
              <p className="ks-mono pt-0.5 text-[13px] font-semibold text-ks-red">
                {e.year}
                {full && e.date && <span className="mt-0.5 block text-[10px] font-normal text-ks-ink-muted">{e.date}</span>}
              </p>
              <div className={full ? "border-t border-ks-outline-variant pb-3.5 pt-0" : undefined}>
                <p className={full ? "text-[14px] font-semibold leading-snug text-ks-ink" : "text-[13.5px] leading-snug text-ks-ink"}>
                  {e.headline}
                </p>
                {full && e.detail && <p className="mt-1 text-[13px] leading-relaxed text-ks-ink-muted">{e.detail}</p>}
                {full && e.dispute && <KsDispute>{e.dispute}</KsDispute>}
              </div>
            </motion.div>
          </Frame>
        );
      })}
    </div>
  );
}

/** compact mode needs a gap between frames; full mode draws its own
 *  top-border rule instead, so the wrapping list contributes no gap there */
function Frame({ children, gapped }: { children: ReactNode; gapped: boolean }) {
  return <div className={gapped ? "[&:not(:first-child)]:mt-5" : undefined}>{children}</div>;
}
