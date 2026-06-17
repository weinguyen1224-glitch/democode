/* ═════════════════════════════════════════════════════════════
   BACKGROUND SCROLLMATION — Chương I
   Pattern B từ SCROLL_ANIMATION_SPEC.md:
   Sticky media layer, text panels scroll qua, ảnh cross-fade.
   Thuật toán: passive scroll listener + rAF + chỉ thay opacity/transform.
   ═════════════════════════════════════════════════════════════ */

(() => {
  const section = document.querySelector('[data-bgsm="ch1"]');
  if (!section) return;

  const slides = Array.from(section.querySelectorAll(".bpt-sm-slide"));
  const panels = Array.from(section.querySelectorAll(".bpt-sm-panel"));
  const N = slides.length;
  if (!N || !panels.length) return;

  // Respect reduced motion: no cross-fade, just show slide 0
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced) {
    slides[0].classList.add("is-active");
    return;
  }

  let currentIndex = 0;
  let ticking = false;
  let _active = false;
  let cachedTrackHeight = section.offsetHeight - window.innerHeight;

  // IntersectionObserver: pause scroll handler when section off-screen
  const visObs = new IntersectionObserver(
    (entries) => {
      _active = entries[0].isIntersecting;
    },
    { rootMargin: "10% 0px" },
  );
  visObs.observe(section);

  const overlay = section.querySelector(".bpt-sm-overlay");

  // Warm slides = index 0,1 (p1 Kinh Bắc, p2 Truyền thuyết)
  const WARM_SLIDES = new Set([0, 1]);

  function activateSlide(index, instant) {
    if (index === currentIndex && !instant) return;

    const prev = currentIndex;
    currentIndex = index;

    // Toggle overlay: light for warm slides, dark for photo slides
    if (overlay) {
      if (WARM_SLIDES.has(index)) {
        overlay.classList.add("is-light");
      } else {
        overlay.classList.remove("is-light");
      }
    }

    slides.forEach((slide, i) => {
      slide.classList.remove("is-active", "is-primed");
      if (i === index) {
        if (instant) {
          // Tắt transition tạm thời để chuyển ngay
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
        // Pre-load ảnh kế tiếp
        slide.classList.add("is-primed");
      }
    });
  }

  function onScroll() {
    if (!_active || ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  // Zoom scale cho slide 4 — skip on mobile for performance
  const ZOOM_SLIDE_INDEX = 4;
  const isMobile = window.innerWidth < 769;
  let zoomTicking = false;

  function applyZoomToSlide4() {
    if (isMobile) return; // Skip zoom on mobile — too expensive
    
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

    const progress = Math.max(
      0,
      Math.min(1, (vh - rect.top) / (vh + panelHeight)),
    );

    const eased = 1 - Math.pow(1 - progress, 3);
    const scale = 1 + eased * 2;
    const panX = 15 * eased;

    const img = slide4.querySelector("img");
    if (img) {
      img.style.transform = `translate3d(${panX.toFixed(2)}%, 0, 0) scale(${scale.toFixed(3)})`;
      img.style.transformOrigin = "center center";
    }
  }

  function onZoomRaf() {
    zoomTicking = false;
    applyZoomToSlide4();
  }

  function requestZoomUpdate() {
    if (!zoomTicking) {
      requestAnimationFrame(onZoomRaf);
      zoomTicking = true;
    }
  }

  function update() {
    const rect = section.getBoundingClientRect();
    if (cachedTrackHeight <= 0) {
      ticking = false;
      return;
    }

    // pct: 0 khi đỉnh section vào viewport → 1 khi đáy section rời viewport
    const pct = Math.max(0, Math.min(1, -rect.top / cachedTrackHeight));

    // Mỗi panel chiếm 1/N của chiều dài scroll
    const rawIndex = pct * N;
    const index = Math.min(N - 1, Math.floor(rawIndex));

    if (index !== currentIndex) {
      activateSlide(index, false);
      // Khi chuyển slide, reset zoom của slide cũ
      slides.forEach((s, i) => {
        if (i !== index && i === ZOOM_SLIDE_INDEX) {
          const img = s.querySelector("img");
          if (img) img.style.transform = "";
        }
      });
    }

    // Trigger zoom update cho slide 4
    if (index === ZOOM_SLIDE_INDEX) {
      requestZoomUpdate();
    }

    ticking = false;
  }

  // Khởi tạo: slide 0 active ngay (instant, không transition)
  activateSlide(0, true);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    cachedTrackHeight = section.offsetHeight - window.innerHeight;
    onScroll();
  }, { passive: true });

  // First update in case page loads mid-scroll
  requestAnimationFrame(update);
})();

