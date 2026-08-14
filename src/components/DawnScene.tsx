import { useMemo } from "react";
import { MAHALAYA_VERSION as V } from "../data/mahalayaGeometry";
import { mahalayaLayout } from "../lib/mahalayaLayout";
import { useViewport } from "../hooks/useViewport";

/**
 * Mahalaya, through a window — painted, layered, and alive.
 *
 * The room, the barred window, the city and the radio are delivered art; the
 * sky, the sun, the light through the bars and the dust are drawn in code and
 * driven by `progress`, how far through the broadcast we are. Night lifts to
 * the sun cresting the North Kolkata rooftops across its length, the way the
 * real morning arrives while the Chandi is read.
 *
 * Depth is real: the sky sits behind the window and the room's transparent
 * opening reveals it, the far and near city slide by different amounts as the
 * pointer moves (or the phone tilts), and the curtain nearest the eye moves
 * most. The room itself is held still so its window stays aligned with the sky
 * behind it.
 */

const asset = (p: string) => `${p}?v=${V}`;

const SKY: [number, string, string][] = [
  [0.0, "#12182e", "#26304a"], // deep blue night, but visible — the city reads against it
  [0.4, "#141a34", "#3a2c46"],
  [0.62, "#1a2444", "#5e3a52"],
  [0.8, "#243358", "#8a4a4e"],
  [0.92, "#31497a", "#d2733c"],
  [1.0, "#4a6ea6", "#ffc57e"],
];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function mixHex(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(lerp(v, pb[i], t)));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
function skyAt(p: number) {
  let lo = SKY[0], hi = SKY[SKY.length - 1];
  for (let i = 0; i < SKY.length - 1; i++) {
    if (p >= SKY[i][0] && p <= SKY[i + 1][0]) { lo = SKY[i]; hi = SKY[i + 1]; break; }
  }
  const t = Math.min(1, Math.max(0, (p - lo[0]) / (hi[0] - lo[0] || 1)));
  return { top: mixHex(lo[1], hi[1], t), horizon: mixHex(lo[2], hi[2], t) };
}
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function DawnScene({ progress, playing }: { progress: number; playing: boolean }) {
  const { w: vw, h: vh } = useViewport();
  const { win, radio } = mahalayaLayout(vw, vh);
  const { top, horizon } = skyAt(progress);
  const glow = clamp01((progress - 0.5) / 0.5);
  const stars = clamp01(1 - progress / 0.6);
  const sunRise = clamp01((progress - 0.72) / 0.28);
  const spill = clamp01((progress - 0.5) / 0.5);

  const starField = useMemo(
    () => Array.from({ length: 60 }, (_, i) => ({
      left: Math.random() * 100, top: Math.random() * 62,
      size: Math.random() < 0.85 ? 1 : 2,
      delay: (Math.random() * 4).toFixed(2), dur: (2.4 + Math.random() * 3.5).toFixed(2), key: i,
    })), [],
  );
  const motes = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({
      left: 6 + Math.random() * 22, top: 30 + Math.random() * 40,
      size: 1 + Math.random() * 2, delay: (Math.random() * 9).toFixed(2), dur: (7 + Math.random() * 7).toFixed(2), key: i,
    })), [],
  );

  // sky box, a hair larger than the window so the room masks its edges
  const m = Math.max(6, win.w * 0.02);
  const box = { left: win.x - m, top: win.y - m, width: win.w + 2 * m, height: win.h + 2 * m } as const;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-30 overflow-hidden"
      style={{ background: "#060402" }}
    >
      <style>{KEYFRAMES}</style>

      {/* the sky, city and sun, behind the window and clipped to it */}
      <div className="absolute overflow-hidden" style={{ left: box.left, top: box.top, width: box.width, height: box.height, background: `linear-gradient(180deg, ${top} 0%, ${top} 42%, ${horizon} 100%)` }}>
        <div className="absolute inset-0" style={{ opacity: stars, transition: "opacity 1.4s linear" }}>
          {starField.map((s) => (
            <span key={s.key} className="dawn-star" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />
          ))}
        </div>
        {/* no moon: Mahalaya falls on Amavasya, the new-moon night */}
        {/* the cloud band, spanning the whole window width and dropped a little
            below the top, drifting slowly across the sky the whole time and
            warming as dawn comes */}
        <img src={asset("/scene/maha-clouds.webp")} alt="" className="maha-cloud absolute" style={{ top: "12%", left: "-16%", width: "132%", opacity: 0.45 + glow * 0.4, transition: "opacity 1.4s linear" }} />
        {/* the warm glow building at the horizon, behind the rooftops */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: "50%", opacity: glow, transition: "opacity 1.4s linear", background: "radial-gradient(120% 100% at 58% 100%, rgba(255,176,90,0.95) 0%, rgba(214,104,54,0.4) 34%, transparent 72%)" }} />
        {/* the sun, cresting the rooftops at the very end */}
        <div className="absolute" style={{ left: "56%", bottom: `calc(14% + ${sunRise * 18}%)`, width: "36%", aspectRatio: "1", opacity: sunRise, borderRadius: "999px", background: "radial-gradient(circle, #fff4d4 0%, #ffd27a 34%, rgba(255,168,80,0.5) 56%, transparent 74%)", transform: "translate(-50%, 50%)" }} />
        {/* South Kolkata rooftops at the horizon: flat terraces, water tanks,
            antennas, a distant dome and a temple finial, with a few lit windows */}
        <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 w-full" style={{ height: "44%", bottom: "6%" }}>
          <g fill="#090b15">
            {/* far, hazier row */}
            <g opacity="0.7">
              <rect x="0" y="66" width="70" height="84" />
              <rect x="60" y="58" width="44" height="92" />
              {/* Victoria Memorial dome in the distance */}
              <path d="M150 62 a16 16 0 0 1 32 0 z" />
              <rect x="150" y="62" width="32" height="20" />
              <rect x="120" y="70" width="40" height="80" />
              <rect x="182" y="66" width="46" height="84" />
              <rect x="300" y="60" width="44" height="90" />
              <rect x="356" y="66" width="44" height="84" />
            </g>
            {/* nearer terraces */}
            <rect x="-4" y="96" width="86" height="60" />
            <rect x="78" y="84" width="60" height="72" />
            <rect x="134" y="100" width="52" height="56" />
            <rect x="182" y="80" width="70" height="76" />
            <rect x="248" y="104" width="46" height="52" />
            <rect x="290" y="88" width="64" height="68" />
            <rect x="350" y="98" width="60" height="58" />
            {/* water tanks on stands */}
            <g>
              <rect x="24" y="82" width="18" height="14" rx="2" /><rect x="26" y="96" width="2" height="6" /><rect x="38" y="96" width="2" height="6" />
              <rect x="206" y="66" width="20" height="15" rx="2" /><rect x="208" y="81" width="2" height="7" /><rect x="222" y="81" width="2" height="7" />
              <rect x="312" y="74" width="18" height="14" rx="2" /><rect x="314" y="88" width="2" height="6" /><rect x="326" y="88" width="2" height="6" />
            </g>
            {/* a small temple finial */}
            <path d="M262 104 q6 -22 12 -22 q6 0 12 22 z" />
            {/* antennas */}
            <path d="M96 84 v-16 M90 74 l12 -8 M90 78 l12 -8" stroke="#090b15" strokeWidth="1.3" fill="none" />
            <path d="M330 88 v-14 M325 80 l10 -6 M325 84 l10 -6" stroke="#090b15" strokeWidth="1.3" fill="none" />
          </g>
          {/* a few lit windows, warm */}
          <g fill="#e8a24a" opacity="0.85">
            <rect x="12" y="112" width="5" height="8" /><rect x="30" y="120" width="5" height="8" />
            <rect x="196" y="98" width="5" height="8" /><rect x="228" y="112" width="5" height="9" />
            <rect x="306" y="104" width="5" height="8" /><rect x="366" y="116" width="5" height="8" />
          </g>
        </svg>
      </div>

      {/* the room, painted over cover, anchored to the bottom so the sill and
          the radio on it stay in frame; its transparent window reveals the sky */}
      <img src={asset("/scene/maha-room.webp")} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 100%" }} />

      {/* warm light spilling through the bars into the room */}
      <div className="absolute" style={{ left: win.x, top: win.y, width: win.w, height: win.h * 1.4, opacity: spill, transition: "opacity 1.4s linear", mixBlendMode: "screen", background: "radial-gradient(70% 60% at 50% 26%, rgba(255,182,104,0.42) 0%, rgba(255,150,80,0.12) 42%, transparent 72%)" }} />

      {/* the radio on the sill: its dial burns brighter while it plays, and the
          broadcast rings out of it in slow waves */}
      <div className="absolute" style={{ left: radio.x, top: radio.y, width: radio.w, height: radio.h }}>
        {playing && (
          <div className="pointer-events-none absolute" style={{ left: "76%", top: "50%" }}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="radio-wave" style={{ animationDelay: `${i * 0.9}s` }} />
            ))}
          </div>
        )}
        <img src={asset("/scene/maha-radio.webp")} alt="" className={`absolute inset-0 h-full w-full object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.7)] ${playing ? "radio-live" : ""}`} />
        {/* the dial glow */}
        <div className={playing ? "dawn-dial-on" : "dawn-dial"} style={{ position: "absolute", left: "55%", top: "40%", width: "42%", height: "24%", background: "radial-gradient(circle, rgba(255,214,140,0.7) 0%, transparent 70%)", mixBlendMode: "screen" }} />
        {/* the speaker breathing, left panel */}
        {playing && <div className="radio-eq" style={{ position: "absolute", left: "12%", top: "36%", width: "30%", height: "40%", background: "radial-gradient(circle, rgba(255,170,90,0.28) 0%, transparent 70%)", mixBlendMode: "screen" }} />}
      </div>

      {/* dust turning in the light */}
      <div className="absolute inset-0" style={{ opacity: 0.4 + spill * 0.5 }}>
        {motes.map((mo) => (
          <span key={mo.key} className="dawn-mote" style={{ left: `${mo.left}%`, top: `${mo.top}%`, width: mo.size, height: mo.size, animationDelay: `${mo.delay}s`, animationDuration: `${mo.dur}s` }} />
        ))}
      </div>

      {/* the tungsten bulb, top-left, flickering the way a filament does */}
      <div className="bulb-flicker absolute" style={{ left: "1%", top: "0%", width: "18%", height: "34%", background: "radial-gradient(circle at 52% 28%, rgba(255,196,96,0.34) 0%, rgba(255,170,80,0.1) 42%, transparent 66%)", mixBlendMode: "screen" }} />

      {/* legibility wash */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(4,3,1,0.55) 0%, rgba(4,3,1,0.04) 22%, rgba(4,3,1,0) 52%, rgba(4,3,1,0.5) 86%, rgba(4,3,1,0.85) 100%)" }} />
    </div>
  );
}

