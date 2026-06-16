(() => {
  const sections = [
    ...document.querySelectorAll(
      '#article > header[id^="section-"], #article > div[id^="section-"]',
    ),
  ];
  if (!sections.length) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    '<div class="scene-progress" aria-hidden="true"></div>',
  );

  const progress = document.querySelector(".scene-progress");
  let ticking = false;
  let activeIndex = 0;
  let activeSection = sections[0];

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      activeSection = visible.target;
      activeIndex = sections.indexOf(activeSection);
      document.documentElement.style.setProperty("--active-scene", activeIndex);
      requestUpdate();
    },
    { threshold: [0.25, 0.5, 0.75] },
  );

  sections.forEach((section) => observer.observe(section));

  function update() {
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    const pageProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    progress.style.transform = `scaleX(${pageProgress})`;

    const rect = activeSection.getBoundingClientRect();
    const activeRatio = clamp(
      (innerHeight - rect.top) / (innerHeight + rect.height),
    );
    activeSection.style.setProperty("--scene-ratio", activeRatio.toFixed(3));
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate, { passive: true });
  update();
})();
/* ═══════════════════════════════════════════════════════════ */
/* CHƯƠNG I — Scroll-reveal for narrative scenes                */
/* ═══════════════════════════════════════════════════════════ */

(() => {
  const allReveals = document.querySelectorAll(".bpt-reveal");
  // Exclude elements with their own scroll-driven animation logic
  const reveals = [...allReveals].filter(
    (el) =>
      !el.closest(".bpt-sm-panel--cinematic") &&
      !el.closest(".bpt-sm-panel--magazine") &&
      !el.closest(".bpt-zoom-scene"),
  );
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("bpt-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════════ */
/* STORYTELLING — ca-dao reveal, divider animation, intro card */
/* ═══════════════════════════════════════════════════════════ */

// Ca-dao blockquote: separate observer for border-grow effect
(() => {
  const quotes = document.querySelectorAll(".bpt-ca-dao");
  if (!quotes.length) return;

  const qObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("bpt-quote-visible");
          qObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -60px 0px" },
  );

  quotes.forEach((q) => qObs.observe(q));
})();

// Chapter divider: add bpt-visible for entrance animation
(() => {
  const dividers = document.querySelectorAll(".bpt-chapter-divider");
  if (!dividers.length) return;

  const dObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("bpt-visible");
          dObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -60px 0px" },
  );

  dividers.forEach((d) => dObs.observe(d));
})();

// Intro card: entrance animation on load
(() => {
  const introCard = document.querySelector(".intro-card");
  if (!introCard) return;

  // If intro is already visible on load, reveal immediately
  const iObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("bpt-visible");
          iObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  iObs.observe(introCard);
})();

// Scroll-driven paragraph dimming: paragraphs gently fade as user scrolls past them
(() => {
  const proseParas = document.querySelectorAll(".bpt-prose p");
  if (!proseParas.length) return;

  // Respect reduced motion preference
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const pObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting && e.boundingClientRect.top < 0) {
          // Scrolled past — dim gently
          e.target.style.opacity = "0.5";
        } else {
          e.target.style.opacity = "";
        }
      });
    },
    { threshold: 0, rootMargin: "-10% 0px -50% 0px" },
  );

  proseParas.forEach((p) => pObs.observe(p));
})();

