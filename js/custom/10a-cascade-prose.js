/* ═══════════════════════════════════════════════════════════
   CASCADING PROSE REVEAL — Word-by-word entrance for .bpt-prose
   KHÔNG chạy cho .bpt-sm-text (đã có scrollmation riêng)
   ═══════════════════════════════════════════════════════════ */
(() => {
  const proseBlocks = document.querySelectorAll(
    ".bpt-prose:not(.bpt-sm-text):not(.bpt-no-cascade)"
  );
  if (!proseBlocks.length) return;

  const PARAGRAPH_STAGGER_MS = 400;
  const WORD_DELAY_SEC = 0.06;

  /** Wrap each word in a span with stagger delay via CSS custom property */
  function prepareCascade(block) {
    const paragraphs = block.querySelectorAll("p:not(.bpt-ca-dao p)");

    paragraphs.forEach((paragraph, paragraphIndex) => {
      if (paragraph.dataset.cascadeReady) return;

      const text = paragraph.innerHTML;
      const tokens = text.split(/(\s+)/);

      let wordCount = 0;
      const wrapped = tokens
        .map((token) => {
          if (/\s+/.test(token)) return token;
          const delay =
            paragraphIndex * (PARAGRAPH_STAGGER_MS / 1000) +
            wordCount * WORD_DELAY_SEC;
          wordCount++;
          return `<span class="cascade-word" style="--cascade-delay: ${delay.toFixed(3)}s">${token}</span>`;
        })
        .join("");

      paragraph.innerHTML = wrapped;
      paragraph.dataset.cascadeReady = "true";
      paragraph.classList.add("cascade-paragraph");
    });
  }

  /** Trigger cascade animation when block enters viewport */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.cascadeTriggered)
          return;

        entry.target.dataset.cascadeTriggered = "true";
        const paragraphs = entry.target.querySelectorAll(".cascade-paragraph");
        paragraphs.forEach((p, i) => {
          setTimeout(() => p.classList.add("cascade-active"), i * PARAGRAPH_STAGGER_MS);
        });
      });
    },
    { threshold: 0.2, rootMargin: "-10% 0px -20% 0px" }
  );

  proseBlocks.forEach((block) => {
    prepareCascade(block);
    observer.observe(block);
  });
})();
