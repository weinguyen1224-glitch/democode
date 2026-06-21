/* CHƯƠNG II — Cinematic reveal for new sections               */
/* ═══════════════════════════════════════════════════════════ */

(() => {
  // Reveal animations for bpt-split-scene and bpt-scene sections
  const sceneEls = document.querySelectorAll(
    "#section-bpt-ch2-mo-dau, #section-bpt-ch2-nghe-nhan, #section-bpt-ch2-bao-ton",
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