/* ═════════════════════════════════════════════════════════════ */
/* ZOOM SCENE — scroll-driven zoom for bánh Phu Thê closing     */
/* ═════════════════════════════════════════════════════════════ */
(() => {
  const zoomScene = document.querySelector(".bpt-zoom-scene");
  if (!zoomScene) return;

  // Respect reduced motion
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const visual = zoomScene.querySelector(".bpt-zoom-scene__visual");
  const text = zoomScene.querySelector(".bpt-zoom-scene__text");
  if (!visual) return;

  let ticking = false;

  // Ease-out cubic for smooth zoom feel
  function easeOutCubicZoom(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateZoom() {
    const rect = zoomScene.getBoundingClientRect();
    const vh = innerHeight;

    // Progress: 0 when section bottom enters viewport → 1 when section top passes ~60vh above bottom
    // We want zoom to go from 1 → 3× as user scrolls through
    const sectionProgress = Math.min(
      1,
      Math.max(0, (vh - rect.top) / (vh + rect.height * 0.6)),
    );

    // Apply easing for natural zoom feel: slow start, accelerate, then decelerate near 3×
    const eased = easeOutCubicZoom(sectionProgress);

    // Zoom: starts at 1, eases up to 3× as user scrolls through
    const scale = 1 + eased * 2;
    visual.style.setProperty("--bpt-zoom", scale.toFixed(3));
    visual.style.transform = `scale(${scale.toFixed(3)})`;

    // Text: fades in after ~50% progress (when zoom is already ~2×)
    if (text) {
      const textOpacity = Math.min(
        1,
        Math.max(0, (sectionProgress - 0.45) / 0.3),
      );
      text.style.setProperty("--bpt-zoom-text-opacity", textOpacity.toFixed(3));
      const textY = 30 * (1 - Math.min(1, textOpacity));
      text.style.setProperty("--bpt-zoom-text-y", textY.toFixed(1));
    }

    ticking = false;
  }

  function requestZoomUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateZoom);
      ticking = true;
    }
  }

  addEventListener("scroll", requestZoomUpdate, { passive: true });
  addEventListener("resize", requestZoomUpdate, { passive: true });

  // Initial state
  requestZoomUpdate();
})();

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
    const trackHeight = section.offsetHeight - window.innerHeight;
    if (trackHeight <= 0) {
      ticking = false;
      return;
    }

    // pct: 0 khi đỉnh section vào viewport → 1 khi đáy section rời viewport
    const pct = Math.max(0, Math.min(1, -rect.top / trackHeight));

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
  window.addEventListener("resize", onScroll, { passive: true });

  // First update in case page loads mid-scroll
  requestAnimationFrame(update);
})();

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
    if (ep > 0.2) {
      textEl.classList.add("is-visible");
    } else if (exp > 0.5) {
      textEl.classList.remove("is-visible");
    }

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile: bay lên từ dưới theo chiều thẳng đứng
      const ty = (64 * (1 - ep) - 24 * exp).toFixed(2);
      const op = (Math.min(1, p * 1.6) * (1 - exp * 0.9)).toFixed(3);
      textEl.style.transform = `translate3d(0, ${ty}px, 0)`;
      textEl.style.opacity = op;
    } else {
      // Desktop: góc 45° — X đối xứng theo dir, Y từ dưới lên
      const tx = (dir * 80 * (1 - ep) - dir * 28 * exp).toFixed(2);
      const ty = (60 * (1 - ep) - 20 * exp).toFixed(2);
      const op = (Math.min(1, p * 1.5) * (1 - exp * 0.9)).toFixed(3);
      textEl.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
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

/* ═══════════════════════════════════════════════════════════
   Panel p1 — Magazine Cinematic: ảnh Đình làng bay từ góc
   - Phase 1 ENTER: Ảnh từ góc phải dưới (nghiêng 35°) bay vào vị trí chuẩn
   - Phase 2 HOLD: Ảnh đứng yên, nằm ngay ngắn
   - Phase 3 EXIT: Ảnh bay ngược về góc phải dưới khi scroll qua
   - Khung ảnh: scale từ nhỏ → to + fade in (cinematic reveal)
   ═══════════════════════════════════════════════════════════ */

(() => {
  // Mobile: simplified IntersectionObserver instead of scroll-driven animation
  const isMobileMag = window.innerWidth < 769;

  const panel = document.querySelector(".bpt-sm-panel--magazine");
  if (!panel) return;

  const photo = panel.querySelector(".bpt-magazine-photo");
  const photoFrame = panel.querySelector(".bpt-magazine-photo-inner");
  const textEl = panel.querySelector(".bpt-sm-text.bpt-reveal");

  // Mobile: simple reveal instead of per-frame animation
  if (isMobileMag) {
    const mobileMagObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (photo) {
              photo.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
              photo.style.opacity = "1";
            }
            if (photoFrame) {
              photoFrame.style.transform = "scale(1)";
              photoFrame.style.opacity = "1";
              photoFrame.classList.add("is-visible");
            }
            if (textEl) {
              textEl.style.transform = "translate3d(0, 0, 0)";
              textEl.style.opacity = "1";
              textEl.classList.add("is-visible");
            }
            mobileMagObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    mobileMagObs.observe(panel);
    return;
  }

  // Reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (photo) {
      photo.style.transform = "";
      photo.style.opacity = "1";
    }
    if (photoFrame) {
      photoFrame.style.transform = "";
      photoFrame.style.opacity = "1";
    }
    if (textEl) {
      textEl.style.transform = "";
      textEl.style.opacity = "1";
    }
    return;
  }

  // Easing functions
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function easeInCubic(t) {
    return t * t * t;
  }

  let ticking = false;

  function computeProgress() {
    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight;
    const panelHeight = rect.height;

    // viewport boundaries
    const viewportCenter = vh * 0.5;
    const panelTop = rect.top;
    const panelBottom = rect.bottom;
    const panelCenter = (panelTop + panelBottom) / 2;

    // Phase 1: ENTER - panel từ dưới lên đến khi panel top chạm viewport center
    // Start: panel bottom ở viewport bottom (panelTop = vh)
    // End: panel top ở viewport center (panelTop = viewportCenter)
    let pEnter = 0;
    const enterStart = vh; // panel vừa bắt đầu vào từ dưới
    const enterEnd = viewportCenter - panelHeight * 0.2; // panel đã vào khá sâu

    if (panelTop <= enterStart && panelTop >= enterEnd) {
      pEnter = Math.max(
        0,
        Math.min(1, (enterStart - panelTop) / (enterStart - enterEnd)),
      );
    } else if (panelTop < enterEnd) {
      pEnter = 1; // Enter hoàn thành
    }

    // Phase 3: EXIT - panel đi lên quá viewport center
    // Start: panel center ở viewport center
    // End: panel top ra khỏi viewport (panelTop = -panelHeight * 0.3)
    let pExit = 0;
    const exitStart = viewportCenter * 0.5; // bắt đầu exit muộn hơn
    const exitEnd = -panelHeight * 0.9; // đã exit hẳn — muộn hơn

    if (panelCenter <= exitStart && panelCenter >= exitEnd) {
      pExit = Math.max(
        0,
        Math.min(1, (exitStart - panelCenter) / (exitStart - exitEnd)),
      );
    } else if (panelCenter < exitEnd) {
      pExit = 1; // Đã exit hoàn toàn
    }

    return { pEnter, pExit };
  }

  function applyAnimation() {
    const { pEnter, pExit } = computeProgress();

    const ep = easeOutCubic(pEnter);
    const exp = easeInCubic(pExit);

    // Toggle is-visible classes cho animation
    if (ep > 0.15) {
      if (photoFrame) photoFrame.classList.add("is-visible");
      if (textEl) textEl.classList.add("is-visible");
    } else if (exp > 0.6) {
      if (photoFrame) photoFrame.classList.remove("is-visible");
      if (textEl) textEl.classList.remove("is-visible");
    }

    // Photo animation - 3 phases:
    // ENTER: từ góc phải dưới, rotate 35° → vị trí chuẩn
    // HOLD: ở vị trí chuẩn (khi pEnter=1, pExit=0)
    // EXIT: từ vị trí chuẩn → góc phải dưới, rotate 35°
    if (photo) {
      const startX = 80; // % (bên phải xa)
      const startY = 60; // % (dưới)
      const startRot = 35; // độ nghiêng ban đầu

      // Nếu đang exit, ưu tiên exit animation
      let finalX, finalY, finalRot, opacity;

      if (pExit > 0) {
        // EXIT phase: đang rời đi
        finalX = startX * exp;
        finalY = startY * exp;
        finalRot = startRot * exp;
        opacity = 1 - exp * 0.95;
      } else {
        // ENTER phase: đang vào
        finalX = startX * (1 - ep);
        finalY = startY * (1 - ep);
        finalRot = startRot * (1 - ep);
        opacity = Math.min(1, ep * 1.3);
      }

      photo.style.transform = `translate3d(${finalX.toFixed(2)}%, ${finalY.toFixed(2)}%, 0) rotate(${finalRot.toFixed(2)}deg)`;
      photo.style.opacity = Math.max(0, opacity).toFixed(3);
    }

    // Frame animation: scale từ nhỏ → to + fade in (cinematic)
    if (photoFrame) {
      let scale, opacity;

      if (pExit > 0) {
        // EXIT: frame thu nhỏ và fade out
        scale = 1 - 0.08 * exp;
        opacity = 1 - exp * 0.95;
      } else {
        // ENTER: frame scale lên và fade in
        scale = 0.92 + 0.08 * ep;
        opacity = Math.min(1, ep * 1.4);
      }

      photoFrame.style.transform = `scale(${scale.toFixed(3)})`;
      photoFrame.style.opacity = Math.max(0, opacity).toFixed(3);
    }

    // Text animation - đơn giản hơn
    if (textEl) {
      let finalY, opacity;

      if (pExit > 0) {
        // EXIT: text trượt lên và mờ
        finalY = -25 * exp;
        opacity = 1 - exp * 0.9;
      } else {
        // ENTER: text trượt lên nhẹ và hiện
        finalY = 40 * (1 - ep);
        opacity = Math.min(1, ep * 1.2);
      }

      textEl.style.transform = `translate3d(0, ${finalY.toFixed(2)}px, 0)`;
      textEl.style.opacity = Math.max(0, opacity).toFixed(3);
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

  // Init
  applyAnimation();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      onScroll();
    },
    { passive: true },
  );
})();

