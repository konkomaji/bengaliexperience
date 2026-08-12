import { useState } from "react";
import type { RouteDef } from "../data/routes";

/**
 * The scene behind everything.
 *
 * Deliberately NOT a coded/animated vehicle: the whole scene — bus, road,
 * hills, sky — is a single pre-rendered illustration, exactly how the
 * reference site does it. Trying to draw a convincing bus in SVG is a losing
 * game; one good image beats it instantly and costs nothing at runtime.
 *
 * Layer stack, back to front:
 *   0  flat dusk gradient (paints instantly, also the fallback if the
 *      hero image is missing or still generating)
 *   1  the hero illustration, object-cover, focal point panned per
 *      breakpoint via --hero-position so the bus survives narrow screens
 *   2  drifting cloud strip (2x-wide tiled PNG, translateX -50% loop)
 *   3  legibility washes — top and bottom darkened so header/player text reads
 *   4  film grain
 */
export function HeroScene({ route }: { route: RouteDef }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-30 overflow-hidden bg-surface">
      {/* 0 — dusk gradient base */}
      <div
        className="animate-settle absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #150803 0%, #2a1810 26%, #4a2a18 46%, #6b3a18 66%, #40200c 84%, #150803 100%)",
        }}
      />

      {/* 1 — hero illustration */}
      {!failed && (
        <img
          src={route.hero}
          alt=""
          fetchPriority="high"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover transition-opacity duration-[1200ms] ease-[var(--ease-glide)]"
          style={{ objectPosition: "var(--hero-position)", opacity: loaded ? 1 : 0 }}
        />
      )}

      {/* 2 — drifting clouds. Kept very low opacity: the hero illustrations
             already have rich painted skies, so this layer is only here to
             add slow motion, not to add cloud detail on top of cloud detail. */}
      <div
        className="absolute inset-x-0 top-0 h-[46%] opacity-[0.13] mix-blend-screen"
        style={{
          maskImage: "linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%)",
        }}
      >
        <div className="animate-drift flex h-full w-[200%]">
          <CloudStrip />
          <CloudStrip />
        </div>
      </div>

      {/* 3 — legibility washes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(12,5,2,0.72) 0%, rgba(12,5,2,0.18) 22%, rgba(12,5,2,0.05) 46%, rgba(12,5,2,0.55) 74%, rgba(12,5,2,0.95) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 85% at 50% 45%, rgba(12,5,2,0) 38%, rgba(12,5,2,0.55) 100%)" }}
      />

      {/* 4 — film grain */}
      <svg className="absolute inset-0 size-full opacity-[0.11] mix-blend-soft-light">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={17} stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
    </div>
  );
}

/**
 * One tile of the cloud strip. Uses the generated transparent PNG when it's
 * present; the inline blurred ellipses underneath keep the layer from being
 * empty before the asset exists, and read as haze either way.
 */
function CloudStrip() {
  return (
    <div className="relative h-full w-1/2 shrink-0">
      <svg viewBox="0 0 800 300" preserveAspectRatio="none" className="size-full opacity-60 blur-[6px]">
        <ellipse cx="110" cy="120" rx="150" ry="30" fill="#fff" opacity="0.35" />
        <ellipse cx="360" cy="80" rx="190" ry="26" fill="#fff" opacity="0.28" />
        <ellipse cx="620" cy="140" rx="160" ry="24" fill="#fff" opacity="0.3" />
      </svg>
      <img
        src="/hero/clouds.png"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
        onError={(e) => {
          // asset not supplied yet — fall back to the inline haze above
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}
