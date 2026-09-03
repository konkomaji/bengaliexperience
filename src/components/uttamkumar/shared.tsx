import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { QA } from "../../data/seo";

/**
 * Shared building blocks for /uttamkumar pages — the role
 * kabirsuman/shared.tsx plays for that section, reskinned for the darkened
 * cinema-hall theme: a marquee-style hero, a ticket-stub fact strip, and
 * section dividers styled as a strip of film stock.
 */

export function UkHero({ eyebrow, h1, intro }: { eyebrow: string; h1: string; intro: string }) {
  return (
    <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      <p className="uk-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-uk-gold">{eyebrow}</p>
      <h1 className="uk-marquee mt-2 text-[32px] leading-[1.05] tracking-tight text-uk-on-void sm:text-[46px]">{h1}</h1>
      <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-uk-on-void-muted sm:text-base">{intro}</p>
    </motion.header>
  );
}

/** The fact strip, styled as a ticket stub pinned under the marquee. */
export function UkFacts({ facts }: { facts: string[] }) {
  if (!facts.length) return null;
  return (
    <ul className="mt-6 flex flex-col gap-2 border-l-2 border-uk-gold/70 pl-4">
      {facts.map((f, i) => (
        <motion.li
          key={f}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.08 + i * 0.04 }}
          className="text-[13px] leading-snug text-uk-on-void-muted"
        >
          {f}
        </motion.li>
      ))}
    </ul>
  );
}

export function UkSection({ id, heading, children }: { id?: string; heading: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="mt-12 scroll-mt-24 sm:mt-16">
      <div className="flex items-center gap-3">
        <h2 id={id ? `${id}-h` : undefined} className="uk-mono shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-uk-on-void-muted">
          {heading}
        </h2>
        <span aria-hidden className="uk-filmstrip h-[10px] flex-1" />
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function UkProse({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-3.5 text-[14.5px] leading-relaxed text-uk-on-void/90 sm:text-[15px]">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  );
}

export function UkFaq({ items }: { items: QA[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {items.map((f) => (
        <details key={f.q} className="group border border-uk-outline-variant bg-uk-void-dim open:bg-uk-curtain/30">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13.5px] font-semibold text-uk-on-void marker:content-none">
            {f.q}
            <span aria-hidden className="shrink-0 text-lg font-light text-uk-gold transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="px-4 pb-3.5 text-[13px] leading-relaxed text-uk-on-void-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** A "sources disagree / addressed honestly" callout — the same editorial
 *  move KsDispute makes for Kabir Suman, reused here for the harder parts of
 *  the life page and the Suchitra rumor. */
export function UkNote({ label = "Addressed honestly —", children }: { label?: string; children: ReactNode }) {
  return (
    <div className="uk-mono mt-2 border border-dashed border-uk-gold/50 bg-uk-gold-container/25 px-3 py-2 text-[11.5px] leading-relaxed text-uk-on-gold-container">
      <span className="font-semibold uppercase tracking-wide">{label} </span>
      {children}
    </div>
  );
}

/** A ticket-stub styled stat/label pill, used on film cards and the awards page. */
export function UkStub({ children }: { children: ReactNode }) {
  return (
    <span className="uk-mono inline-flex items-center gap-1 rounded-sm border border-uk-gold/50 bg-uk-gold-container/30 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-uk-on-gold-container">
      {children}
    </span>
  );
}
