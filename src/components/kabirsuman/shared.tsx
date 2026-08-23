import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { QA } from "../../data/seo";

/**
 * Shared building blocks for the /kabirsuman pages — the same role
 * src/components/tarakeswar/shared.tsx plays for that section, reskinned
 * for the archive theme: a masthead-style hero, a fact strip set as an
 * ink-stamped card rather than pills, and section dividers that look like a
 * catalogue card's rule line rather than a modern app heading.
 */

export function KsHero({ eyebrow, h1, intro }: { eyebrow: string; h1: string; intro: string }) {
  return (
    <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      <p className="ks-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ks-red">{eyebrow}</p>
      <h1
        style={{ fontFamily: "var(--font-ks-display)" }}
        className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-tight text-ks-ink sm:text-[42px]"
      >
        {h1}
      </h1>
      <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-ks-ink-muted sm:text-base">{intro}</p>
    </motion.header>
  );
}

/** The fact strip, styled as an index card pinned under the masthead. */
export function KsFacts({ facts }: { facts: string[] }) {
  return (
    <ul className="mt-6 flex flex-col gap-2 border-l-2 border-ks-red/60 pl-4">
      {facts.map((f, i) => (
        <motion.li
          key={f}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.08 + i * 0.04 }}
          className="text-[13px] leading-snug text-ks-ink-muted"
        >
          {f}
        </motion.li>
      ))}
    </ul>
  );
}

export function KsSection({ id, heading, children }: { id?: string; heading: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="mt-12 scroll-mt-24 sm:mt-16">
      <div className="flex items-center gap-3">
        <h2
          id={id ? `${id}-h` : undefined}
          className="ks-mono shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-ks-ink-muted"
        >
          {heading}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-ks-outline" />
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function KsProse({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-3.5 text-[14.5px] leading-relaxed text-ks-ink/90 sm:text-[15px]">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  );
}

export function KsFaq({ items }: { items: QA[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {items.map((f) => (
        <details key={f.q} className="group border border-ks-outline bg-ks-paper-bright open:bg-ks-paper-container">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13.5px] font-semibold text-ks-ink marker:content-none">
            {f.q}
            <span aria-hidden className="shrink-0 text-lg font-light text-ks-red transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="px-4 pb-3.5 text-[13px] leading-relaxed text-ks-ink-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** A disputed-fact callout: two readings side by side rather than one
 *  silently picked, the whole editorial stance this section takes on
 *  conflicting sources made visible as a UI element. */
export function KsDispute({ children }: { children: ReactNode }) {
  return (
    <div className="ks-mono mt-2 border border-dashed border-ks-brass/70 bg-ks-brass-container/40 px-3 py-2 text-[11.5px] leading-relaxed text-ks-on-brass-container">
      <span className="font-semibold uppercase tracking-wide">Sources disagree — </span>
      {children}
    </div>
  );
}
