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

