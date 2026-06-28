/* ─────────────────────────────────────────────────────────────
   js/chapters/ch3-reveal.js
   IntersectionObserver for Chapter III sections.
   Toggles .bpt-visible — animations replay on scroll back.
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var CH3_SECTIONS = [
    'section-bpt-ch3-divider',
    'section-bpt-ch3-intro',
    'section-bpt-ch3-gallery-1',
    'section-bpt-ch3-nguyen-lieu',
    'section-bpt-ch3-gallery-2',
    'section-bpt-ch3-vo-vang',
    'section-bpt-ch3-nhan-banh',
    'section-bpt-ch3-quote',
    'section-bpt-ch3-bo',
    'section-bpt-ch3-gallery-5',
    'section-bpt-ch3-video',
    'section-bpt-ch3-hap-goi',
    'section-bpt-ch3-bao-quan',
    'section-bpt-ch3-video-2',
    'section-bpt-ch3-thanh-pham',
  ];

  function init() {
    if (!('IntersectionObserver' in window)) {
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
          } else {
            entry.target.classList.remove('bpt-visible');
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -10px 0px',
      }
    );

    CH3_SECTIONS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });

    // Reveal first section immediately (match ch4 pattern)
    var first = document.getElementById(CH3_SECTIONS[0]);
    if (first) {
      setTimeout(function () { first.classList.add('bpt-visible'); }, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
