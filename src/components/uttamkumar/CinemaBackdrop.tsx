import { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * The immersive layer the hub's marquee sits in front of: three drawn
 * layers moving at different speeds as the page scrolls (a spotlight glow,
 * a pair of projector beams, a drifting sprocket band) plus a scatter of
 * dust motes rising slowly through it — all code, no photography, for the
 * same legal reason the whole section has no self-hosted stills yet (see
 * /uttamkumar/credits). This is what "surreal, walk-into-it" is supposed to
 * look like on a page with no art budget: real depth from real motion,
 * not a flat hero image with text on top of it.
 *
 * Scroll-linked via framer-motion's window-level useScroll, not a fixed
 * per-component ref — the parallax should read against the whole page
 * scrolling past it, the way a cinema lobby would as you walked through it.
 */
export function CinemaBackdrop() {
  const { scrollY } = useScroll();

  const glowY = useTransform(scrollY, [0, 900], [0, -90]);
  const beamsY = useTransform(scrollY, [0, 900], [0, -220]);
  const beamsRotate = useTransform(scrollY, [0, 900], [0, 4]);
  const bandY = useTransform(scrollY, [0, 900], [0, 70]);

  const motes = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 5) % 100}%`,
        size: 2 + ((i * 7) % 4),
        duration: 10 + ((i * 13) % 12),
        delay: -((i * 3.7) % 14),
        drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 5) * 6),
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* back: a spotlight glow, as if one follow-spot hangs over the whole hall */}
      <motion.div
        style={{ y: glowY }}
        className="absolute left-1/2 top-[-20%] h-[70vh] w-[140vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(216,169,74,0.16)_0%,rgba(216,169,74,0.05)_35%,transparent_65%)]"
      />
      {/* mid: two angled projector beams, drawn as soft conic wedges */}
      <motion.div style={{ y: beamsY, rotate: beamsRotate }} className="absolute inset-0 opacity-70">
        <div className="absolute -left-[10%] top-[-10%] h-[120%] w-[55%] origin-top-left bg-[conic-gradient(from_100deg_at_0%_0%,rgba(216,169,74,0.10),transparent_28%)]" />
        <div className="absolute -right-[10%] top-[-10%] h-[120%] w-[55%] origin-top-right bg-[conic-gradient(from_260deg_at_100%_0%,rgba(216,169,74,0.08),transparent_28%)]" />
      </motion.div>
      {/* front: a drifting sprocket band, the film-strip motif in motion rather than static trim */}
      <motion.div
        style={{ y: bandY }}
        className="uk-sprockets absolute inset-x-0 bottom-[18%] h-4 opacity-40"
      />
      {/* dust motes, each on its own loop (see @keyframes uk-drift in index.css) */}
      {motes.map((m) => (
        <span
          key={m.id}
          className="uk-mote"
          style={
            {
              left: m.left,
              bottom: 0,
              "--uk-mote-size": `${m.size}px`,
              "--uk-mote-duration": `${m.duration}s`,
              "--uk-mote-delay": `${m.delay}s`,
              "--uk-mote-drift": `${m.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
