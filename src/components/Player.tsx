import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PlayerEngine } from "../hooks/usePlayerEngine";
import { PLAYER_MOUNT_ID } from "../hooks/usePlayerEngine";
import { Record } from "./Record";
import {
  PlayIcon, PauseIcon, NextIcon, PrevIcon,
  ShuffleIcon, RepeatIcon, VolumeIcon, QueueIcon, TicketIcon,
} from "./icons";

function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/**
 * The dock. Deliberately a short, wide bar: one row of info + transport,
 * one thin row of scrubber. Keeps the hero illustration visible behind it
 * instead of becoming a tall panel that eats the screen.
 */
export function Player({
  engine,
  onOpenQueue,
  onOpenTicket,
  queueSize,
}: {
  engine: PlayerEngine;
  onOpenQueue: () => void;
  onOpenTicket: () => void;
  queueSize: number;
}) {
  const song = engine.currentSong;
  const [scrub, setScrub] = useState<number | null>(null);
  const [volOpen, setVolOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const pct = engine.duration ? ((scrub ?? engine.currentTime) / engine.duration) * 100 : 0;

  function seekFromX(clientX: number) {
    const el = barRef.current;
    if (!el || !engine.duration) return;
    const r = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setScrub(ratio * engine.duration);
  }

  // keyboard shortcuts, matching the legend below the bar
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.code) {
        case "Space": e.preventDefault(); engine.togglePlay(); return;
        case "ArrowRight": engine.seek(Math.min(engine.duration, engine.currentTime + 5)); return;
        case "ArrowLeft": engine.seek(Math.max(0, engine.currentTime - 5)); return;
        case "ArrowUp": e.preventDefault(); engine.setVolume(engine.volume + 5); return;
        case "ArrowDown": e.preventDefault(); engine.setVolume(engine.volume - 5); return;
      }
      switch (e.key.toLowerCase()) {
        case "n": engine.next(); break;
        case "p": engine.prev(); break;
        case "q": onOpenQueue(); break;
        case "t": onOpenTicket(); break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [engine, onOpenQueue, onOpenTicket]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="pointer-events-auto w-full max-w-xl rounded-[var(--radius-lg)] border border-white/12 bg-surface-container/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl"
    >
      {/* audio-only YouTube iframe, parked off-screen */}
      <div className="pointer-events-none fixed -left-[9999px] top-0 size-px overflow-hidden" aria-hidden="true">
        <div id={PLAYER_MOUNT_ID} />
      </div>

      <div className="flex items-center gap-3">
        <Record
          thumbUrl={song ? `https://i.ytimg.com/vi/${song.youtubeId}/mqdefault.jpg` : undefined}
          isPlaying={engine.isPlaying}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold leading-tight text-on-surface">
            {song?.titleRomanized ?? "…"}
          </p>
          <p className="truncate text-[11px] leading-tight text-on-surface-muted">{song?.artist}</p>
          <p className="truncate font-display text-[11px] leading-tight text-on-surface-muted/70" lang="bn">
            {song?.title}
          </p>
        </div>

        <button
          type="button" onClick={engine.toggleShuffle} aria-pressed={engine.shuffle} aria-label="Shuffle"
          className={`hidden shrink-0 rounded-full p-2 transition-colors sm:block ${engine.shuffle ? "text-primary" : "text-on-surface-muted hover:text-on-surface"}`}
        >
          <ShuffleIcon />
        </button>

        <div className="flex shrink-0 items-center gap-0.5">
          <IconBtn label="Previous" onClick={engine.prev}><PrevIcon /></IconBtn>
          <button
            type="button" onClick={engine.togglePlay}
            aria-label={engine.isPlaying ? "Pause" : "Play"}
            className="flex size-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform duration-150 ease-[var(--ease-expressive)] active:scale-90"
          >
            {engine.isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </button>
          <IconBtn label="Next" onClick={engine.next}><NextIcon /></IconBtn>
        </div>

        <button
          type="button" onClick={engine.cycleRepeat} aria-label={`Repeat: ${engine.repeat}`}
          className={`relative hidden shrink-0 rounded-full p-2 transition-colors sm:block ${engine.repeat !== "off" ? "text-primary" : "text-on-surface-muted hover:text-on-surface"}`}
        >
          <RepeatIcon />
          {engine.repeat === "one" && (
            <span className="absolute right-0 top-0 flex size-3 items-center justify-center rounded-full bg-primary text-[7px] font-bold text-on-primary">1</span>
          )}
        </button>

        <IconBtn label={`Queue, ${queueSize} songs`} onClick={onOpenQueue} muted><QueueIcon /></IconBtn>
        <IconBtn label="Your ticket" onClick={onOpenTicket} muted><TicketIcon /></IconBtn>
      </div>

      {/* scrubber row, with volume tucked at the end */}
      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] tabular-nums text-on-surface-muted">
        <span className="w-8 text-right">{fmt(scrub ?? engine.currentTime)}</span>
        <div
          ref={barRef}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(engine.duration)}
          aria-valuenow={Math.round(scrub ?? engine.currentTime)}
          tabIndex={0}
          className="group relative h-4 flex-1 cursor-pointer touch-none"
          onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); seekFromX(e.clientX); }}
          onPointerMove={(e) => { if (e.buttons === 1) seekFromX(e.clientX); }}
          onPointerUp={(e) => {
            if (scrub !== null) engine.seek(scrub);
            setScrub(null);
            (e.target as Element).releasePointerCapture(e.pointerId);
          }}
        >
          <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/12" />
          <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow transition-opacity group-hover:opacity-100"
            style={{ left: `${pct}%` }}
          />
        </div>
        <span className="w-8">{fmt(engine.duration)}</span>

        <button
          type="button" onClick={() => setVolOpen((v) => !v)} aria-label="Volume" aria-expanded={volOpen}
          className={`shrink-0 rounded-full p-1 transition-colors ${volOpen ? "text-primary" : "text-on-surface-muted hover:text-on-surface"}`}
        >
          <VolumeIcon muted={engine.muted || engine.volume === 0} />
        </button>
        <AnimatePresence initial={false}>
          {volOpen && (
            <motion.input
              key="vol" type="range" min={0} max={100}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 56, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              value={engine.muted ? 0 : engine.volume}
              onChange={(e) => engine.setVolume(Number(e.target.value))}
              className="h-1 shrink-0 accent-[var(--color-primary)]"
              aria-label="Volume level"
            />
          )}
        </AnimatePresence>
      </div>

      {/* shortcut legend — desktop only */}
      <div className="mt-1.5 hidden flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9px] uppercase tracking-wide text-on-surface-muted/55 sm:flex">
        <Key k="Space" label="play" /><Key k="←→" label="seek" /><Key k="N P" label="track" />
        <Key k="Q" label="queue" /><Key k="T" label="ticket" /><Key k="H" label="horn" />
      </div>
    </motion.div>
  );
}

function IconBtn({
  children, onClick, label, muted,
}: { children: React.ReactNode; onClick: () => void; label: string; muted?: boolean }) {
  return (
    <button
      type="button" onClick={onClick} aria-label={label}
      className={`flex size-9 items-center justify-center rounded-full transition-transform duration-150 ease-[var(--ease-expressive)] hover:bg-white/5 active:scale-90 ${muted ? "text-on-surface-muted hover:text-on-surface" : "text-on-surface"}`}
    >
      {children}
    </button>
  );
}

function Key({ k, label }: { k: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0.5 font-mono text-[9px] normal-case">{k}</kbd>
      {label}
    </span>
  );
}
