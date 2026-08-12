import { useCallback, useRef, useState } from "react";

const SHAKE_MS = 620; // must match the `honk` keyframe duration

/**
 * The horn: a synthesized two-tone bus honk plus a `honking` flag the scene
 * uses to shake itself.
 *
 * Audio is generated with Web Audio rather than shipped as a file — two
 * detuned sawtooth voices with a fast attack and quick decay give the reedy
 * "pom-pom" of a road horn, with nothing to license or download.
 */
export function useHorn() {
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const [honking, setHonking] = useState(false);

  const honk = useCallback(() => {
    // --- visual: restart the shake even on a rapid second press ---
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setHonking(false);
    // next frame, so removing and re-adding the class actually replays it
    requestAnimationFrame(() => {
      setHonking(true);
      timerRef.current = window.setTimeout(() => setHonking(false), SHAKE_MS);
    });

    // --- audio ---
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    const ctx = (ctxRef.current ??= new Ctx());
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    for (const offset of [0, 0.24]) {
      for (const freq of [305, 372]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + offset);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.94, now + offset + 0.19);

        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.1, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.2);

        osc.connect(gain).connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.22);
      }
    }
  }, []);

  return { honk, honking };
}
