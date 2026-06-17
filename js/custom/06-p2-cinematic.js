/* ═══════════════════════════════════════════════════════════
/* ═══════════════════════════════════════════════════════════
   Panel p2 — Cinematic: GIF nền full-bleed + text overlay
   Scroll-driven bidirectional:
   • GIF nền: scale(1.08)→scale(1) + opacity fade-in khi enter
   • GIF nền: scale(1)→scale(0.96) + opacity fade-out khi exit
   • Text: translateY + opacity fade-in/fade-out đồng bộ
   ═══════════════════════════════════════════════════════════ */

(() => {
  const isMobileAnim = window.innerWidth < 769;
  const panel = document.querySelector(".bpt-sm-panel--cinematic");
  if (!panel) return;

  // Mobile: simple IntersectionObserver instead of scroll-driven animation
  if (isMobileAnim) {
    const mobileObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const bg = panel.querySelector(".bpt-sm-cinematic-bg");
            const txt = panel.querySelector(".bpt-sm-text.bpt-reveal");
            if (bg) {
              bg.style.transform = "scale(1)";
              bg.style.opacity = "1";
            }
            if (txt) {
              txt.style.transform = "translate3d(0, 0, 0)";
              txt.style.opacity = "1";
              
            }
            mobileObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    mobileObs.observe(panel);
    return;
  }

  const bgImg = panel.querySelector(".bpt-sm-cinematic-bg");
  const textEl = panel.querySelector(".bpt-sm-text.bpt-reveal");

  // Reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (bgImg) {
      bgImg.style.transform = "";
      bgImg.style.opacity = "1";
    }
    if (textEl) {
      textEl.style.transform = "";
      textEl.style.opacity = "1";
      textEl.style.filter = "none";
    }
    return;
  }

  // ── Scroll-driven animation: bg scale + text fade ──
  let ticking = false;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }
  function easeIn(t) {
    return t * t;
  }

  function computeProgress() {
    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight;
    const enterStart = vh * 1.1;
    const enterEnd = vh * 0.45;
    const p = Math.max(
      0,
      Math.min(1, (enterStart - rect.top) / (enterStart - enterEnd)),
    );
    const exitStart = -vh * 0.35;
    const exitEnd = -vh * 1.2;
    const ex = Math.max(
      0,
      Math.min(1, (exitStart - rect.top) / (exitStart - exitEnd)),
    );
    return { p, ex };
  }

  function applyAnimation() {
    const { p, ex } = computeProgress();
    const ep = easeOut(p);
    const exp = easeIn(ex);

    // BG: scale 1.08 → 1.0 (enter), 1.0 → 0.96 (exit)
    if (bgImg) {
      const scale = (1.08 - 0.08 * ep - 0.04 * exp).toFixed(4);
      const bgOp = (Math.min(1, p * 1.6) * (1 - exp * 0.85)).toFixed(3);
      bgImg.style.transform = `scale(${scale})`;
      bgImg.style.opacity = bgOp;
    }

    // Text: translateY 30px → 0 (enter), 0 → -20px (exit) + opacity
    if (textEl) {
      const txtY = (30 * (1 - ep) - 20 * exp).toFixed(2);
      const txtOp = (Math.min(1, p * 1.5) * (1 - exp * 0.9)).toFixed(3);
      const txtBlur = (4 * (1 - ep)).toFixed(1);
      textEl.style.transform = `translateY(${txtY}px)`;
      textEl.style.opacity = txtOp;
      
    }
  }

  function onRaf() {
    ticking = false;
    applyAnimation();
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onRaf);
  }

  applyAnimation();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();

