/* ═══════════════════════════════════════════════════════════
   OPACITY FOCUS — Dim text blocks away from viewport center
   Desktop only (skip mobile for performance)
   
   ENGINE INTEGRATION: Registered with BPT.ScrollEngine (LOW priority).
   ═══════════════════════════════════════════════════════════ */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 769) return;

  const textBlocks = document.querySelectorAll(".bpt-prose, .bpt-sm-text");
  if (!textBlocks.length) return;

  /** Adjust opacity based on distance from viewport center — skip off-screen */
  function updateOpacity(frame) {
    const vh = frame ? frame.viewportH : window.innerHeight;
    const viewportCenter = vh / 2;
    const maxDistance = vh * 0.5;
    const margin = vh * 0.3;

    textBlocks.forEach((block) => {
      const rect = block.getBoundingClientRect();
      if (rect.bottom < -margin || rect.top > vh + margin) return;
      const blockCenter = rect.top + rect.height / 2;
      const distance = Math.abs(blockCenter - viewportCenter);
      const opacity = Math.max(0.5, 1 - (distance / maxDistance) * 0.5);
      block.style.opacity = opacity.toFixed(3);
    });

    return true;
  }

  if (window.BPT && window.BPT.ScrollEngine) {
    window.BPT.ScrollEngine.register({
      id: "opacity-focus",
      priority: window.BPT.ScrollEngine.PRIORITY.LOW,
      update: updateOpacity,
    });
  } else {
    // Standalone fallback
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateOpacity();
          ticking = false;
        });
        ticking = true;
      }
    }

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const hasVisible = entries.some((e) => e.isIntersecting);
        if (hasVisible) {
          window.addEventListener("scroll", onScroll, { passive: true });
          updateOpacity();
        } else {
          window.removeEventListener("scroll", onScroll);
        }
      },
      { rootMargin: "10% 0px" }
    );

    textBlocks.forEach((block) => visibilityObserver.observe(block));
  }
})();
