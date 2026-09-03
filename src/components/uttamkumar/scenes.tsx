import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Layout primitives for the redesigned wings. Deliberately NOT a
 * hero-then-stacked-sections kit — that shape is what made this section
 * read as a recolour of the Kabir Suman archive. These are scene parts:
 * a full-viewport opening, an off-centre editorial split, a horizontal
 * rail, an oversized stat, a full-bleed band. Each wing composes its own
 * body out of them rather than filling in the same template.
 */

/** A full-viewport opening scene. The page starts as a room you're standing
 *  in, not a heading with paragraphs under it. */
export function Curtain({
  children,
  minHeight = "82svh",
}: {
  children: ReactNode;
  minHeight?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Kept small and clipped by the section: a parallax lift, not a drift that
  // slides the title down over whatever scene comes next.
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex items-center overflow-hidden px-5 sm:px-8" style={{ minHeight }}>
      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-5xl">
        {children}
      </motion.div>
      <ScrollCue />
    </section>
  );
}

function ScrollCue() {
  return (
    <motion.span
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.25, 0.8, 0.25], y: [0, 7, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className="uk-mono absolute bottom-6 left-1/2 -translate-x-1/2 text-[9.5px] uppercase tracking-[0.35em] text-uk-gold"
    >
      ↓
    </motion.span>
  );
}

/** Oversized display type, the marquee itself doing the work a heading
 *  usually does. Scales down hard on phones but stays disproportionate. */
export function BigTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={`uk-marquee text-[clamp(2.6rem,11vw,6.5rem)] leading-[0.92] tracking-[-0.02em] text-uk-on-void ${className}`}
    >
      {children}
    </h1>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="uk-mono text-[10px] uppercase tracking-[0.35em] text-uk-gold sm:text-[11px]">{children}</p>
  );
}

/** An off-centre editorial split: a wide column and a narrow one, reversed
 *  on alternating uses so consecutive blocks never line up the same way. */
export function Split({
  lead,
  aside,
  flip = false,
}: {
  lead: ReactNode;
  aside?: ReactNode;
  flip?: boolean;
}) {
  return (
    <div
      className={`mx-auto grid w-full max-w-5xl gap-8 px-5 sm:px-8 md:gap-12 ${
        aside ? (flip ? "md:grid-cols-[minmax(0,1fr)_1.7fr]" : "md:grid-cols-[1.7fr_minmax(0,1fr)]") : ""
      }`}
    >
      {aside && flip ? (
        <>
          <div className="min-w-0">{aside}</div>
          <div className="min-w-0">{lead}</div>
        </>
      ) : (
        <>
          <div className="min-w-0">{lead}</div>
          {aside && <div className="min-w-0">{aside}</div>}
        </>
      )}
    </div>
  );
}

/** A full-bleed band with its own ground, used to break the page's rhythm
 *  between scenes instead of a rule line and a heading. */
export function Band({
  children,
  label,
  tone = "curtain",
}: {
  children: ReactNode;
  label?: string;
  tone?: "curtain" | "void";
}) {
  return (
    <section
      className={`relative mt-16 border-y border-uk-outline-variant py-12 sm:mt-24 sm:py-16 ${
        tone === "curtain" ? "bg-uk-curtain/25" : "bg-uk-void-dim/70"
      }`}
    >
      {label && (
        <p className="uk-mono absolute -top-2.5 left-5 bg-uk-void px-2 text-[9.5px] uppercase tracking-[0.3em] text-uk-gold sm:left-8">
          {label}
        </p>
      )}
      {children}
    </section>
  );
}

/** A horizontally-scrolled rail — used where a grid would read as a
 *  catalogue page and this should read as a shelf you push along. */
export function Rail({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div>
      {label && (
        <p className="uk-mono mb-3 px-5 text-[9.5px] uppercase tracking-[0.3em] text-uk-on-void-muted sm:px-8">
          {label}
        </p>
      )}
      <div className="flex snap-x gap-3 overflow-x-auto px-5 pb-4 sm:gap-4 sm:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}

/** One oversized number with a caption — the awards wing's unit, and the
 *  reason it doesn't need a bulleted list. */
export function Stat({ value, label, note }: { value: ReactNode; label: string; note?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="border-l-2 border-uk-gold/60 pl-4"
    >
      <p className="uk-marquee text-[clamp(2.2rem,7vw,3.6rem)] leading-none text-uk-gold">{value}</p>
      <p className="mt-1.5 text-[13.5px] font-semibold leading-snug text-uk-on-void">{label}</p>
      {note && <p className="mt-1 text-[12px] leading-relaxed text-uk-on-void-muted">{note}</p>}
    </motion.div>
  );
}

/** Body copy at reading width, wherever a wing needs actual prose. */
export function Read({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-[62ch] text-[15px] leading-relaxed text-uk-on-void-muted sm:text-base ${className}`}>
      {children}
    </div>
  );
}
