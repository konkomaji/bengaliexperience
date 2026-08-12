import { useCallback, useEffect, useRef, useState } from "react";
import type { Song } from "../data/songs.types";
import { loadYouTubeApi } from "./useYouTubeApi";

export type RepeatMode = "off" | "all" | "one";

export const PLAYER_MOUNT_ID = "yt-audio-mount";
const VOLUME_KEY = "be:volume";

/**
 * Wraps the YouTube IFrame player as a plain audio engine.
 *
 * The iframe itself is mounted off-screen (see Player.tsx) — we only ever use
 * it for sound, and show a spinning record instead. Everything here is the
 * transport: queue position, playback state, progress, shuffle/repeat.
 */
export function usePlayerEngine(queue: Song[]) {
  const playerRef = useRef<YT.Player | null>(null);
  const queueRef = useRef(queue);
  queueRef.current = queue;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("all");
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(VOLUME_KEY) : null;
    const n = saved ? Number(saved) : 80;
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 80;
  });

  // refs mirror state so the (once-only) player event handlers always read
  // current values without needing to be re-bound
  const indexRef = useRef(currentIndex);
  indexRef.current = currentIndex;
  const shuffleRef = useRef(shuffle);
  shuffleRef.current = shuffle;
  const repeatRef = useRef(repeat);
  repeatRef.current = repeat;
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const advance = useCallback((dir: 1 | -1) => {
    const q = queueRef.current;
    if (!q.length) return;
    if (shuffleRef.current && q.length > 1) {
      let next = Math.floor(Math.random() * q.length);
      if (next === indexRef.current) next = (next + 1) % q.length;
      setCurrentIndex(next);
      return;
    }
    setCurrentIndex((i) => (i + dir + q.length) % q.length);
  }, []);

  // create the player once
  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then((YTApi) => {
      if (cancelled) return;
      playerRef.current = new YTApi.Player(PLAYER_MOUNT_ID, {
        host: "https://www.youtube-nocookie.com",
        videoId: queueRef.current[0]?.youtubeId,
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(volumeRef.current);
            setIsReady(true);
          },
          onStateChange: (e) => {
            const S = window.YT!.PlayerState;
            if (e.data === S.PLAYING) {
              setIsPlaying(true);
              setDuration(e.target.getDuration());
            } else if (e.data === S.PAUSED) {
              setIsPlaying(false);
            } else if (e.data === S.ENDED) {
              if (repeatRef.current === "one") {
                e.target.seekTo(0, true);
                e.target.playVideo();
                return;
              }
              const atEnd = indexRef.current === queueRef.current.length - 1;
              if (repeatRef.current === "off" && !shuffleRef.current && atEnd) {
                setIsPlaying(false);
                return;
              }
              advance(1);
            }
          },
          // a dead/region-blocked video shouldn't stall the bus — skip it
          onError: () => advance(1),
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [advance]);

  // load whichever track the index points at
  const firstLoad = useRef(true);
  useEffect(() => {
    const p = playerRef.current;
    const song = queue[currentIndex];
    if (!isReady || !p || !song) return;
    // the constructor already cued track 0 — don't immediately reload it,
    // that would autoplay before the user has asked for anything
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    p.loadVideoById(song.youtubeId);
  }, [currentIndex, isReady, queue]);

  // poll progress only while actually playing
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setCurrentTime(p.getCurrentTime());
      setDuration(p.getDuration());
    }, 500);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const togglePlay = useCallback(() => (isPlaying ? pause() : play()), [isPlaying, play, pause]);

  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.min(100, Math.max(0, v));
      setVolumeState(clamped);
      playerRef.current?.setVolume(clamped);
      if (clamped > 0 && muted) {
        playerRef.current?.unMute();
        setMuted(false);
      }
      window.localStorage.setItem(VOLUME_KEY, String(clamped));
    },
    [muted],
  );

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  }, [muted]);

  const playIndex = useCallback(
    (i: number) => {
      if (i === currentIndex) {
        togglePlay();
        return;
      }
      setCurrentIndex(i);
      // loadVideoById autoplays, so reflect that optimistically
      setIsPlaying(true);
    },
    [currentIndex, togglePlay],
  );

  const next = useCallback(() => advance(1), [advance]);
  const prev = useCallback(() => {
    const p = playerRef.current;
    // standard behaviour: restart the track unless you're near its start
    if (p && p.getCurrentTime() > 4) {
      p.seekTo(0, true);
      return;
    }
    advance(-1);
  }, [advance]);

  const cycleRepeat = useCallback(
    () => setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off")),
    [],
  );
  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);

  return {
    currentSong: queue[currentIndex],
    currentIndex,
    isPlaying,
    isReady,
    currentTime,
    duration,
    volume,
    muted,
    shuffle,
    repeat,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    playIndex,
    next,
    prev,
    toggleShuffle,
    cycleRepeat,
  };
}

export type PlayerEngine = ReturnType<typeof usePlayerEngine>;
