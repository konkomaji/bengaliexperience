import { BRAND } from "../data/brand";

/**
 * The breakdown screen: shown by the error boundary, and reused for 404s.
 *
 * Conceit — the bus hasn't crashed, the driver has just pulled over for a
 * chai and a cigarette. Framing failure as a tea break keeps the site's voice
 * intact at the exact moment a generic "Something went wrong" would break it.
 *
 * Styled with inline styles and its own keyframes on purpose: if the app
 * failed hard enough to land here, we can't assume the stylesheet, fonts or
 * any other component loaded correctly. This screen must stand on its own.
 *
 * Drop `/public/hero/breakdown.jpg` in and it becomes the backdrop; without
 * it the layered gradient below carries the scene on its own.
 */
export function BreakdownScreen({
  detail,
  title = "Chai break.",
  message = "The driver has pulled over for a cup and a smoke. The bus will be moving again shortly.",
  action = "Back on the road",
  onAction,
}: {
  detail?: string;
  title?: string;
  message?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div style={styles.root} role="alert">
      <style>{keyframes}</style>

      {/* dusk roadside gradient — always present, so the screen is never bare */}
      <div style={styles.sky} />

      {/* optional themed photograph, if supplied */}
      <img
        src="/hero/breakdown.jpg"
        alt=""
        aria-hidden="true"
        style={styles.photo}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />

      {/* warm glow from the roadside stall, breathing */}
      <div style={styles.stallGlow} />

      {/* rising cigarette / chai steam */}
      <span style={{ ...styles.steam, left: "46%", animationDelay: "0s" }} />
      <span style={{ ...styles.steam, left: "52%", animationDelay: "1.1s" }} />
      <span style={{ ...styles.steam, left: "49%", animationDelay: "2.2s" }} />

      {/* embers off the stove, drifting on the night air — slow and
          irregular on purpose, so the screen feels like it is waiting rather
          than loading */}
      {EMBERS.map((e, i) => (
        <span
          key={i}
          style={{
            ...styles.ember,
            left: e.left,
            bottom: e.bottom,
            width: e.size,
            height: e.size,
            animationDuration: e.duration,
            animationDelay: e.delay,
          }}
        />
      ))}

      {/* a truck passes somewhere down the road every so often */}
      <div style={styles.headlight} />

      {/* darkening washes for legibility */}
      <div style={styles.wash} />

      <div style={styles.content}>
        <p style={styles.kicker}>{BRAND.nameEn}</p>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.message}>{message}</p>

        <button
          type="button"
          onClick={onAction ?? (() => window.location.assign("/"))}
          style={styles.button}
        >
          {action}
        </button>

        {detail && (
          <details style={styles.details}>
            <summary style={styles.summary}>What went wrong</summary>
            <code style={styles.code}>{detail}</code>
          </details>
        )}
      </div>
    </div>
  );
}

/** Hand-placed so the drift looks scattered rather than generated. */
const EMBERS = [
  { left: "41%", bottom: "30%", size: 3, duration: "13s", delay: "0s" },
  { left: "47%", bottom: "26%", size: 2, duration: "17s", delay: "2.5s" },
  { left: "55%", bottom: "31%", size: 4, duration: "15s", delay: "5s" },
  { left: "59%", bottom: "24%", size: 2, duration: "19s", delay: "7.5s" },
  { left: "44%", bottom: "22%", size: 3, duration: "16s", delay: "10s" },
  { left: "52%", bottom: "34%", size: 2, duration: "21s", delay: "12.5s" },
];

