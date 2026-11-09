// Small shared effects: letter-by-letter headline reveal, a light that
// trails the pointer, and buttons that lean toward the cursor.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;

  // split .split headings into words and letters (keeps child spans' classes)
  let i = 0;
  const splitNode = (node) => {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(" "); return; }
        const word = document.createElement("span");
        word.className = "word";
        for (const c of part) {
          const ch = document.createElement("span");
          ch.className = "ch";
          ch.style.setProperty("--i", i++);
          ch.textContent = c;
          word.append(ch);
        }
        frag.append(word);
      });
      node.replaceWith(frag);
    } else if (node.nodeType === 1 && node.classList.contains("gloss-text")) {
      // gradient text can't be painted through per-letter transforms, so
      // glossy phrases rise in a word at a time, each word carrying the gloss
      const frag = document.createDocumentFragment();
      node.textContent.trim().split(/\s+/).forEach((w, n) => {
        if (n) frag.append(" ");
        const word = document.createElement("span");
        word.className = "word ch gloss-word";
        word.style.setProperty("--i", i);
        i += w.length;
        word.textContent = w;
        frag.append(word);
      });
      node.replaceWith(frag);
    } else if (node.nodeType === 1) {
      [...node.childNodes].forEach(splitNode);
    }
  };
  document.querySelectorAll(".split").forEach((el) => {
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    [...el.childNodes].forEach(splitNode);
    el.querySelectorAll(".word").forEach((w) => w.setAttribute("aria-hidden", "true"));
  });

  if (reduce || !fine) return;

  // trailing light
  const glow = document.createElement("div");
  glow.className = "glow";
  document.body.append(glow);
  let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
  addEventListener("pointermove", (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.classList.add("on");
  }, { passive: true });
  document.addEventListener("pointerleave", () => glow.classList.remove("on"));
  const tick = () => {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
    requestAnimationFrame(tick);
  };
  tick();

  // magnetic buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });
})();
