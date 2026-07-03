/* ═══════════════════════════════════════════════════════════════
   CHƯƠNG V — Scripts
   ═══════════════════════════════════════════════════════════════ */
(function () {
    /* ── Scroll Reveal ────────────────────────────────── */
    var reveals = document.querySelectorAll(
        ".ch5-reveal, .ch5-grid__cell",
    );
    if (reveals.length) {
        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("ch5-visible");
                    } else {
                        entry.target.classList.remove("ch5-visible");
                    }
                });
            },
            { threshold: 0.05, rootMargin: "0px 0px -10px 0px" },
        );

        reveals.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    /* ── Wipe/Reveal Effect on Scroll ─────────────────── */
    var wipeSections = document.querySelectorAll("[data-wipe]");

    /* ── Ch3 Wipe Effect (scroll-triggered) ──────────── */
    var ch3Wipes = document.querySelectorAll("[data-ch3-wipe]");
    if (ch3Wipes.length) {
        function updateCh3Wipe(section) {
            var topLayer = section.querySelector(".ch3-wipe__top-layer");
            if (!topLayer) return;

            var rect = section.getBoundingClientRect();
            var wrapperHeight = section.offsetHeight;
            var windowHeight = window.innerHeight;

            var scrolled = -rect.top;
            var scrollRange = wrapperHeight - windowHeight;

            var progress = Math.max(0, Math.min(1, scrolled / scrollRange));

            var clipBottom = progress * 100;
            topLayer.style.clipPath = "inset(0 0 " + clipBottom + "% 0)";
        }

        var ch3WipeTicking = false;
        window.addEventListener(
            "scroll",
            function () {
                if (!ch3WipeTicking) {
                    requestAnimationFrame(function () {
                        ch3Wipes.forEach(function (section) {
                            var rect = section.getBoundingClientRect();
                            if (
                                rect.top < window.innerHeight &&
                                rect.bottom > 0
                            ) {
                                updateCh3Wipe(section);
                            }
                        });
                        ch3WipeTicking = false;
                    });
                    ch3WipeTicking = true;
                }
            },
            { passive: true },
        );

        ch3Wipes.forEach(function (section) {
            var rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                updateCh3Wipe(section);
            }
        });
    }

    /* ── Ch5 Wipe Effect (scroll-triggered, horizontal) ── */
    var ch5Wipes = document.querySelectorAll("[data-ch5-wipe]");
    if (ch5Wipes.length) {
        function updateCh5Wipe(section) {
            var revealLayer = section.querySelector(".ch5-wipe__reveal-layer");
            var swipeLine = section.querySelector(".ch5-wipe__line");
            if (!revealLayer) return;

            var rect = section.getBoundingClientRect();
            var wrapperHeight = section.offsetHeight;
            var windowHeight = window.innerHeight;

            var scrolled = -rect.top;
            var scrollRange = wrapperHeight - windowHeight;

            var progress = Math.max(0, Math.min(1, scrolled / scrollRange));

            var clipRight = 100 - progress * 100;
            revealLayer.style.clipPath = "inset(0 " + clipRight + "% 0 0)";

            if (swipeLine) {
                var linePos = progress * 100;
                swipeLine.style.left = linePos + "%";
                swipeLine.style.opacity = progress > 0.01 && progress < 0.99 ? "1" : "0";
            }
        }

        var ch5WipeTicking = false;
        window.addEventListener("scroll", function () {
            if (!ch5WipeTicking) {
                requestAnimationFrame(function () {
                    ch5Wipes.forEach(function (section) {
                        var rect = section.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            updateCh5Wipe(section);
                        }
                    });
                    ch5WipeTicking = false;
                });
                ch5WipeTicking = true;
            }
        }, { passive: true });

        ch5Wipes.forEach(function (section) {
            var rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                updateCh5Wipe(section);
            }
        });
    }

    if (!wipeSections.length) return;

    function updateWipe(section) {
        var revealImg = section.querySelector(
            ".ch5-split__img--reveal",
        );
        var wipeLine = section.querySelector(
            ".ch5-split__wipe-line",
        );
        var revealLabel = section.querySelector(
            ".ch5-split__label--reveal",
        );
        if (!revealImg || !wipeLine) return;

        var rect = section.getBoundingClientRect();
        var viewportH = window.innerHeight;

        var rawProgress =
            1 -
            (rect.bottom - viewportH * 0.3) /
                (rect.height + viewportH * 0.4);
        rawProgress = Math.max(0, Math.min(1, rawProgress));

        var wipeProgress;
        if (rawProgress < 0.25) {
            wipeProgress = 0;
        } else if (rawProgress > 0.75) {
            wipeProgress = 1;
        } else {
            wipeProgress = (rawProgress - 0.25) / 0.5;
        }

        var clipBottom = 100 - wipeProgress * 100;
        revealImg.style.clipPath =
            "inset(0 0 " + clipBottom + "% 0)";

        var linePos = wipeProgress * 100;
        wipeLine.style.top = linePos + "%";
        wipeLine.style.opacity =
            wipeProgress > 0.01 && wipeProgress < 0.99 ? "1" : "0";

        if (revealLabel) {
            if (wipeProgress > 0.5) {
                revealLabel.classList.add("is-visible");
            } else {
                revealLabel.classList.remove("is-visible");
            }
        }
    }

    var ticking = false;
    window.addEventListener(
        "scroll",
        function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    wipeSections.forEach(function (section) {
                        var rect = section.getBoundingClientRect();
                        if (
                            rect.top < window.innerHeight &&
                            rect.bottom > 0
                        ) {
                            updateWipe(section);
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        },
        { passive: true },
    );

    wipeSections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            updateWipe(section);
        }
    });
})();