const keyframes = `
@keyframes bd-steam {
  0%   { opacity: 0; transform: translateY(0) scale(0.7); }
  15%  { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(-140px) scale(1.9); }
}
@keyframes bd-glow {
  0%, 100% { opacity: 0.45; }
  50%      { opacity: 0.75; }
}
@keyframes bd-rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* the scene breathes very slowly, so a screen you might sit on for a while
   never feels frozen */
@keyframes bd-drift {
  from { transform: scale(1.04) translate3d(0, 0, 0); }
  to   { transform: scale(1.11) translate3d(-1.5%, -1%, 0); }
}
@keyframes bd-ember {
  0%   { opacity: 0; transform: translate3d(0, 0, 0) scale(0.6); }
  12%  { opacity: 0.75; }
  70%  { opacity: 0.45; }
  100% { opacity: 0; transform: translate3d(26px, -220px, 0) scale(1.1); }
}
/* headlights sweeping past, far down the road */
@keyframes bd-pass {
  0%, 62%   { opacity: 0; transform: translateX(-30vw) scaleX(0.7); }
  74%       { opacity: 0.5; }
  100%      { opacity: 0; transform: translateX(115vw) scaleX(1.3); }
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
`;

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    minHeight: "100dvh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#150803",
    color: "#f7ece4",
    fontFamily: "'Baloo Da 2', 'Hind Siliguri', system-ui, sans-serif",
    textAlign: "center",
    padding: "1.5rem",
  },
  sky: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, #150803 0%, #2a1810 26%, #4a2a18 48%, #6b3a18 68%, #40200c 86%, #150803 100%)",
  },
  photo: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center 58%",
    opacity: 0.85,
    animation: "bd-drift 34s ease-in-out infinite alternate",
  },
  ember: {
    position: "absolute",
    borderRadius: "999px",
    background: "rgba(255,186,110,0.9)",
    boxShadow: "0 0 8px rgba(255,160,60,0.85)",
    animationName: "bd-ember",
    animationTimingFunction: "ease-out",
    animationIterationCount: "infinite",
    pointerEvents: "none",
  },
  headlight: {
    position: "absolute",
    left: 0,
    top: "62%",
    width: "22vw",
    height: "6vh",
    borderRadius: "999px",
    background:
      "radial-gradient(ellipse at center, rgba(255,240,200,0.5) 0%, rgba(255,220,160,0.14) 45%, transparent 72%)",
    filter: "blur(10px)",
    mixBlendMode: "screen",
    animation: "bd-pass 17s linear infinite",
    pointerEvents: "none",
  },
  stallGlow: {
    position: "absolute",
    left: "50%",
    top: "58%",
    width: "70vw",
    maxWidth: 560,
    height: "40vh",
    transform: "translate(-50%, -50%)",
    background:
      "radial-gradient(circle, rgba(255,180,90,0.5) 0%, rgba(255,140,60,0.16) 45%, transparent 72%)",
    mixBlendMode: "screen",
    animation: "bd-glow 5s ease-in-out infinite",
    pointerEvents: "none",
  },
  steam: {
    position: "absolute",
    bottom: "34%",
    width: 10,
    height: 10,
    borderRadius: "999px",
    background: "rgba(255,240,220,0.5)",
    filter: "blur(7px)",
    animation: "bd-steam 4.5s ease-out infinite",
    pointerEvents: "none",
  },
  wash: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(12,5,2,0.8) 0%, rgba(12,5,2,0.25) 35%, rgba(12,5,2,0.6) 72%, rgba(12,5,2,0.95) 100%)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.6rem",
    maxWidth: "30rem",
    animation: "bd-rise 0.7s cubic-bezier(0.16,1,0.3,1) both",
  },
  kicker: {
    margin: 0,
    fontSize: "0.65rem",
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
  },
  title: {
    margin: 0,
    fontSize: "clamp(2rem, 8vw, 3.5rem)",
    fontWeight: 800,
    lineHeight: 1,
    textShadow: "0 4px 28px rgba(0,0,0,0.7)",
  },
  message: {
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "rgba(247,236,228,0.78)",
  },
  button: {
    marginTop: "0.9rem",
    border: "2px solid #2b1600",
    borderRadius: "999px",
    background: "linear-gradient(180deg, #ffdd55 0%, #ffa726 100%)",
    color: "#2b1600",
    padding: "0.7rem 1.6rem",
    fontWeight: 800,
    fontSize: "0.9rem",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
  },
  details: {
    marginTop: "1.1rem",
    maxWidth: "100%",
    color: "rgba(247,236,228,0.4)",
    fontSize: "0.7rem",
  },
  summary: { cursor: "pointer" },
  code: {
    display: "block",
    marginTop: "0.5rem",
    padding: "0.5rem 0.7rem",
    borderRadius: "0.6rem",
    background: "rgba(0,0,0,0.45)",
    fontFamily: "ui-monospace, monospace",
    wordBreak: "break-word",
    textAlign: "left",
  },
};
