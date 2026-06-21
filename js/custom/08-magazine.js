/* ═══════════════════════════════════════════════════════════
   Panel p1 — Magazine Cinematic: ảnh Đình làng bay từ góc
   Scroll-driven bidirectional với 3 phases:
   • Enter (0-40%): ảnh bay từ góc phải dưới → center
   • Settle (40-60%): ảnh đứng yên ở vị trí chuẩn
   • Exit (60-100%): ảnh bay ra trái + fade out
   
   Easing: cubic-bezier(0.16, 1, 0.3, 1) — smooth decelerate
   FPS: 60 via rAF, passive scroll listener
   ═══════════════════════════════════════════════════════════ */

(() => {
  const panel = document.querySelector(".bpt-sm-panel--magazine");
  if (!panel) return;

  const photo = panel.querySelector(".bpt-magazine-photo");
  const photoFrame = panel.querySelector(".bpt-magazine-photo-inner");
  const textEl = panel.querySelector(".bpt-sm-text.bpt-reveal");
  const img = panel.querySelector(".bpt-magazine-photo img");

  // Reduced motion — disable animations
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    [photo, photoFrame, textEl].forEach(el => {
      if (!el) return;
      el.style.transform = "";
      el.style.opacity = "1";
      el.classList.add("is-visible");
    });
    return;
  }

  // GPU optimization
  [photo, photoFrame, textEl].forEach(el => {
    if (el) el.style.willChange = "transform, opacity";
  });

  // Phase breakpoints (relative to panel journey through viewport)
  const PHASE = { ENTER: 0.35, SETTLE: 0.55, EXIT: 0.75 };

  // Easing: smooth decelerate for natural feel
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
  const easeInOutQuart = (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

  // Compute scroll progress for panel (0 = panel bottom enters, 1 = panel top exits)
  function computeProgress() {
    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight;
    const panelHeight = rect.height;
    
    // progress 0: when panel bottom enters viewport
    // progress 1: when panel top exits viewport
    const start = vh; // panel bottom at viewport bottom
    const end = -panelHeight; // panel top above viewport
    const current = rect.top;
    
    return Math.max(0, Math.min(1, (start - current) / (start - end)));
  }

  // Calculate phase progress
  function getPhaseProgress(progress) {
    if (progress < PHASE.ENTER) {
      return { type: "enter", p: progress / PHASE.ENTER };
    } else if (progress < PHASE.SETTLE) {
      return { type: "enter-settle", p: (progress - PHASE.ENTER) / (PHASE.SETTLE - PHASE.ENTER) };
    } else if (progress < PHASE.EXIT) {
      return { type: "settle", p: 0 }; // Fully settled
    } else {
      return { type: "exit", p: (progress - PHASE.EXIT) / (1 - PHASE.EXIT) };
    }
  }

  // Apply transforms based on phase
  function update() {
    const progress = computeProgress();
    const phase = getPhaseProgress(progress);
    const eased = easeOutQuart(Math.min(1, phase.p));

    if (phase.type === "enter") {
      // Enter: from bottom-right + rotated + scaled down
      const x = 80 * (1 - eased); // 80% → 0%
      const y = 60 * (1 - eased); // 60% → 0%
      const rot = 18 * (1 - eased); // 18deg → 0deg
      const scale = 0.85 + 0.15 * eased; // 0.85 → 1.0
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
      
      // Text follows photo with delay
      const textDelay = Math.max(0, eased - 0.3) / 0.7; // Text starts after 30% of enter
      const textEased = easeOutQuart(textDelay);
      if (textEl) {
        const tx = 40 * (1 - textEased);
        const ty = 30 * (1 - textEased);
        textEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        textEl.style.opacity = textEased.toFixed(3);
        textEl.classList.toggle("is-visible", textEased > 0.3);
      }

    } else if (phase.type === "enter-settle") {
      // Smooth settle into final position
      const settleEased = easeInOutQuart(phase.p);
      
      if (photo) {
        photo.style.transform = `translate3d(0, 0, 0) rotate(${-2 * settleEased}deg)`;
        photo.style.opacity = "1";
      }
      if (photoFrame) {
        photoFrame.style.transform = `scale(1) rotate(${-1 * settleEased}deg)`;
        photoFrame.style.opacity = "1";
        photoFrame.classList.add("is-visible");
      }
      if (textEl) {
        textEl.style.transform = `translate3d(0, 0, 0)`;
        textEl.style.opacity = "1";
        textEl.classList.add("is-visible");
      }

    } else if (phase.type === "settle") {
      // Hold position — reading zone, release GPU layers
      if (photo) {
        photo.style.transform = "translate3d(0, 0, 0) rotate(-2deg)";
        photo.style.opacity = "1";
        photo.style.willChange = "auto";
      }
      if (photoFrame) {
        photoFrame.style.transform = "scale(1) rotate(-1deg)";
        photoFrame.style.opacity = "1";
        photoFrame.style.willChange = "auto";
      }
      if (textEl) {
        textEl.style.willChange = "auto";
      }

    } else if (phase.type === "exit") {
      // Exit: slide left + rotate slightly + fade
      const exitEased = easeInOutQuart(eased);
      const x = -60 * exitEased; // 0% → -60%
      const y = -20 * exitEased; // drift up slightly
      const rot = -2 - 8 * exitEased; // -2deg → -10deg
      const opacity = 1 - exitEased * 0.8; // 1 → 0.2 (keep slight visibility)
      
      if (photo) {
        photo.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, 0) rotate(${rot.toFixed(2)}deg)`;
        photo.style.opacity = opacity.toFixed(3);
      }
      if (photoFrame) {
        photoFrame.style.transform = `scale(${1 - 0.1 * exitEased}) rotate(${-1 - 4 * exitEased}deg)`;
        photoFrame.style.opacity = opacity.toFixed(3);
      }
      
      // Text exits first (quicker)
      const textExit = Math.min(1, exitEased * 1.3);
      if (textEl) {
        const tx = -30 * textExit;
        const ty = -20 * textExit;
        textEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        textEl.style.opacity = (1 - textExit).toFixed(3);
        if (textExit > 0.8) textEl.classList.remove("is-visible");
      }
    }
  }

  // Passive scroll handler with rAF
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Only run when panel is near viewport
  const visObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          update(); // Initial update
        } else {
          window.removeEventListener("scroll", onScroll);
        }
      });
    },
    { rootMargin: "20% 0px" }
  );

  visObs.observe(panel);

  // Initial state
  update();
})();

/* ═══════════════════════════════════════════════════════════ */
