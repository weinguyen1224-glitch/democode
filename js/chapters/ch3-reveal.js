/* ─────────────────────────────────────────────────────────────
   js/chapters/ch3-reveal.js
   IntersectionObserver for Chapter III sections.
   Adds .bpt-visible when section enters viewport (once).
   Pure IO — no scroll listener, no rAF loop.
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* IDs of every ch3 section that needs .bpt-visible toggled */
  const CH3_SECTIONS = [
    'section-bpt-ch3-divider',
    'section-bpt-ch3-intro',
    'section-bpt-ch3-nguyen-lieu',
    'section-bpt-ch3-vo-vang',
    'section-bpt-ch3-nhan-banh',
    'section-bpt-ch3-quote',
    'section-bpt-ch3-bo',
    'section-bpt-ch3-hap-goi',
    'section-bpt-ch3-thanh-pham',
  ];

  function init() {
    if (!('IntersectionObserver' in window)) {
      /* Fallback: show all immediately */
      CH3_SECTIONS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('bpt-visible');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('bpt-visible');
            io.unobserve(entry.target); /* fire once */
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    CH3_SECTIONS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
