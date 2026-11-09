// The sorry page's lamp. The flame flickers on its own, bends away from a
// passing pointer, and a tap blows it out (smoke) or lights it again.
// Embers drift up from it while it burns.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lamp = document.getElementById("lamp");
  const flame = document.getElementById("flame");
  const halo = document.getElementById("halo");
  const tip = document.getElementById("tip");

  // show the URL the visitor asked for (as text, never as HTML)
  const pathEl = document.getElementById("path");
  let asked = location.pathname + location.search;
  try { asked = decodeURIComponent(asked); } catch { /* keep it encoded */ }
  asked = asked.slice(0, 160);
  if (asked && asked !== "/" && asked !== "/404.html" && asked !== "/404") {
    pathEl.querySelector("code").textContent = asked;
    pathEl.hidden = false;
  }

  let lit = true;
  lamp.addEventListener("click", () => {
    lit = !lit;
    lamp.classList.toggle("out", !lit);
    lamp.setAttribute("aria-label", lit ? "A lit diya. Press to blow it out." : "A diya that has gone out. Press to light it again.");
    tip.textContent = lit
      ? "Lit again. Something new is being made."
      : "Gone out, like this project. Tap to light the next one.";
  });

  // pointer as a breeze: bend away from it when it comes close
  const ptr = { x: -9999, y: -9999, vx: 0 };
  let lastX = null;
  addEventListener("pointermove", (e) => {
    if (lastX !== null) ptr.vx = e.clientX - lastX;
    lastX = e.clientX;
    ptr.x = e.clientX; ptr.y = e.clientY;
  }, { passive: true });

  let lean = 0, t0 = performance.now();

  // embers
  const cv = document.getElementById("embers");
  const cx = cv.getContext("2d");
  let W = 0, H = 0, DPR = 1;
  const size = () => {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
  };
  size();
  addEventListener("resize", size);
  const embers = [];

  const frame = (now) => {
    const t = (now - t0) / 1000;
    const box = lamp.getBoundingClientRect();
    const fx = box.left + box.width * 0.504;
    const fy = box.top + box.height * 0.32;

    // flame lean: idle sway + breeze from a nearby, moving pointer
    const dx = fx - ptr.x, dy = fy - ptr.y;
    const d = Math.hypot(dx, dy);
    const near = Math.max(0, 1 - d / 260);
    let target = Math.sin(t * 1.7) * 2.5 + Math.sin(t * 4.3) * 1.2;
    target += near * Math.sign(dx || 1) * 18 + ptr.vx * near * 0.6;
    target = Math.max(-28, Math.min(28, target));
    lean += (target - lean) * 0.12;
    ptr.vx *= 0.9;

    const flicker = 1 + Math.sin(t * 9.1) * 0.025 + Math.sin(t * 23.7) * 0.02 - near * 0.06;
    flame.style.transform = `rotate(${lean.toFixed(2)}deg) scale(${(1 - near * 0.04).toFixed(3)}, ${flicker.toFixed(3)})`;
    if (lit) halo.style.opacity = (0.85 + Math.sin(t * 7.3) * 0.08 + Math.sin(t * 13) * 0.05).toFixed(3);

    // embers rise while the flame burns
    if (lit && Math.random() < 0.35) {
      embers.push({
        x: fx + (Math.random() - 0.5) * 10,
        y: fy - box.height * 0.12,
        vx: (Math.random() - 0.5) * 0.5 + lean * 0.02,
        vy: -0.6 - Math.random() * 1.1,
        life: 1,
        r: 0.8 + Math.random() * 1.8,
        hue: Math.random() < 0.5 ? "255,165,31" : "255,212,71",
      });
    }
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx.clearRect(0, 0, W, H);
    cx.globalCompositeOperation = "lighter";
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.x += e.vx + Math.sin(t * 2 + i) * 0.25;
      e.y += e.vy;
      e.life -= 0.006;
      if (e.life <= 0) { embers.splice(i, 1); continue; }
      cx.fillStyle = `rgba(${e.hue},${(e.life * 0.9).toFixed(3)})`;
      cx.shadowColor = `rgba(${e.hue},1)`;
      cx.shadowBlur = 8;
      cx.beginPath(); cx.arc(e.x, e.y, e.r * e.life, 0, Math.PI * 2); cx.fill();
    }
    requestAnimationFrame(frame);
  };

  if (!reduce) requestAnimationFrame(frame);
})();
