import { useRef } from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../data/brand";
import { PUJA_START } from "../data/broadcast";
import { MAHALAYA_VERSION } from "../data/mahalayaGeometry";
import { PAGE_PATH, PAGE_SEO } from "../data/seo";
import { buildJsonLd } from "../lib/jsonld";
import { useAboardCount } from "../hooks/useAboardCount";
import { useBroadcast } from "../hooks/useBroadcast";
import { useCountdown } from "../hooks/useCountdown";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { useISTClock } from "../hooks/useISTClock";
import { useViewport } from "../hooks/useViewport";
import { mahalayaLayout } from "../lib/mahalayaLayout";
import { DawnScene } from "../components/DawnScene";
import { JsonLd } from "../components/JsonLd";

/**
 * Mahalaya. Almost nothing is written; the room is the whole thing.
 *
 * There is no play button and no explanation — you press the radio and the
 * broadcast starts, and the sky in the window does the rest. One line of type,
 * a live countdown to the pujo, and the small hours on the clock. Everything
 * else is felt.
 */
export function MahalayaPage() {
  const broadcast = useBroadcast();
  const clock = useISTClock();
  const listening = useAboardCount();
  const puja = useCountdown(PUJA_START);
  const { w: vw, h: vh } = useViewport();
  const { radio } = mahalayaLayout(vw, vh);

  const seo = PAGE_SEO.mahalaya;
  useDocumentHead(seo, PAGE_PATH.mahalaya);

  const inviting = broadcast.ready && !broadcast.started && !broadcast.unavailable;

  // The tuning knob scrubs the broadcast, the way you would drag a video: a
  // drag across half the screen runs the whole hour and a half, and because the
  // dawn is driven by how far in we are, turning the knob turns the sky.
  const drag = useRef<{ x: number; t: number } | null>(null);
  const onKnobDown = (e: React.PointerEvent) => {
    if (!broadcast.ready) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, t: broadcast.currentTime };
  };
  const onKnobMove = (e: React.PointerEvent) => {
    const s = drag.current;
    if (!s) return;
    const dt = ((e.clientX - s.x) / (vw * 0.55)) * broadcast.duration;
    broadcast.seek(Math.max(0, Math.min(broadcast.duration, s.t + dt)));
  };
  const onKnobUp = () => {
    drag.current = null;
  };

  return (
    <>
      <JsonLd data={buildJsonLd("mahalaya")} />
      <DawnScene progress={broadcast.progress} playing={broadcast.playing} />

      {/* মা আসছেন and the countdown, together in the bottom-right, a little up
          from the foot. মা আসছেন glows in slowly as the broadcast goes on —
          faint at the start, blazing by the time it ends. */}
      <style>{MAA_CSS}</style>
      <div
        className="maa-block pointer-events-none fixed z-10 flex flex-col items-center text-center"
        style={{ right: "3.5%", bottom: "10%", width: "min(34vw, 270px)" }}
      >
        <img
          src={`/scene/maha-maa.webp?v=${MAHALAYA_VERSION}`}
          alt="মা আসছেন — the Mother is coming"
          className="maa-glow-el h-auto w-full"
          style={{ opacity: 0.16 + 0.84 * broadcast.progress, transition: "opacity 1s linear" }}
        />
        <div className="timer-glow mt-1.5 flex items-start justify-center gap-1.5 tabular-nums sm:gap-2" style={{ color: "#fdf4e6" }}>
          {[
            { v: puja.days, l: "days" },
            { v: puja.hours, l: "hrs", pad: true },
            { v: puja.minutes, l: "min", pad: true },
            { v: puja.seconds, l: "sec", pad: true },
          ].map((c, i) => (
            <div key={c.l} className="flex items-start">
              {i > 0 && (
                <span className="timer-dot font-display px-1 text-xl font-bold leading-none sm:text-2xl" aria-hidden>
                  :
                </span>
              )}
              <div className="flex flex-col items-center">
                <span className="font-display text-xl font-extrabold leading-none sm:text-2xl">
                  {c.pad ? String(c.v).padStart(2, "0") : c.v}
                </span>
                <span className="mt-0.5 text-[7px] uppercase tracking-[0.16em] opacity-70 sm:text-[8px]">{c.l}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* the radio is the control: a click target laid exactly over the set */}
      <button
        type="button"
        onClick={broadcast.toggle}
        disabled={!broadcast.ready}
        aria-label={broadcast.playing ? "Pause the broadcast" : broadcast.started ? "Resume the broadcast" : "Start the Mahalaya broadcast"}
        className="group fixed z-20 cursor-pointer"
        style={{ left: radio.x, top: radio.y, width: radio.w, height: radio.h }}
      >
        {inviting && (
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="block size-12 animate-ping rounded-full bg-amber-300/25" />
          </span>
        )}
      </button>

      {/* the tuning knob: drag it to scrub the broadcast, and the dawn turns
          with you, since the sky is driven by how far in we are */}
      <div
        onPointerDown={onKnobDown}
        onPointerMove={onKnobMove}
        onPointerUp={onKnobUp}
        onPointerCancel={onKnobUp}
        role="slider"
        aria-label="Drag to move through the broadcast"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(broadcast.progress * 100)}
        className="fixed z-30 cursor-ew-resize touch-none"
        style={{ left: radio.x + radio.w * 0.56, top: radio.y + radio.h * 0.62, width: radio.w * 0.42, height: radio.h * 0.36 }}
      />

      {/* everything readable, kept to a whisper */}
      <div className="pointer-events-none relative z-10 flex min-h-dvh flex-col px-5 sm:px-8">
        <header className="flex items-start justify-between pt-safe pt-5 sm:pt-7">
          <Link
            to={PAGE_PATH.home}
            className="font-display pointer-events-auto text-sm font-extrabold tracking-wide text-white/80 sm:text-base"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.85)" }}
          >
            {BRAND.nameEn}
          </Link>
          <div className="flex flex-col items-end gap-1 text-right">
            <p
              className="flex items-baseline tabular-nums leading-none text-white/80"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.85)" }}
              aria-label={`Kolkata time ${clock.hh}:${clock.mm} ${clock.period}`}
            >
              <span className="text-base font-semibold sm:text-lg">{clock.hh}</span>
              <span className="animate-blink px-0.5 text-base font-semibold text-amber-300/90 sm:text-lg">:</span>
              <span className="text-base font-semibold sm:text-lg">{clock.mm}</span>
              <span className="ml-1 text-[9px] font-semibold tracking-[0.14em] text-white/45">{clock.period}</span>
            </p>
            {listening !== null && (
              <p className="flex items-center gap-1.5 whitespace-nowrap text-[9px] uppercase tracking-[0.16em] text-white/55" aria-live="polite">
                <span className="relative flex size-1.5">
                  <span className="animate-beacon absolute inset-0 rounded-full bg-amber-300" />
                  <span className="relative size-1.5 rounded-full bg-amber-300" />
                </span>
                <span className="font-semibold tabular-nums text-white/80">{listening}</span>
                listening
              </p>
            )}
          </div>
        </header>

        {/* the one line, up top; the real heading held for a screen reader */}
        <h1 className="sr-only">{seo.h1}</h1>
        <p
          aria-hidden
          className="mx-auto mt-3 max-w-2xl text-center text-[10px] font-medium uppercase leading-relaxed tracking-[0.28em] text-amber-100/70 sm:mt-5 sm:text-xs sm:tracking-[0.34em]"
          style={{ textShadow: "0 1px 16px rgba(0,0,0,0.9)" }}
        >
          Experience the Mahalaya, the way it should be
        </p>

        {/* মা আসছেন and the countdown live in the scene now, behind the window
            bars — see DawnScene. */}
        <div className="flex-1" />
      </div>

      {/* the broadcast's progress, a hairline at the very foot of the screen */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-0.5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-amber-400/60 to-amber-200"
          style={{ width: `${broadcast.progress * 100}%`, transition: "width 0.3s linear" }}
        />
      </div>
    </>
  );
}

