import { useCallback, useEffect, useRef, useState } from "react";

/**
 * How long a full blast lasts.
 *
 * A real bus driver taps the horn, they do not lean on it for four seconds.
 * The earlier 3.4s version was a ship's horn: impressive once, tiring twice,
 * and nothing like the short hard stab you actually hear on a road here.
 */
export const BLAST_MS = 1200;
/** The scene only rattles at the start; shaking for the whole blast is sickening. */
const SHAKE_MS = 420;

/**
 * The two tones.
 *
 * Not invented. Indian commercial vehicles run ARAI-certified dual-tone
 * horns, and the standard pairing is 420 Hz and 560 Hz, which is a perfect
 * fourth apart. That interval is the reason the sound is instantly placeable:
 * a fourth is bright and open where the minor third this used to use sat dark
 * and mournful, more foghorn than bus. Musical and multi-tone horns are
 * actually illegal on Indian commercial vehicles, so the plain hard two-tone
 * is both the legal sound and the real one.
 */
const TONES = [
  [420, 0.3],
  [560, 0.26],
] as const;

/**
 * The horn: a synthesized air horn plus two flags the page uses, `honking`
 * for the short scene rattle and `blasting` for the length of the sound.
 *
 * Audio is generated with Web Audio rather than shipped as a file, so there is
 * nothing to license and nothing to download. Each of the two tones is doubled
 * and detuned so the voices beat against each other the way two real horn
 * trumpets never quite agree, run through a lowpass to take the digital fizz
 * off and a compressor so four sawtooths at this level do not clip.
 *
 * While it blasts, the music ducks: `onDuck(true)` on the way in, and
 * `onDuck(false)` when the horn releases. That is what actually makes it read
 * as loud. The horn is over the music, not mixed into it.
 */
export function useHorn({ onDuck }: { onDuck?: (ducked: boolean) => void } = {}) {
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const shakeTimer = useRef<number | null>(null);
  const blastTimer = useRef<number | null>(null);
  const [honking, setHonking] = useState(false);
  const [blasting, setBlasting] = useState(false);

  const duckRef = useRef(onDuck);
  duckRef.current = onDuck;

  const honk = useCallback(() => {
    // a second press restarts the horn rather than layering a second one
    stopRef.current?.();
    if (shakeTimer.current) window.clearTimeout(shakeTimer.current);
    if (blastTimer.current) window.clearTimeout(blastTimer.current);

    // --- visual: rattle now, callout for the whole blast ---
    setHonking(false);
    requestAnimationFrame(() => {
      setHonking(true);
      shakeTimer.current = window.setTimeout(() => setHonking(false), SHAKE_MS);
    });
    setBlasting(true);
    blastTimer.current = window.setTimeout(() => setBlasting(false), BLAST_MS);

    // --- music gets out of the way ---
    duckRef.current?.(true);

    // --- audio ---
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) {
      window.setTimeout(() => duckRef.current?.(false), BLAST_MS);
      return;
    }

    const ctx = (ctxRef.current ??= new Ctx());
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    const hold = BLAST_MS / 1000;
    const release = 0.16; // short: an electric horn stops, it does not sigh
    const end = now + hold + release;

    // shared output chain: lowpass takes the digital fizz off the sawtooths,
    // the compressor keeps four loud voices from clipping the master. Opened
    // up from 2600Hz because these horns are brassy and rude, and cutting the
    // upper harmonics was rounding off exactly the part that carries.
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.setValueAtTime(4200, now);
    tone.Q.value = 0.7;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 8;
    comp.attack.value = 0.004;
    comp.release.value = 0.15;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    // Faster than before. An electric horn is on the instant the contact
    // closes; the slow swell was what made the old one sound pneumatic.
    master.gain.exponentialRampToValueAtTime(0.85, now + 0.02);
    master.gain.setValueAtTime(0.85, now + hold);
    master.gain.exponentialRampToValueAtTime(0.0001, end);

    tone.connect(comp).connect(master).connect(ctx.destination);

    // buzz from the vibrating diaphragm, faster and shallower than the slow
    // pressure wobble of a true air horn
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 8;
    lfoGain.gain.value = 1.6;
    lfo.connect(lfoGain);

    const oscs: OscillatorNode[] = [lfo];

    // two-tone chord, each voice doubled and detuned so they beat
    for (const [freq, level] of TONES) {
      for (const detune of [-7, 7]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);
        // a very slight droop as the current settles, over the whole blast
        // rather than the pronounced air-pressure sag it had before
        osc.frequency.linearRampToValueAtTime(freq * 0.995, now + hold);
        lfoGain.connect(osc.detune);

        gain.gain.value = level;
        osc.connect(gain).connect(tone);
        osc.start(now);
        osc.stop(end);
        oscs.push(osc);
      }
    }
    lfo.start(now);
    lfo.stop(end);

    let stopped = false;
    const unduck = window.setTimeout(() => duckRef.current?.(false), BLAST_MS);
    stopRef.current = () => {
      if (stopped) return;
      stopped = true;
      window.clearTimeout(unduck);
      const t = ctx.currentTime;
      try {
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
        master.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
        for (const o of oscs) o.stop(t + 0.07);
      } catch {
        /* already stopped */
      }
    };
  }, []);

  // a horn left mid-blast by a navigation shouldn't leave the music ducked
  useEffect(() => () => {
    stopRef.current?.();
    duckRef.current?.(false);
  }, []);

  return { honk, honking, blasting };
}
