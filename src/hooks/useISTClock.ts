import { useEffect, useState } from "react";

export interface ISTClock {
  hh: string;
  mm: string;
  ss: string;
  period: "AM" | "PM";
  /** true between 19:00 and 05:59 IST */
  isNight: boolean;
}

const FMT = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

function read(): ISTClock {
  const parts = FMT.formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "--";
  const hh = get("hour");
  const mm = get("minute");
  const ss = get("second");
  // en-IN renders dayPeriod as "am"/"pm" (sometimes "a.m."), so strip
  // punctuation before comparing rather than trusting the raw string
  const period = get("dayPeriod").toUpperCase().replace(/[^AP]/g, "").startsWith("P") ? "PM" : "AM";
  const h12 = Number(hh) % 12;
  const h24 = period === "PM" ? h12 + 12 : h12;
  return { hh, mm, ss, period, isNight: h24 >= 19 || h24 < 6 };
}

/**
 * Live IST wall clock, ticking every second — the bus runs on Kolkata time
 * no matter where the listener is.
 */
export function useISTClock(): ISTClock {
  const [clock, setClock] = useState<ISTClock>(read);
  useEffect(() => {
    const id = window.setInterval(() => setClock(read()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return clock;
}
