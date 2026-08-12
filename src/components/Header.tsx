import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BRAND } from "../data/brand";
import { ROUTES, type RouteDef, type RouteId } from "../data/routes";
import { ROUTE_PATH } from "../data/seo";
import { useISTClock } from "../hooks/useISTClock";

export function Header({
  route, aboard,
}: {
  route: RouteDef;
  aboard: number | null;
}) {
  const clock = useISTClock();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex flex-col gap-2.5 px-4 pt-safe pt-4 sm:px-7 sm:pt-6">
      <div className="flex items-start justify-between gap-3">
        {/* wordmark — type only */}
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex min-w-0 flex-col leading-none"
        >
          <span className="font-display truncate text-base font-extrabold text-on-surface sm:text-xl"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }} lang="bn">
            {BRAND.nameBn}
          </span>
          <span className="mt-1 truncate text-[8px] uppercase tracking-[0.26em] text-white/50 sm:text-[9px]">
            {route.ticker}
          </span>
        </motion.div>

        <div className="flex shrink-0 flex-col items-end leading-none">
          <p className="flex items-baseline tabular-nums text-white/90" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.85)" }}>
            <span className="text-base font-semibold sm:text-lg">{clock.hh}</span>
            <span className="animate-blink px-0.5 text-base font-semibold text-primary sm:text-lg">:</span>
            <span className="text-base font-semibold sm:text-lg">{clock.mm}</span>
            <span className="ml-1 text-[9px] font-medium tracking-[0.2em] text-white/45">{clock.period}</span>
          </p>
          {aboard !== null && (
            <p className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-[10px] uppercase tracking-[0.14em] text-white/60 sm:text-[11px]">
              <span className="relative flex size-1.5">
                <span className="animate-beacon absolute inset-0 rounded-full bg-primary" />
                <span className="relative size-1.5 rounded-full bg-primary" />
              </span>
              <span className="font-semibold tabular-nums text-white/85">{aboard}</span> aboard
            </p>
          )}
        </div>
      </div>

      {/* route pills — real links, so each experience is crawlable and shareable */}
      <nav aria-label="Choose a route"
        className="pointer-events-auto flex gap-1.5 self-start overflow-x-auto rounded-full border border-white/10 bg-black/30 p-1 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ROUTES.map((r) => (
          <RoutePill key={r.id} id={r.id} label={r.nameEn} glyph={r.glyph} active={r.id === route.id} />
        ))}
      </nav>
    </header>
  );
}

function RoutePill({ id, label, glyph, active }: { id: RouteId; label: string; glyph: string; active: boolean }) {
  return (
    <Link to={ROUTE_PATH[id]} aria-current={active ? "page" : undefined}
      className="relative shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white/70 transition-colors sm:text-xs">
      {active && (
        <motion.span layoutId="route-pill" className="absolute inset-0 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 34 }} />
      )}
      <span className={`relative z-10 flex items-center gap-1.5 whitespace-nowrap ${active ? "text-on-primary" : ""}`}>
        <span aria-hidden="true">{glyph}</span>{label}
      </span>
    </Link>
  );
}
