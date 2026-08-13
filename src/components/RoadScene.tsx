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

/** Ground speed, CSS px/s at a 1440px-wide viewport, scaled with the layout. */
const BASE_SPEED = 300;

/** Depth. The road is 1 by definition; the rest are fractions of it. */
const PARALLAX = { far: 0.16, mid: 0.42, near: 0.86 } as const;

/** Suspension: stiffness and damping of the body on its springs. */
const SPRING_K = 190;
const SPRING_D = 15;

/** Fixed physics step. Decoupled from the frame rate so a 120Hz screen and a
 *  30Hz one travel the same distance in the same wall-clock time. */
const STEP = 1 / 120;

export function RoadScene({ honking = false, paused = false }: { honking?: boolean; paused?: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const farRef = useRef<HTMLDivElement | null>(null);
  const midRef = useRef<HTMLDivElement | null>(null);
  const nearRef = useRef<HTMLDivElement | null>(null);
  const roadRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const wheelRefs = useRef<(HTMLImageElement | null)[]>([]);

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
      Math.sin(x * 0.031) * 0.55 + Math.sin(x * 0.0117 + 1.3) * 0.3 + Math.sin(x * 0.0071 + 2.7) * 0.15;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      const el = rootRef.current;
      if (!el) return;

      // Long gaps mean a background tab. Snapping to 0.1s stops the bus
      // teleporting a mile down the road on the frame the tab comes back.
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      const width = el.clientWidth || 1;
      const scale = width / 1440;
      const speed = pausedRef.current ? 0 : BASE_SPEED * scale;

      acc += dt;
      while (acc >= STEP) {
        acc -= STEP;
        dist += speed * STEP;

        // The horn is an impulse, not a force. Applying it as a force for one
        // 8ms step moved the body a fraction of a pixel; a bus rocking on its
        // springs is a sudden change in velocity, so that is what it is.
        if (hornRef.current && !hornWasOn) bounceV += 150 * scale;
        hornWasOn = hornRef.current;

        // Road input against the spring. The amplitude is set so the body
        // actually travels a few pixels: at the first value it settled at
        // 0.18px, which is real physics and completely invisible.
        const force = roughness(dist) * 520 * scale - SPRING_K * bounce - SPRING_D * bounceV;

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
      const busScale = (el.clientHeight * 0.44) / G.bus.h;
      const wheelR = G.axles[0].r * 1.06 * busScale;
      const spin = (dist / wheelR) * (180 / Math.PI);
      for (const w of wheelRefs.current) {
        if (w) w.style.transform = `rotate(${(spin % 360).toFixed(2)}deg)`;
      }
    };

    if (!reduced) raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Sprite scale is decided in CSS so the first painted frame is already
  // right; the loop only ever moves things.
  const busH = "clamp(150px, 44cqh, 460px)";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-30 overflow-hidden bg-surface"
      style={{ containerType: "size" }}
    >
      {/* sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a0d05 0%, #3d1c09 34%, #7a3d12 58%, #b8641f 72%, #2a1409 100%)",
        }}
      />

      <Layer refEl={farRef} src="/scene/bg-far.webp" tile={G.layers["bg-far"]} bottom="26%" opacity={0.72} />
      <Layer refEl={midRef} src="/scene/bg-mid.webp" tile={G.layers["bg-mid"]} bottom="22%" opacity={0.9} />
      <Layer refEl={nearRef} src="/scene/bg-near.webp" tile={G.layers["bg-near"]} bottom="18%" />

      {/* road */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] overflow-hidden">
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

      {/* the bus, sitting on the road */}
      <div
        ref={bodyRef}
        className="absolute will-change-transform"
        style={{
          left: "50%",
          bottom: "19%",
          height: busH,
          aspectRatio: `${G.bus.w} / ${G.bus.h}`,
          translate: "-50% 0",
          transformOrigin: "50% 100%",
        }}
      >
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
  refEl, src, tile, bottom, opacity = 1,
}: {
  refEl: React.RefObject<HTMLDivElement | null>;
  src: string;
  tile: { w: number; h: number };
  bottom: string;
  opacity?: number;
}) {
  return (
    <div className="absolute inset-x-0 overflow-hidden" style={{ bottom, height: `${(tile.h / 900) * 62}%`, opacity }}>
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
