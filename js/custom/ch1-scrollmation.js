/* ═════════════════════════════════════════════════════════════
   CHAPTER I — Scrollmation System
   Gộp từ: 05-scrollmation.js, 06-p2-cinematic.js,
           07-text-panels.js, 08-magazine.js
   ═════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  // ── Shared utilities ──
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 769;

  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
  function easeIn(t) { return t * t; }
  function easeInOut(t) { return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; }

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  // Passive scroll + rAF pattern
  function createScrollHandler(fn) {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { fn(); ticking = false; });
    }
    return onScroll;
  }

  // Visibility observer: pause when section off-screen
  function createVisObserver(el, opts) {
    let active = false;
    const obs = new IntersectionObserver((entries) => {
      active = entries[0].isIntersecting;
    }, opts || { rootMargin: "10% 0px" });
    obs.observe(el);
    return () => active;
  }

  // ═══════════════════════════════════════════════════════════
  // 1. BACKGROUND SCROLLMATION (from 05-scrollmation.js)
  //    Sticky media layer, text panels scroll qua, ảnh cross-fade.
  // ═══════════════════════════════════════════════════════════
  (() => {
    const section = document.querySelector('[data-bgsm="ch1"]');
    if (!section) return;

    const slides = Array.from(section.querySelectorAll(".bpt-sm-slide"));
    const panels = Array.from(section.querySelectorAll(".bpt-sm-panel"));
    const N = slides.length;
    if (!N || !panels.length) return;

    if (prefersReduced) {
      slides[0].classList.add("is-active");
      return;
    }

    let currentIndex = 0;
    const isActive = createVisObserver(section);
    const overlay = section.querySelector(".bpt-sm-overlay");
    const WARM_SLIDES = new Set([0, 1]);

    function activateSlide(index, instant) {
      if (index === currentIndex && !instant) return;
      currentIndex = index;

      if (overlay) {
        overlay.classList.toggle("is-light", WARM_SLIDES.has(index));
      }

      slides.forEach((slide, i) => {
        slide.classList.remove("is-active", "is-primed");
        if (i === index) {
          if (instant) {
            slide.style.transition = "none";
            slide.style.transform = "scale(1)";
            slide.style.opacity = "1";
            requestAnimationFrame(() => {
              slide.style.removeProperty("transition");
              slide.style.removeProperty("transform");
              slide.style.removeProperty("opacity");
              slide.classList.add("is-active");
            });
          } else {
            slide.classList.add("is-active");
          }
        } else if (i === index + 1) {
          slide.classList.add("is-primed");
        }
      });
    }

    const ZOOM_SLIDE_INDEX = 4;
    let zoomTicking = false;

    function applyZoomToSlide4() {
      if (isMobile) return;
      const slide4 = slides[ZOOM_SLIDE_INDEX];
      if (!slide4 || !slide4.classList.contains("is-active")) {
        if (slide4) {
          const img = slide4.querySelector("img");
          if (img) img.style.transform = "";
        }
        return;
      }
      const panel = panels[ZOOM_SLIDE_INDEX];
      if (!panel) return;

      const vh = window.innerHeight;
      const rect = panel.getBoundingClientRect();
      const panelHeight = panel.offsetHeight;
      const progress = clamp01((vh - rect.top) / (vh + panelHeight));
      const eased = 1 - Math.pow(1 - progress, 3);
      const scale = 1 + eased * 2;
      const panX = 15 * eased;

      const img = slide4.querySelector("img");
      if (img) {
        img.style.transform = `translate3d(${panX.toFixed(2)}%, 0, 0) scale(${scale.toFixed(3)})`;
        img.style.transformOrigin = "center center";
      }
    }

    const BREAKPOINTS = [0, 0.2, 0.25, 0.65, 0.9];

    function getIndexFromProgress(pct) {
      for (let i = BREAKPOINTS.length - 1; i >= 0; i--) {
        if (pct >= BREAKPOINTS[i]) return i;
      }
      return 0;
    }

    function update() {
      const rect = section.getBoundingClientRect();
      const trackHeight = section.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;

      const pct = clamp01(-rect.top / trackHeight);
      const index = getIndexFromProgress(pct);

      if (index !== currentIndex) {
        activateSlide(index, false);
        slides.forEach((s, i) => {
          if (i !== index && i === ZOOM_SLIDE_INDEX) {
            const img = s.querySelector("img");
            if (img) img.style.transform = "";
          }
        });
      }

      if (index === ZOOM_SLIDE_INDEX && !zoomTicking) {
        zoomTicking = true;
        requestAnimationFrame(() => { zoomTicking = false; applyZoomToSlide4(); });
      }
    }

    activateSlide(0, true);
    window.addEventListener("scroll", createScrollHandler(() => { if (isActive()) update(); }), { passive: true });
    window.addEventListener("resize", update, { passive: true });

    // Browser restores scroll position asynchronously after page load.
    // Run update() once after a short delay to catch the restored position.
    requestAnimationFrame(() => { update(); setTimeout(update, 200); });
  })();

  // ═══════════════════════════════════════════════════════════
  // 2. PANEL p2 — CINEMATIC (from 06-p2-cinematic.js)
  //    Nền vàng be + float image + text reveal (bidirectional)
  // ═══════════════════════════════════════════════════════════
  (() => {
    const panel = document.querySelector(".bpt-sm-panel--cinematic");
    if (!panel) return;

    const floatImg = panel.querySelector(".bpt-legend-float");
    const textEl = panel.querySelector(".bpt-sm-text.bpt-reveal");

    if (prefersReduced) {
      if (floatImg) { floatImg.style.opacity = "1"; floatImg.style.transform = "none"; }
      if (textEl) { textEl.classList.add("is-visible"); }
      return;
    }

    // IntersectionObserver — bidirectional: thêm/xóa class khi scroll vào/ra
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (floatImg) floatImg.classList.add("ch1-visible");
          if (textEl) textEl.classList.add("is-visible");
        } else {
          if (floatImg) floatImg.classList.remove("ch1-visible");
          if (textEl) textEl.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -80px 0px" });
    observer.observe(panel);
  })();

  // ═══════════════════════════════════════════════════════════
  // 3. TEXT PANELS — Scroll-driven 45° fly-in (from 07-text-panels.js)
  //    p1, p3, p4, p5 text blocks bay vào từ rìa màn hình
  // ═══════════════════════════════════════════════════════════
  (() => {
    const section = document.querySelector('[data-bgsm="ch1"]');
    if (!section || prefersReduced) return;

    const panelItems = Array.from(
      section.querySelectorAll(".bpt-sm-panel:not(.bpt-sm-panel--cinematic):not(.bpt-sm-panel--magazine)")
    ).map((panel) => {
      const textEl = panel.querySelector(".bpt-sm-text.bpt-reveal");
      if (!textEl) return null;
      const dir = textEl.classList.contains("bpt-sm-text--right") ? -1 : 1;
      textEl.style.willChange = "transform, opacity";
      return { panel, textEl, dir };
    }).filter(Boolean);

    if (!panelItems.length) return;

    const isActive = createVisObserver(section, { rootMargin: "15% 0px" });

    function computeItemProgress(panel) {
      const rect = panel.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp01((vh * 1.1 - rect.top) / (vh * 1.1 - vh * 0.45));
      const ex = clamp01((-vh * 0.35 - rect.top) / (-vh * 0.35 - (-vh * 1.2)));
      return { p, ex };
    }

    function applyItem({ panel, textEl, dir }) {
      const { p, ex } = computeItemProgress(panel);
      const ep = easeOut(p);
      const exp = easeIn(ex);

      if (ep > 0.15) {
        textEl.classList.add("is-visible");
      } else if (exp > 0.4) {
        textEl.classList.remove("is-visible");
      }

      textEl.style.willChange = (ep === 0 && exp === 0) ? "auto" : "transform, opacity";

      const rotation = dir * 3;
      if (isMobile) {
        const ty = (55 * (1 - ep) - 20 * exp).toFixed(2);
        const sc = (0.94 + 0.06 * ep - 0.04 * exp).toFixed(3);
        const bl = (4 * (1 - ep) + 3 * exp).toFixed(1);
        const op = (Math.min(1, p * 1.8) * (1 - exp * 0.95)).toFixed(3);
        textEl.style.transform = `translate3d(0, ${ty}px, 0) scale(${sc})`;
        textEl.style.opacity = op;
      } else {
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

    panelItems.forEach(applyItem);
    window.addEventListener("scroll", createScrollHandler(() => { if (isActive()) panelItems.forEach(applyItem); }), { passive: true });
    window.addEventListener("resize", () => panelItems.forEach(applyItem), { passive: true });
  })();

  // ═══════════════════════════════════════════════════════════
  // 4. PANEL p1 — MAGAZINE CINEMATIC (from 08-magazine.js)
  //    Ảnh Đình làng bay từ góc, 3 phases: enter → settle → exit
  // ═══════════════════════════════════════════════════════════
  (() => {
    const panel = document.querySelector(".bpt-sm-panel--magazine");
    if (!panel) return;

    const photo = panel.querySelector(".bpt-magazine-photo");
    const photoFrame = panel.querySelector(".bpt-magazine-photo-inner");
    const textEl = panel.querySelector(".bpt-sm-text.bpt-reveal");

    if (prefersReduced) {
      [photo, photoFrame, textEl].forEach(el => {
        if (!el) return;
        el.style.transform = "";
        el.style.opacity = "1";
        el.classList.add("is-visible");
      });
      return;
    }

    [photo, photoFrame, textEl].forEach(el => {
      if (el) el.style.willChange = "transform, opacity";
    });

    const PHASE = { ENTER: 0.35, SETTLE: 0.55, EXIT: 0.75 };

    function computeProgress() {
      const rect = panel.getBoundingClientRect();
      const vh = window.innerHeight;
      const panelHeight = rect.height;
      return clamp01((vh - rect.top) / (vh + panelHeight));
    }

    function getPhaseProgress(progress) {
      if (progress < PHASE.ENTER) {
        return { type: "enter", p: progress / PHASE.ENTER };
      } else if (progress < PHASE.SETTLE) {
        return { type: "enter-settle", p: (progress - PHASE.ENTER) / (PHASE.SETTLE - PHASE.ENTER) };
      } else if (progress < PHASE.EXIT) {
        return { type: "settle", p: 0 };
      } else {
        return { type: "exit", p: (progress - PHASE.EXIT) / (1 - PHASE.EXIT) };
      }
    }

    function update() {
      const progress = computeProgress();
      const phase = getPhaseProgress(progress);
      const eased = easeOut(Math.min(1, phase.p));

      if (phase.type === "enter") {
        const x = 80 * (1 - eased);
        const y = 60 * (1 - eased);
        const rot = 18 * (1 - eased);
        const scale = 0.85 + 0.15 * eased;
        const opacity = eased;

        if (photo) {
          photo.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, 0) rotate(${rot.toFixed(2)}deg)`;
          photo.style.opacity = opacity.toFixed(3);
        }
        if (photoFrame) {
          photoFrame.style.transform = `scale(${scale.toFixed(3)}) rotate(${-3 * (1 - eased)}deg)`;
          photoFrame.style.opacity = opacity.toFixed(3);
          photoFrame.classList.toggle("is-visible", eased > 0.5);
        }
        const textDelay = Math.max(0, eased - 0.3) / 0.7;
        const textEased = easeOut(textDelay);
        if (textEl) {
          textEl.style.transform = `translate3d(${(40 * (1 - textEased)).toFixed(2)}px, ${(30 * (1 - textEased)).toFixed(2)}px, 0)`;
          textEl.style.opacity = textEased.toFixed(3);
          textEl.classList.toggle("is-visible", textEased > 0.3);
        }

      } else if (phase.type === "enter-settle") {
        const s = easeInOut(phase.p);
        if (photo) { photo.style.transform = `translate3d(0, 0, 0) rotate(${-2 * s}deg)`; photo.style.opacity = "1"; }
        if (photoFrame) { photoFrame.style.transform = `scale(1) rotate(${-1 * s}deg)`; photoFrame.style.opacity = "1"; photoFrame.classList.add("is-visible"); }
        if (textEl) { textEl.style.transform = "translate3d(0, 0, 0)"; textEl.style.opacity = "1"; textEl.classList.add("is-visible"); }

      } else if (phase.type === "settle") {
        if (photo) { photo.style.transform = "translate3d(0, 0, 0) rotate(-2deg)"; photo.style.opacity = "1"; photo.style.willChange = "auto"; }
        if (photoFrame) { photoFrame.style.transform = "scale(1) rotate(-1deg)"; photoFrame.style.opacity = "1"; photoFrame.style.willChange = "auto"; }
        if (textEl) { textEl.style.willChange = "auto"; }

      } else if (phase.type === "exit") {
        const ex = easeInOut(eased);
        const x = -60 * ex;
        const y = -20 * ex;
        const rot = -2 - 8 * ex;
        const opacity = 1 - ex * 0.8;

        if (photo) {
          photo.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, 0) rotate(${rot.toFixed(2)}deg)`;
          photo.style.opacity = opacity.toFixed(3);
        }
        if (photoFrame) {
          photoFrame.style.transform = `scale(${1 - 0.1 * ex}) rotate(${-1 - 4 * ex}deg)`;
          photoFrame.style.opacity = opacity.toFixed(3);
        }
        const textExit = Math.min(1, ex * 1.3);
        if (textEl) {
          textEl.style.transform = `translate3d(${(-30 * textExit).toFixed(2)}px, ${(-20 * textExit).toFixed(2)}px, 0)`;
          textEl.style.opacity = (1 - textExit).toFixed(3);
          if (textExit > 0.8) textEl.classList.remove("is-visible");
        }
      }
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          window.addEventListener("scroll", createScrollHandler(update), { passive: true });
          update();
        } else {
          window.removeEventListener("scroll", update);
        }
      });
    }, { rootMargin: "20% 0px" });
    obs.observe(panel);
    update();
  })();
})();
