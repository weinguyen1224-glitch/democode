/* CHƯƠNG II — Cinematic reveal for new sections               */
/* ═══════════════════════════════════════════════════════════ */

function ch2RevealInit() {
  // Reveal animations for bpt-split-scene and bpt-scene sections
  const sceneEls = document.querySelectorAll(
    "#section-bpt-ch2-mo-dau, #section-bpt-ch2-nghe-nhan, #section-bpt-ch2-bao-ton, #section-bpt-ch2-gallery-1",
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
          entry.target.querySelectorAll(".bpt-split-scene, .bpt-scene__centered").forEach((el) => {
            el.classList.add("bpt-visible");
          });
        } else {
          entry.target.classList.remove("bpt-visible");
          entry.target.querySelectorAll(".bpt-reveal").forEach((el) => {
            el.classList.remove("bpt-visible");
          });
          entry.target.querySelectorAll(".bpt-split-scene, .bpt-scene__centered").forEach((el) => {
            el.classList.remove("bpt-visible");
          });
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
  // Skip on mobile for performance — integrated with ScrollEngine
  const splitVisuals = document.querySelectorAll(
    ".bpt-split-scene__visual .bpt-placeholder-img",
  );
  if (
    splitVisuals.length &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.innerWidth >= 769
  ) {
    let active = true;
    const firstVisual = splitVisuals[0];

    // IO guard: only run parallax when section is on-screen
    if (typeof IntersectionObserver !== "undefined" && firstVisual) {
      const section = firstVisual.closest('[id^="section-bpt-ch2"]') || firstVisual;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => { active = e.isIntersecting; });
        },
        { rootMargin: "20% 0px" }
      );
      obs.observe(section);
    }

    function updateParallax(frame) {
      const vh = frame ? frame.viewportH : window.innerHeight;
      splitVisuals.forEach((img) => {
        const rect = img.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const progress = (vh - rect.top) / (vh + img.offsetHeight);
        const shift = (progress - 0.5) * 20;
        img.style.transform = `translateY(${shift.toFixed(1)}px)`;
      });
      return true;
    }

    if (window.BPT && window.BPT.ScrollEngine) {
      window.BPT.ScrollEngine.register({
        id: 'ch2-parallax',
        priority: window.BPT.ScrollEngine.PRIORITY.LOW,
        update: (frame) => active ? updateParallax(frame) : true,
      });
    } else {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!active || ticking) return;
        requestAnimationFrame(() => {
          updateParallax({ viewportH: window.innerHeight });
          ticking = false;
        });
        ticking = true;
      }, { passive: true });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ch2RevealInit);
} else {
  ch2RevealInit();
}
