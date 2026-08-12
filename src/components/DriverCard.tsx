import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DRIVER } from "../data/brand";

/**
 * "Who's driving?" — the curator credit. A small avatar button in the header
 * that opens a card with the driver's name, a line about the playlist, and a
 * follow link.
 */
export function DriverCard() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // dismiss on outside click / Escape, like any popover should
  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="pointer-events-auto relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Who's driving?"
        className="animate-glint flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 ring-1 ring-white/25 transition-transform duration-200 ease-[var(--ease-expressive)] hover:scale-105 active:scale-95"
      >
        <Avatar />
        <span className="hidden whitespace-nowrap text-[11px] font-semibold text-white/85 sm:inline">
          Who&apos;s driving?
        </span>
      </button>

      {open && (
        <motion.div
          id="driver-card"
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.24, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute right-0 top-full z-40 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] border border-white/12 bg-surface-container-high/95 p-4 text-left shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <span className="size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
              <Avatar />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-bold text-on-surface">{DRIVER.name}</p>
              <p className="text-xs leading-snug text-on-surface-muted">{DRIVER.bio}</p>
            </div>
          </div>

          <a
            href={DRIVER.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold text-white transition-transform duration-150 ease-[var(--ease-expressive)] active:scale-95"
            style={{ background: "linear-gradient(90deg, #f9a01b 0%, #e1306c 55%, #a334c4 100%)" }}
          >
            <InstagramGlyph />
            Follow {DRIVER.handle}
          </a>

          <p className="mt-2 text-center text-[11px] text-on-surface-muted/80">{DRIVER.footnote}</p>
        </motion.div>
      )}
    </div>
  );
}

/** Simple conductor avatar — cap, face, uniform. */
function Avatar() {
  return (
    <svg viewBox="0 0 48 48" className="size-9 rounded-full" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#3a1b0c" />
      <ellipse cx="24" cy="46" rx="16" ry="12" fill="#6e2a2e" />
      <circle cx="24" cy="23" r="11" fill="#c98a5c" />
      <path d="M12 20a12 12 0 0 1 24 0c-3-2.5-6-1.5-12-1.5S15 17.5 12 20z" fill="#241a12" />
      <rect x="11" y="19" width="26" height="3.4" rx="1.7" fill="#1a120b" />
      <circle cx="19.5" cy="23.5" r="1.5" fill="#1c130c" />
      <circle cx="28.5" cy="23.5" r="1.5" fill="#1c130c" />
      <path d="M20 28.5q4 2.6 8 0" stroke="#1c130c" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
