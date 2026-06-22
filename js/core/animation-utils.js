/* ═══════════════════════════════════════════════════════════════
   BÁNH PHU THÊ — Core Animation Utilities
   
   Shared easing functions, math helpers, and viewport cache.
   Used by ScrollEngine and all scroll-driven animation modules.
   
   DESIGN PRINCIPLES:
   • All functions are pure — no side effects, no DOM access
   • Easing functions accept t ∈ [0,1] and return ∈ [0,1]
   • Clamp and remap utilities for scroll-progress math
   • GPU-hint helpers for smart will-change management
   ═══════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  /* ── Easing Functions ───────────────────────────────────────
     All accept t in range [0,1], return eased value also in [0,1].
     Based on Robert Penner's easing equations, optimized.
  */

  /** Quadratic ease-in: accelerating from zero velocity */
  function easeInQuad(t) {
    return t * t;
  }

  /** Quadratic ease-out: decelerating to zero velocity */
  function easeOutQuad(t) {
    return t * (2 - t);
  }

  /** Quadratic ease-in-out */
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /** Cubic ease-out: stronger deceleration */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /** Cubic ease-in */
  function easeInCubic(t) {
    return t * t * t;
  }

  /** Cubic ease-in-out */
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /** Quart ease-out: very smooth deceleration — ideal for entrance animations */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  /** Quart ease-in */
  function easeInQuart(t) {
    return t * t * t * t;
  }

  /** Quart ease-in-out */
  function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  /** Quint ease-out: even stronger deceleration */
  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
  }

  /** Expo ease-out: exponential deceleration */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /** Expo ease-in */
  function easeInExpo(t) {
    return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
  }

  /** Back ease-out: slight overshoot */
  function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  /* ── Math Helpers ─────────────────────────────────────────── */

  /** Clamp a value between min and max */
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  /** Linear interpolation: a + (b - a) * t */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /** Inverse lerp: maps value in [a,b] → [0,1] */
  function invLerp(a, b, value) {
    return clamp((value - a) / (b - a), 0, 1);
  }

  /** Remap: maps value from [inMin,inMax] → [outMin,outMax] */
  function remap(value, inMin, inMax, outMin, outMax) {
    return lerp(outMin, outMax, invLerp(inMin, inMax, value));
  }

  /** Convert scroll position to 0-1 progress through a section */
  function scrollProgress(rect, viewportH, options = {}) {
    const {
      enterAt = 1.0,    // section enters when top at this fraction of viewport
      exitAt = 0.0,      // section exits when bottom at this fraction of viewport
      pinLength = 0,     // extra scroll distance the section "pins" for
    } = options;

    const start = viewportH * enterAt;
    const end = -(rect.height + pinLength) + viewportH * exitAt;
    const range = start - end;
    return range > 0 ? clamp((start - rect.top) / range, 0, 1) : 0;
  }

  /** Compute bidirectional enter + exit progress for a panel */
  function bidirectionalProgress(rect, viewportH, options = {}) {
    const {
      enterStart = 1.1,   // enter begins at 110% viewport height
      enterEnd = 0.45,    // enter completes at 45% viewport height
      exitStart = -0.35,  // exit begins at -35% viewport height
      exitEnd = -1.2,     // exit completes at -120% viewport height
    } = options;

    const p = clamp(
      (viewportH * enterStart - rect.top) /
        (viewportH * (enterStart - enterEnd)),
      0, 1
    );
    const ex = clamp(
      (viewportH * exitStart - rect.top) /
        (viewportH * (exitStart - exitEnd)),
      0, 1
    );
    return { enter: p, exit: ex };
  }

  /* ── GPU Layer Management ─────────────────────────────────── */

  /**
   * Smart will-change management.
   * Promote to GPU layer when element is in viewport ± margin.
   * Demote (release GPU memory) when far off-screen.
   * 
   * @param {Element} el — DOM element
   * @param {boolean} promote — true to set will-change, false to release
   * @param {string} [props="transform, opacity"] — CSS properties to promote
   */
  function manageGPU(el, promote, props = "transform, opacity") {
    if (!el) return;
    if (promote) {
      if (el.style.willChange !== props) {
        el.style.willChange = props;
      }
    } else {
      if (el.style.willChange) {
        el.style.willChange = "auto";
      }
    }
  }

  /** 
   * Batch GPU layer promotion for an array of elements.
   * Release all when done=false; promote when done=true.
   */
  function manageGPUBatch(elements, promote, props = "transform, opacity") {
    elements.forEach((el) => manageGPU(el, promote, props));
  }

  /* ── Viewport State ───────────────────────────────────────── */

  /**
   * Return cached viewport dimensions.
   * Intended to be called once per frame by ScrollEngine.
   */
  function getViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY || window.pageYOffset,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight,
    };
  }

  /** Check if element rect is within viewport (± margin) */
  function isInViewport(rect, viewportH, margin = 0.2) {
    const m = viewportH * margin;
    return rect.bottom > -m && rect.top < viewportH + m;
  }

  /* ── Export ────────────────────────────────────────────────── */
  const BPT = window.BPT || {};
  Object.assign(BPT, {
    // Easing
    easeInQuad, easeOutQuad, easeInOutQuad,
    easeInCubic, easeOutCubic, easeInOutCubic,
    easeInQuart, easeOutQuart, easeInOutQuart,
    easeOutQuint, easeOutExpo, easeInExpo,
    easeOutBack,
    // Math
    clamp, lerp, invLerp, remap,
    scrollProgress, bidirectionalProgress,
    // GPU
    manageGPU, manageGPUBatch,
    // Viewport
    getViewport, isInViewport,
  });

  window.BPT = BPT;
})();
