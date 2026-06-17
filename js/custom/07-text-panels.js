/* ═══════════════════════════════════════════════════════════
   TEXT PANELS — Scroll-driven 45° fly-in (p1, p3, p4, p5)
   Ảnh nền (background) giữ nguyên sticky cross-fade.
   Text block mỗi panel: bay vào từ rìa màn hình theo góc 45°
   khi scroll đến, bay ngược về khi scroll qua — bidirectional.
   p2 text đã được IIFE trên xử lý riêng → skip ở đây.
   ═══════════════════════════════════════════════════════════ */

(() => {
  const section = document.querySelector('[data-bgsm="ch1"]');
  if (!section) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Chỉ lấy panels KHÔNG phải split (p2 đã có IIFE riêng)
  const panelItems = Array.from(
    section.querySelectorAll(
      ".bpt-sm-panel:not(.bpt-sm-panel--cinematic):not(.bpt-sm-panel--magazine)",
    ),
  )
    .map((panel) => {
      const textEl = panel.querySelector(".bpt-sm-text.bpt-reveal");
      if (!textEl) return null;

      // Xác định hướng bay: --left → từ phải (dir=+1), --right → từ trái (dir=-1), center → phải
      const dir = textEl.classList.contains("bpt-sm-text--right") ? -1 : 1;

      // GPU layer sẵn sàng
      textEl.style.willChange = "transform, opacity";

      return { panel, textEl, dir };
    })
    .filter(Boolean);

  if (!panelItems.length) return;

  let ticking = false;
  let _active = false;

  const visObs = new IntersectionObserver(
    (entries) => {
      _active = entries.some((e) => e.isIntersecting);
    },
    { rootMargin: "15% 0px" },
  );
  visObs.observe(section);

  // easeOut quart — mượt cho enter
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }
  // easeIn quad — nhanh dần cho exit
  function easeIn(t) {
    return t * t;
  }

  function computeItemProgress(panel) {
    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight;
    // Enter: rect.top từ vh*1.1 xuống vh*0.45 → p: 0→1
    const enterStart = vh * 1.1;
    const enterEnd = vh * 0.45;
    const p = Math.max(
      0,
      Math.min(1, (enterStart - rect.top) / (enterStart - enterEnd)),
    );

    // Exit: rect.top từ -vh*0.05 xuống -vh*0.65 → ex: 0→1
    const exitStart = -vh * 0.35;
    const exitEnd = -vh * 1.2;
    const ex = Math.max(
      0,
      Math.min(1, (exitStart - rect.top) / (exitStart - exitEnd)),
    );

    return { p, ex };
  }

  function applyItem({ panel, textEl, dir }) {
    const { p, ex } = computeItemProgress(panel);
    const ep = easeOut(p);
    const exp = easeIn(ex);

    // Cinematic reveal: toggle is-visible class
    if (ep > 0.15) {
      textEl.classList.add("is-visible");
    } else if (exp > 0.4) {
      textEl.classList.remove("is-visible");
    }

    const isMobile = window.innerWidth <= 768;
    const rotation = dir * 3; // XOAY nhẹ khi bay vào

    if (isMobile) {
      // Mobile: bay lên từ dưới + scale + blur
      const ty = (55 * (1 - ep) - 20 * exp).toFixed(2);
      const sc = (0.94 + 0.06 * ep - 0.04 * exp).toFixed(3);
      const bl = (4 * (1 - ep) + 3 * exp).toFixed(1);
      const op = (Math.min(1, p * 1.8) * (1 - exp * 0.95)).toFixed(3);
      textEl.style.transform = `translate3d(0, ${ty}px, 0) scale(${sc})`;
      textEl.style.opacity = op;
      
    } else {
      // Desktop: góc 45° + xoay + scale + blur — cinematic emagazine
      const tx = (dir * 90 * (1 - ep) - dir * 35 * exp).toFixed(2);
      const ty = (65 * (1 - ep) - 25 * exp).toFixed(2);
      const rot = (rotation * (1 - ep) - rotation * 0.5 * exp).toFixed(2);
      const sc = (0.92 + 0.08 * ep - 0.05 * exp).toFixed(3);
      const bl = (5 * (1 - ep) + 4 * exp).toFixed(1);
      const op = (Math.min(1, p * 1.6) * (1 - exp * 0.95)).toFixed(3);
      textEl.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`;
      textEl.style.opacity = op;
      
    }
  }

  function onRaf() {
    ticking = false;
    panelItems.forEach(applyItem);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onRaf);
  }

  // Init
  panelItems.forEach(applyItem);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();

