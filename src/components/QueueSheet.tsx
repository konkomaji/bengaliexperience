import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Era, Song } from "../data/songs.types";
import { ERA_LABELS } from "../data/songs.types";
import { CloseIcon } from "./icons";

/**
 * The queue lives in a popup, not on the page — the hero scene stays the
 * hero. Era chips are the one filter kept, since "play me the 90s" is the
 * actual thing people want from a playlist spanning four decades.
 */
export function QueueSheet({
  open, onClose, songs, currentIndex, isPlaying, onPlay,
}: {
  open: boolean;
  onClose: () => void;
  songs: Song[];
  currentIndex: number;
  isPlaying: boolean;
  onPlay: (index: number) => void;
}) {
  const [era, setEra] = useState<Era | null>(null);

  const eras = useMemo(() => {
    const present = new Set(songs.map((s) => s.era));
    return (Object.keys(ERA_LABELS) as Era[]).filter((e) => present.has(e));
  }, [songs]);

  const rows = useMemo(
    () => songs.map((song, index) => ({ song, index })).filter(({ song }) => !era || song.era === era),
    [songs, era],
  );

  if (!open) return null;

  // Deliberately no AnimatePresence / exit animation. With framer-motion v13
  // under React 19 + StrictMode, the exit never flushed on its own — the node
  // lingered until some unrelated re-render (the header clock ticking) forced
  // it out, which meant a modal that visibly refused to close. Plain
  // conditional rendering unmounts instantly and reliably; we keep the enter
  // animation, and losing the exit fade is a fair trade.
  return (
    <>
      {(
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label="Playlist queue"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="flex max-h-[82vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[var(--radius-xl)] border border-white/12 bg-surface-container-high pb-safe shadow-2xl sm:rounded-[var(--radius-xl)]"
          >
            <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-4">
              <p className="font-display text-sm font-bold text-on-surface">
                প্লেলিস্ট · {songs.length} tracks
              </p>
              <button type="button" onClick={onClose} aria-label="Close queue"
                className="rounded-full p-1.5 text-on-surface-muted hover:text-on-surface">
                <CloseIcon />
              </button>
            </div>

            <div className="flex shrink-0 gap-1.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip active={era === null} onClick={() => setEra(null)} label="সব" />
              {eras.map((e) => (
                <Chip key={e} active={era === e} onClick={() => setEra(era === e ? null : e)} label={ERA_LABELS[e]} />
              ))}
            </div>

            <ul className="min-h-24 flex-1 overflow-y-auto px-2 pb-3" role="list">
              {rows.map(({ song, index }) => {
                const active = index === currentIndex;
                return (
                  <li key={song.id}>
                    <button
                      type="button" onClick={() => onPlay(index)}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left transition-colors ${active ? "bg-primary-container" : "hover:bg-white/5"}`}
                    >
                      <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-black/40">
                        <img src={`https://i.ytimg.com/vi/${song.youtubeId}/default.jpg`} alt="" loading="lazy" className="size-full object-cover opacity-90" />
                        {active && isPlaying && (
                          <span className="absolute inset-0 flex items-end justify-center gap-0.5 bg-black/55 pb-2">
                            {[0, 0.15, 0.3].map((d) => (
                              <span key={d} className="w-0.5 origin-bottom bg-primary"
                                style={{ height: 10, animation: "var(--animate-equalize)", animationDelay: `${d}s` }} />
                            ))}
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate font-display text-sm font-semibold ${active ? "text-primary" : "text-on-surface"}`}>
                          {song.titleRomanized}
                        </span>
                        <span className="block truncate text-xs text-on-surface-muted">{song.artist}</span>
                      </span>
                      <span className="shrink-0 text-[10px] tabular-nums text-on-surface-muted/70">{song.year}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="relative shrink-0 rounded-full px-3 py-1 text-xs font-medium text-white/75">
      {active && (
        <motion.span layoutId="era-pill" className="absolute inset-0 rounded-full bg-secondary"
          transition={{ type: "spring", stiffness: 500, damping: 34 }} />
      )}
      <span className={`relative z-10 whitespace-nowrap ${active ? "text-on-secondary" : ""}`}>{label}</span>
    </button>
  );
}
