import { useCallback, useEffect, useRef, useState } from "react";
import { PLAYLISTS, type PlaylistDef } from "../data/playlists";
import { pickFollowUpPlaylist, pickOpeningPlaylist } from "../lib/selection";
import { canEmbedPlaylist } from "../lib/embeddable";
import { loadYouTubeApi } from "./useYouTubeApi";

export const PLAYER_MOUNT_ID = "yt-audio-mount";
const VOLUME_KEY = "be:volume";

/**
 * Where in a list to start.
 *
 * Taken from the declared track count rather than the loaded tracklist,
 * because this has to be decided before the player exists. If the count is
 * stale and the index overshoots, YouTube falls back to the first track,
 * which is exactly the behaviour this replaces, so a wrong guess costs
 * nothing.
 */
function randomStartIndex(p: PlaylistDef): number {
  return Math.floor(Math.random() * Math.max(1, Math.floor(p.approxTracks)));
}

export interface Track {
  videoId: string;
  title: string;
  author: string;
}

/**
 * Playback engine, driven by YouTube playlists rather than a hardcoded list.
 *
 * The player loads a whole playlist natively (`listType: "playlist"`), which
 * means the site always reflects whatever is on YouTube right now — add a song
 * there and it appears here with no redeploy.
 *
 * A playlist is chosen at random on every page load and shuffled, so no two
 * visitors start in the same place. When one list is exhausted the engine
 * rolls straight into another random one, so the bus never stops.
 *
 * **Nothing plays until the visitor presses play.** Browsers refuse to start
 * audible media before a user gesture, and the only way around that is to
 * start muted, which means the site either opens silently and pretends it is
 * playing, or nags for a second interaction to turn the sound on. Both are
 * worse than simply waiting. The play button *is* the gesture, so pressing it
 * can unmute and start audibly in one move: press once, hear music. The
 * playlist is cued at a random point in the meantime, so the track showing
 * before the press is the track that plays.
 */
