const base = { viewBox: "0 0 24 24", fill: "currentColor" } as const;

export const PlayIcon = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 18} height={p.size ?? 18}><path d="M8 5v14l11-7z" /></svg>
);
export const PauseIcon = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 18} height={p.size ?? 18}><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
);
export const NextIcon = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 17} height={p.size ?? 17}><path d="M6 5v14l10-7zM17 5v14h2V5z" /></svg>
);
export const PrevIcon = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 17} height={p.size ?? 17}><path d="M18 5v14L8 12zM5 5v14h2V5z" /></svg>
);
export const ShuffleIcon = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 16} height={p.size ?? 16}>
    <path d="M14.83 13.41 16.34 16H14a5.72 5.72 0 0 1-5-2.87A6.87 6.87 0 0 0 3 10H2v2h1a5.72 5.72 0 0 1 5 2.87A6.87 6.87 0 0 0 14 18h2.34l-1.51 2.59 1.73 1L20 17l-3.44-4.59zM14 6h2.34l-1.51 2.59 1.73 1L20 5l-3.44-4.59-1.73 1L16.34 4H14a6.87 6.87 0 0 0-6 3.13A5.72 5.72 0 0 1 3 10H2v2h1a6.87 6.87 0 0 0 6-3.13A5.72 5.72 0 0 1 14 6z" />
  </svg>
);
export const RepeatIcon = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 16} height={p.size ?? 16}>
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2z" />
  </svg>
);
export const VolumeIcon = (p: { muted?: boolean; size?: number }) => (
  <svg {...base} width={p.size ?? 15} height={p.size ?? 15}>
    <path d="M3 10v4h4l5 5V5L7 10H3z" />
    {p.muted ? (
      <path d="M19 12l3-3-1.4-1.4L17.6 10.6 15.2 8.2 13.8 9.6l2.4 2.4-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4z" />
    ) : (
      <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
    )}
  </svg>
);
export const QueueIcon = (p: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 15} height={p.size ?? 15} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M4 6h12M4 12h12M4 18h8" />
    <path d="M18 10v8m0 0-3-3m3 3 3-3" />
  </svg>
);
export const TicketIcon = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 16} height={p.size ?? 16}>
    <path d="M4 8a2 2 0 0 0-2 2v1.5a1.5 1.5 0 0 1 0 3V16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1.5a1.5 1.5 0 0 1 0-3V10a2 2 0 0 0-2-2zm7 1h2v1.5h-2zm0 3h2v1.5h-2zm0 3h2v1.5h-2z" />
  </svg>
);
/**
 * The bulb horn: flared bell, tapering neck, rubber squeeze bulb.
 *
 * Not a speaker with sound waves coming out of it, which is the generic
 * "audio" glyph and says nothing. This is the horn painted on the back of
 * every truck and bus on an Indian road next to the words themselves, so it
 * is the one shape that reads as "press this to honk" without a label.
 */
export const HornIcon = (p: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 16} height={p.size ?? 16} fill="currentColor">
    {/* Tilted, because a horn sits at an angle on a bus and a level one reads
        as a megaphone. */}
    <g transform="rotate(-14 12 12)">
      {/* Bell. The mouth is an outward arc rather than a flat edge: a straight
          one turns the whole shape into a play triangle at 16px, which is the
          one glyph it must not be mistaken for. */}
      <path d="M10.8 8.1 3.4 4.3a6.3 6.3 0 0 0 0 11.4l7.4-3.8Z" />
      {/* neck, running back to the bulb */}
      <path
        d="M11 10c2.3.5 4.1 1.5 5.5 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      {/* the squeeze bulb */}
      <circle cx="18.7" cy="16.2" r="3.1" />
    </g>
  </svg>
);
export const CloseIcon = (p: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 18} height={p.size ?? 18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/* ── Tarakeswar section icons ─────────────────────────────────────────
   A different visual language on purpose: a stroked, line-drawn set for a
   text-forward guide, next to the filled set above built for a scene's UI. */
const line = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** the atchala temple roof: a stepped, tiered hut-roof silhouette */
export const TempleIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 20} height={p.size ?? 20}>
    <path d="M12 2.5 8.5 6.5h7z" />
    <path d="M6.5 8h11M5 11h14M4 20h16M6 11v9M18 11v9M9.5 15.5v4.5M14.5 15.5v4.5" />
    <path d="M9.5 15.5a2.5 2.5 0 0 1 5 0" />
  </svg>
);
export const MapPinIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 18} height={p.size ?? 18}>
    <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
);
export const TrainIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 18} height={p.size ?? 18}>
    <rect x="5" y="4" width="14" height="12" rx="4" />
    <path d="M5 11h14M9 4v7M15 4v7M8 20l-2.5 2M16 20l2.5 2" />
    <circle cx="9" cy="14" r="0.6" fill="currentColor" />
    <circle cx="15" cy="14" r="0.6" fill="currentColor" />
  </svg>
);
export const RoadIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 18} height={p.size ?? 18}>
    <path d="M8 3 4 21M16 3l4 18M12 3v3M12 9.5v3M12 16v3" />
  </svg>
);
export const FoodIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 18} height={p.size ?? 18}>
    <path d="M6 2.5v8a2.5 2.5 0 0 0 5 0v-8M8.5 2.5v6M6 2.5v6" />
    <path d="M17 2.5s-2 2-2 5 2 3 2 3v11" />
  </svg>
);
export const ClockIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 18} height={p.size ?? 18}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const CalendarIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 18} height={p.size ?? 18}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);
export const PillIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 18} height={p.size ?? 18}>
    <rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-35 12 12)" />
    <path d="M9.5 9.5 14.5 14.5" />
  </svg>
);
export const ArrowRightIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 16} height={p.size ?? 16}>
    <path d="M4 12h16M13 5l7 7-7 7" />
  </svg>
);
export const ExternalIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 14} height={p.size ?? 14}>
    <path d="M9 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3M14 4h6v6M20 4l-9.5 9.5" />
  </svg>
);
export const StarIcon = (p: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 12} height={p.size ?? 12} fill="currentColor">
    <path d="M12 2.5l2.9 6.4 6.9.7-5.2 4.7 1.5 6.9L12 17.6 5.9 21.2l1.5-6.9-5.2-4.7 6.9-.7z" />
  </svg>
);
export const CompassIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 18} height={p.size ?? 18}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15 9-4.5 1.5L9 15l4.5-1.5z" />
  </svg>
);
export const ArticleIcon = (p: { size?: number }) => (
  <svg {...line} width={p.size ?? 18} height={p.size ?? 18}>
    <rect x="4" y="3.5" width="16" height="17" rx="2" />
    <path d="M7.5 8h9M7.5 11.5h9M7.5 15h5.5" />
  </svg>
);
