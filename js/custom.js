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
