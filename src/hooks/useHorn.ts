import { useCallback, useRef } from "react";

/**
 * Two-tone bus horn, synthesized with Web Audio — no audio file to license,
 * host, or wait on. Two detuned sawtooth voices with a fast attack and a
 * quick decay reads convincingly as a "pom-pom" road horn.
 */
export function useHorn() {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    const ctx = (ctxRef.current ??= new Ctx());
    // browsers start the context suspended until a user gesture
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    // two blasts; each blast is two detuned voices for that reedy bus timbre
    for (const offset of [0, 0.24]) {
      for (const freq of [305, 372]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + offset);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.94, now + offset + 0.19);

        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.11, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.2);

        osc.connect(gain).connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.22);
      }
    }
  }, []);
}
