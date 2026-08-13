import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The horn: three real recordings, plus everything the page animates from.
 *
 * This used to be synthesized with Web Audio, two tones a fourth apart through
 * a lowpass and a compressor. It was a decent imitation and it was still an
 * imitation. Real buses do not agree with each other: one is five hard taps,
 * the next stutters, the next leans on one long blare. Recordings carry that
 * for free, and nothing about an oscillator was ever going to.
 *
 * What comes out of here:
 *   `honking`  the scene rattle
 *   `blasting` the dancing heading
 *   `style`    which keyframes and cycle time to use, chosen per recording
 *
 * Both flags run from the press until one second before the audio ends, so the
 * bus settles while the note is still fading. The music ducks for the whole
 * thing: `onDuck(true)` on the press, `onDuck(false)` on the audio element's
 * own `ended` event rather than a timer hoping to match it. That contrast, not
 * raw gain, is what makes a horn read as loud.
 */

/**
 * How a horn moves the page.
 *
 * Every recording gets its own pair of animations rather than all five
 * sharing one. Five different sounds driving one identical shake makes the
 * page feel like it has a single canned reaction it plays regardless of what
 * it heard, which is exactly the impression a random horn is supposed to
 * avoid. Keyframes live in src/index.css.
 */
export interface HornStyle {
  /** keyframes applied to each letter of the heading */
  letters: string;
  /** one cycle of the letter animation */
  letterMs: number;
  /** added per letter, so the word ripples instead of jumping in unison */
  staggerMs: number;
  /** keyframes applied to the whole scene */
  scene: string;
  sceneMs: number;
}

/**
 * The recordings, in /public/horns/, one picked per press.
 *
 * The styles are not taste. Each recording was decoded and measured, an RMS
 * envelope in 30ms windows, counting bursts above 28% of peak, plus attack
 * time and zero-crossing rate as a brightness proxy, and the animation cycle
 * is set to that horn's own burst rate. So the page moves on the beat of
 * whichever horn is sounding rather than to one canned rhythm that happens to
 * fit none of them.
 */
const HORNS: { src: string; style: HornStyle }[] = [
  {
    /**
     * 3.2s · 5 bursts (~630ms apart) · 0.03s attack · sounds 75% of the time
     * · brightest of the three at ~2.3kHz.
     *
     * Five hard taps, instant on. The jolt hits at the top of each cycle and
     * is over almost immediately, so the movement lands with the tap and then
     * waits, the way the sound does.
     */
    src: "/horns/horn-1.mp3",
    style: { letters: "letter-jolt", letterMs: 630, staggerMs: 14, scene: "shake-jolt", sceneMs: 630 },
  },
  {
    /**
     * 8.2s · 38 bursts (~215ms apart) · sounds only 37% of the time.
     *
     * The stuttering one: rapid short taps with real silence between them.
     * Small amplitude on a fast cycle, mostly at rest, because matching 38
     * full-sized shakes would be unbearable and would not look like the sound
     * either.
     */
    src: "/horns/horn-2.mp3",
    style: { letters: "letter-stutter", letterMs: 215, staggerMs: 8, scene: "shake-stutter", sceneMs: 215 },
  },
  {
    /**
     * 8.4s · 7 bursts (~1.2s apart) · sounds 89% of the time.
     *
     * Long sustained blares, near enough continuous. Nothing sharp: a slow
     * heavy sway on a 1.2s cycle, which is the only one of the three that can
     * run for eight seconds without becoming punishing.
     */
    src: "/horns/horn-3.mp3",
    style: { letters: "letter-sway", letterMs: 1200, staggerMs: 45, scene: "shake-sway", sceneMs: 1200 },
  },
];

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
  /** how the current horn moves things. Kept after the blast rather than
   *  cleared, so nothing has to handle a null mid-animation. */
  const [style, setStyle] = useState<HornStyle>(HORNS[0].style);

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
    const horn = HORNS[i];

    // --- visual: shake and dance, for a window this press does not know yet
    setStyle(horn.style);
    setHonking(true);
    setBlasting(true);
    // Until the file reports its length, assume a short one. A wrong guess
    // here settles the picture early, which is invisible; the alternative is
    // a page that shakes on after a horn that already stopped.
    visualTimer.current = window.setTimeout(endVisuals, FALLBACK_VISUAL_MS);

    // --- music gets out of the way
    duckRef.current?.(true);

    // --- audio
    const audio = new Audio(horn.src);
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

    // Every one of these has to check it is still the current horn first.
    // Pressing again pauses the previous element, and a paused-then-abandoned
    // element can still fire `error` (or, mid-buffer, `ended`) a moment later.
    // Without the guard that stale event ran `endBlast` on the press that had
    // just replaced it, so a quick second press started a horn with no shake
    // and no dancing letters at all.
    const finishIfCurrent = () => {
      if (audioRef.current !== audio) return;
      endBlast();
    };
    audio.addEventListener("ended", finishIfCurrent, { once: true });
    audio.addEventListener("error", finishIfCurrent, { once: true });
    failsafeTimer.current = window.setTimeout(finishIfCurrent, MAX_BLAST_MS);

    void audio.play().catch(() => {
      // Blocked or unplayable. The scene still rattles, but the music must
      // not be left ducked under a horn that never sounded.
      finishIfCurrent();
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

  return { honk, honking, blasting, style };
}