/* ── Horizontal Swipe Effect ──────────────────────── */
var hSwipeFigures = document.querySelectorAll("[data-hswipe]");
if (hSwipeFigures.length) {
    function updateHSwipe(fig) {
        var revealImg = fig.querySelector(
            ".ch5-prose__swipe-img--reveal",
        );
        var swipeLine = fig.querySelector(".ch5-prose__swipe-line");
        var revealLabel = fig.querySelector(
            ".ch5-prose__swipe-label--reveal",
        );
        if (!revealImg || !swipeLine) return;

        var rect = fig.getBoundingClientRect();
        var viewportH = window.innerHeight;
        var isMobile = window.innerWidth < 768;
        var deadZone = isMobile ? 0.35 : 0.25;
        var liveRange = 1 - deadZone * 2;

        var rawProgress =
            1 -
            (rect.bottom - viewportH * 0.3) /
                (rect.height + viewportH * 0.4);
        rawProgress = Math.max(0, Math.min(1, rawProgress));

        var swipeProgress;
        if (rawProgress < deadZone) {
            swipeProgress = 0;
        } else if (rawProgress > 1 - deadZone) {
            swipeProgress = 1;
        } else {
            swipeProgress = (rawProgress - deadZone) / liveRange;
        }

        var clipRight = 100 - swipeProgress * 100;
        revealImg.style.clipPath =
            "inset(0 " + clipRight + "% 0 0)";

        var linePos = swipeProgress * 100;
        swipeLine.style.left = linePos + "%";
        swipeLine.style.opacity =
            swipeProgress > 0.01 && swipeProgress < 0.99
                ? "1"
                : "0";

        if (revealLabel) {
            if (swipeProgress > 0.5) {
                revealLabel.classList.add("is-visible");
            } else {
                revealLabel.classList.remove("is-visible");
            }
        }
    }

    var hSwipeTicking = false;
    window.addEventListener(
        "scroll",
        function () {
            if (!hSwipeTicking) {
                requestAnimationFrame(function () {
                    hSwipeFigures.forEach(function (fig) {
                        var rect = fig.getBoundingClientRect();
                        if (
                            rect.top < window.innerHeight &&
                            rect.bottom > 0
                        ) {
                            updateHSwipe(fig);
                        }
                    });
                    hSwipeTicking = false;
                });
                hSwipeTicking = true;
            }
        },
        { passive: true },
    );

    hSwipeFigures.forEach(function (fig) {
        var rect = fig.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            updateHSwipe(fig);
        }
    });
}

/* ── Lightbox ───────────────────────────────────────── */
function openLightbox(cell) {
    var img = cell.querySelector("img");
    var caption = cell.querySelector(".ch5-grid__caption");
    var lightbox = document.getElementById("ch5-lightbox");
    var lightboxImg = document.getElementById("ch5-lightbox-img");
    var lightboxCaption = document.getElementById(
        "ch5-lightbox-caption",
    );

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption
        ? caption.textContent
        : "";
    lightbox.classList.add("is-active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    var lightbox = document.getElementById("ch5-lightbox");
    lightbox.classList.remove("is-active");
    document.body.style.overflow = "";
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
});
