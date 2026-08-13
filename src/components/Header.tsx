import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BRAND } from "../data/brand";
import { PAGE_PATH } from "../data/seo";
import { useISTClock } from "../hooks/useISTClock";
import { DriverCard } from "./DriverCard";

/**
 * The fixed top bar on the bus page: the brand, the Kolkata clock, how many
 * people are listening, and the curator card.
 *
 * The line of stops that used to sit under the wordmark is gone. There is one
 * bus and you are already on it; naming the stops made it read like a
 * timetable for a service you had to pick.
 *
 * The wordmark is a link home. It is the only route out of the experience and
 * back to the rest of the project, which matters more now that the project is
 * a collection rather than a single site.
 */
export function Header({ aboard }: { aboard: number | null }) {
  const clock = useISTClock();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex flex-col gap-2.5 px-4 pt-safe pt-4 sm:px-7 sm:pt-6">
      <div className="flex items-start justify-between gap-3">
        {/* wordmark — type only */}
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex min-w-0 flex-col leading-none"
        >
          <Link to={PAGE_PATH.home} className="min-w-0">
            <span className="font-display block truncate text-base font-extrabold text-on-surface sm:text-xl"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }} >
              {BRAND.nameEn}
            </span>
          </Link>
        </motion.div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {/* IST clock: HH:MM, seconds in superscript, then AM/PM */}
          <p className="flex items-baseline tabular-nums leading-none text-white/90"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.85)" }}
            aria-label={`Kolkata time ${clock.hh}:${clock.mm}:${clock.ss} ${clock.period}`}>
            <span className="text-lg font-semibold sm:text-xl">{clock.hh}</span>
            <span className="animate-blink px-0.5 text-lg font-semibold text-primary sm:text-xl">:</span>
            <span className="text-lg font-semibold sm:text-xl">{clock.mm}</span>
            <span className="ml-1 text-[11px] font-medium text-white/55 sm:text-xs">{clock.ss}</span>
            <span className="ml-1 text-[10px] font-semibold tracking-[0.14em] text-white/45">{clock.period}</span>
          </p>

          {/* live listeners, directly under the clock */}
          <AboardCount count={aboard} />

          <DriverCard />
        </div>
      </div>

    </header>
  );
}

/**
 * "N aboard" — how many people are listening right now, from the KV-backed
 * edge counter. Renders nothing at all when the count is unavailable (plain
 * `vite dev`, or the function not deployed): showing an invented number would
 * be worse than showing none.
 */
function AboardCount({ count }: { count: number | null }) {
  const [bump, setBump] = useState(0);
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (count !== null && prev.current !== null && count !== prev.current) {
      setBump((n) => n + 1); // re-key the number so it animates in
    }
    prev.current = count;
  }, [count]);

  if (count === null) return null;

  return (
    <p className="flex items-center gap-1.5 whitespace-nowrap text-[10px] uppercase tracking-[0.16em] text-white/60 sm:text-[11px]"
      style={{ textShadow: "0 1px 10px rgba(0,0,0,0.85)" }}
      aria-live="polite">
      <span className="relative flex size-1.5">
        <span className="animate-beacon absolute inset-0 rounded-full bg-primary" />
        <span className="relative size-1.5 rounded-full bg-primary" />
      </span>
      <span key={bump} className="animate-board font-semibold tabular-nums text-white/90">{count}</span>
      aboard
    </p>
  );
}

