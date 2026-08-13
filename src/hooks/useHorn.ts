import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The horn: five real recordings, plus the flags the page animates from.
 *
 * This used to be synthesized with Web Audio, two tones a fourth apart through
 * a lowpass and a compressor. It was a decent imitation and it was still an
 * imitation. Real buses do not agree with each other: one horn is a flat blare,
 * the next is cracked, the next has that rising double-tap. Five recordings,
 * picked at random, carry that variety for free, and nothing about an
 * oscillator was ever going to.
 *
 * Two flags come out of here:
 *   `honking`  a short scene rattle, deliberately not the whole blast, because
 *              shaking the screen for three seconds is sickening
 *   `blasting` true for exactly as long as the sound lasts, so the heading can
 *              dance and the music can stay ducked for the real duration
 *              rather than a guessed one
 *
 * The music ducks underneath: `onDuck(true)` when the horn starts, and
 * `onDuck(false)` when it actually ends. That contrast, not raw gain, is what
 * makes a horn read as loud, and it is why the duck is driven by the audio
 * element's own `ended` event instead of a timer that hopes to match it.
 */

/** Recordings in /public/horns/, one picked per press. */
const HORNS = ["/horns/horn-1.mp3", "/horns/horn-2.mp3", "/horns/horn-3.mp3", "/horns/horn-4.mp3", "/horns/horn-5.mp3"];

/**
 * How long before the end of a recording the picture settles down.
 *
 * The five horns run from 3s to 15s, so nothing visual can be a fixed
 * duration. The shake and the dancing letters stop one second before the
 * audio does, which is what a real horn looks like: the bus stops shuddering
 * while the note is still fading off down the road. Ending them exactly on
 * the audio would make the whole page freeze on the same frame the sound
 * cuts, which reads as a glitch rather than a horn.
 */
const SETTLE_BEFORE_END_MS = 1000;

/** If metadata never arrives, shake for this long and no longer. */
const FALLBACK_VISUAL_MS = 2200;

/**
 * Backstop for the duck.
 *
 * `ended` is the signal that matters, but if a file stalls or the element
 * errors after playback has begun, `ended` never fires and the music would
 * stay at 12% forever. Nothing here is anywhere near this long.
 */
const MAX_BLAST_MS = 20000;

export function useHorn({ onDuck }: { onDuck?: (ducked: boolean) => void } = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastIndexRef = useRef(-1);
  const visualTimer = useRef<number | null>(null);
  const failsafeTimer = useRef<number | null>(null);
  /** the scene rattle */
  const [honking, setHonking] = useState(false);
  /** the dancing heading; same window as the rattle, kept separate so the
   *  page can drive the two independently if that ever stops being true */
  const [blasting, setBlasting] = useState(false);

  const duckRef = useRef(onDuck);
  duckRef.current = onDuck;

  /** the picture settles; the sound may still be finishing */
  const endVisuals = useCallback(() => {
    if (visualTimer.current) window.clearTimeout(visualTimer.current);
    visualTimer.current = null;
    setHonking(false);
    setBlasting(false);
  }, []);

  /** everything that has to happen when a blast is over, however it ended */
  const endBlast = useCallback(() => {
    if (failsafeTimer.current) window.clearTimeout(failsafeTimer.current);
    failsafeTimer.current = null;
    endVisuals();
    duckRef.current?.(false);
  }, [endVisuals]);

  const honk = useCallback(() => {
    // A second press restarts the horn rather than layering a second one on
    // top, which is what a driver does and also what stops five overlapping
    // recordings turning into noise.
    const previous = audioRef.current;
    if (previous) {
      previous.pause();
      previous.currentTime = 0;
    }
    if (visualTimer.current) window.clearTimeout(visualTimer.current);
    if (failsafeTimer.current) window.clearTimeout(failsafeTimer.current);

    // Never the same horn twice running: with five files a plain random pick
    // repeats often enough to read as "it only has one sound".
    let i = Math.floor(Math.random() * HORNS.length);
    if (i === lastIndexRef.current) i = (i + 1 + Math.floor(Math.random() * (HORNS.length - 1))) % HORNS.length;
    lastIndexRef.current = i;

    // --- visual: shake and dance, for a window this press does not know yet
    setHonking(true);
    setBlasting(true);
    // Until the file reports its length, assume a short one. A wrong guess
    // here settles the picture early, which is invisible; the alternative is
    // a page that shakes on after a horn that already stopped.
    visualTimer.current = window.setTimeout(endVisuals, FALLBACK_VISUAL_MS);

    // --- music gets out of the way
    duckRef.current?.(true);

    // --- audio
    const audio = new Audio(HORNS[i]);
    audio.preload = "auto";
    audio.volume = 1;
    audioRef.current = audio;

    // The real visual window, once the recording says how long it is.
    audio.addEventListener(
      "loadedmetadata",
      () => {
        if (audioRef.current !== audio || !Number.isFinite(audio.duration)) return;
        if (visualTimer.current) window.clearTimeout(visualTimer.current);
        const ms = Math.max(500, audio.duration * 1000 - SETTLE_BEFORE_END_MS);
        visualTimer.current = window.setTimeout(endVisuals, ms);
      },
      { once: true },
    );

    audio.addEventListener("ended", endBlast, { once: true });
    audio.addEventListener("error", endBlast, { once: true });
    failsafeTimer.current = window.setTimeout(endBlast, MAX_BLAST_MS);

    void audio.play().catch(() => {
      // Blocked or unplayable. The scene still rattles, but the music must
      // not be left ducked under a horn that never sounded.
      endBlast();
    });
  }, [endBlast, endVisuals]);

  // a horn left mid-blast by a navigation should not leave the music ducked
  useEffect(
    () => () => {
      audioRef.current?.pause();
      if (visualTimer.current) window.clearTimeout(visualTimer.current);
      if (failsafeTimer.current) window.clearTimeout(failsafeTimer.current);
      duckRef.current?.(false);
    },
    [],
  );

  return { honk, honking, blasting };
}
