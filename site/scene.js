// Kolkata at night, under the alpana: the Howrah Bridge over the Hooghly,
// puja lights strung along its deck, a yellow Ambassador taxi crossing (tap
// it to honk and it hurries), a country boat drifting downriver, and paper
// kites in the sky that can be grabbed and flown.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.append(n);
    return n;
  };

  // ---------------------------------------------------------------- bridge
  const host = document.getElementById("bridge");
  const VW = 1440, VH = 230, DECK = 168;
  const svg = el("svg", { viewBox: `0 0 ${VW} ${VH}`, preserveAspectRatio: "xMaxYMax slice" }, host);

  const defs = el("defs", {}, svg);
  const steel = el("linearGradient", { id: "steel", x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
  [["0", "#ffd447"], [".45", "#ffa51f"], [".75", "#ee2d3f"], ["1", "#ff6fa8"]].forEach(([o, c]) => el("stop", { offset: o, "stop-color": c }, steel));
  const river = el("linearGradient", { id: "river", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  [["0", "#123a3a", ".55"], ["1", "#0f0b0a", "0"]].forEach(([o, c, a]) => el("stop", { offset: o, "stop-color": c, "stop-opacity": a }, river));
  const taxiG = el("linearGradient", { id: "taxi", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  [["0", "#fff2a6"], [".35", "#ffd447"], ["1", "#d99a00"]].forEach(([o, c]) => el("stop", { offset: o, "stop-color": c }, taxiG));
  const blur = el("filter", { id: "bloom", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
  el("feGaussianBlur", { stdDeviation: 2.4 }, blur);

  // the Hooghly
  el("rect", { x: 0, y: DECK + 12, width: VW, height: VH - DECK - 12, fill: "url(#river)" }, svg);
  const shimmer = el("g", { class: "shimmer" }, svg);
  for (let i = 0; i < 26; i++) {
    const y = DECK + 20 + Math.random() * (VH - DECK - 26);
    const x = Math.random() * VW;
    el("line", {
      x1: x, y1: y, x2: x + 20 + Math.random() * 50, y2: y,
      style: `animation-delay:${(-Math.random() * 6).toFixed(2)}s`,
    }, shimmer);
  }

  // top chord of the cantilever truss, as the bridge's silhouette reads
  const CHORD = [[500, 150], [742, 34], [905, 112], [1095, 112], [1258, 34], [1500, 150]];
  const chordY = (x) => {
    for (let i = 0; i < CHORD.length - 1; i++) {
      const [x0, y0] = CHORD[i], [x1, y1] = CHORD[i + 1];
      if (x >= x0 && x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
    return DECK;
  };

  const truss = el("g", { class: "truss" }, svg);
  let n = 0;
  const draw = (attrs, cls) => {
    const p = el("path", { ...attrs, pathLength: 1, class: `draw ${cls}`, style: `animation-delay:${(0.6 + n++ * 0.012).toFixed(3)}s` }, truss);
    return p;
  };
  // verticals and K-diagonals
  for (let x = 510; x <= 1490; x += 24) {
    const y = chordY(x);
    if (DECK - y < 6) continue;
    draw({ d: `M${x} ${y} L${x} ${DECK}` }, "thin");
    const nx = x + 24, ny = chordY(nx);
    if (nx <= 1500) draw({ d: `M${x} ${DECK} L${nx} ${(ny + DECK) / 2} L${x} ${y}` }, "thin");
  }
  // deck, chords and the two towers in the glossy steel
  draw({ d: `M-20 ${DECK} L${VW + 20} ${DECK}` }, "main");
  draw({ d: "M" + CHORD.map((p) => p.join(" ")).join(" L") }, "main");
  for (const tx of [742, 1258]) {
    draw({ d: `M${tx - 7} 30 L${tx - 7} ${DECK + 24} M${tx + 7} 30 L${tx + 7} ${DECK + 24}` }, "main");
    draw({ d: `M${tx - 7} 30 L${tx + 7} 30 M${tx - 7} 70 L${tx + 7} 100 M${tx + 7} 70 L${tx - 7} 100` }, "thin");
  }

  // puja lights strung along the deck, with their reflections
  const lights = el("g", { class: "lights" }, svg);
  for (let x = 12, i = 0; x < VW; x += 30, i++) {
    const d = `${(-i * 0.11).toFixed(2)}s`;
    el("line", { x1: x, y1: DECK + 16, x2: x, y2: DECK + 26, class: "reflect", style: `animation-delay:${d}` }, lights);
    el("circle", { cx: x, cy: DECK - 5, r: 4, class: "halo", filter: "url(#bloom)", style: `animation-delay:${d}` }, lights);
    el("circle", { cx: x, cy: DECK - 5, r: 1.7, class: "bulb", style: `animation-delay:${d}` }, lights);
  }

  // country boat with its little hut, drifting downriver
  const boat = el("g", { class: "boat" }, svg);
  el("path", { d: "M0 7 Q26 19 52 7 L47 7 Q26 13 5 7 Z", fill: "#3b1a10" }, boat);
  el("path", { d: "M15 8 Q26 -5 37 8 Z", fill: "#7a3a1a" }, boat);
  el("path", { d: "M17 8 Q26 -2 35 8", fill: "none", stroke: "#ffa51f", "stroke-opacity": ".5", "stroke-width": 1 }, boat);
  el("line", { x1: 46, y1: 9, x2: 60, y2: 20, stroke: "#c98a5a", "stroke-width": 1.4 }, boat);
  el("circle", { cx: 26, cy: 4, r: 1.6, fill: "#ffd447", filter: "url(#bloom)" }, boat);

  // the yellow Ambassador
  const taxi = el("g", { class: "taxi", role: "button" }, svg);
  const car = el("g", {}, taxi);
  el("rect", { x: -6, y: -14, width: 50, height: 22, fill: "transparent" }, car); // generous hit area
  el("path", { d: "M0 9 Q0 5 4 5 L8 5 Q10 -1 16 -1 L23 -1 Q28 -1 30 5 L34 5 Q37 5 37 9 L37 12 L0 12 Z", fill: "url(#taxi)" }, car);
  el("path", { d: "M10 5 Q11.5 1 16 1 L18 1 L18 5 Z M20 1 L23 1 Q26.5 1 28 5 L20 5 Z", fill: "#1d1410" }, car);
  el("path", { d: "M6 6 L32 6", stroke: "#fff", "stroke-opacity": ".6", "stroke-width": 0.8 }, car);
  el("rect", { x: 16.5, y: -3.2, width: 5, height: 2.2, rx: 0.6, fill: "#fff2a6" }, car);
  el("circle", { cx: 8, cy: 12, r: 2.8, fill: "#1d1410" }, car);
  el("circle", { cx: 29, cy: 12, r: 2.8, fill: "#1d1410" }, car);
  el("circle", { cx: 36.5, cy: 8, r: 1.3, fill: "#fff8d6" }, car);
  el("path", { d: "M38 8 L70 3 L70 13 Z", fill: "#fff2a6", opacity: ".12" }, car); // headlight beam
  const honk = el("g", { class: "honk" }, taxi);
  el("path", { d: "M44 2 Q48 7 44 12 M48 -1 Q54 7 48 15", fill: "none", stroke: "#ffd447", "stroke-width": 1.4, "stroke-linecap": "round" }, honk);

  let taxiX = 380, boost = 0;
  taxi.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    boost = 1;
    taxi.classList.remove("honking");
    void taxi.getBBox();
    taxi.classList.add("honking");
  });

  // ----------------------------------------------------------------- kites
  const ks = document.getElementById("kites");
  const KITES = [
    { fx: 0.47, fy: 0.16, s: 1.15, a: "#ee2d3f", b: "#ffd447" },
    { fx: 0.93, fy: 0.2, s: 0.95, a: "#1ec8b4", b: "#f7ede1" },
    { fx: 0.6, fy: 0.07, s: 0.7, a: "#ff6fa8", b: "#5a63ff" },
  ];
  let W = innerWidth, H = innerHeight;
  const kites = KITES.map((k, i) => {
    const string = el("path", { class: "manja" }, ks);
    const g = el("g", { class: "kite" }, ks);
    const body = el("g", {}, g);
    el("path", { d: "M0 -24 L17 0 L0 28 Z", fill: k.a }, body);
    el("path", { d: "M0 -24 L-17 0 L0 28 Z", fill: k.b }, body);
    el("path", { d: "M0 -24 L-17 0 L-6 -4 Z", fill: "#fff", opacity: ".35" }, body); // gloss
    el("path", { d: "M0 -24 L0 28 M-17 0 Q0 -8 17 0", fill: "none", stroke: "#2b1208", "stroke-opacity": ".55", "stroke-width": 1.1 }, body);
    el("path", { d: "M0 28 L-7 39 L7 39 Z", fill: k.a }, body);
    el("circle", { cx: 0, cy: 0, r: 34, fill: "transparent" }, body); // hit area
    const st = { ...k, g, body, string, x: 0, y: 0, vx: 0, vy: 0, drag: false, tx: 0, ty: 0, phase: i * 2.1 };
    g.addEventListener("pointerdown", (e) => {
      st.drag = true; st.tx = e.clientX; st.ty = e.clientY;
      g.setPointerCapture(e.pointerId);
      g.classList.add("held");
    });
    g.addEventListener("pointermove", (e) => { if (st.drag) { st.tx = e.clientX; st.ty = e.clientY; } });
    const drop = () => { st.drag = false; g.classList.remove("held"); };
    g.addEventListener("pointerup", drop);
    g.addEventListener("pointercancel", drop);
    return st;
  });

  const place = () => {
    W = innerWidth; H = innerHeight;
    ks.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const small = W <= 860;
    kites.forEach((k, i) => {
      k.hx = (small ? [0.1, 0.9, 0.62][i] : k.fx) * W;
      k.hy = (small ? [0.2, 0.42, 0.04][i] : k.fy) * H;
      if (!k.x || reduce) { k.x = k.hx; k.y = reduce ? k.hy : k.hy + H * 0.5; }
      k.g.style.display = small && i === 2 ? "none" : "";
    });
  };
  place();
  addEventListener("resize", place);

  // ------------------------------------------------------------------ loop
  let last = performance.now();
  const frame = (now) => {
    const dt = Math.min(50, now - last) / 1000;
    last = now;
    const t = now / 1000;

    // taxi crosses left to right, boosted after a honk
    boost = Math.max(0, boost - dt * 0.6);
    taxiX += dt * (46 + boost * 260);
    if (taxiX > VW + 60) taxiX = -80;
    const bob = Math.sin(t * 14) * 0.35 * (1 + boost);
    taxi.setAttribute("transform", `translate(${taxiX.toFixed(1)} ${(DECK - 12 + bob).toFixed(2)})`);

    // boat drifts right to left, rocking
    const bx = VW + 80 - ((t * 12) % (VW + 200));
    boat.setAttribute("transform", `translate(${bx.toFixed(1)} ${(DECK + 34 + Math.sin(t * 1.4) * 1.4).toFixed(2)}) rotate(${(Math.sin(t * 1.1) * 2).toFixed(2)} 26 8)`);

    // kites: drift on the wind, or follow the hand that holds them
    for (const k of kites) {
      const tx = k.drag ? k.tx : k.hx + Math.sin(t * 0.7 + k.phase) * 26 + Math.sin(t * 1.9 + k.phase) * 8;
      const ty = k.drag ? k.ty : k.hy + Math.cos(t * 0.9 + k.phase) * 14;
      k.vx += (tx - k.x) * (k.drag ? 0.08 : 0.02);
      k.vy += (ty - k.y) * (k.drag ? 0.08 : 0.02);
      k.vx *= 0.86; k.vy *= 0.86;
      k.x += k.vx; k.y += k.vy;
      const tilt = Math.max(-35, Math.min(35, k.vx * 2.2 + Math.sin(t * 2.3 + k.phase) * 6));
      k.g.setAttribute("transform", `translate(${k.x.toFixed(1)} ${k.y.toFixed(1)}) rotate(${tilt.toFixed(1)}) scale(${k.s})`);
      // manja string sags down to a rooftop off the bottom-right corner
      const ax = W + 30, ay = H + 30;
      const sx = k.x, sy = k.y + 39 * k.s;
      const cx = (sx + ax) / 2 - 40, cy = Math.max(sy, ay) - (k.drag ? 10 : -60);
      k.string.setAttribute("d", `M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ax} ${ay}`);
    }
    if (!reduce) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
