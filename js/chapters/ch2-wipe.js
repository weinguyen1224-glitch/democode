/* ═══════════════════════════════════════════════════════════
   CHƯƠNG II — Wipe Scroll Engine + Reveal Observer
   Lightweight: only clip-path updates, no layout thrashing.
   ═══════════════════════════════════════════════════════════ */

function ch2WipeInit() {
    'use strict';

    /* ── Wipe Sections ─────────────────────────────────────── */
    var wipes = document.querySelectorAll('[data-ch2-wipe]');

    function updateWipe(section) {
        var topLayer = section.querySelector('.ch2-wipe__top-layer');
        if (!topLayer) return;

        var rect = section.getBoundingClientRect();
        var wrapperH = section.offsetHeight;
        var winH = window.innerHeight;

        var scrolled = -rect.top;
        var scrollRange = wrapperH - winH;
        var progress = Math.max(0, Math.min(1, scrolled / scrollRange));

        var clipBottom = progress * 100;
        topLayer.style.clipPath = 'inset(0 0 ' + clipBottom + '% 0)';
    }

    var wipeTicking = false;
    window.addEventListener('scroll', function () {
        if (!wipeTicking) {
            requestAnimationFrame(function () {
                wipes.forEach(function (section) {
                    var rect = section.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        updateWipe(section);
                    }
                });
                wipeTicking = false;
            });
            wipeTicking = true;
        }
    }, { passive: true });

    // Initial paint
    wipes.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            updateWipe(section);
        }
    });

    /* ── Reveal Observer (toggles .bpt-visible) ────────────── */
    var revealEls = document.querySelectorAll(
        '.ch2-divider, .ch2-wipe, .ch2-gallery, .ch2-ngu-hanh, .ch2-closing'
    );

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('bpt-visible');
                } else {
                    entry.target.classList.remove('bpt-visible');
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('bpt-visible'); });
    }

    // Reveal first section immediately
    var first = document.querySelector('.ch2-divider');
    if (first) {
        setTimeout(function () { first.classList.add('bpt-visible'); }, 80);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ch2WipeInit);
} else {
    ch2WipeInit();
}
