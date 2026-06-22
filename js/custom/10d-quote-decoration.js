/* ═══════════════════════════════════════════════════════════
   QUOTE DECORATION — Add decorative quotation marks to .bpt-ca-dao
   ═══════════════════════════════════════════════════════════ */
(() => {
  const quotes = document.querySelectorAll(".bpt-ca-dao");
  if (!quotes.length) return;

  /** Inject opening and closing quote decorations */
  function decorateQuote(quote) {
    if (quote.dataset.quoteDecorated) return;

    const openMark = document.createElement("span");
    openMark.className = "quote-deco quote-deco-before";
    openMark.textContent = "\u201C";

    const closeMark = document.createElement("span");
    closeMark.className = "quote-deco quote-deco-after";
    closeMark.textContent = "\u201D";

    quote.prepend(openMark);
    quote.append(closeMark);
    quote.dataset.quoteDecorated = "true";
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("quote-active", entry.isIntersecting);
      });
    },
    { threshold: 0.4 }
  );

  quotes.forEach((quote) => {
    decorateQuote(quote);
    observer.observe(quote);
  });
})();
