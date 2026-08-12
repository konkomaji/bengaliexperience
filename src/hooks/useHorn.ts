import { useCallback, useEffect, useRef, useState } from "react";

/** How long a full blast lasts — a real bus leans on it for a few seconds. */
export const BLAST_MS = 3400;
/** The scene only rattles at the start; shaking for the whole blast is sickening. */
const SHAKE_MS = 620;

/**
 * The horn: a synthesized air horn plus two flags the page uses — `honking`
 * for the short scene rattle, `blasting` for the length of the sound itself.
 *
 * Audio is generated with Web Audio rather than shipped as a file — nothing to
 * license, nothing to download. A real bus air horn is a two-tone chord, not a
 * beep: two fundamentals a minor third apart, each doubled and detuned so the
 * voices beat against each other, run through a lowpass to take the fizz off
 * and a compressor so four sawtooths at this level don't clip.
 *
 * While it blasts, the music ducks — `onDuck(true)` on the way in, and
 * `onDuck(false)` when the horn releases. That's what actually makes it read
 * as loud: the horn is over the music, not mixed into it.
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
    const release = 0.28;
    const end = now + hold + release;

    // shared output chain: lowpass takes the digital fizz off the sawtooths,
    // the compressor keeps four loud voices from clipping the master
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.setValueAtTime(2600, now);
    tone.Q.value = 0.6;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 8;
    comp.attack.value = 0.004;
    comp.release.value = 0.15;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.85, now + 0.055); // air valve snaps open
    master.gain.setValueAtTime(0.85, now + hold);
    master.gain.exponentialRampToValueAtTime(0.0001, end); // pressure bleeds off

    tone.connect(comp).connect(master).connect(ctx.destination);

    // pressure wobble — a real horn is never perfectly steady
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 5.5;
    lfoGain.gain.value = 2.4;
    lfo.connect(lfoGain);

    const oscs: OscillatorNode[] = [lfo];

    // two-tone chord, each voice doubled and detuned so they beat
    for (const [freq, level] of [[233, 0.3], [311, 0.26]] as const) {
      for (const detune of [-7, 7]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);
        // the horn sags a touch as the initial air pressure drops
        osc.frequency.linearRampToValueAtTime(freq * 0.985, now + 0.35);
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
