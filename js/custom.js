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
/* CHƯƠNG I — Scroll-reveal + zoom transition                    */
/* ═══════════════════════════════════════════════════════════ */

(() => {
  const revealEls = document.querySelectorAll('.bpt-scroll-reveal');
  if (!revealEls.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bpt-revealed');
          // Zoom effect on the final Chương I section
          const zoomTarget = entry.target.querySelector('.bpt-scene--zoom-target');
          if (zoomTarget) {
            zoomTarget.classList.add('bpt-zoomed');
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
})();
