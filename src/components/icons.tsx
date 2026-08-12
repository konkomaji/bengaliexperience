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
export const HornIcon = (p: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 16} height={p.size ?? 16} fill="currentColor">
    <path d="M3 10v4h3l5 4V6L6 10H3z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M18.5 6a9 9 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65" />
  </svg>
);
export const CloseIcon = (p: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 18} height={p.size ?? 18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
