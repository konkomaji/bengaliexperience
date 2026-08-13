import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "../data/brand";
import { PAGE_PATH, PAGE_SEO } from "../data/seo";

/**
 * The share affordance, dressed as a real bus ticket: cream stock, punched
 * perforation, tear-off counterfoil with a barcode. Sharing a "ticket" is a
 * lot more fun to send someone than a bare link, which is the entire point.
 *
 * It prints before it appears. A conductor's ticket comes off a machine, and
 * the two seconds of it feeding out is the difference between a card that
 * faded in and an object that was made for you. It also covers the moment
 * where the ticket would otherwise pop in fully formed, which always read as
 * a dialog rather than a thing.
 *
 * No route anywhere on it. There is one bus and you are on it; naming stops
 * made it look like a timetable for a service you had to choose.
 *
 * The link it shares is the bus page rather than the site root, so whoever
 * opens it lands on the thing they were sent, not on the shelf it sits on.
 */

/** How long the ticket takes to feed out of the machine. */
const PRINT_MS = 1700;

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
  const [printed, setPrinted] = useState(false);

  // Reset and re-print on every open, so the second look is not a card that
  // simply reappears. Anyone who has asked for less motion skips it entirely
  // and gets the ticket immediately.
  useEffect(() => {
    if (!open) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPrinted(true);
      return;
    }
    setPrinted(false);
    const t = window.setTimeout(() => setPrinted(true), PRINT_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  const shareUrl = BRAND.url + PAGE_PATH.busdriver;
  const shareText = song
    ? `"${song.title}" by ${song.artist}, on the ${PAGE_SEO.busdriver.h1}.`
    : PAGE_SEO.busdriver.title;

  const seat = String(seatNo).padStart(2, "0");
  const serial = serialFor(seat, song?.title ?? BRAND.nameEn);

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
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog" aria-modal="true" aria-label="Your ticket"
        aria-busy={!printed}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="w-full max-w-sm px-3 pb-safe"
      >
        {/* The machine. Sits above the slot the ticket comes out of, and
            leaves once there is nothing left to print. */}
        <motion.div
          animate={{ opacity: printed ? 0 : 1, y: printed ? -8 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          // Wider than the ticket, so the paper comes out of the machine
          // rather than appearing to be bigger than the thing printing it.
          className="relative mx-auto h-11 w-full rounded-t-xl border border-black/50 bg-[#241109] shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
        >
          <div className="flex h-full items-center justify-between px-3">
            <span className="font-display text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/45">
              {BRAND.nameEn}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              <span className="text-[8px] uppercase tracking-[0.22em] text-white/40">
                {printed ? "Ready" : "Printing"}
              </span>
            </span>
          </div>
          {/* the slot itself */}
          <div className="absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-black/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
        </motion.div>

        {/* Feed window. Clipped while printing so the ticket genuinely emerges
            from behind the machine rather than sliding over the top of it. */}
        <div className={`px-2 ${printed ? "" : "overflow-hidden"}`}>
          <motion.div
            initial={{ y: "-100%" }}
            // Stepped rather than smooth: paper leaves a machine in pulls, one
            // roller bite at a time, with a beat of stillness between each. A
            // linear glide reads as a slide-in transition, not as printing.
            animate={{
              y: ["-100%", "-84%", "-84%", "-60%", "-60%", "-36%", "-36%", "-15%", "-15%", "0%"],
            }}
            transition={{
              duration: PRINT_MS / 1000,
              times: [0, 0.14, 0.24, 0.38, 0.48, 0.62, 0.72, 0.86, 0.93, 1],
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          >
            <motion.div
              animate={printed ? { rotate: 0 } : { rotate: [0, 0.35, -0.25, 0.15, 0] }}
              transition={{ duration: PRINT_MS / 1000, ease: "linear" }}
            >
              <Ticket
                seat={seat}
                serial={serial}
                song={song}
                printed={printed}
                copied={copied}
                onShare={share}
                onClose={onClose}
              />
            </motion.div>
          </motion.div>
        </div>

        <p className="sr-only" aria-live="polite">
          {printed ? "Your ticket is ready." : "Printing your ticket."}
        </p>
      </motion.div>
    </motion.div>
  );
}

function Ticket({
  seat, serial, song, printed, copied, onShare, onClose,
}: {
  seat: string;
  serial: string;
  song: { title: string; artist: string } | undefined;
  printed: boolean;
  copied: boolean;
  onShare: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="flex overflow-hidden rounded-[var(--radius-md)] text-[#2a1f14] shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
      style={{
        // Real ticket stock: a warm base with a fibre speckle and a slight
        // top-to-bottom shade, so it is not a flat rectangle of cream.
        backgroundColor: "#f4ecd8",
        backgroundImage:
          "radial-gradient(circle at 12% 18%, rgba(120,90,40,0.07) 0 1px, transparent 1px)," +
          "radial-gradient(circle at 68% 62%, rgba(120,90,40,0.06) 0 1px, transparent 1px)," +
          "linear-gradient(180deg, #f7f0de 0%, #f1e7cf 62%, #eadfc2 100%)",
        backgroundSize: "17px 17px, 23px 23px, 100% 100%",
      }}
    >
      {/* main stub */}
      <div className="flex-1 px-4 pb-4 pt-3.5">
        {/* branding */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-[13px] font-extrabold uppercase leading-none tracking-[0.06em]">
              {BRAND.nameEn}
            </p>
            <p className="mt-1 text-[8px] uppercase tracking-[0.24em] text-[#2a1f14]/55">
              {PAGE_SEO.busdriver.h1}
            </p>
          </div>
          <span
            className="shrink-0 rounded-sm border-2 border-[#b23a1f] px-1.5 py-0.5 text-[9px] font-black tracking-[0.18em] text-[#b23a1f]"
            style={{ transform: "rotate(-7deg)", opacity: 0.85 }}
          >
            FREE
          </span>
        </div>

        <Rule />

        <p className="text-[8px] uppercase tracking-[0.22em] text-[#2a1f14]/50">Now playing</p>
        <p className="mt-0.5 font-display text-sm font-bold leading-snug">
          {song?.title ?? BRAND.nameEn}
        </p>
        <p className="truncate text-[11px] text-[#2a1f14]/70">
          {song?.artist ?? "A whole playlist, actually"}
        </p>

        <Rule />

        <dl className="flex items-end justify-between font-mono text-[10px] text-[#2a1f14]/75">
          <div>
            <dt className="text-[7px] uppercase tracking-[0.2em] text-[#2a1f14]/45">Seat</dt>
            <dd className="text-[13px] font-bold tracking-wider text-[#2a1f14]">{seat}</dd>
          </div>
          <div className="text-right">
            <dt className="text-[7px] uppercase tracking-[0.2em] text-[#2a1f14]/45">Ticket no.</dt>
            <dd className="tracking-wider">{serial}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onShare}
          disabled={!printed}
          className="mt-3.5 w-full rounded-full bg-[#b23a1f] py-2.5 text-xs font-bold text-[#fdf3e4] transition-[transform,opacity] duration-150 ease-[var(--ease-expressive)] active:scale-95 disabled:opacity-45"
        >
          {copied ? "Link copied ✓" : "Share this ticket →"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-1 w-full py-1 text-[11px] text-[#2a1f14]/50"
        >
          Close
        </button>
      </div>

      {/* perforation */}
      <div className="relative w-0 border-l-2 border-dashed border-[#2a1f14]/30">
        <span className="absolute -left-[9px] -top-[9px] size-[18px] rounded-full bg-black/75" />
        <span className="absolute -bottom-[9px] -left-[9px] size-[18px] rounded-full bg-black/75" />
      </div>

      {/* counterfoil */}
      <div className="flex w-[62px] shrink-0 flex-col items-center justify-between bg-[#e6d9b8] py-3.5">
        <div className="text-center">
          <p className="text-[7px] uppercase tracking-[0.16em] text-[#2a1f14]/50">Seat</p>
          <p className="font-mono text-sm font-bold leading-none">{seat}</p>
        </div>
        <Barcode seed={serial} />
        <p
          className="text-[6px] font-semibold uppercase tracking-[0.24em] text-[#2a1f14]/45"
          style={{ writingMode: "vertical-rl" }}
        >
          {BRAND.nameEn}
        </p>
      </div>
    </div>
  );
}

/** The dashed separator, at the one weight that reads as ticket stock. */
const Rule = () => <div className="my-2.5 border-t border-dashed border-[#2a1f14]/25" />;

/**
 * A stable ticket number.
 *
 * Derived from the seat and the track rather than random, so the same ride
 * prints the same number every time it is opened. A serial that changed on
 * each look would quietly tell you the ticket is decoration.
 */
function serialFor(seat: string, title: string): string {
  let h = 7;
  for (const s of `${seat}:${title}`) h = (h * 31 + s.charCodeAt(0)) % 1000000;
  return `${String(h).padStart(6, "0").slice(0, 2)}-${String(h).padStart(6, "0").slice(2)}`;
}

/** Bar widths derived from the serial, so a given ticket always renders the
 *  same barcode instead of flickering a new random one each frame. */
function Barcode({ seed }: { seed: string }) {
  const bars = Array.from(seed.replace(/\D/g, "")).map((c) => (c.charCodeAt(0) % 3) + 1);
  return (
    <svg viewBox={`0 0 ${bars.length * 4} 40`} width={16} height={46} className="my-1" aria-hidden>
      {bars.map((w, i) => (
        <rect key={i} x={i * 4} y={0} width={w} height={40} fill="#2a1f14" />
      ))}
    </svg>
  );
}
