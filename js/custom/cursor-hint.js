/* CURSOR HINT - Con tro chi vao banh Phu The */

(() => {
  const section = document.getElementById("section-bpt-ch2-ngu-hanh");
  if (!section) return;

  const orbit = section.querySelector(".bpt-ngu-hanh__orbit");
  if (!orbit) return;

  const cursorContainer = document.createElement("div");
  cursorContainer.className = "cursor-hint-container";
  cursorContainer.innerHTML =
    '<div class="cursor-tooltip">Ấn vào để khám phá!</div><div class="cursor-ripple-ring"></div><div class="cursor-ripple-ring"></div><div class="cursor-icon"><svg viewBox="0 0 24 24"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.44 0 .66-.53.35-.85L6.35 2.85a.5.5 0 0 0-.85.36z"/></svg></div>';

  const banhWrap = orbit.querySelector(".bpt-banh-wrap");
  if (banhWrap) {
    banhWrap.style.position = "relative";
    banhWrap.appendChild(cursorContainer);
  } else {
    orbit.appendChild(cursorContainer);
  }

  const hideCursor = () => {
    orbit.classList.add("clicked");
    setTimeout(() => {
      cursorContainer.style.opacity = "0";
      cursorContainer.style.transition = "opacity 0.3s ease";
    }, 300);
  };

  const wrap = orbit.querySelector(".bpt-banh-wrap");
  if (wrap) {
    wrap.addEventListener("click", hideCursor, { once: true });
    wrap.addEventListener("touchstart", hideCursor, { once: true });
  }

  setTimeout(() => {
    if (!orbit.classList.contains("clicked")) {
      cursorContainer.style.opacity = "0.5";
    }
  }, 10000);
})();
