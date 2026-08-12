import { useEffect, useState } from "react";

export interface ISTClock {
  hh: string;
  mm: string;
  period: "AM" | "PM";
  /** true between 19:00 and 05:59 IST */
  isNight: boolean;
}

const FMT = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

function read(): ISTClock {
  const parts = FMT.formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "--";
  const hh = get("hour");
  const mm = get("minute");
  const period = (get("dayPeriod").toUpperCase().replace(/[^AP M]/g, "").trim() as "AM" | "PM") || "AM";
  const h12 = Number(hh) % 12;
  const h24 = period === "PM" ? h12 + 12 : h12;
  return { hh, mm, period, isNight: h24 >= 19 || h24 < 6 };
}

/** Live IST wall clock for the header — the bus runs on Kolkata time no
 *  matter where the listener is. */
export function useISTClock(): ISTClock {
  const [clock, setClock] = useState<ISTClock>(read);
  useEffect(() => {
    const id = window.setInterval(() => setClock(read()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return clock;
}
