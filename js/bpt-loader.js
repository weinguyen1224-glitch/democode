/* ═══════════════════════════════════════════════════════════
   bpt-loader.js
   Preloads all images in the page, shows progress, then fades out.
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
    // Remove loader from DOM after transition
    setTimeout(function () {
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    }, 700);
    // Dispatch event for other scripts
    window.dispatchEvent(new Event('bpt:loaded'));
  }

  /* ── Collect all image URLs from <img> and <source> ────── */
  function collectImageURLs() {
    var urls = [];
    var seen = {};

    // <img src="...">
    var imgs = document.querySelectorAll('img[src]');
    for (var i = 0; i < imgs.length; i++) {
      var src = imgs[i].getAttribute('src');
      if (src && !seen[src] && !src.startsWith('data:')) {
        seen[src] = true;
        urls.push(src);
      }
    }

    // <source srcset="...">
    var sources = document.querySelectorAll('source[srcset]');
    for (var j = 0; j < sources.length; j++) {
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

    // CSS background-image URLs (from inline styles and computed)
    var allElements = document.querySelectorAll('[style*="background"]');
    for (var m = 0; m < allElements.length; m++) {
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
    // Lock scroll
    document.body.classList.add('bpt-loading');

    // Collect image URLs from the DOM
    var urls = collectImageURLs();

    // Add known heavy assets that might be lazy-loaded later
    var extras = [
      'assets/chương-3/wipe1.webp',
      'assets/chương-3/wipe2.webp',
      'assets/chương-3/anh-thanh-pham.webp'
    ];
    var seen = {};
    for (var i = 0; i < urls.length; i++) seen[urls[i]] = true;
    for (var j = 0; j < extras.length; j++) {
      if (!seen[extras[j]]) {
        urls.push(extras[j]);
        seen[extras[j]] = true;
      }
    }

    total = urls.length;

    if (total === 0) {
      finish();
      return;
    }

    updateProgress();

    // Preload in parallel (max 6 concurrent)
    var concurrency = 6;
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

    // Safety timeout — finish after 8s even if some images fail
    setTimeout(finish, 8000);
  }

  /* ── Kick off ──────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
