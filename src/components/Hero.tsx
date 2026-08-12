import { motion } from "framer-motion";
import type { RouteDef } from "../data/routes";
import { BRAND } from "../data/brand";
import { HornIcon } from "./icons";

/**
 * The big title block: track count, oversized wordmark, ruled punchline, and
 * the horn. Sits high so the illustrated bus below it stays visible.
 */
export function Hero({
  route, trackCount, onHonk,
}: {
  route: RouteDef;
  trackCount: number;
  onHonk: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="pointer-events-none flex flex-col items-center text-center"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/60 sm:text-xs"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.85)" }}>
        {trackCount} tracks · non-stop
      </p>

      <h1 className="font-display mt-1 text-4xl font-extrabold leading-[0.95] text-on-surface sm:text-6xl md:text-7xl"
        style={{ textShadow: "0 4px 28px rgba(0,0,0,0.7)" }} >
        {BRAND.nameEn}
      </h1>

      <div className="mt-3 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/55 sm:text-[11px]">
        <span className="h-px w-6 bg-white/25 sm:w-10" />
        {route.punchline}
        <span className="h-px w-6 bg-white/25 sm:w-10" />
      </div>

      <motion.button
        type="button" onClick={onHonk} aria-label="Honk the horn"
        className="pointer-events-auto mt-4 flex items-center gap-2 rounded-full border-2 border-[#2b1600] px-4 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
        style={{ background: "linear-gradient(180deg, #ffdd55 0%, #ffa726 100%)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-[#2b1600]"><HornIcon size={15} /></span>
        <span className="font-display text-xs font-extrabold leading-none text-[#2b1600]">HORN OK PLEASE</span>
      </motion.button>
    </motion.div>
  );
}