/** মা আসছেন and the timer float and glow together, in sync: the block bobs as
 *  one, and both glows run on the same 4s clock. */
const MAA_CSS = `
.maa-block { animation: maa-bob 6.5s ease-in-out infinite; }
.maa-glow-el { animation: maa-glow 4s ease-in-out infinite; }
.timer-glow { animation: timer-glow 4s ease-in-out infinite; }
@keyframes maa-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes maa-glow {
  0%, 100% { filter: drop-shadow(0 0 12px rgba(255,150,60,0.4)); }
  50% { filter: drop-shadow(0 0 30px rgba(255,160,70,0.72)); }
}
@keyframes timer-glow {
  0%, 100% { text-shadow: 0 1px 3px #000, 0 0 12px rgba(255,160,70,0.4); }
  50% { text-shadow: 0 1px 3px #000, 0 0 24px rgba(255,170,80,0.72); }
}
.timer-dot { color: #ffcf6a; animation: dot-blink 2.2s ease-in-out infinite; }
@keyframes dot-blink {
  0%, 100% { opacity: 0.25; text-shadow: 0 0 6px rgba(255,190,90,0.5); }
  50% { opacity: 1; text-shadow: 0 0 16px rgba(255,190,90,0.95); }
}
@media (prefers-reduced-motion: reduce) { .maa-block, .maa-glow-el, .timer-glow, .timer-dot { animation: none; } }
`;
