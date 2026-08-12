/**
 * Spinning vinyl in place of the video frame. The real YouTube iframe is
 * parked off-screen (audio only) — this is what the user actually looks at,
 * and it doubles as the play/pause affordance's visual state: it spins while
 * playing and freezes when paused.
 */
export function Record({
  thumbUrl,
  isPlaying,
}: {
  thumbUrl: string | undefined;
  isPlaying: boolean;
}) {
  return (
    <div className="relative size-12 shrink-0 sm:size-14">
      <div
        className="size-full rounded-full"
        style={{
          animation: "var(--animate-vinyl)",
          animationPlayState: isPlaying ? "running" : "paused",
          background:
            "repeating-radial-gradient(circle at 50% 50%, #1d1310 0px, #1d1310 2px, #0b0705 3px, #0b0705 4px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        <div className="absolute left-1/2 top-1/2 size-[54%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-2 ring-black/60">
          {thumbUrl ? (
            <img src={thumbUrl} alt="" className="size-full object-cover" loading="lazy" />
          ) : (
            <div className="size-full bg-surface-container-high" />
          )}
        </div>
        <div className="absolute left-1/2 top-1/2 size-[8%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-dim" />
      </div>
    </div>
  );
}
