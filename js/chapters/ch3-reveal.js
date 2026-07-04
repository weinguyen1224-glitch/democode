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
    'section-bpt-ch3-vo-vang-1',
    'section-bpt-ch3-vo-vang-2',
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

  function decodeImages(el) {
    var imgs = el.querySelectorAll('img');
    var promises = [];
    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) return;
      if (typeof img.decode === 'function') {
        promises.push(img.decode().catch(function () {}));
      }
    });
    if (!promises.length) return Promise.resolve();
    var all = Promise.all(promises);
    var timeout = new Promise(function (resolve) { setTimeout(resolve, 800); });
    return Promise.race([all, timeout]);
  }

  function init() {
    if (!('IntersectionObserver' in window)) {
      CH3_SECTIONS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('ch3-visible');
      });
      return;
    }

    var galleries = document.querySelectorAll('.ch3-gallery');

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('ch3-gallery') || entry.target.id === 'section-bpt-ch3-thanh-pham') {
              decodeImages(entry.target).then(function () {
                entry.target.classList.add('ch3-visible');
              });
            } else {
              entry.target.classList.add('ch3-visible');
            }
          } else {
            entry.target.classList.remove('ch3-visible');
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px 300px 0px',
      }
    );

    CH3_SECTIONS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
    galleries.forEach(function (g) { io.observe(g); });

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
