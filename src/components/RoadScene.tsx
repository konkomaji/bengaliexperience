import { useEffect, useRef } from "react";
import { SCENE } from "../data/scene";
import { SCENE_GEOMETRY as G } from "../data/sceneGeometry";

/**
 * The bus, driving.
 *
 * This replaces a single flat illustration with the bus painted into it, which
 * could not move at all: the old scene faked travel by pushing the whole
 * picture around a stationary vehicle. Now the road and three parallax layers
 * scroll, the wheels turn, and the body rides on a spring.
 *
 * One number drives everything. `speed` is the ground speed in CSS pixels per
 * second, and every other motion is derived from it rather than tuned by eye:
 *
 *   wheels     ω = v / r. Get this wrong by any amount and the tyres visibly
 *              slip or spin like a cartoon. It is the difference between a bus
 *              driving and a bus being dragged.
 *   parallax   far 0.16, mid 0.42, near 0.86, road 1.0. Approximate real depth
 *              ratios; anything flatter reads as a painted backdrop sliding.
 *   suspension a damped spring driven by a road-roughness function of distance
 *              travelled, so the same bump always arrives at the same point on
 *              the road rather than at random.
 *   pitch      derived from the spring's velocity, so the body noses down as
 *              it drops and lifts as it recovers.
 *
 * Everything is written straight to the DOM inside one rAF loop. React renders
 * this once and then never touches it: sixty state updates a second would cost
 * more than the animation itself.
 */

/**
 * How big the bus is drawn, and therefore how big everything is.
 *
 * Height alone used to decide this, which works on a wide screen and fails
 * badly on a tall narrow one: the sprite is 2.58 times as wide as it is tall,
 * so 44% of a phone's height came out 880px wide inside a 386px viewport, and
 * all you saw was the middle of the bus with both ends and the wheels cropped
 * off. Constrained by width as well now, whichever is smaller.
 */
const BUS_ASPECT = G.bus.w / G.bus.h;
const BUS_H_OF_VIEWPORT = 0.44;
const BUS_W_OF_VIEWPORT = 0.92;
const BUS_MIN_PX = 104;
const BUS_MAX_PX = 460;

/** The CSS and the physics have to agree on this exactly: it is the number
 *  wheel radius is derived from, and a mismatch makes the tyres slip. */
const busHeightPx = (w: number, h: number) =>
  Math.max(
    BUS_MIN_PX,
    Math.min(BUS_MAX_PX, BUS_H_OF_VIEWPORT * h, (BUS_W_OF_VIEWPORT * w) / BUS_ASPECT),
  );

const BUS_H_CSS = `clamp(${BUS_MIN_PX}px, min(${BUS_H_OF_VIEWPORT * 100}cqh, ${(
  (BUS_W_OF_VIEWPORT / BUS_ASPECT) *
  100
).toFixed(3)}cqw), ${BUS_MAX_PX}px)`;

/**
 * Ground speed, in the sprite's own pixels per second.
 *
 * Not pixels of screen: that was scaled by viewport width, so a phone ran at
 * 80px/s against a desktop's 400px/s while drawing a *larger* bus, and the
 * thing crawled. What a viewer actually perceives is bus lengths per second,
 * which is invariant only if speed comes from the size the bus is drawn at.
 * Every other quantity below is in sprite space for the same reason, so the
 * same journey plays at the same apparent speed, with the same bumps in the
 * same places, on any screen.
 */
const SPEED_SPRITE_PX = 708;

/** Depth. The road is 1 by definition; the rest are fractions of it. */
const PARALLAX = { far: 0.16, mid: 0.42, near: 0.86 } as const;

/** Suspension: stiffness and damping of the body on its springs. */
const SPRING_K = 190;
const SPRING_D = 15;

/** Fixed physics step. Decoupled from the frame rate so a 120Hz screen and a
 *  30Hz one travel the same distance in the same wall-clock time. */
const STEP = 1 / 120;

/**
 * Overtaking traffic, in a lane behind the bus.
 *
 * Each vehicle crosses left-to-right — the same direction the bus faces, only
 * faster, so it reads as overtaking rather than oncoming. Sized and seated in
 * bus heights and cycled in sprite pixels, exactly like everything else, so a
 * pass looks the same on a phone as on a desktop. `seat` is where the sprite's
 * bottom sits above the road line, in bus heights — small and near the bus's
 * own contact so the wheels land on the asphalt, not the kerb or the air.
 * `cycle` is how much road (sprite px) one full appear-and-vanish takes;
 * `cross` is the slice of that spent on screen, the rest being the gap before
 * the next one. Only vehicles whose art is actually present are kept.
 */
