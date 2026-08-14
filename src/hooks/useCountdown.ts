import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** true once the target has passed */
  arrived: boolean;
}

function read(targetMs: number): Countdown {
  const diff = targetMs - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true };
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    arrived: false,
  };
}

/**
 * Live countdown to a fixed moment, ticking every second. The target is passed
 * as an ISO string with an explicit offset so it means the same instant for a
 * listener in Kolkata and one in California.
 */
export function useCountdown(targetIso: string): Countdown {
  const targetMs = Date.parse(targetIso);
  const [c, setC] = useState<Countdown>(() => read(targetMs));
  useEffect(() => {
    const id = window.setInterval(() => setC(read(targetMs)), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);
  return c;
}
