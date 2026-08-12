import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { PlayerEngine } from "../hooks/usePlayerEngine";
import { cleanTitle } from "../lib/title";
import { CloseIcon } from "./icons";

/**
 * The queue: the live contents of whichever YouTube playlist is loaded, plus
 * chips to jump between playlists.
 *
 * The player only reports ids for the full list (titles come one at a time,
 * for the current video), so rows fetch their own title from YouTube's oEmbed
 * endpoint — lazily, only for rows scrolled into view, and cached across
 * opens so reopening the sheet is instant.
 */
const titleCache = new Map<string, string>();

export function QueueSheet({
  open, onClose, engine,
}: {
  open: boolean;
  onClose: () => void;
  engine: PlayerEngine;
}) {
  if (!open) return null;

  // No AnimatePresence: under framer-motion v13 + React 19 its exit never
  // flushed on its own, leaving the sheet stuck on screen until an unrelated
  // re-render. Conditional rendering unmounts immediately.
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog" aria-modal="true" aria-label="Playlist queue"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        className="flex max-h-[82vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[var(--radius-xl)] border border-white/12 bg-surface-container-high pb-safe shadow-2xl sm:rounded-[var(--radius-xl)]"
      >
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-4">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-on-surface">
              {engine.playlist.label}
            </p>
            <p className="truncate text-[11px] text-on-surface-muted">
              {engine.videoIds.length || engine.playlist.approxTracks} tracks · shuffled
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close queue"
            className="rounded-full p-1.5 text-on-surface-muted hover:text-on-surface">
            <CloseIcon />
          </button>
        </div>

        {/* playlist switcher */}
        <div className="flex shrink-0 gap-1.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {engine.playlists.map((p) => {
            const active = p.id === engine.playlist.id;
            return (
              <button key={p.id} type="button" onClick={() => engine.choosePlaylist(p)}
                className="relative shrink-0 rounded-full px-3 py-1 text-xs font-medium text-white/75">
                {active && (
                  <motion.span layoutId="playlist-pill" className="absolute inset-0 rounded-full bg-secondary"
                    transition={{ type: "spring", stiffness: 500, damping: 34 }} />
                )}
                <span className={`relative z-10 whitespace-nowrap ${active ? "text-on-secondary" : ""}`}>
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>

        <ul className="min-h-24 flex-1 overflow-y-auto px-2 pb-3" role="list">
          {engine.videoIds.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-on-surface-muted">Loading the playlist…</li>
          )}
          {engine.videoIds.map((vid, i) => (
            <QueueRow
              key={`${vid}-${i}`}
              videoId={vid}
              active={i === engine.index}
              isPlaying={engine.isPlaying}
              onPlay={() => { engine.playIndex(i); onClose(); }}
            />
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

function QueueRow({ videoId, active, isPlaying, onPlay }: {
  videoId: string; active: boolean; isPlaying: boolean; onPlay: () => void;
}) {
  const [title, setTitle] = useState(() => titleCache.get(videoId) ?? "");
  const ref = useRef<HTMLLIElement>(null);

  // only fetch a title once the row is actually near the viewport, so opening
  // a 100-track playlist doesn't fire 100 requests at once
  useEffect(() => {
    if (title || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d: { title?: string } | null) => {
            if (!d?.title) return;
            const clean = cleanTitle(d.title);
            titleCache.set(videoId, clean);
            setTitle(clean);
          })
          .catch(() => { /* unlisted or blocked — the thumbnail still shows */ });
      },
      { root: el.closest("ul"), rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [videoId, title]);

  return (
    <li ref={ref}>
      <button
        type="button" onClick={onPlay}
        aria-current={active ? "true" : undefined}
        className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left transition-colors ${active ? "bg-primary-container" : "hover:bg-white/5"}`}
      >
        <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-black/40">
          <img src={`https://i.ytimg.com/vi/${videoId}/default.jpg`} alt="" loading="lazy"
            className="size-full object-cover opacity-90" />
          {active && isPlaying && (
            <span className="absolute inset-0 flex items-end justify-center gap-0.5 bg-black/55 pb-2">
              {[0, 0.15, 0.3].map((d) => (
                <span key={d} className="w-0.5 origin-bottom bg-primary"
                  style={{ height: 10, animation: "var(--animate-equalize)", animationDelay: `${d}s` }} />
              ))}
            </span>
          )}
        </span>
        <span className={`min-w-0 flex-1 truncate font-display text-sm font-semibold ${active ? "text-primary" : "text-on-surface"}`}>
          {title || "…"}
        </span>
      </button>
    </li>
  );
}
