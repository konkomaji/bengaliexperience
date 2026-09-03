import { motion } from "framer-motion";
import type { LifeEvent } from "../../data/uttamkumar/life";
import { UkNote } from "./shared";

/**
 * The life spine, styled as a filmstrip rail rather than a plain list — the
 * same move src/components/kabirsuman/ReelTimeline.tsx makes, reskinned to
 * this theme's gold-on-dark rather than being imported and recoloured, so
 * the two tributes stay visually independent.
 */
export function LifeReel({ events, full = false }: { events: LifeEvent[]; full?: boolean }) {
  return (
    <div className="flex flex-col">
      {events.map((e, i) => (
        <div key={`${e.year}-${e.headline.slice(0, 20)}`} className={full ? undefined : "[&:not(:first-child)]:mt-5"}>
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: (i % 8) * 0.05 }}
            className="relative grid grid-cols-[56px_1fr] items-start gap-3 pl-8 sm:grid-cols-[76px_1fr]"
          >
            <span
              aria-hidden
              className="absolute bottom-0 left-[7px] top-0 w-px bg-[repeating-linear-gradient(to_bottom,var(--color-uk-gold-dim)_0,var(--color-uk-gold-dim)_3px,transparent_3px,transparent_10px)]"
            />
            <span aria-hidden className="absolute left-0 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-uk-gold-dim bg-uk-void" />
            <p className="uk-mono pt-0.5 text-[13px] font-semibold text-uk-gold">
              {e.year}
              {full && e.date && <span className="mt-0.5 block text-[10px] font-normal text-uk-on-void-muted">{e.date}</span>}
            </p>
            <div className={full ? "border-t border-uk-outline-variant pb-3.5 pt-0" : undefined}>
              <p className={full ? "text-[14px] font-semibold leading-snug text-uk-on-void" : "text-[13.5px] leading-snug text-uk-on-void"}>
                {e.headline}
              </p>
              {full && e.detail && <p className="mt-1 text-[13px] leading-relaxed text-uk-on-void-muted">{e.detail}</p>}
              {full && e.dispute && <UkNote>{e.dispute}</UkNote>}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