const TRAFFIC = (
  [
    { key: "taxi", h: 0.52, seat: -0.04, cycle: 4200, cross: 0.5, phase: 0.15 },
    { key: "truck", h: 0.72, seat: -0.08, cycle: 6200, cross: 0.5, phase: 0.62 },
  ] as const
).filter((t) => t.key in (G.sprites ?? {}));

/** Diesel puffs off the tailpipe. Emitted as a function of distance, so a
 *  faster bus smokes harder, and frozen with the scene when it is paused. */
const PUFFS = 5;
/** Road (sprite px) one puff lives across, from tailpipe to faded-out. */
const PUFF_LIFE = 560;
/** Only smoke if the puff art was delivered. */
const HAS_EXHAUST = "exhaust" in (G.sprites ?? {});

export function RoadScene({ honking = false, paused = false }: { honking?: boolean; paused?: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const farRef = useRef<HTMLDivElement | null>(null);
  const midRef = useRef<HTMLDivElement | null>(null);
  const nearRef = useRef<HTMLDivElement | null>(null);
  const roadRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const wheelRefs = useRef<(HTMLImageElement | null)[]>([]);
  const trafficRefs = useRef<(HTMLImageElement | null)[]>([]);
  const puffRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Read by the loop without restarting it.
  const hornRef = useRef(honking);
  hornRef.current = honking;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last = performance.now();
    let acc = 0;

    /** metres of road behind us, in CSS px */
    let dist = 0;
    /** body displacement from rest, and its velocity */
    let bounce = 0;
    let bounceV = 0;
    let hornWasOn = false;

    /**
     * How rough the road is at a given point.
     *
     * A function of distance rather than of time, so a pothole belongs to a
     * place: drive past it twice and it hits twice, in the same spot. Three
     * incommensurate sine terms so it never audibly repeats.
     */
    const roughness = (x: number) =>
      Math.sin(x * 0.0175) * 0.55 + Math.sin(x * 0.0066 + 1.3) * 0.3 + Math.sin(x * 0.004 + 2.7) * 0.15;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      const el = rootRef.current;
      if (!el) return;

      // Long gaps mean a background tab. Snapping to 0.1s stops the bus
      // teleporting a mile down the road on the frame the tab comes back.
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      // One number the whole scene is built from: how many screen pixels one
      // pixel of the bus sprite occupies. The layout uses the same figure via
      // BUS_H_CSS, so nothing can drift out of step with anything else.
      const scale = busHeightPx(el.clientWidth || 1, el.clientHeight || 1) / G.bus.h;
      const speed = pausedRef.current ? 0 : SPEED_SPRITE_PX * scale;

      acc += dt;
      while (acc >= STEP) {
        acc -= STEP;
        dist += speed * STEP;

        // The horn is an impulse, not a force. Applying it as a force for one
        // 8ms step moved the body a fraction of a pixel; a bus rocking on its
        // springs is a sudden change in velocity, so that is what it is.
        if (hornRef.current && !hornWasOn) bounceV += 354 * scale;
        hornWasOn = hornRef.current;

        // Road input against the spring, sampled in sprite space so a given
        // pothole belongs to a place on the road rather than to a screen size.
        // The amplitude is set so the body actually travels a few pixels: at
        // the first value it settled at 0.18px, real physics and invisible.
        const force = roughness(dist / scale) * 1226 * scale - SPRING_K * bounce - SPRING_D * bounceV;

        bounceV += force * STEP;
        bounce += bounceV * STEP;
      }

      const px = (n: number) => `${n.toFixed(2)}px`;

      // Layers. Each slides by the remainder of its own travel, so it wraps
      // invisibly and never runs out.
      //
      // The wrap has to happen at the tile's *rendered* width, which is set by
      // `background-size: auto 100%` and so depends on the strip's height, not
      // on the viewport. Wrapping at the source width instead left the road
      // jumping half a tile sideways every few seconds, which is the kind of
      // thing that looks like a dropped frame until you measure it.
      const shift = (node: HTMLDivElement | null, tile: { w: number; h: number }, factor: number) => {
        if (!node) return;
        const rendered = node.clientHeight * (tile.w / tile.h);
        if (rendered <= 0) return;
        node.style.transform = `translate3d(${px(-((dist * factor) % rendered))}, 0, 0)`;
      };
      shift(farRef.current, G.layers["bg-far"], PARALLAX.far);
      shift(midRef.current, G.layers["bg-mid"], PARALLAX.mid);
      shift(nearRef.current, G.layers["bg-near"], PARALLAX.near);
      shift(roadRef.current, G.layers.road, 1);

      // The body: bounce, and pitch out of how fast it is moving vertically.
      if (bodyRef.current) {
        const pitch = Math.max(-1.4, Math.min(1.4, -bounceV * 0.012));
        bodyRef.current.style.transform = `translate3d(0, ${px(bounce)}, 0) rotate(${pitch.toFixed(3)}deg)`;
      }

      // ω = v / r. The one relationship that has to be exact.
      //
      // Each wheel is spun by its OWN radius, read off the wheel as actually
      // laid out. The two axles are drawn at different sizes — the front arch
      // is larger than the rear — so a single shared radius turned the smaller
      // tyre at the wrong rate and it visibly slipped. Reading each wheel's own
      // width cannot drift from how it renders.
      for (let i = 0; i < wheelRefs.current.length; i++) {
        const w = wheelRefs.current[i];
        if (!w) continue;
        const r = w.clientWidth / 2 || (G.axles[i] ?? G.axles[0]).r * 1.06 * scale;
        const spin = ((dist / r) * (180 / Math.PI)) % 360;
        w.style.transform = `rotate(${spin.toFixed(2)}deg)`;
      }

      // Overtaking traffic. Position is a function of distance in sprite space,
      // so a pass takes the same road on any screen. Off screen during the gap,
      // it is simply faded out and parked rather than kept moving.
      const laneW = el.clientWidth;
      const road = dist / scale; // sprite px travelled, screen-size invariant
      for (let i = 0; i < TRAFFIC.length; i++) {
        const node = trafficRefs.current[i];
        if (!node) continue;
        const t = TRAFFIC[i];
        const phase = ((road / t.cycle) % 1 + 1) % 1;
        if (phase < t.cross) {
          const vw = node.clientWidth || 0;
          const k = phase / t.cross; // 0 off the left, 1 off the right
          const x = -vw - 48 + k * (laneW + 2 * vw + 96);
          node.style.transform = `translate3d(${px(x)}, 0, 0)`;
          node.style.opacity = "1";
        } else {
          node.style.opacity = "0";
        }
      }

      // Exhaust. Each puff drifts back and up from the tailpipe, growing and
      // fading, on a distance clock so it stalls when the bus does. Measured in
      // rendered bus heights so it sits with the sprite at any size.
      const bh = scale * G.bus.h;
      for (let i = 0; i < puffRefs.current.length; i++) {
        const node = puffRefs.current[i];
        if (!node) continue;
        const q = ((road / PUFF_LIFE + i / PUFFS) % 1 + 1) % 1;
        const s = 0.45 + q * 1.15;
        const opacity = (q < 0.12 ? q / 0.12 : Math.max(0, 1 - q)) * 0.5;
        node.style.transform = `translate3d(${px(-q * 0.55 * bh)}, ${px(-q * 0.8 * bh)}, 0) scale(${s.toFixed(3)})`;
        node.style.opacity = opacity.toFixed(3);
      }
    };

    if (!reduced) raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Sprite scale is decided in CSS so the first painted frame is already
  // right; the loop only ever moves things.
  //
  // Everything below is a multiple of `--bus-h` rather than a percentage of
  // the viewport. Percentages made the composition change shape with the
  // screen: on a phone the road band came out taller than the bus. Tied to the
  // bus, the scene holds its proportions at any size.
  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-30 overflow-hidden bg-surface"
      style={{
        containerType: "size",
        "--bus-h": BUS_H_CSS,
        // Where the wheels meet the road. Everything vertical hangs off this,
        // so the bus always sits ON the road rather than near it. The cqh floor
        // lifts the whole street clear of the player dock on a phone, where the
        // bus-relative value alone put the bus behind it.
        "--road-y": "max(calc(var(--bus-h) * 0.43), 21cqh)",
      } as React.CSSProperties}
    >
      {/* sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a0d05 0%, #3d1c09 34%, #7a3d12 58%, #b8641f 72%, #2a1409 100%)",
        }}
      />

      <Layer refEl={farRef} src="/scene/bg-far.webp" bottom={0.16} height={1.15} heightFloor={42} opacity={0.72} />
      <Layer refEl={midRef} src="/scene/bg-mid.webp" bottom={0.07} height={1.18} heightFloor={43} opacity={0.9} />
      <Layer refEl={nearRef} src="/scene/bg-near.webp" bottom={-0.02} height={1.17} heightFloor={43} />

      {/* road */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ height: "calc(var(--road-y) + var(--bus-h) * 0.36)" }}
      >
        <div
          ref={roadRef}
          className="absolute inset-y-0 left-0 w-[300%] will-change-transform"
          style={{
            backgroundImage: "url(/scene/road.webp)",
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
          }}
        />
      </div>

      {/* overtaking traffic, a lane behind the bus so the bus stays the hero */}
      {TRAFFIC.map((t, i) => {
        const sp = G.sprites[t.key as "taxi" | "truck"];
        return (
          <img
            key={t.key}
            ref={(n) => { trafficRefs.current[i] = n; }}
            src={`/scene/${t.key}.webp`}
            alt=""
            aria-hidden="true"
            className="absolute left-0 will-change-transform"
            style={{
              bottom: `calc(var(--road-y) + var(--bus-h) * ${t.seat})`,
              height: `calc(var(--bus-h) * ${t.h})`,
              aspectRatio: `${sp.w} / ${sp.h}`,
              opacity: 0,
            }}
          />
        );
      })}

      {/* the bus, sitting on the road */}
      <div
        ref={bodyRef}
        className="absolute will-change-transform"
        style={{
          left: "50%",
          bottom: "var(--road-y)",
          height: "var(--bus-h)",
          aspectRatio: `${G.bus.w} / ${G.bus.h}`,
          translate: "-50% 0",
          transformOrigin: "50% 100%",
        }}
      >
        {/* exhaust off the tailpipe, behind the wheels and the body */}
        {HAS_EXHAUST &&
          Array.from({ length: PUFFS }).map((_, i) => (
            <img
              key={`puff-${i}`}
              ref={(n) => { puffRefs.current[i] = n; }}
              src="/scene/exhaust.webp"
              alt=""
              aria-hidden="true"
              className="absolute will-change-transform"
              style={{
                left: "-3%",
                bottom: "5%",
                width: "calc(var(--bus-h) * 0.26)",
                aspectRatio: "1 / 1",
                transformOrigin: "center center",
                opacity: 0,
              }}
            />
          ))}

        {G.axles.map((a, i) => {
          const d = (a.r * 2 * 1.06) / G.bus.h; // tyre a touch larger than its arch
          return (
            <img
              key={a.x}
              ref={(n) => { wheelRefs.current[i] = n; }}
              src="/scene/wheel.webp"
              alt=""
              className="absolute will-change-transform"
              style={{
                width: `${(d * G.bus.h * 100) / G.bus.w}%`,
                height: `${d * 100}%`,
                left: `${(a.x / G.bus.w) * 100}%`,
                top: `${(a.y / G.bus.h) * 100}%`,
                translate: "-50% -50%",
              }}
            />
          );
        })}

        <img src="/scene/bus.webp" alt={SCENE.heroAlt} className="absolute inset-0 size-full" />
      </div>

      {/* legibility washes, unchanged in spirit from the still scene */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,4,1,0.72) 0%, rgba(10,4,1,0.12) 26%, rgba(10,4,1,0) 46%, rgba(10,4,1,0.55) 88%, rgba(10,4,1,0.8) 100%)",
        }}
      />
    </div>
  );
}

/** One scrolling strip. Three times the tile width, so a slow layer still has
 *  something to show after the fast ones have wrapped many times. */
function Layer({
  refEl, src, bottom, height, heightFloor, opacity = 1,
}: {
  refEl: React.RefObject<HTMLDivElement | null>;
  src: string;
  /** how far above the road line, in bus heights */
  bottom: number;
  /** how tall, in bus heights */
  height: number;
  /**
   * Height floor in cqh, for tall narrow screens.
   *
   * Tied to the bus alone, a phone.s small bus left the street occupying a
   * fifth of the screen under an enormous empty sky. The floor only binds in
   * portrait: on desktop the bus-relative value is larger and wins, so the
   * composition there is untouched.
   */
  heightFloor: number;
  opacity?: number;
}) {
  return (
    <div
      className="absolute inset-x-0 overflow-hidden"
      style={{
        bottom: `calc(var(--road-y) + var(--bus-h) * ${bottom})`,
        height: `max(calc(var(--bus-h) * ${height}), ${heightFloor}cqh)`,
        opacity,
      }}
    >
      <div
        ref={refEl}
        className="absolute inset-y-0 left-0 w-[300%] will-change-transform"
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
        }}
      />
    </div>
  );
}
