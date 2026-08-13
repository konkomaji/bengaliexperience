import { useState } from "react";
import { motion } from "framer-motion";
import { SCENE } from "../data/scene";
import { BRAND } from "../data/brand";
import { PAGE_PATH, PAGE_SEO } from "../data/seo";

/**
 * The share affordance, dressed as a real bus ticket: cream stock, punched
 * perforation, tear-off counterfoil with a barcode. Sharing a "ticket" is a
 * lot more fun to send someone than a bare link, which is the entire point.
 *
 * The link it shares is the bus page rather than the site root, so whoever
 * opens it lands on the thing they were sent, not on the shelf it sits on.
 */
export function TicketSheet({
  open, onClose, song, seatNo,
}: {
  open: boolean;
  onClose: () => void;
  song: { title: string; artist: string } | undefined;
  /** position in the current playlist, printed as the seat number */
  seatNo: number;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = BRAND.url + PAGE_PATH.busdriver;
  const shareText = song
    ? `"${song.title}" by ${song.artist}. Aboard the ${SCENE.name} bus.`
    : PAGE_SEO.busdriver.title;
  const seat = `${SCENE.name.slice(0, 2).toUpperCase()}-${String(seatNo).padStart(2, "0")}`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: PAGE_SEO.busdriver.title, text: shareText, url: shareUrl });
        return;
      } catch {
        /* dismissed — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked; nothing sensible left to do */
    }
  }

  if (!open) return null;

  // No AnimatePresence here either — see the note in QueueSheet: its exit
  // never flushed under framer-motion v13 + React 19, leaving the modal stuck
  // on screen. Conditional render unmounts immediately.
  return (
    <>
      {(
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label="Your ticket"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="w-full max-w-sm pb-safe"
          >
            <div className="mx-3 flex overflow-hidden rounded-[var(--radius-lg)] bg-cream text-[#2a1f14] shadow-2xl">
              {/* main stub */}
              <div className="flex-1 px-5 pb-5 pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.28em] text-[#2a1f14]/50">Passenger copy</p>
                    <p className="font-display text-lg font-extrabold leading-tight">{SCENE.name}</p>
                  </div>
                  <span className="rounded-full border-2 border-[#b23a1f] px-2 py-1 text-[8px] font-black tracking-widest text-[#b23a1f]"
                    style={{ transform: "rotate(-8deg)" }}>
                    FREE
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-[#2a1f14]/60">{SCENE.ticker}</p>

                <div className="mt-3 border-t border-dashed border-[#2a1f14]/25 pt-2">
                  <p className="text-[8px] uppercase tracking-[0.22em] text-[#2a1f14]/50">Now playing</p>
                  <p className="mt-0.5 font-display text-sm font-bold leading-snug">
                    {song?.title ?? BRAND.nameEn}
                  </p>
                  <p className="text-[11px] text-[#2a1f14]/70">{song?.artist ?? "A whole playlist, actually"}</p>
                </div>

                <button
                  type="button" onClick={share}
                  className="mt-4 w-full rounded-full bg-[#b23a1f] py-2.5 text-xs font-bold text-[#fdf3e4] transition-transform duration-150 ease-[var(--ease-expressive)] active:scale-95"
                >
                  {copied ? "Copied ✓" : "Send it to one person →"}
                </button>
                <button type="button" onClick={onClose}
                  className="mt-1.5 w-full py-1 text-[11px] text-[#2a1f14]/50">
                  Close
                </button>
              </div>

              {/* perforation */}
              <div className="relative w-0 border-l-2 border-dashed border-[#2a1f14]/25">
                <span className="absolute -left-2 -top-2 size-4 rounded-full bg-black/70" />
                <span className="absolute -bottom-2 -left-2 size-4 rounded-full bg-black/70" />
              </div>

              {/* counterfoil */}
              <div className="flex w-16 shrink-0 flex-col items-center justify-between bg-[#e8dcc0] py-4">
                <div className="text-center">
                  <p className="text-[7px] uppercase tracking-widest text-[#2a1f14]/50">Seat</p>
                  <p className="font-mono text-xs font-bold">{seat}</p>
                </div>
                <Barcode seed={seat} />
                <p className="text-[6px] tracking-[0.2em] text-[#2a1f14]/40" style={{ writingMode: "vertical-rl" }}>
                  {BRAND.nameEn.toUpperCase()}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

/** Bar widths derived from the seat code, so a given ticket always renders
 *  the same barcode instead of flickering a new random one each frame. */
function Barcode({ seed }: { seed: string }) {
  const bars = Array.from(seed).map((c) => (c.charCodeAt(0) % 3) + 1);
  return (
    <svg viewBox={`0 0 ${bars.length * 4} 40`} width={14} height={48} className="my-1">
      {bars.map((w, i) => (
        <rect key={i} x={i * 4} y={0} width={w} height={40} fill="#2a1f14" />
      ))}
    </svg>
  );
}
