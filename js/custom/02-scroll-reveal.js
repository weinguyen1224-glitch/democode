/* CHƯƠNG I — Scroll-reveal for narrative scenes                */
/* ═══════════════════════════════════════════════════════════ */

(() => {
  const allReveals = document.querySelectorAll(".bpt-reveal");
  // Exclude elements with their own scroll-driven animation logic
  const reveals = [...allReveals].filter(
    (el) =>
      !el.closest(".bpt-sm-panel--cinematic") &&
      !el.closest(".bpt-sm-panel--magazine") &&
      !el.closest(".bpt-zoom-scene"),
  );
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("bpt-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════════ */
