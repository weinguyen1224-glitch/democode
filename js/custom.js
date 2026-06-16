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
  const reveals = document.querySelectorAll('.bpt-reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bpt-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════════════ */
/* STORYTELLING — ca-dao reveal, divider animation, intro card */
/* ═══════════════════════════════════════════════════════════ */

// Ca-dao blockquote: separate observer for border-grow effect
(() => {
  const quotes = document.querySelectorAll('.bpt-ca-dao');
  if (!quotes.length) return;

  const qObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('bpt-quote-visible');
          qObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.35, rootMargin: '0px 0px -60px 0px' }
  );

  quotes.forEach((q) => qObs.observe(q));
})();

// Chapter divider: add bpt-visible for entrance animation
(() => {
  const dividers = document.querySelectorAll('.bpt-chapter-divider');
  if (!dividers.length) return;

  const dObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('bpt-visible');
          dObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25, rootMargin: '0px 0px -60px 0px' }
  );

  dividers.forEach((d) => dObs.observe(d));
})();

// Intro card: entrance animation on load
(() => {
  const introCard = document.querySelector('.intro-card');
  if (!introCard) return;

  // If intro is already visible on load, reveal immediately
  const iObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('bpt-visible');
          iObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  iObs.observe(introCard);
})();

// Scroll-driven paragraph dimming: paragraphs gently fade as user scrolls past them
(() => {
  const proseParas = document.querySelectorAll('.bpt-prose p');
  if (!proseParas.length) return;

  // Respect reduced motion preference
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting && e.boundingClientRect.top < 0) {
          // Scrolled past — dim gently
          e.target.style.opacity = '0.5';
        } else {
          e.target.style.opacity = '';
        }
      });
    },
    { threshold: 0, rootMargin: '-10% 0px -50% 0px' }
  );

  proseParas.forEach((p) => pObs.observe(p));
})();

/* ═════════════════════════════════════════════════════════════ */
/* ZOOM SCENE — scroll-driven zoom for bánh Phu Thê closing     */
/* ═════════════════════════════════════════════════════════════ */
(() => {
  const zoomScene = document.querySelector('.bpt-zoom-scene');
  if (!zoomScene) return;

  // Respect reduced motion
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const visual = zoomScene.querySelector('.bpt-zoom-scene__visual');
  const text = zoomScene.querySelector('.bpt-zoom-scene__text');
  if (!visual) return;

  let ticking = false;

  function updateZoom() {
    const rect = zoomScene.getBoundingClientRect();
    const vh = innerHeight;

    // ratio: 0 when section bottom enters viewport → 1 when section top passes viewport center
    // We want zoom to go from 1 to ~1.8 as the user scrolls through the section
    const sectionProgress = Math.min(1, Math.max(0,
      (vh - rect.top) / (vh + rect.height)
    ));

    // Zoom: starts at 1, eases up to 1.8 as user scrolls through
    const scale = 1 + sectionProgress * 0.8;
    visual.style.setProperty('--bpt-zoom', scale.toFixed(3));
    visual.style.transform = `scale(${scale.toFixed(3)})`;

    // Text: fades in after ~30% progress through the section
    if (text) {
      const textOpacity = Math.min(1, Math.max(0, (sectionProgress - 0.3) / 0.3));
      text.style.setProperty('--bpt-zoom-text-opacity', textOpacity.toFixed(3));
    }

    ticking = false;
  }

  function requestZoomUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateZoom);
      ticking = true;
    }
  }

  addEventListener('scroll', requestZoomUpdate, { passive: true });
  addEventListener('resize', requestZoomUpdate, { passive: true });

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

  const slides = Array.from(section.querySelectorAll('.bpt-sm-slide'));
  const panels = Array.from(section.querySelectorAll('.bpt-sm-panel'));
  const N = slides.length;
  if (!N || !panels.length) return;

  // Respect reduced motion: no cross-fade, just show slide 0
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    slides[0].classList.add('is-active');
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
    { rootMargin: '10% 0px' }
  );
  visObs.observe(section);

  function activateSlide(index, instant) {
    if (index === currentIndex && !instant) return;

    const prev = currentIndex;
    currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.remove('is-active', 'is-primed');
      if (i === index) {
        if (instant) {
          // Tắt transition tạm thời để chuyển ngay
          slide.style.transition = 'none';
          slide.style.transform = 'scale(1)';
          slide.style.opacity = '1';
          requestAnimationFrame(() => {
            slide.style.removeProperty('transition');
            slide.style.removeProperty('transform');
            slide.style.removeProperty('opacity');
            slide.classList.add('is-active');
          });
        } else {
          slide.classList.add('is-active');
        }
      } else if (i === index + 1) {
        // Pre-load ảnh kế tiếp
        slide.classList.add('is-primed');
      }
    });
  }

  function onScroll() {
    if (!_active || ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function update() {
    const rect = section.getBoundingClientRect();
    const trackHeight = section.offsetHeight - window.innerHeight;
    if (trackHeight <= 0) { ticking = false; return; }

    // pct: 0 khi đỉnh section vào viewport → 1 khi đáy section rời viewport
    const pct = Math.max(0, Math.min(1, -rect.top / trackHeight));

    // Mỗi panel chiếm 1/N của chiều dài scroll
    const rawIndex = pct * N;
    const index = Math.min(N - 1, Math.floor(rawIndex));

    if (index !== currentIndex) {
      activateSlide(index, false);
    }

    ticking = false;
  }

  // Khởi tạo: slide 0 active ngay (instant, không transition)
  activateSlide(0, true);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // First update in case page loads mid-scroll
  requestAnimationFrame(update);
})();


