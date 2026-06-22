/* ═══════════════════════════════════════════════════════════
   KICKER CHARACTER REVEAL — Staggered per-character entrance
   ═══════════════════════════════════════════════════════════ */
(() => {
  const kickers = document.querySelectorAll(".bpt-kicker");
  if (!kickers.length) return;

  const CHAR_DELAY_SEC = 0.05;

  /** Wrap each character in a span with stagger delay */
  function prepareKicker(kicker, kickerIndex) {
    if (kicker.dataset.charReady) return;

    const text = kicker.textContent.trim();
    kicker.innerHTML = text
      .split("")
      .map((char, charIndex) => {
        const delay = kickerIndex * 0.3 + charIndex * CHAR_DELAY_SEC;
        return `<span class="kicker-char" style="--char-delay: ${delay.toFixed(3)}s">${
          char === " " ? "&nbsp;" : char
        }</span>`;
      })
      .join("");

    kicker.dataset.charReady = "true";
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(
          "kicker-reveal-active",
          entry.isIntersecting
        );
      });
    },
    { threshold: 0.8 }
  );

  kickers.forEach((kicker, index) => {
    prepareKicker(kicker, index);
    observer.observe(kicker);
  });
})();
