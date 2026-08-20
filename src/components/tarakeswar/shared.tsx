import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { QA } from "../../data/seo";

/**
 * Shared building blocks for every Tarakeswar page: a hero, a fact strip, a
 * section heading and a native-accordion FAQ block. Kept in one file because
 * five pages (four static, one templated for eleven blog posts) lean on the
 * same handful of shapes, and repeating them five times is the kind of
 * duplication that goes stale first.
 */

export function TaraHero({
  eyebrow,
  h1,
  intro,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-tara-primary">{eyebrow}</p>
      <h1 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-tight text-tara-on-surface sm:text-4xl">
        {h1}
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-tara-on-surface-muted sm:text-base">{intro}</p>
    </motion.header>
  );
}

/** The fact strip: short, single-claim lines in pill-shaped chips, the same
 *  shape the FAQ answers are written in, just compressed further. */
export function TaraFacts({ facts }: { facts: string[] }) {
  return (
    <ul className="mt-6 flex flex-col gap-2.5">
      {facts.map((f, i) => (
        <motion.li
          key={f}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
          className="flex items-start gap-2.5 rounded-xl bg-tara-surface-container px-3.5 py-2.5 text-[13px] leading-snug text-tara-on-surface"
        >
          <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-tara-primary" />
          {f}
        </motion.li>
      ))}
    </ul>
  );
}

export function TaraSection({
  id,
  heading,
  icon,
  children,
}: {
  id?: string;
  heading: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="mt-10 scroll-mt-20 sm:mt-14">
      <h2
        id={id ? `${id}-h` : undefined}
        className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-tara-on-surface-muted"
      >
        {icon}
        {heading}
      </h2>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

/** Plain-language paragraphs, the shape most blog-post sections and page
 *  bodies are written in. */
export function TaraProse({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-3.5 text-[14.5px] leading-relaxed text-tara-on-surface/90 sm:text-[15px]">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  );
}

/** Native <details>/<summary>: no JS state needed, works with keyboard and
 *  screen readers out of the box, and the FAQPage JSON-LD next to it carries
 *  the same Q/A for anything reading structured data instead. */
export function TaraFaq({ items }: { items: QA[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((f) => (
        <details
          key={f.q}
          className="group rounded-2xl border border-tara-outline-variant bg-tara-surface open:bg-tara-surface-container"
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[14px] font-bold text-tara-on-surface marker:content-none">
            {f.q}
            <span
              aria-hidden
              className="shrink-0 text-lg font-light text-tara-primary transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="px-4 pb-4 text-[13.5px] leading-relaxed text-tara-on-surface-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** A saturated, tonal gradient band, the section's one recurring "Material 3
 *  Expressive" flourish: big, soft-edged colour under the hero, built purely
 *  from the theme tokens so it always lands on a pairing that already works
 *  in both directions. */
export function TaraGradientBand({ variant = "primary" }: { variant?: "primary" | "secondary" }) {
  const a = variant === "primary" ? "var(--color-tara-primary)" : "var(--color-tara-secondary)";
  const b = variant === "primary" ? "var(--color-tara-secondary)" : "var(--color-tara-tertiary)";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-[0.16] blur-3xl sm:h-96"
      style={{ background: `radial-gradient(60% 60% at 30% 0%, ${a}, transparent), radial-gradient(50% 50% at 85% 15%, ${b}, transparent)` }}
    />
  );
}