/* ═══════════════════════════════════════════════════════════
   Panel p2 — Scroll-driven parallax (GIF + Text đồng bộ)
   ─────────────────────────────────────────────────────────
   Design principles (UX/motion expert):
   • GIF trượt từ trái vào — dẫn trước, thấy ngay khi panel xuất hiện
   • Text trượt từ phải vào — lag 15% sau GIF để tạo cảm giác "gặp nhau"
   • Scroll lên → cả hai reverse đồng bộ (GIF lùi trái, text mờ-lùi phải)
   • Scroll qua panel → exit: GIF tiếp tục trôi, text fade out nhẹ
   • Pure rAF loop — không dùng IntersectionObserver, không CSS transition
   • Chỉ thay opacity + transform → không reflow, không jank
   ═══════════════════════════════════════════════════════════ */

(() => {
  const splitPanel = document.querySelector('.bpt-sm-panel--split');
  if (!splitPanel) return;

  const gifEl  = splitPanel.querySelector('.bpt-sm-gif-reveal');
  const textEl = splitPanel.querySelector('.bpt-sm-text.bpt-reveal');
  if (!gifEl) return;

  // Reduced motion: instant, no animation
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gifEl.style.transform  = 'none';
    gifEl.style.opacity    = '1';
    if (textEl) { textEl.style.transform = 'none'; textEl.style.opacity = '1'; }
    return;
  }

  // Đặt will-change sớm để GPU layer sẵn sàng
  gifEl.style.willChange = 'transform, opacity';
  if (textEl) textEl.style.willChange = 'transform, opacity';

  let ticking      = false;
  let lastProgress = -1;

  /* ── Progress: 0 khi panel chưa vào, 1 khi panel đã vào giữa màn hình ── */
  function computeProgress() {
    const rect = splitPanel.getBoundingClientRect();
    const vh   = window.innerHeight;
    // p=0: rect.top = vh*1.05 (panel dưới màn hình)
    // p=1: rect.top = vh*0.35 (panel chiếm 65% viewport — đã vào hẳn)
    const rangeStart = vh * 1.05;
    const rangeEnd   = vh * 0.35;
    const traveled   = rangeStart - rect.top;
    const range      = rangeStart - rangeEnd;
    return Math.max(0, Math.min(1, traveled / range));
  }

  /* ── Exit progress: 0 khi panel ở giữa, 1 khi panel đã scroll qua hẳn ── */
  function computeExitProgress() {
    const rect = splitPanel.getBoundingClientRect();
    const vh   = window.innerHeight;
    // Exit bắt đầu khi rect.top < -vh*0.1 (panel bắt đầu rời đỉnh viewport)
    // Exit kết thúc khi rect.top < -vh*0.7 (panel gần ra khỏi viewport trên)
    const exitStart = -vh * 0.10;
    const exitEnd   = -vh * 0.70;
    const traveled  = exitStart - rect.top;
    const range     = exitStart - exitEnd;
    return Math.max(0, Math.min(1, traveled / range));
  }

  /* ── Easing: ease-out quart — mượt nhất cho slide vào ── */
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

  /* ── Apply: tính và set transform/opacity cho GIF + text ── */
  function applyProgress(p) {
    const ep = easeOut(p);

    // Exit: khi panel scroll qua, GIF tiếp tục trôi đi, text fade out
    const ex     = computeExitProgress();
    const exEased = easeOut(ex);

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      /* Mobile: slide lên từ dưới */
      const ty = (70 * (1 - ep)).toFixed(2);
      const sc = (0.92 + 0.08 * ep).toFixed(4);
      const op = (Math.min(1, p * 1.8) * (1 - exEased * 0.6)).toFixed(3);
      gifEl.style.transform = `translateY(${ty}px) scale(${sc})`;
      gifEl.style.opacity   = op;
      if (textEl) {
        const tty = (50 * (1 - Math.max(0, (p - 0.1) / 0.9))).toFixed(2);
        const top = (Math.min(1, Math.max(0, (p - 0.1) / 0.9) * 2) * (1 - exEased * 0.8)).toFixed(3);
        textEl.style.transform = `translateY(${tty}px)`;
        textEl.style.opacity   = top;
      }
    } else {
      /* ── Desktop: GIF từ trái, text từ phải ── */

      // GIF: trượt từ -55% → 0 (thấy rìa phải ngay từ đầu)
      // Exit: tiếp tục trôi thêm -15% khi scroll qua
      const gifTx = (-55 * (1 - ep) - 15 * exEased).toFixed(2);
      const gifTy = (20  * (1 - ep)).toFixed(2);
      const gifSc = (0.95 + 0.05 * ep).toFixed(4);
      const gifOp = (Math.min(1, p * 2.5) * (1 - exEased * 0.5)).toFixed(3);

      gifEl.style.transform = `translateX(${gifTx}%) translateY(${gifTy}px) scale(${gifSc})`;
      gifEl.style.opacity   = gifOp;

      // Text: bắt đầu sau GIF 15% (lag), trượt từ phải +40px → 0
      // Exit: lùi nhẹ về phải +20px + fade out
      if (textEl) {
        const textP   = Math.max(0, Math.min(1, (p - 0.15) / 0.85)); // lag 15%
        const textEp  = easeOut(textP);
        const textTx  = (40 * (1 - textEp) + 20 * exEased).toFixed(2);
        const textOp  = (Math.min(1, textP * 1.4) * (1 - exEased * 0.85)).toFixed(3);
        textEl.style.transform = `translateX(${textTx}px)`;
        textEl.style.opacity   = textOp;
      }
    }
  }

  function onRaf() {
    ticking = false;
    const p = computeProgress();
    if (Math.abs(p - lastProgress) < 0.0002) {
      // Vẫn check exit dù p không đổi
      applyProgress(p);
      return;
    }
    lastProgress = p;
    applyProgress(p);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onRaf);
  }

  // Init ngay (mid-scroll load)
  applyProgress(computeProgress());

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
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

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Chỉ lấy panels KHÔNG phải split (p2 đã có IIFE riêng)
  const panelItems = Array.from(
    section.querySelectorAll('.bpt-sm-panel:not(.bpt-sm-panel--split)')
  ).map((panel) => {
    const textEl = panel.querySelector('.bpt-sm-text.bpt-reveal');
    if (!textEl) return null;

    // Xác định hướng bay: --left → từ phải (dir=+1), --right → từ trái (dir=-1), center → phải
    const dir = textEl.classList.contains('bpt-sm-text--right') ? -1 : 1;

    // GPU layer sẵn sàng
    textEl.style.willChange = 'transform, opacity';

    return { panel, textEl, dir };
  }).filter(Boolean);

  if (!panelItems.length) return;

  let ticking = false;
  let _active = false;

  const visObs = new IntersectionObserver(
    (entries) => { _active = entries.some(e => e.isIntersecting); },
    { rootMargin: '15% 0px' }
  );
  visObs.observe(section);

  // easeOut quart — mượt cho enter
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
  // easeIn quad — nhanh dần cho exit
  function easeIn(t) { return t * t; }

  function computeItemProgress(panel) {
    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight;
    // Enter: rect.top từ vh*1.1 xuống vh*0.45 → p: 0→1
    const enterStart = vh * 1.1;
    const enterEnd   = vh * 0.45;
    const p = Math.max(0, Math.min(1, (enterStart - rect.top) / (enterStart - enterEnd)));

    // Exit: rect.top từ -vh*0.05 xuống -vh*0.65 → ex: 0→1
    const exitStart = -vh * 0.05;
    const exitEnd   = -vh * 0.65;
    const ex = Math.max(0, Math.min(1, (exitStart - rect.top) / (exitStart - exitEnd)));

    return { p, ex };
  }

  function applyItem({ panel, textEl, dir }) {
    const { p, ex } = computeItemProgress(panel);
    const ep  = easeOut(p);
    const exp = easeIn(ex);

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile: bay lên từ dưới theo chiều thẳng đứng
      const ty  = (64 * (1 - ep) - 24 * exp).toFixed(2);
      const op  = (Math.min(1, p * 1.6) * (1 - exp * 0.9)).toFixed(3);
      textEl.style.transform = `translateY(${ty}px)`;
      textEl.style.opacity   = op;
    } else {
      // Desktop: góc 45° — X đối xứng theo dir, Y từ dưới lên
      const tx  = (dir *  80 * (1 - ep) - dir * 28 * exp).toFixed(2);
      const ty  = (60  * (1 - ep) - 20 * exp).toFixed(2);
      const op  = (Math.min(1, p * 1.5) * (1 - exp * 0.9)).toFixed(3);
      textEl.style.transform = `translateX(${tx}px) translateY(${ty}px)`;
      textEl.style.opacity   = op;
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

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();

