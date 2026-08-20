import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * A gentle scroll-tied parallax on a hero photo: the image drifts a little
 * slower than the page around it, the small bit of depth Material 3
 * Expressive layouts lean on instead of a static, flat photo block. Driven
 * by framer-motion's scroll progress rather than a scroll event listener,
 * so it runs on the compositor rather than re-rendering on every pixel.
 *
 * The image is deliberately oversized (110%, inset -30px) inside a clipped,
 * fixed-aspect frame: translating it up to 24px either way must never
 * expose bare frame edges, so it has to overflow the frame by more than the
 * travel distance on every side, in both axes.
 *
 * Off entirely under prefers-reduced-motion (see useReducedMotion below),
 * on top of the CSS-level kill switch in index.css — belt and braces,
 * because this one is JS-driven and the CSS rule alone can't reach it.
 */
export function ParallaxFigure({
  src,
  alt,
  aspect = "3/2",
  children,
}: {
  src: string;
  alt: string;
  aspect?: string;
  /** figcaption or other overlay content, rendered below the frame */
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-24, 24]);

  return (
    <figure className="mt-7 overflow-hidden rounded-3xl border border-tara-outline-variant">
      <div ref={ref} className="relative overflow-hidden" style={{ aspectRatio: aspect }}>
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ y }}
          className="absolute -inset-8 h-[calc(100%+64px)] w-[calc(100%+64px)] object-cover"
        />
      </div>
      {children}
    </figure>
  );
}
