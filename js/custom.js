(() => {
  const sections = [...document.querySelectorAll('#article > header[id^="section-"], #article > div[id^="section-"]')];
  if (!sections.length) return;

  document.body.insertAdjacentHTML('beforeend', '<div class="scene-progress" aria-hidden="true"></div><div class="scene-wipe" aria-hidden="true"></div><div class="scene-orb" aria-hidden="true"></div>');

  const progress = document.querySelector('.scene-progress');
  const orb = document.querySelector('.scene-orb');
  const wipe = document.querySelector('.scene-wipe');
  let ticking = false;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  function update() {
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    const pageProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    progress.style.transform = `scaleX(${pageProgress})`;

    let activeIndex = 0;
    let activeRatio = 0;
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const ratio = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      section.style.setProperty('--scene-ratio', ratio.toFixed(3));
      if (rect.top <= innerHeight * 0.52 && rect.bottom >= innerHeight * 0.52) {
        activeIndex = index;
        activeRatio = ratio;
      }
    });

    const x = 12 + activeRatio * 76;
    const y = 18 + (activeIndex % 3) * 24;
    orb.style.transform = `translate3d(${x}vw, ${y}vh, 0) scale(${0.8 + activeRatio * 0.45})`;
    const pulse = Math.sin(pageProgress * Math.PI * (sections.length - 1));
    wipe.style.opacity = String(clamp(pulse * 0.42, 0.08, 0.42));
    wipe.style.transform = `translate3d(${(activeRatio - .5) * 18}vw, 0, 0) rotate(${activeIndex % 2 ? -2 : 2}deg)`;
    document.documentElement.style.setProperty('--active-scene', activeIndex);
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate, { passive: true });
  update();
})();