const KEYFRAMES = `
.maha-cloud { animation: cloud-sway 68s ease-in-out infinite alternate; will-change: transform; }
@keyframes cloud-sway { 0% { transform: translateX(-4%); } 100% { transform: translateX(6%); } }
.bulb-flicker { animation: bulb-flicker 7s ease-in-out infinite; }
@keyframes bulb-flicker { 0%,100% { opacity: 0.85; } 46% { opacity: 1; } 49% { opacity: 0.72; } 52% { opacity: 0.96; } 78% { opacity: 0.88; } 82% { opacity: 0.8; } }
.dawn-star { position:absolute; border-radius:999px; background:#fdf6e3; box-shadow:0 0 3px rgba(253,246,227,0.8);
  animation-name:dawn-twinkle; animation-iteration-count:infinite; animation-timing-function:ease-in-out; }
@keyframes dawn-twinkle { 0%,100%{opacity:.2} 50%{opacity:1} }
.dawn-dial { opacity:0; }
.dawn-dial-on { animation:dawn-flicker 3.6s ease-in-out infinite; }
@keyframes dawn-flicker { 0%,100%{opacity:.7} 45%{opacity:1} 48%{opacity:.55} 52%{opacity:1} }
.dawn-mote { position:absolute; border-radius:999px; background:rgba(255,214,150,0.8); box-shadow:0 0 4px rgba(255,190,110,0.8);
  animation-name:dawn-float; animation-iteration-count:infinite; animation-timing-function:ease-in-out; }
@keyframes dawn-float { 0%{opacity:0; transform:translate(0,0)} 20%{opacity:.9} 80%{opacity:.6} 100%{opacity:0; transform:translate(12px,-40px)} }
.radio-wave { position:absolute; left:0; top:0; width:18px; height:18px; margin:-9px; border-radius:999px;
  border:2px solid rgba(255,206,130,0.55); animation:radio-wave 2.7s ease-out infinite; }
@keyframes radio-wave { 0%{transform:scale(0.4);opacity:0.75} 100%{transform:scale(3.4);opacity:0} }
.radio-live { animation:radio-breathe 3.2s ease-in-out infinite; transform-origin:center bottom; }
@keyframes radio-breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.006)} }
.radio-eq { animation:radio-eq 1.1s ease-in-out infinite; }
@keyframes radio-eq { 0%,100%{opacity:0.3} 50%{opacity:0.85} }
@media (prefers-reduced-motion: reduce) { .dawn-star,.dawn-dial-on,.dawn-mote,.radio-wave,.radio-live,.radio-eq,.maha-cloud,.bulb-flicker { animation:none } }
`;
