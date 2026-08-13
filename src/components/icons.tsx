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
