import { motion } from "framer-motion";
import { SCENE } from "../data/scene";
import { PAGE_SEO } from "../data/seo";
import { HornIcon } from "./icons";

/**
 * The big title block: track count, oversized page heading, ruled punchline,
 * and the horn. Sits high so the illustrated bus below it stays visible.
 *
 * The heading is the page's h1 rather than the site wordmark. This page is
 * the bus, not the project, and the brand sits above it in the header.
 */
export function Hero({
  trackCount, onHonk, blasting = false,
}: {
  trackCount: number;
  onHonk: () => void;
  /** true for exactly as long as the horn recording is sounding */
  blasting?: boolean;
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

      {/* Sized smaller than the old one-word wordmark it replaced: this
          heading is four words and has to survive a narrow phone. */}
      <h1 className="font-display mt-1 max-w-[11ch] text-4xl font-extrabold leading-[0.92] text-on-surface sm:max-w-none sm:text-5xl md:text-6xl"
        style={{ textShadow: "0 4px 28px rgba(0,0,0,0.7)" }}
        aria-label={PAGE_SEO.busdriver.h1}
      >
        <DancingText text={PAGE_SEO.busdriver.h1} dancing={blasting} />
      </h1>

      <div className="mt-3 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/55 sm:text-[11px]">
        <span className="h-px w-6 bg-white/25 sm:w-10" />
        {SCENE.punchline}
        <span className="h-px w-6 bg-white/25 sm:w-10" />
      </div>

      {/* Bigger than the rest of the furniture on purpose: it is the one thing
          on the page you are meant to press, and a horn button that needs
          aiming at is not a horn button. While it sounds, the pulse stops and
          the whole thing sits pressed in, so the button looks held down for
          as long as the note lasts. */}
      <motion.button
        type="button" onClick={onHonk} aria-label="Honk the horn"
        className="pointer-events-auto mt-5 flex items-center gap-2.5 rounded-full border-2 border-[#2b1600] px-6 py-3 shadow-[0_8px_26px_rgba(0,0,0,0.55)] sm:gap-3 sm:px-7 sm:py-3.5"
        style={{ background: "linear-gradient(180deg, #ffdd55 0%, #ffa726 100%)" }}
        animate={
          blasting
            ? { scale: 0.94, boxShadow: "0 2px 10px rgba(0,0,0,0.6)" }
            : { scale: [1, 1.06, 1] }
        }
        transition={
          blasting
            ? { type: "spring", stiffness: 500, damping: 26 }
            : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
        }
        whileTap={{ scale: 0.9 }}
      >
        <motion.span
          className="text-[#2b1600]"
          // the bulb gets squeezed: a quick shake on the icon only, so the
          // label stays readable while the horn is going
          animate={blasting ? { rotate: [0, -12, 9, -6, 0] } : { rotate: 0 }}
          transition={blasting ? { duration: 0.3, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        >
          <HornIcon size={22} />
        </motion.span>
        <span className="font-display text-sm font-extrabold leading-none tracking-wide text-[#2b1600] sm:text-base">
          HORN PLEASEEEE
        </span>
      </motion.button>
    </motion.div>
  );
}

/**
 * The heading, one letter per span, so the horn can shake them individually.
 *
 * Split on words first and made `inline-block` per word, so a letter-by-letter
 * heading still wraps at word boundaries on a phone instead of breaking
 * mid-word. Each letter carries a small increasing delay, which is what turns
 * a row of letters jumping in unison into something travelling along the word.
 *
 * The whole thing is `aria-hidden` and the real text lives in the h1's
 * `aria-label`: a screen reader should hear the title, not twenty-six
 * individual characters.
 */
function DancingText({ text, dancing }: { text: string; dancing: boolean }) {
  let n = 0;
  return (
    <span aria-hidden className="inline-block">
      {text.split(" ").map((word, w, words) => (
        <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
          {[...word].map((char, c) => (
            <span
              key={`${char}-${c}`}
              className="inline-block will-change-transform"
              style={
                dancing
                  ? { animation: "var(--animate-letter-dance)", animationDelay: `${n++ * 32}ms` }
                  : undefined
              }
            >
              {char}
            </span>
          ))}
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
