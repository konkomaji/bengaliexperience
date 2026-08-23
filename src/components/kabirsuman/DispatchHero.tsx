import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReelIcon, StampIcon } from "../icons";

/**
 * The hub page's masthead — a parallax dispatch rather than a static hero.
 * Three layers move at different scroll speeds (a big ghost reel behind
 * everything, drifting slow; the ink stamp, drifting a little faster; the
 * title block, drifting fastest and fading as it leaves) — the depth cue a
 * flat page can't give, built from `useScroll`/`useTransform` against this
 * component's own ref rather than the whole document, so it only ever
 * reads scroll progress across its own height.
 *
 * The ink stamp itself "lands" on mount with a spring overshoot — a stamp
 * hitting paper, not a fade-in.
 */
export function DispatchHero({ eyebrow, h1, intro }: { eyebrow: string; h1: string; intro: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const reelY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const reelRotate = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const stampY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative -mx-4 -mt-6 overflow-hidden px-4 pb-10 pt-8 sm:-mx-6 sm:pt-12 sm:px-6">
      {/* back layer: an oversized ghost reel, barely visible, slow drift + spin */}
      <motion.div
        aria-hidden
        style={{ y: reelY, rotate: reelRotate }}
        className="pointer-events-none absolute -right-16 -top-16 text-ks-brass/10 sm:-right-6 sm:-top-10"
      >
        <ReelIcon size={280} />
      </motion.div>

      {/* mid layer: the ink stamp, lands with an overshoot spring */}
      <motion.div
        style={{ y: stampY }}
        initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
        className="pointer-events-none absolute right-3 top-6 text-ks-red/25 sm:right-8 sm:top-10"
      >
        <StampIcon size={72} />
      </motion.div>

      {/* front layer: the actual title block */}
      <motion.header style={{ y: titleY, opacity: titleOpacity }} className="relative max-w-[36rem]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="ks-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ks-red"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.05 }}
          style={{ fontFamily: "var(--font-ks-display)" }}
          className="mt-2 text-[34px] font-semibold leading-[1.02] tracking-tight text-ks-ink sm:text-[52px]"
        >
          {h1}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.12 }}
          className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-ks-ink-muted sm:text-base"
        >
          {intro}
        </motion.p>
      </motion.header>
    </div>
  );
}
