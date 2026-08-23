import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalIcon, PlayIcon } from "../icons";

/**
 * A single song's player, styled as a cassette deck rather than a plain
 * embed button — two reel windows either side of the play head, because the
 * whole section's material is tape and broadcast, not a generic video
 * player chrome. Material-3-Expressive motion: a spring on press, not an
 * ease-out fade, and the deck visibly "loads the tape" into the window
 * frame it becomes rather than just swapping elements.
 *
 * No JS player engine here, on purpose — this is one video with its own
 * native controls, not a shuffled endless playlist, so there is nothing the
 * YouTube IFrame API buys over a plain embed. Click-to-load: the iframe
 * (and the network request that comes with it) is not created until the
 * visitor actually asks for the song, and the click *is* the user gesture
 * that lets `autoplay=1` start audibly with no second interaction — the
 * same rule the bus player is built around.
 *
 * When no verified id exists yet for a song, this degrades to a plain
 * outbound search link rather than a broken or guessed embed.
 */
export function SongPlayer({ videoId, title }: { videoId?: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  if (!videoId) {
    return (
      <a
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`Kabir Suman ${title}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-dashed border-ks-outline bg-ks-paper-container px-4 py-3 text-[13px] font-semibold text-ks-ink-muted transition-colors hover:border-ks-red hover:text-ks-red"
      >
        Search for this song on YouTube
        <ExternalIcon size={14} />
      </a>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {!loaded ? (
          <motion.button
            key="deck"
            type="button"
            onClick={() => setLoaded(true)}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            whileHover={{ scale: 1.015, rotate: -0.3 }}
            whileTap={{ scale: 0.97, rotate: 0.4 }}
            className="group flex w-full items-center gap-4 rounded-[var(--radius-lg)] border-2 border-ks-ink bg-ks-brass-container px-4 py-3.5 text-left shadow-[0_3px_0_var(--color-ks-ink)]"
          >
            {/* left reel */}
            <ReelWindow />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ks-red text-ks-on-red transition-transform group-hover:scale-110">
                  <PlayIcon size={14} />
                </span>
                <span className="truncate text-[14px] font-semibold text-ks-on-brass-container">
                  Play {title}
                </span>
              </span>
              <span className="ks-mono mt-0.5 block pl-10 text-[10px] uppercase tracking-wider text-ks-brass-dim">
                via official YouTube upload
              </span>
            </span>
            {/* right reel */}
            <ReelWindow />
          </motion.button>
        ) : (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="overflow-hidden rounded-[var(--radius-lg)] border-2 border-ks-ink bg-black shadow-[0_3px_0_var(--color-ks-ink)]"
          >
            <div className="flex items-center justify-between bg-ks-ink px-3 py-1.5">
              <span className="ks-mono flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ks-signal">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ks-signal" style={{ animation: "var(--animate-blink)" }} />
                On air
              </span>
              <span className="ks-mono truncate pl-3 text-[10px] uppercase tracking-wider text-ks-paper/60">{title}</span>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** One cassette reel window — a spinning-when-idle brass ring, purely
 *  decorative, the same visual grammar as ReelIcon but built for a bigger
 *  stage than an 18px nav icon. */
function ReelWindow() {
  return (
    <span
      aria-hidden
      className="relative hidden h-9 w-9 shrink-0 rounded-full border-2 border-ks-ink bg-ks-paper-bright sm:block"
      style={{ animation: "var(--animate-vinyl)", animationDuration: "6s" }}
    >
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ks-ink" />
      <span className="absolute left-1.5 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-ks-brass" />
      <span className="absolute right-1.5 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-ks-brass" />
      <span className="absolute left-1/2 top-1.5 h-1 w-1 -translate-x-1/2 rounded-full bg-ks-brass" />
    </span>
  );
}
