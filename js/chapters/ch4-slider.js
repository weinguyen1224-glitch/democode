/* ═══════════════════════════════════════════════════════════
   CHƯƠNG IV — Slider + Reveal + Scroll Path Animation
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Before / After Slider ─────────────────────────────── */
  function initSliders() {
    document.querySelectorAll(".ch4-compare").forEach(function (el) {
      var xua = el.querySelector(".ch4-compare--xua");
      var handle = el.querySelector(".ch4-slider-handle");
      if (!xua || !handle) return;

      var dragging = false;

      function setPosition(px) {
        var rect = el.getBoundingClientRect();
        var x = Math.max(0, Math.min(px - rect.left, rect.width));
        var pct = (x / rect.width) * 100;

        xua.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
        handle.style.left = pct + "%";

        if (pct < 35) {
          el.classList.add("ch4-compare--label-fade-left");
          el.classList.remove("ch4-compare--label-fade-right");
        } else if (pct > 65) {
          el.classList.remove("ch4-compare--label-fade-left");
          el.classList.add("ch4-compare--label-fade-right");
        } else {
          el.classList.remove("ch4-compare--label-fade-left");
          el.classList.remove("ch4-compare--label-fade-right");
        }
      }

      el.addEventListener("mousedown", function (e) {
        e.preventDefault();
        dragging = true;
        setPosition(e.clientX);
      });

      document.addEventListener("mousemove", function (e) {
        if (!dragging) return;
        e.preventDefault();
        setPosition(e.clientX);
      });

      document.addEventListener("mouseup", function () {
        dragging = false;
      });

      el.addEventListener(
        "touchstart",
        function (e) {
          dragging = true;
          setPosition(e.touches[0].clientX);
        },
        { passive: true },
      );

      document.addEventListener(
        "touchmove",
        function (e) {
          if (!dragging) return;
          setPosition(e.touches[0].clientX);
        },
        { passive: true },
      );

      document.addEventListener("touchend", function () {
        dragging = false;
      });

      var rect = el.getBoundingClientRect();
      setPosition(rect.left + rect.width * 0.37);
    });
  }

  /* ── Per-Section Scroll Reveal ─────────────────────────── */
  function initReveal() {
    // Find all ch4 sections — works in both standalone and merged index.html
    var sections = document.querySelectorAll(
      ".ch4-title, .ch4-slider-section, .ch4-symbol, .ch4-happiness, .ch4-region, .ch4-prose-section, .ch4-path-section, .ch4-balance, .ch4-tourism, .ch4-closing, .ch4-3d-viewer, .ch5-title, .ch5-opening, .ch5-poem, .ch5-prose, .ch5-artisan-quote, .ch5-closing, .ch5-final-poem",
    );
    // Observe gallery elements directly so they trigger when scrolled into view,
    // not when their tall parent section first enters at 5%
    var galleries = document.querySelectorAll(
      ".ch4-symbol__gallery, .ch4-tourism__gallery",
    );
    if (!sections.length && !galleries.length) return;

    if (!("IntersectionObserver" in window)) {
      sections.forEach(function (s) {
        s.classList.add("ch4-visible");
        if (
          s.classList.contains("ch5-title") ||
          s.classList.contains("ch5-opening") ||
          s.classList.contains("ch5-poem") ||
          s.classList.contains("ch5-prose") ||
          s.classList.contains("ch5-artisan-quote") ||
          s.classList.contains("ch5-closing") ||
          s.classList.contains("ch5-final-poem")
        ) {
          s.classList.add("ch5-visible");
        }
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("ch4-visible");
            if (
              entry.target.classList.contains("ch5-title") ||
              entry.target.classList.contains("ch5-opening") ||
              entry.target.classList.contains("ch5-poem") ||
              entry.target.classList.contains("ch5-prose") ||
              entry.target.classList.contains("ch5-artisan-quote") ||
              entry.target.classList.contains("ch5-closing") ||
              entry.target.classList.contains("ch5-final-poem")
            ) {
              entry.target.classList.add("ch5-visible");
            }
          } else {
            entry.target.classList.remove("ch4-visible");
            if (
              entry.target.classList.contains("ch5-title") ||
              entry.target.classList.contains("ch5-opening") ||
              entry.target.classList.contains("ch5-poem") ||
              entry.target.classList.contains("ch5-prose") ||
              entry.target.classList.contains("ch5-artisan-quote") ||
              entry.target.classList.contains("ch5-closing") ||
              entry.target.classList.contains("ch5-final-poem")
            ) {
              entry.target.classList.remove("ch5-visible");
            }
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -10px 0px",
      },
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
    galleries.forEach(function (g) {
      observer.observe(g);
    });

    // Reveal title immediately
    var title = document.querySelector(".ch4-title");
    if (title) {
      setTimeout(function () {
        title.classList.add("ch4-visible");
      }, 100);
    }
  }

  /* ── Scroll Path Animation ────────────────────────────── */
  function initPathAnimation() {
    var section = document.querySelector(".ch4-path-section");
    if (!section) return;

    var pathEl = document.getElementById("ch4-path-progress");
    var floatingEl = document.getElementById("ch4-floating");
    var floatTrad = document.getElementById("ch4-float-trad");
    var floatMod = document.getElementById("ch4-float-mod");
    var wpBánh = document.getElementById("ch4-wp-banh");
    var wpVỏ = document.getElementById("ch4-wp-vo");

    // Node images
    var banhTrad = document.getElementById("ch4-banh-trad");
    var banhMod = document.getElementById("ch4-banh-mod");
    var voTrad = document.getElementById("ch4-vo-trad");
    var voMod = document.getElementById("ch4-vo-mod");

    if (!pathEl || !floatingEl) return;

    var pathLength = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = pathLength;
    pathEl.style.strokeDashoffset = pathLength;

    var waypointBánh = 0.3;
    var waypointVỏ = 0.65;
    var currentNode = null; // null | 'banh' | 'vo'
    var rafPending = false;

    function applyAnimation(el, animClass) {
      if (!el) return;
      el.classList.remove(
        "ch4-path__node-img--pop-in",
        "ch4-path__node-img--pop-out",
      );
      void el.offsetWidth; // force reflow to restart animation
      if (animClass) el.classList.add(animClass);
    }

    function removeAnimation(el) {
      if (!el) return;
      el.classList.remove(
        "ch4-path__node-img--pop-in",
        "ch4-path__node-img--pop-out",
      );
    }

    function hideElement(el) {
      if (!el) return;
      // Only pop-out if element was previously shown (has pop-in class or is visible)
      if (el.classList.contains("ch4-path__node-img--pop-in")) {
        applyAnimation(el, "ch4-path__node-img--pop-out");
      } else {
        removeAnimation(el);
      }
    }

    function showBanh() {
      if (currentNode === "banh") return;
      currentNode = "banh";
      hideElement(voTrad);
      hideElement(voMod);
      applyAnimation(banhTrad, "ch4-path__node-img--pop-in");
      applyAnimation(banhMod, "ch4-path__node-img--pop-in");
    }

    function hideBanhShowVo() {
      if (currentNode === "vo") return;
      currentNode = "vo";
      applyAnimation(banhTrad, "ch4-path__node-img--pop-out");
      applyAnimation(banhMod, "ch4-path__node-img--pop-out");
      applyAnimation(voTrad, "ch4-path__node-img--pop-in");
      applyAnimation(voMod, "ch4-path__node-img--pop-in");
    }

    function hideBanh() {
      if (currentNode === null) return;
      currentNode = null;
      hideElement(banhTrad);
      hideElement(banhMod);
      hideElement(voTrad);
      hideElement(voMod);
    }

    function onScroll() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(function () {
        rafPending = false;

        var rect = section.getBoundingClientRect();
        var sectionH = section.offsetHeight - window.innerHeight;
        var scrolled = -rect.top;
        var progress = Math.max(0, Math.min(1, scrolled / sectionH));

        // Get point on path
        var point = pathEl.getPointAtLength(progress * pathLength);
        var svgEl = pathEl.ownerSVGElement || pathEl;
        var vb = svgEl.viewBox.baseVal;
        var svgW = vb.width || 1200;
        var svgH = vb.height || 600;
        var svgRect = svgEl.getBoundingClientRect();
        var scaleX = svgRect.width / svgW;
        var scaleY = svgRect.height / svgH;
        var scale = Math.min(scaleX, scaleY);
        var offX = (svgRect.width - svgW * scale) / 2;
        var offY = (svgRect.height - svgH * scale) / 2;

        // Position floating element
        floatingEl.style.left = point.x * scale + offX + "px";
        floatingEl.style.top = point.y * scale + offY + "px";

        // Position waypoints
        function positionWaypoint(wpEl, wpProgress) {
          if (!wpEl) return;
          var pt = pathEl.getPointAtLength(wpProgress * pathLength);
          wpEl.style.left = pt.x * scale + offX + "px";
          wpEl.style.top = pt.y * scale + offY + "px";
        }
        positionWaypoint(wpBánh, waypointBánh);
        positionWaypoint(wpVỏ, waypointVỏ);

        // Update progress line
        pathEl.style.strokeDashoffset = pathLength * (1 - progress);

        // Cross-fade floating bánh images
        if (floatTrad && floatMod) {
          floatTrad.style.opacity = 1 - progress;
          floatMod.style.opacity = progress;
        }

        // Trigger node image animations based on scroll zone
        var banhTrigger = waypointBánh - 0.02;
        var voTrigger = waypointVỏ - 0.05;

        if (progress >= voTrigger) {
          hideBanhShowVo();
        } else if (progress >= banhTrigger) {
          showBanh();
        } else {
          hideBanh();
        }

        // Waypoint labels always visible
        if (wpBánh) wpBánh.classList.add("ch4-path__waypoint--visible");
        if (wpVỏ) wpVỏ.classList.add("ch4-path__waypoint--visible");
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  /* ── Init ──────────────────────────────────────────────── */
  function init() {
    initSliders();
    initReveal();
    initPathAnimation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
