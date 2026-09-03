import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UTTAMKUMAR_NAV, type UttamKumarNavItem } from "../../data/uttamkumar/nav";

/**
 * The section picker, replacing a conventional header tab-strip on purpose:
 * a horizontal reel of ticket stubs you scroll/drag through like spinning a
 * physical film-select dial. Whichever stub sits nearest the centre is "lit"
 * — bigger, gold-lined, glowing — and the rest recede by distance, so the
 * strip itself looks like something with depth rather than a flat menu.
 *
 * CSS scroll-snap does the actual "settling," so it works with touch, mouse
 * drag-to-scroll and a trackpad with no custom drag physics to get wrong;
 * this component's own job is just watching scroll position to know which
 * stub is centred, for the lit/receded styling.
 */
export function FilmReelNav({ active }: { active: UttamKumarNavItem["id"] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [centeredId, setCenteredId] = useState<string>(active);

  // Keep the active page's stub centred on first paint and whenever the
  // active section changes via a click elsewhere (not just a drag here).
  useEffect(() => {
    const el = itemRefs.current.get(active);
    el?.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    setCenteredId(active);
  }, [active]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect();
        const mid = trackRect.left + trackRect.width / 2;
        let closestId = centeredId;
        let closestDist = Infinity;
        for (const [id, el] of itemRefs.current) {
          const r = el.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid);
          if (d < closestDist) {
            closestDist = d;
            closestId = id;
          }
        }
        setCenteredId(closestId);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {/* fade masks at each edge, so the reel visibly continues offscreen */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-uk-void-dim to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-uk-void-dim to-transparent" />

      <div
        ref={trackRef}
        aria-label="Uttam Kumar tribute sections"
        role="tablist"
        className="uk-mono flex snap-x snap-mandatory gap-2 overflow-x-auto px-[calc(50%-38px)] py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {UTTAMKUMAR_NAV.map((item) => {
          const isCentered = item.id === centeredId;
          return (
            <Link
              key={item.id}
              ref={(el) => {
                if (el) itemRefs.current.set(item.id, el);
                else itemRefs.current.delete(item.id);
              }}
              to={item.path}
              role="tab"
              aria-selected={item.id === active}
              className="flex shrink-0 snap-center flex-col items-center gap-1 transition-[transform,opacity] duration-200 ease-out"
              style={{
                transform: isCentered ? "scale(1.12) translateY(-2px)" : "scale(0.86)",
                opacity: isCentered ? 1 : 0.5,
              }}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors ${
                  isCentered
                    ? "border-uk-gold bg-uk-gold-container/40 text-uk-gold shadow-[0_0_18px_rgba(216,169,74,0.45)]"
                    : "border-uk-outline-variant bg-uk-void-dim text-uk-on-void-muted"
                }`}
              >
                <item.icon size={18} />
              </span>
              <span
                className={`whitespace-nowrap text-[9.5px] font-semibold uppercase tracking-[0.08em] ${
                  isCentered ? "text-uk-gold" : "text-uk-on-void-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