/* ═══════════════════════════════════════════════════════════ */
/* CHƯƠNG II — Cinematic reveal for new sections               */
/* ═══════════════════════════════════════════════════════════ */

(() => {
  // Reveal animations for bpt-split-scene and bpt-scene sections
  const sceneEls = document.querySelectorAll(
    "#section-bpt-ch2-mo-dau, #section-bpt-ch2-vi-ngot, #section-bpt-ch2-nghe-nhan, #section-bpt-ch2-bao-ton",
  );

  if (!sceneEls.length) return;

  const sceneObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("bpt-visible");
          // Also reveal inner elements
          entry.target.querySelectorAll(".bpt-reveal").forEach((el) => {
            el.classList.add("bpt-visible");
          });
          entry.target.querySelectorAll(".bpt-split-scene").forEach((el) => {
            el.classList.add("bpt-visible");
          });
          sceneObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
  );

  sceneEls.forEach((el) => sceneObs.observe(el));

  // Special: ca-dao--finale border glow
  const finaleCaDao = document.querySelector(".bpt-ca-dao--finale");
  if (finaleCaDao) {
    const caObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          finaleCaDao.classList.add("bpt-quote-visible");
          caObs.unobserve(finaleCaDao);
        }
      },
      { threshold: 0.35 },
    );
    caObs.observe(finaleCaDao);
  }

  // Parallax effect on placeholder images within split scenes
  // Skip on mobile for performance
  const splitVisuals = document.querySelectorAll(
    ".bpt-split-scene__visual .bpt-placeholder-img",
  );
  if (
    splitVisuals.length &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.innerWidth >= 769
  ) {
    let ticking = false;
    function updateParallax() {
      splitVisuals.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top < vh && rect.bottom > 0) {
          const progress = (vh - rect.top) / (vh + rect.height);
          const shift = (progress - 0.5) * 20; // ±10px parallax
          img.style.transform = `translateY(${shift.toFixed(1)}px)`;
        }
      });
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true },
    );
  }
})();
