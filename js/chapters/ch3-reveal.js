/* ─────────────────────────────────────────────────────────────
   js/chapters/ch3-reveal.js
   IntersectionObserver for Chapter III sections.
   Toggles .ch3-visible — animations replay on scroll back.
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
        if (el) el.classList.add('ch3-visible');
      });
      return;
    }

    // Observe gallery elements directly so they trigger when scrolled into view,
    // not when their tall parent section first enters at 5% (match ch4 pattern)
    var galleries = document.querySelectorAll('.ch3-gallery');

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('ch3-visible');
          } else {
            entry.target.classList.remove('ch3-visible');
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
    galleries.forEach(function (g) { io.observe(g); });

    // Reveal first section immediately (match ch4 pattern)
    var first = document.getElementById(CH3_SECTIONS[0]);
    if (first) {
      setTimeout(function () { first.classList.add('ch3-visible'); }, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
