/* ═══════════════════════════════════════════════════════════
   bpt-loader.js
   Preloads only above-the-fold images, shows progress, then fades out.
   Blocks body scroll until loading completes.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM refs ──────────────────────────────────────────── */
  var loader  = document.getElementById('bpt-loader');
  var bar     = loader ? loader.querySelector('.bpt-loader__bar') : null;
  var pct     = loader ? loader.querySelector('.bpt-loader__pct') : null;

  /* ── State ─────────────────────────────────────────────── */
  var total   = 0;
  var loaded  = 0;
  var done    = false;
  var started = false;

  /* ── Helpers ───────────────────────────────────────────── */
  function updateProgress() {
    var p = total === 0 ? 0 : Math.round((loaded / total) * 100);
    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = p + '%';
  }

  function finish() {
    if (done) return;
    done = true;
    document.body.classList.remove('bpt-loading');
    if (loader) loader.classList.add('is-done');
    setTimeout(function () {
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    }, 700);
    window.dispatchEvent(new Event('bpt:loaded'));
  }

  /* ── Check if element is above the fold ────────────────── */
  function isAboveFold(el) {
    // If element has no explicit lazy loading, consider it above fold
    if (el.loading === 'lazy') return false;
    // Check if element is within first viewport height
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight;
  }

  /* ── Collect above-the-fold image URLs ─────────────────── */
  function collectImageURLs() {
    var urls = [];
    var seen = {};

    // <img src="..."> — only if not lazy and within viewport
    var imgs = document.querySelectorAll('img[src]');
    for (var i = 0; i < imgs.length; i++) {
      var src = imgs[i].getAttribute('src');
      if (src && !seen[src] && !src.startsWith('data:') && isAboveFold(imgs[i])) {
        seen[src] = true;
        urls.push(src);
      }
    }

    // <source srcset="..."> — only if parent is above fold
    var sources = document.querySelectorAll('source[srcset]');
    for (var j = 0; j < sources.length; j++) {
      var parent = sources[j].closest('picture');
      if (parent && !isAboveFold(parent)) continue;
      var srcset = sources[j].getAttribute('srcset');
      if (srcset) {
        var parts = srcset.split(',');
        for (var k = 0; k < parts.length; k++) {
          var url = parts[k].trim().split(/\s+/)[0];
          if (url && !seen[url] && !url.startsWith('data:')) {
            seen[url] = true;
            urls.push(url);
          }
        }
      }
    }

    // CSS background-image URLs (from inline styles) — only if above fold
    var allElements = document.querySelectorAll('[style*="background"]');
    for (var m = 0; m < allElements.length; m++) {
      if (!isAboveFold(allElements[m])) continue;
      var bg = allElements[m].style.backgroundImage;
      if (bg && bg !== 'none') {
        var match = bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && match[1] && !seen[match[1]] && !match[1].startsWith('data:')) {
          seen[match[1]] = true;
          urls.push(match[1]);
        }
      }
    }

    return urls;
  }

  /* ── Preload a single image ────────────────────────────── */
  function preloadImage(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload  = function () { loaded++; updateProgress(); checkDone(); resolve(); };
      img.onerror = function () { loaded++; updateProgress(); checkDone(); resolve(); };
      img.src = url;
    });
  }

  function checkDone() {
    if (loaded >= total) finish();
  }

  /* ── Main ──────────────────────────────────────────────── */
  function start() {
    if (started) return;
    started = true;
    document.body.classList.add('bpt-loading');

    try {
      var urls = collectImageURLs();
      total = urls.length;

      if (total === 0) {
        finish();
        return;
      }

      updateProgress();

      // Preload in parallel (max 4 concurrent — lighter on mobile)
      var concurrency = 4;
      var index = 0;

      function next() {
        if (index >= urls.length) return;
        var url = urls[index++];
        preloadImage(url).then(function () {
          next();
        });
      }

      for (var c = 0; c < concurrency && c < urls.length; c++) {
        next();
      }
    } catch (e) {
      console.warn('[bpt-loader] error:', e);
    }

    // Safety timeout — finish after 3s even if some images fail
    setTimeout(finish, 3000);
  }

  /* ── Kick off ──────────────────────────────────────────── */
  // Script ở cuối <body> → DOM đã sẵn sàng, không cần chờ DOMContentLoaded
  start();
})();
