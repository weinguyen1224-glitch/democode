/* ═══════════════════════════════════════════════════════════════
   GPU LAYER WARM-UP — Pre-promote compositing layers on load
   
   Strategy:
   1. On load, set will-change:transform,opacity on ALL animated
      elements → browser creates GPU compositing layers immediately.
   2. Force browser to parse all @keyframes by touching each
      element's computed style.
   3. Release will-change after warmup — layers stay cached until
      the real animation triggers.
   
   Does NOT touch .bpt-visible — that's the observers' job.
   Uses requestIdleCallback so it doesn't block first paint.
   ═══════════════════════════════════════════════════════════════ */
;(function () {
  'use strict';

  /* Every selector that carries a scroll-triggered animation */
  var S = [
    '.ch3-anim-fadeInUp',
    '.ch3-anim-zoomIn',
    '.ch3-anim-slideInLeft',
    '.ch3-anim-slideInRight',
    '.ch3-anim-rollIn',
    '.ch3-anim-jackInTheBox',
    '.ch3-anim-rotateIn',
    '.ch3-anim-bounceIn',
    '.ch3-anim-dropFromTop',
    '.ch3-anim-flyLeft',
    '.ch3-anim-flyRight',
    '.ch3-anim-flyTop',
    '.ch3-anim-flyBot',
    '.ch3-anim-revealZoom',
    '.ch3-anim-revealSlideL',
    '.ch3-anim-revealSlideR',
    '.ch3-anim-revealDrop',
    '.ch3-anim-revealRise',
    '.ch3-anim-revealSway',
    '.ch3-anim-revealPop',
    '.ch3-anim-revealTilt',
    '.ch3-anim-slideInRight-slow',
    '.bpt-reveal',
    '.bpt-sm-text.bpt-reveal',
    '.bpt-ca-dao',
    '.bpt-chapter-divider',
    '.intro-card',
    '.ch3-step',
    '.ch3-split__mosaic',
    '.ch3-gallery__item',
  ];

  var BATCH = 50;

  function schedule(fn) {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(fn, { timeout: 3000 });
    } else {
      setTimeout(fn, 32);
    }
  }

  function warmUp() {
    var sel = S.join(',');
    var els = document.querySelectorAll(sel);
    if (!els.length) return;

    /* ── Phase 1: promote ALL to GPU layers ─────────────── */
    var all = Array.prototype.slice.call(els);
    all.forEach(function (el) {
      el.style.willChange = 'transform, opacity';
    });

    /* ── Phase 2: force browser to parse + cache keyframes ─
       Touch offsetHeight to trigger synchronous style computation
       in batches so we don't block the main thread.            */
    var i = 0;
    function parseBatch() {
      var end = Math.min(i + BATCH, all.length);
      for (; i < end; i++) {
        /* Reading offsetHeight forces style + layout for this element,
           which causes the browser to parse its @keyframes and cache
           the computed values. */
        void all[i].offsetHeight;
      }
      if (i < all.length) {
        requestAnimationFrame(parseBatch);
      } else {
        /* ── Phase 3: release will-change — layers stay cached ── */
        requestAnimationFrame(releaseBatch);
      }
    }

    var j = 0;
    function releaseBatch() {
      var end = Math.min(j + BATCH, all.length);
      for (; j < end; j++) {
        all[j].style.willChange = '';
      }
      if (j < all.length) {
        requestAnimationFrame(releaseBatch);
      }
    }

    requestAnimationFrame(parseBatch);
  }

  schedule(warmUp);
})();