export function usePlayerEngine() {
  const playerRef = useRef<YT.Player | null>(null);

  const [playlist, setPlaylist] = useState<PlaylistDef>(pickOpeningPlaylist);
  const playlistRef = useRef(playlist);
  playlistRef.current = playlist;

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(true);
  const [repeat, setRepeat] = useState(false);
  const [muted, setMuted] = useState(false); // nothing autoplays, so nothing needs muting
  /** every playlist YouTube has refused to load this session */
  const deadRef = useRef<Set<string>>(new Set());
  /** true once nothing is left to roll to — the bus really has broken down */
  const [stalled, setStalled] = useState(false);
  /** a paused player is not a stalled one; the watchdog must not fight the user */
  const userPausedRef = useRef(false);
  const errorRunRef = useRef(0);
  /**
   * Has the visitor asked for music yet?
   *
   * The watchdog treats "ready but not playing" as a stuck playlist, which is
   * correct once someone has pressed play and completely wrong before that,
   * when not playing is simply the resting state. Nothing may be diagnosed as
   * broken until playback has actually been asked for.
   */
  const startedRef = useRef(false);
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(VOLUME_KEY) : null;
    const n = saved ? Number(saved) : 80;
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 80;
  });
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  /** pull whatever the player currently knows into React state */
  const sync = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      const data = p.getVideoData?.();
      if (data?.video_id) {
        setTrack({ videoId: data.video_id, title: data.title ?? "", author: data.author ?? "" });
      }
      const list = p.getPlaylist?.();
      if (Array.isArray(list) && list.length) setVideoIds(list);
      const i = p.getPlaylistIndex?.();
      if (typeof i === "number" && i >= 0) setIndex(i);
      setDuration(p.getDuration?.() ?? 0);
    } catch {
      /* player not ready for these calls yet */
    }
  }, []);

  /**
   * Hop to a different playlist and keep going.
   *
   * `pickFollowUpPlaylist` skips everything already known dead, so a run of
   * unplayable lists walks down to a playable one instead of ping-ponging.
   * When it runs out there is genuinely nothing left to play and we say so
   * rather than sitting on "Boarding…" forever.
   */
  const rollRef = useRef<() => void>(() => {});

  /**
   * Load a list and then check that it actually loaded.
   *
   * `loadPlaylist` on a refused list does not always raise `onError`: if
   * something is already playing, YouTube can quietly keep playing it while
   * the app believes it switched. That shows the visitor one playlist name
   * over a different playlist's audio. So we ask the player, a beat later,
   * which list it really has — and if it isn't ours, the list is dead.
   */
  const verifyTimerRef = useRef<number | null>(null);

  /**
   * Did that list actually load?
   *
   * Neither obvious signal can be trusted. `getPlaylistId()` echoes back
   * whatever we asked for, even for a list YouTube refused, and `onError`
   * fires for a refused list built from `playerVars` but not always for one
   * arrived at via `loadPlaylist` — the player just keeps playing the old
   * list while the UI shows the new list's name.
   *
   * So compare the tracklist against the one we had before the call: empty,
   * or byte-for-byte the list we already had, means it never loaded. One
   * retry covers a slow network before the list is written off.
   */
  const verifyLoaded = useCallback(
    (p: PlaylistDef, before: string[] | null, attempt = 0) => {
      if (verifyTimerRef.current) window.clearTimeout(verifyTimerRef.current);
      verifyTimerRef.current = window.setTimeout(() => {
        if (playlistRef.current.id !== p.id) return; // superseded by a newer load
        const list = playerRef.current?.getPlaylist?.();

        const empty = !Array.isArray(list) || list.length === 0;
        // Same songs as before the call = the request was ignored. Compare
        // membership, not order: shuffle reorders the array, so `list[0]`
        // changes even when nothing was actually loaded.
        const previous = before?.length ? new Set(before) : null;
        const unchanged =
          !empty && !!previous && list.length === previous.size && list.every((id) => previous.has(id));

        if (empty || unchanged) {
          if (attempt < 1) {
            verifyLoaded(p, before, attempt + 1); // maybe it is just slow
            return;
          }
          deadRef.current.add(p.id);
          rollRef.current();
          return;
        }
        sync();
      }, 2500);
    },
    [sync],
  );

  /**
   * Turn shuffle on, once there is a list to shuffle.
   *
   * `setShuffle(true)` is a silent no-op if the tracklist has not arrived yet,
   * which is exactly how a "shuffled" playlist ends up opening on track one
   * for every visitor forever. So this waits for `getPlaylist()` to answer.
   *
   * Shuffle only governs where *next* goes. Where the session *starts* is
   * handled by `randomStartIndex` at load time, because that is the part
   * YouTube will not let you change once the player is running.
   */
  const enableShuffleRef = useRef<(attempt?: number) => void>(() => {});
  const enableShuffle = useCallback((attempt = 0) => {
    const player = playerRef.current;
    if (!player) return;
    const list = player.getPlaylist?.();
    if (!Array.isArray(list) || list.length === 0) {
      // ~5s of patience in 250ms steps. Beyond that the list is not coming and
      // verifyLoaded / onError own the failure.
      if (attempt < 20) window.setTimeout(() => enableShuffleRef.current(attempt + 1), 250);
      return;
    }
    player.setShuffle(true);
  }, []);
  enableShuffleRef.current = enableShuffle;

  const loadPlaylistInto = useCallback((p: PlaylistDef) => {
    const player = playerRef.current;
    if (!player) return;
    const before = player.getPlaylist?.() ?? null;
    player.loadPlaylist({ list: p.id, listType: "playlist", index: randomStartIndex(p) });
    enableShuffle();
    verifyLoaded(p, before);
  }, [verifyLoaded, enableShuffle]);

  /**
   * Reshuffle and keep going on the list we already have.
   *
   * With a single playlist there is nothing to roll to, so "the list ended"
   * must not mean "the bus is over". Reshuffling and restarting at a random
   * point is what a driver with one cassette does: flip it and keep driving.
   */
  const restartShuffled = useCallback(() => {
    const player = playerRef.current;
    if (!player) return false;
    const list = player.getPlaylist?.();
    if (!Array.isArray(list) || list.length === 0) return false;
    player.setShuffle(true);
    player.playVideoAt(Math.floor(Math.random() * list.length));
    player.playVideo();
    return true;
  }, []);

  const rollToNextPlaylist = useCallback(async () => {
    // ask oEmbed first: a refused list is skipped in ~100ms instead of costing
    // the visitor seconds of silence while the player fails on its own
    for (let attempt = 0; attempt < PLAYLISTS.length; attempt++) {
      const next = pickFollowUpPlaylist(playlistRef.current.id, deadRef.current);
      if (!next) break;
      if (!(await canEmbedPlaylist(next.id))) {
        deadRef.current.add(next.id);
        continue;
      }
      errorRunRef.current = 0;
      setPlaylist(next);
      setTrack(null);
      setVideoIds([]);
      loadPlaylistInto(next);
      return;
    }
    // Nothing to roll to. If the list we are on is still playable, that is not
    // a breakdown, it is just the end of the tape: reshuffle it and carry on.
    // Only a list that cannot play at all is worth stopping for.
    if (!deadRef.current.has(playlistRef.current.id) && restartShuffled()) return;
    setStalled(true);
  }, [loadPlaylistInto, restartShuffled]);
  rollRef.current = rollToNextPlaylist;

  /**
   * Mark the current list unplayable and move on.
   *
   * Except when there is nowhere to move to. With a single playlist, writing
   * it off over what is usually just a slow start ends the ride permanently:
   * the watchdog fires at 8s, the only list is declared dead, and the player
   * sits on "Boarding…" forever with nothing left to try. So when there is no
   * alternative, reload the same list from a different point and only give up
   * after a few honest attempts.
   */
  const soloRetriesRef = useRef(0);
  const abandonCurrentPlaylist = useCallback(() => {
    const current = playlistRef.current;
    const hasAlternative = PLAYLISTS.some(
      (p) => p.id !== current.id && !deadRef.current.has(p.id),
    );

    if (!hasAlternative) {
      if (soloRetriesRef.current < 3) {
        soloRetriesRef.current += 1;
        loadPlaylistInto(current);
        return;
      }
      setStalled(true);
      return;
    }

    deadRef.current.add(current.id);
    rollToNextPlaylist();
  }, [loadPlaylistInto, rollToNextPlaylist]);

  // create the player once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // settle on a list the embed will accept *before* building the player,
      // so the first thing the visitor hears isn't a refused list timing out
      for (let attempt = 0; attempt < PLAYLISTS.length; attempt++) {
        const candidate = playlistRef.current;
        if (await canEmbedPlaylist(candidate.id)) break;
        deadRef.current.add(candidate.id);
        const next = pickOpeningPlaylist(deadRef.current);
        if (deadRef.current.has(next.id)) break; // nothing left; let it fail honestly
        playlistRef.current = next;
        setPlaylist(next);
      }
      if (cancelled) return;
      const YTApi = await loadYouTubeApi();
      if (cancelled) return;
      playerRef.current = new YTApi.Player(PLAYER_MOUNT_ID, {
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          listType: "playlist",
          list: playlistRef.current.id,
          // Where the ride starts. Set here because it is the only place it
          // takes: once the player is running, YouTube ignores a jump issued
          // during startup, which is why every visitor used to open on the
          // same first track no matter what shuffle said.
          index: randomStartIndex(playlistRef.current),
          // Cue, do not play. The visitor's press is what starts the music,
          // and because that press is a real user gesture it is allowed to
          // start it audibly.
          autoplay: 0,
          mute: 0,
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
            e.target.unMute();
            // Shuffle governs what comes next. The opening track is already
            // random via the `index` playerVar, which is the only way to
            // choose it: playVideoAt during startup is quietly ignored, so
            // asking for a random track here left everyone on track one.
            enableShuffleRef.current();
            setIsReady(true);
            sync();
          },
          onStateChange: (e) => {
            const S = window.YT!.PlayerState;
            if (e.data === S.PLAYING) {
              setIsPlaying(true);
              errorRunRef.current = 0;
              soloRetriesRef.current = 0; // it started; the retry budget resets
              sync();
            } else if (e.data === S.PAUSED) {
              setIsPlaying(false);
            } else if (e.data === S.CUED) {
              sync();
            } else if (e.data === S.ENDED) {
              // YouTube advances within a playlist itself; reaching ENDED
              // means the list is finished, so roll into another one
              if (repeatRef.current) {
                e.target.playVideoAt(0);
              } else {
                rollToNextPlaylist();
              }
            }
          },
          // A removed / region-locked / non-embeddable video shouldn't stall
          // the bus. But error 150 on a list that never loaded is the *list*
          // being refused, not a track: `nextVideo()` on an empty playlist is
          // a no-op, which is exactly how the player used to sit on
          // "Boarding…" forever. Distinguish the two by whether we have a
          // tracklist at all.
          onError: () => {
            const list = playerRef.current?.getPlaylist?.();
            if (!Array.isArray(list) || !list.length) {
              abandonCurrentPlaylist();
              return;
            }
            // a whole run of dead videos means the list isn't worth staying on
            if (++errorRunRef.current > 4) {
              abandonCurrentPlaylist();
              return;
            }
            try {
              playerRef.current?.nextVideo();
            } catch {
              abandonCurrentPlaylist();
            }
          },
        },
      });
    })();
    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const repeatRef = useRef(repeat);
  repeatRef.current = repeat;

  /**
   * Watchdog. YouTube does not always report a refused list through `onError`
   * — sometimes the player simply never starts. If a freshly loaded playlist
   * hasn't reached PLAYING within 8s and the visitor didn't pause it, treat
   * the list as dead and roll on.
   */
  useEffect(() => {
    // Not before the visitor has asked for music. Sitting cued and silent is
    // the resting state now, not a symptom, and a watchdog that cannot tell
    // the difference would declare the playlist dead 8s after every page load.
    if (!startedRef.current) return;
    if (!isReady || isPlaying || stalled || userPausedRef.current) return;
    const id = window.setTimeout(() => {
      if (!userPausedRef.current) abandonCurrentPlaylist();
    }, 8000);
    return () => window.clearTimeout(id);
  }, [isReady, isPlaying, stalled, playlist.id, abandonCurrentPlaylist]);

  /**
   * Volume ducking, for the horn.
   *
   * The YouTube API only sets volume outright, so the fade is stepped by hand
   * — an instant drop and jump back sounds like a fault, a 200ms dip and a
   * 700ms recovery sounds like the driver leaning on the horn. The visitor's
   * chosen volume is never overwritten; ducking works below it and restores
   * to whatever it is when the horn releases.
   */
  const duckTimerRef = useRef<number | null>(null);
  const setDucked = useCallback((ducked: boolean) => {
    const p = playerRef.current;
    if (!p) return;
    if (duckTimerRef.current) window.clearInterval(duckTimerRef.current);

    const from = p.getVolume?.() ?? volumeRef.current;
    const to = ducked ? Math.round(volumeRef.current * 0.12) : volumeRef.current;
    // Fast out, slower back in. The return was 22 steps when the horn held for
    // 3.4s; against a 1.2s stab that left the music crawling back up long
    // after the horn had stopped, which read as a bug rather than a duck.
    const steps = ducked ? 6 : 14;
    let n = 0;

    duckTimerRef.current = window.setInterval(() => {
      n += 1;
      const v = from + (to - from) * (n / steps);
      playerRef.current?.setVolume(Math.round(v));
      if (n >= steps && duckTimerRef.current) {
        window.clearInterval(duckTimerRef.current);
        duckTimerRef.current = null;
      }
    }, 30);
  }, []);

  useEffect(() => () => {
    if (duckTimerRef.current) window.clearInterval(duckTimerRef.current);
  }, []);

  // poll progress + playlist position while playing
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setCurrentTime(p.getCurrentTime?.() ?? 0);
      setDuration(p.getDuration?.() ?? 0);
      const i = p.getPlaylistIndex?.();
      if (typeof i === "number" && i >= 0 && i !== index) sync();
    }, 500);
    return () => window.clearInterval(id);
  }, [isPlaying, index, sync]);

  /**
   * Start playing, audibly.
   *
   * Every call unmutes and resets the volume first. That is not redundant: the
   * press that reaches here is the user gesture the browser was holding out
   * for, and spending it on `playVideo()` alone is how a site ends up playing
   * silently with no obvious reason why. Unmuting inside the same gesture is
   * what makes the first press produce actual sound.
   */
  const play = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    userPausedRef.current = false;
    startedRef.current = true;
    p.unMute();
    p.setVolume(volumeRef.current);
    setMuted(false);
    p.playVideo();
  }, []);
  const pause = useCallback(() => {
    userPausedRef.current = true;
    playerRef.current?.pauseVideo();
  }, []);
  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const seek = useCallback((s: number) => {
    playerRef.current?.seekTo(s, true);
    setCurrentTime(s);
  }, []);

  const setVolume = useCallback((v: number) => {
    const c = Math.min(100, Math.max(0, v));
    setVolumeState(c);
    playerRef.current?.setVolume(c);
    if (c > 0 && muted) {
      playerRef.current?.unMute();
      setMuted(false);
    }
    window.localStorage.setItem(VOLUME_KEY, String(c));
  }, [muted]);

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

  const next = useCallback(() => {
    playerRef.current?.nextVideo();
    window.setTimeout(sync, 400);
  }, [sync]);

  const prev = useCallback(() => {
    const p = playerRef.current;
    if (p && (p.getCurrentTime?.() ?? 0) > 4) {
      p.seekTo(0, true);
      return;
    }
    p?.previousVideo();
    window.setTimeout(sync, 400);
  }, [sync]);

  const playIndex = useCallback((i: number) => {
    playerRef.current?.playVideoAt(i);
    setIndex(i);
    window.setTimeout(sync, 400);
  }, [sync]);

  const toggleShuffle = useCallback(() => {
    setShuffle((s) => {
      const nextVal = !s;
      playerRef.current?.setShuffle(nextVal);
      return nextVal;
    });
  }, []);

  const toggleRepeat = useCallback(() => setRepeat((r) => !r), []);

  /** switch playlists from the queue chips */
  const choosePlaylist = useCallback((p: PlaylistDef) => {
    userPausedRef.current = false;
    errorRunRef.current = 0;
    setStalled(false);
    deadRef.current.delete(p.id); // an explicit pick deserves a fresh attempt
    setPlaylist(p);
    setTrack(null);
    setVideoIds([]);
    loadPlaylistInto(p);
    window.setTimeout(sync, 700);
  }, [loadPlaylistInto, sync]);

  /**
   * Change what's playing because the visitor changed where they are.
   *
   * Switching route is switching scene, so the music switches with it: a
   * different playlist if there is a usable one, otherwise at least the next
   * song, so the new place never sounds identical to the old one.
   */
  const rollPlaylist = useCallback(async () => {
    for (let attempt = 0; attempt < PLAYLISTS.length; attempt++) {
      const next = pickFollowUpPlaylist(playlistRef.current.id, deadRef.current);
      if (!next) break;
      if (!(await canEmbedPlaylist(next.id))) {
        deadRef.current.add(next.id);
        continue;
      }
      choosePlaylist(next);
      return;
    }
    // only one usable list — at least change the song
    playerRef.current?.nextVideo();
    window.setTimeout(sync, 400);
  }, [choosePlaylist, sync]);

  return {
    playlists: PLAYLISTS,
    playlist,
    choosePlaylist,
    rollPlaylist,
    stalled,
    setDucked,
    isReady,
    isPlaying,
    track,
    videoIds,
    index,
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
    next,
    prev,
    playIndex,
    toggleShuffle,
    toggleRepeat,
  };
}

export type PlayerEngine = ReturnType<typeof usePlayerEngine>;
