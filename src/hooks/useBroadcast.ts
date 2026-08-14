import { useCallback, useEffect, useRef, useState } from "react";
import { BROADCAST, HAS_BROADCAST } from "../data/broadcast";
import { loadYouTubeApi } from "./useYouTubeApi";

/**
 * The Mahalaya broadcast player.
 *
 * The bus needs a whole engine — shuffling, a weighted opening pick, rolling
 * from a dead list to a live one, a watchdog. This needs none of it. There is
 * one recording, it plays from the beginning, and the only state anyone cares
 * about is how far through it is, because the scene's dawn is timed to that.
 *
 * The YouTube iframe is parked off-screen and used purely as an audio engine,
 * the same trick as the bus. Like the bus, `play()` unmutes and resets the
 * volume on every call, so the very first press starts it audibly — browsers
 * block audible autoplay until a gesture, and the play button is that gesture.
 */
export interface BroadcastPlayer {
  /** the player has loaded and can be started */
  ready: boolean;
  /** no recording is wired up, or the video refused to load */
  unavailable: boolean;
  playing: boolean;
  /** true once it has been started at least once */
  started: boolean;
  currentTime: number;
  duration: number;
  /** 0 to 1 through the broadcast — what the dawn is driven from */
  progress: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
}

export function useBroadcast(): BroadcastPlayer {
  const playerRef = useRef<YT.Player | null>(null);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(!HAS_BROADCAST);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(BROADCAST.durationSec);

  useEffect(() => {
    if (!HAS_BROADCAST) return;
    let cancelled = false;

    // An off-screen, clipped wrapper with an inner target the API replaces.
    // The wrapper has to hold the position, not the target: YT.Player swaps the
    // element it is given for a fresh iframe and the target's own styles go with
    // it, so pointing the API straight at the positioned node left the video
    // visible at its default size. The wrapper stays put and hides it.
    const wrap = document.createElement("div");
    wrap.setAttribute("aria-hidden", "true");
    wrap.style.cssText =
      "position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;pointer-events:none;";
    const target = document.createElement("div");
    wrap.appendChild(target);
    document.body.appendChild(wrap);

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(target, {
        videoId: BROADCAST.videoId,
        playerVars: { playsinline: 1, controls: 0, rel: 0, modestbranding: 1, origin: window.location.origin },
        events: {
          onReady: (e) => {
            const d = e.target.getDuration?.() ?? 0;
            if (d > 0) setDuration(d);
            setReady(true);
          },
          onStateChange: (e) => {
            const S = YT.PlayerState;
            if (e.data === S.PLAYING) {
              setPlaying(true);
              setStarted(true);
              const d = e.target.getDuration?.();
              if (d) setDuration(d);
            } else if (e.data === S.PAUSED || e.data === S.ENDED) {
              setPlaying(false);
            }
          },
          onError: () => setUnavailable(true),
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* player may not have finished constructing */
      }
      wrap.remove();
    };
  }, []);

  // While it is playing, read the clock a few times a second so the dawn moves
  // smoothly rather than in one-second steps.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setCurrentTime(p.getCurrentTime?.() ?? 0);
      const d = p.getDuration?.();
      if (d && d > 0) setDuration((prev) => (Math.abs(prev - d) > 1 ? d : prev));
    }, 250);
    return () => window.clearInterval(id);
  }, [playing]);

  const play = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.unMute?.();
    p.setVolume?.(100);
    p.playVideo?.();
  }, []);

  const pause = useCallback(() => playerRef.current?.pauseVideo?.(), []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause]);
  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo?.(seconds, true);
    setCurrentTime(seconds);
  }, []);

  const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  return { ready, unavailable, playing, started, currentTime, duration, progress, play, pause, toggle, seek };
}
