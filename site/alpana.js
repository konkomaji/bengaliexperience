// The home page centrepiece: an alpana — the white rice-paste floor art
// drawn at Bengali doorsteps — rebuilt as rings of glossy beads and petals.
// Rings turn slowly in alternating directions. The pointer pushes the
// pieces aside and they spring home; a tap sends a ripple out and shifts
// every ring to the next colour.
(() => {
  const canvas = document.getElementById("alpana");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PALETTE = [
    "#ee2d3f", // sindoor
    "#ffa51f", // marigold
    "#ffd447", // haldi
    "#ff6fa8", // shapla
    "#1ec8b4", // ganga
    "#5a63ff", // neel
    "#f7ede1", // rice paste
  ];

  // ring: radius (× R), count, kind, size (× R), turn direction/speed, colour index
  const RINGS = [
    { r: 0, n: 1, kind: "dot", s: 0.105, spin: 0, c: 1 },
    { r: 0.2, n: 8, kind: "petal", s: 0.13, spin: 0.05, c: 0 },
    { r: 0.315, n: 16, kind: "dot", s: 0.026, spin: -0.07, c: 6 },
    { r: 0.43, n: 12, kind: "petal", s: 0.17, spin: 0.035, c: 3 },
    { r: 0.56, n: 24, kind: "dot", s: 0.03, spin: -0.04, c: 2 },
    { r: 0.68, n: 18, kind: "petal", s: 0.13, spin: 0.028, c: 4 },
    { r: 0.8, n: 36, kind: "dot", s: 0.017, spin: -0.03, c: 1 },
    { r: 0.9, n: 24, kind: "petal", s: 0.07, spin: 0.02, c: 0 },
    { r: 0.98, n: 72, kind: "dot", s: 0.009, spin: -0.015, c: 6 },
  ];

  // ---- pre-rendered glossy sprites, one per colour ----------------------
  const SPRITE = 128;
  const mix = (hex, amt) => {
    // amt > 0 toward white, < 0 toward black
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = amt > 0 ? 255 : 0, a = Math.abs(amt);
    r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
    return `rgb(${r},${g},${b})`;
  };

  const makeDot = (hex) => {
    const c = document.createElement("canvas");
    c.width = c.height = SPRITE;
    const g = c.getContext("2d");
    const m = SPRITE / 2;
    const body = g.createRadialGradient(m * 0.7, m * 0.6, 0, m, m, m * 0.98);
    body.addColorStop(0, mix(hex, 0.75));
    body.addColorStop(0.28, mix(hex, 0.15));
    body.addColorStop(0.78, hex);
    body.addColorStop(1, mix(hex, -0.55));
    g.fillStyle = body;
    g.beginPath(); g.arc(m, m, m * 0.96, 0, Math.PI * 2); g.fill();
    // specular
    g.save();
    g.translate(m * 0.68, m * 0.52);
    g.rotate(-0.6);
    const spec = g.createRadialGradient(0, 0, 0, 0, 0, m * 0.34);
    spec.addColorStop(0, "rgba(255,255,255,0.95)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = spec;
    g.scale(1, 0.55);
    g.beginPath(); g.arc(0, 0, m * 0.34, 0, Math.PI * 2); g.fill();
    g.restore();
    // bounce light on the lower rim
    const rim = g.createRadialGradient(m * 1.25, m * 1.45, 0, m * 1.25, m * 1.45, m * 0.5);
    rim.addColorStop(0, "rgba(255,255,255,0.22)");
    rim.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rim;
    g.beginPath(); g.arc(m, m, m * 0.96, 0, Math.PI * 2); g.fill();
    return c;
  };

  // petal: pointed at both ends, long axis along +x
  const makePetal = (hex) => {
    const w = SPRITE * 2, h = SPRITE;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d");
    const shape = () => {
      g.beginPath();
      g.moveTo(4, h / 2);
      g.bezierCurveTo(w * 0.3, h * 0.02, w * 0.72, h * 0.04, w - 4, h / 2);
      g.bezierCurveTo(w * 0.72, h * 0.96, w * 0.3, h * 0.98, 4, h / 2);
      g.closePath();
    };
    const body = g.createLinearGradient(0, 0, 0, h);
    body.addColorStop(0, mix(hex, 0.55));
    body.addColorStop(0.35, hex);
    body.addColorStop(1, mix(hex, -0.6));
    g.fillStyle = body; shape(); g.fill();
    // centre vein, like a brush stroke of rice paste
    g.strokeStyle = "rgba(255,255,255,0.35)";
    g.lineWidth = 3;
    g.beginPath(); g.moveTo(w * 0.12, h / 2); g.quadraticCurveTo(w * 0.5, h * 0.44, w * 0.86, h / 2); g.stroke();
    // long glossy streak
    g.save(); shape(); g.clip();
    const spec = g.createLinearGradient(0, h * 0.12, 0, h * 0.42);
    spec.addColorStop(0, "rgba(255,255,255,0.85)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = spec;
    g.beginPath(); g.ellipse(w * 0.48, h * 0.3, w * 0.3, h * 0.12, 0, 0, Math.PI * 2); g.fill();
    g.restore();
    return c;
  };

  const dots = PALETTE.map(makeDot);
  const petals = PALETTE.map(makePetal);

  // ---- layout + pieces --------------------------------------------------
  let W = 0, H = 0, DPR = 1, CX = 0, CY = 0, R = 0;
  let pieces = [];
  let shift = 0; // colour rotation, bumped by taps

  const layout = () => {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    if (W > 860) {
      CX = W * 0.72; CY = H * 0.52; R = Math.min(H * 0.43, W * 0.27);
    } else {
      CX = W * 0.5; CY = H * 0.25; R = Math.min(W * 0.46, H * 0.22);
    }
    const first = pieces.length === 0;
    if (first) {
      pieces = [];
      RINGS.forEach((ring, ri) => {
        for (let k = 0; k < ring.n; k++) {
          pieces.push({
            ri, k,
            base: (k / ring.n) * Math.PI * 2 + (ri % 2 ? Math.PI / ring.n : 0),
            x: CX, y: CY, vx: 0, vy: 0, lean: 0,
          });
        }
      });
    }
  };

  // ---- pointer ----------------------------------------------------------
  const ptr = { x: -9999, y: -9999, on: false };
  canvas.addEventListener("pointermove", (e) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true; }, { passive: true });
  canvas.addEventListener("pointerleave", () => { ptr.on = false; ptr.x = ptr.y = -9999; });

  const ripples = [];
  canvas.addEventListener("pointerdown", (e) => {
    ptr.x = e.clientX; ptr.y = e.clientY;
    shift = (shift + 1) % PALETTE.length;
    ripples.push({ x: e.clientX, y: e.clientY, t: 0 });
    for (const p of pieces) {
      const dx = p.x - e.clientX, dy = p.y - e.clientY;
      const d = Math.hypot(dx, dy) || 1;
      const f = Math.min(26, (R * 9) / (d + R * 0.2));
      p.vx += (dx / d) * f; p.vy += (dy / d) * f;
    }
    if (reduce) draw(0);
  });

  // ---- frame ------------------------------------------------------------
  const PUSH = () => R * 0.42;

  const draw = (t) => {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const time = reduce ? 0 : t / 1000;
    const breathe = reduce ? 1 : 1 + Math.sin(time * 0.8) * 0.012;

    // faint guide circles: the chalk lines under the alpana
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(time * 0.02);
    ctx.strokeStyle = "rgba(247,237,225,0.07)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 7]);
    for (const r of [0.26, 0.5, 0.74, 1.06]) {
      ctx.beginPath(); ctx.arc(0, 0, r * R * breathe, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();

    // halo behind the centre
    const halo = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 1.15);
    halo.addColorStop(0, "rgba(255,165,31,0.16)");
    halo.addColorStop(0.5, "rgba(238,45,63,0.05)");
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(CX - R * 1.2, CY - R * 1.2, R * 2.4, R * 2.4);

    const push = PUSH();
    // outer rings first so the centre sits on top
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      const ring = RINGS[p.ri];
      const a = p.base + time * ring.spin * Math.PI;
      const wob = reduce ? 0 : Math.sin(time * 1.3 + p.ri + p.k * 0.6) * R * 0.006;
      const hr = ring.r * R * breathe + wob;
      const hx = CX + Math.cos(a) * hr;
      const hy = CY + Math.sin(a) * hr;

      if (reduce) {
        p.x = hx; p.y = hy;
      } else {
        // spring home
        p.vx += (hx - p.x) * 0.06;
        p.vy += (hy - p.y) * 0.06;
        // pointer pushes
        if (ptr.on) {
          const dx = p.x - ptr.x, dy = p.y - ptr.y;
          const d = Math.hypot(dx, dy);
          if (d < push && d > 0.01) {
            const f = Math.pow(1 - d / push, 2) * 9;
            p.vx += (dx / d) * f; p.vy += (dy / d) * f;
          }
        }
        p.vx *= 0.82; p.vy *= 0.82;
        p.x += p.vx; p.y += p.vy;
      }

      const ci = (ring.c + shift) % PALETTE.length;
      const size = ring.s * R;
      if (ring.kind === "dot") {
        const d = size * 2;
        ctx.drawImage(dots[ci], p.x - size, p.y - size, d, d);
      } else {
        // petals point outward and lean with their speed
        const out = Math.atan2(p.y - CY, p.x - CX);
        const tang = -p.vx * Math.sin(out) + p.vy * Math.cos(out);
        p.lean += (tang * 0.04 - p.lean) * 0.2;
        const len = size, wid = size * 0.5;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(out + p.lean);
        ctx.drawImage(petals[ci], -len * 0.5, -wid * 0.5, len, wid);
        ctx.restore();
      }
    }

    // tap ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.t += reduce ? 1 : 0.018;
      if (rp.t >= 1) { ripples.splice(i, 1); continue; }
      ctx.strokeStyle = `rgba(255,212,71,${0.5 * (1 - rp.t)})`;
      ctx.lineWidth = 2 * (1 - rp.t) + 0.5;
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.t * R * 1.4, 0, Math.PI * 2); ctx.stroke();
    }
  };

  let raf = 0;
  const loop = (t) => { draw(t); raf = requestAnimationFrame(loop); };
  const start = () => { if (!reduce && !raf) raf = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  layout();
  // start every piece at the centre so the alpana unfolds on load
  for (const p of pieces) { p.x = CX; p.y = CY; }
  addEventListener("resize", () => { layout(); if (reduce) draw(0); });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  if (reduce) draw(0); else start();
})();
