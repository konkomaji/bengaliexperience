import { motion } from "framer-motion";
import type { Quote } from "../../data/kabirsuman/quotes";

/**
 * One quote, styled as a clipped-out newspaper cutting rather than a
 * generic pull-quote box — pinned at a slight rotation, torn top edge
 * (`.ks-clipping` in index.css), because this section's whole material is
 * print and broadcast, and a quote from an interview is exactly the kind
 * of thing that gets clipped and kept.
 */
export function QuoteClipping({ quote, index }: { quote: Quote; index: number }) {
  const rotate = index % 2 === 0 ? -1.4 : 1.6;
  return (
    <motion.figure
      initial={{ opacity: 0, y: 18, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 220, damping: 20, delay: index * 0.08 }}
      whileHover={{ rotate: 0, scale: 1.015 }}
      className="ks-clipping shrink-0 snap-start bg-ks-paper-bright px-5 pb-5 pt-6 sm:w-[300px]"
    >
      {quote.bn && (
        <p className="ks-bengali mb-2 text-[16px] leading-snug text-ks-ink">"{quote.bn}"</p>
      )}
      <blockquote className="text-[14px] italic leading-snug text-ks-ink">"{quote.en}"</blockquote>
      <figcaption className="ks-mono mt-3 text-[10px] uppercase tracking-[0.12em] text-ks-red">
        {quote.speaker} <span className="text-ks-ink-muted">— {quote.source}, {quote.date}</span>
      </figcaption>
    </motion.figure>
  );
}
