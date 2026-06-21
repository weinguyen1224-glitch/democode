/* STORYTELLING — ca-dao reveal, divider animation, intro card */
/* ═══════════════════════════════════════════════════════════ */

// Ca-dao blockquote: separate observer for border-grow effect
(() => {
  const quotes = document.querySelectorAll(".bpt-ca-dao");
  if (!quotes.length) return;

  const qObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("bpt-quote-visible");
          qObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -60px 0px" },
  );

  quotes.forEach((q) => qObs.observe(q));
})();

// Chapter divider: add bpt-visible for entrance animation
(() => {
  const dividers = document.querySelectorAll(".bpt-chapter-divider");
  if (!dividers.length) return;

  const dObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("bpt-visible");
          dObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -60px 0px" },
  );

  dividers.forEach((d) => dObs.observe(d));
})();

// Intro card: entrance animation on load
(() => {
  const introCard = document.querySelector(".intro-card");
  if (!introCard) return;

  // If intro is already visible on load, reveal immediately
  const iObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("bpt-visible");
          iObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  iObs.observe(introCard);
})();

// Scroll-driven paragraph dimming: paragraphs gently fade as user scrolls past them
(() => {
  const proseParas = document.querySelectorAll(".bpt-prose p");
  if (!proseParas.length) return;

  // Respect reduced motion preference
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const pObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting && e.boundingClientRect.top < 0) {
          // Scrolled past — dim gently
          e.target.style.opacity = "0.5";
        } else {
          e.target.style.opacity = "";
        }
      });
    },
    { threshold: 0, rootMargin: "-10% 0px -50% 0px" },
  );

  proseParas.forEach((p) => pObs.observe(p));
})();

