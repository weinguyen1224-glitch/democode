/* ═══════════════════════════════════════════════════════════
   CHƯƠNG IV — Slider + Reveal + Scroll Path Animation
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Before / After Slider ─────────────────────────────── */
  function initSliders() {
    document.querySelectorAll('.ch4-compare').forEach(function (el) {
      var xua = el.querySelector('.ch4-compare--xua');
      var handle = el.querySelector('.ch4-slider-handle');
      if (!xua || !handle) return;

      var dragging = false;

      function setPosition(px) {
        var rect = el.getBoundingClientRect();
        var x = Math.max(0, Math.min(px - rect.left, rect.width));
        var pct = (x / rect.width) * 100;

        xua.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
        handle.style.left = pct + '%';

        if (pct < 35) {
          el.classList.add('ch4-compare--label-fade-left');
          el.classList.remove('ch4-compare--label-fade-right');
        } else if (pct > 65) {
          el.classList.remove('ch4-compare--label-fade-left');
          el.classList.add('ch4-compare--label-fade-right');
        } else {
          el.classList.remove('ch4-compare--label-fade-left');
          el.classList.remove('ch4-compare--label-fade-right');
        }
      }

      el.addEventListener('mousedown', function (e) {
        e.preventDefault();
        dragging = true;
        setPosition(e.clientX);
      });

      document.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        e.preventDefault();
        setPosition(e.clientX);
      });

      document.addEventListener('mouseup', function () {
        dragging = false;
      });

      el.addEventListener('touchstart', function (e) {
        dragging = true;
        setPosition(e.touches[0].clientX);
      }, { passive: true });

      document.addEventListener('touchmove', function (e) {
        if (!dragging) return;
        setPosition(e.touches[0].clientX);
      }, { passive: true });

      document.addEventListener('touchend', function () {
        dragging = false;
      });

      var rect = el.getBoundingClientRect();
      setPosition(rect.left + rect.width / 2);
    });
  }

  /* ── Per-Section Scroll Reveal ─────────────────────────── */
  function initReveal() {
    // Find all ch4 sections — works in both standalone and merged index.html
    var sections = document.querySelectorAll(
      '.ch4-title, .ch4-slider-section, .ch4-symbol, .ch4-happiness, .ch4-region, .ch4-prose-section, .ch4-path-section, .ch4-balance, .ch4-tourism, .ch4-closing, .ch4-3d-viewer, .ch5-title, .ch5-opening, .ch5-poem, .ch5-prose, .ch5-artisan-quote, .ch5-closing, .ch5-final-poem'
    );
    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) {
      sections.forEach(function (s) {
        s.classList.add('ch4-visible');
        if (s.classList.contains('ch5-title') || s.classList.contains('ch5-opening') || s.classList.contains('ch5-poem') || s.classList.contains('ch5-prose') || s.classList.contains('ch5-artisan-quote') || s.classList.contains('ch5-closing') || s.classList.contains('ch5-final-poem')) {
          s.classList.add('ch5-visible');
        }
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('ch4-visible');
          if (entry.target.classList.contains('ch5-title') ||
              entry.target.classList.contains('ch5-opening') ||
              entry.target.classList.contains('ch5-poem') ||
              entry.target.classList.contains('ch5-prose') ||
              entry.target.classList.contains('ch5-artisan-quote') ||
              entry.target.classList.contains('ch5-closing') ||
              entry.target.classList.contains('ch5-final-poem')) {
            entry.target.classList.add('ch5-visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -10px 0px'
    });

    sections.forEach(function (s) { observer.observe(s); });

    // Reveal title immediately
    var title = document.querySelector('.ch4-title');
    if (title) {
      setTimeout(function () { title.classList.add('ch4-visible'); }, 100);
    }
  }

  /* ── Scroll Path Animation ────────────────────────────── */
  function initPathAnimation() {
    var section = document.querySelector('.ch4-path-section');
    if (!section) return;

    var pathEl = document.getElementById('ch4-path-progress');
    var bánhEl = document.getElementById('ch4-banh-float');
    var imgTrad = section.querySelector('.ch4-path__bánh--traditional');
    var imgMod = section.querySelector('.ch4-path__bánh--modern');
    var wpBánh = document.getElementById('ch4-wp-banh');
    var wpVỏ = document.getElementById('ch4-wp-vo');
    var labelTruyen = document.getElementById('ch4-label-truyen-thong');
    var labelHien = document.getElementById('ch4-label-hien-dai');

    if (!pathEl || !bánhEl) return;

    var pathLength = pathEl.getTotalLength();

    // Set up progress line stroke-dasharray
    pathEl.style.strokeDasharray = pathLength;
    pathEl.style.strokeDashoffset = pathLength;

    // Waypoint positions along path (0-1)
    var waypointBánh = 0.30;
    var waypointVỏ = 0.65;

    function onScroll() {
      var rect = section.getBoundingClientRect();
      var sectionH = section.offsetHeight - window.innerHeight;
      var scrolled = -rect.top;
      var progress = Math.max(0, Math.min(1, scrolled / sectionH));

      // Get point on path using SVG's own coordinate system
      var point = pathEl.getPointAtLength(progress * pathLength);

      // Use SVG's screen CTM for accurate coordinate conversion
      var ctm = pathEl.getScreenCTM();
      var actualX = ctm.a * point.x + ctm.c * point.y + ctm.e;
      var actualY = ctm.b * point.x + ctm.d * point.y + ctm.f;

      // Position bánh relative to visual container (where SVG lives)
      var visualRect = section.querySelector('.ch4-path__visual').getBoundingClientRect();
      var left = actualX - visualRect.left;
      var top = actualY - visualRect.top;

      bánhEl.style.left = left + 'px';
      bánhEl.style.top = top + 'px';

      // Update progress line
      pathEl.style.strokeDashoffset = pathLength * (1 - progress);

      // Cross-fade images
      if (imgTrad && imgMod) {
        imgTrad.style.opacity = 1 - progress;
        imgMod.style.opacity = progress;
      }

      // Waypoint visibility
      if (wpBánh) {
        var dBánh = Math.abs(progress - waypointBánh);
        if (dBánh < 0.12) {
          wpBánh.classList.add('ch4-path__waypoint--visible');
        } else {
          wpBánh.classList.remove('ch4-path__waypoint--visible');
        }
      }

      if (wpVỏ) {
        var dVỏ = Math.abs(progress - waypointVỏ);
        if (dVỏ < 0.12) {
          wpVỏ.classList.add('ch4-path__waypoint--visible');
        } else {
          wpVỏ.classList.remove('ch4-path__waypoint--visible');
        }
      }

      // Corner labels activation
      if (labelTruyen) {
        if (progress < 0.3) {
          labelTruyen.classList.add('ch4-path__corner-text--active');
        } else {
          labelTruyen.classList.remove('ch4-path__corner-text--active');
        }
      }

      if (labelHien) {
        if (progress > 0.7) {
          labelHien.classList.add('ch4-path__corner-text--active');
        } else {
          labelHien.classList.remove('ch4-path__corner-text--active');
        }
      }
    }

    // Use passive scroll listener for performance
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial position
    onScroll();
  }

  /* ── Init ──────────────────────────────────────────────── */
  function init() {
    initSliders();
    initReveal();
    initPathAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
