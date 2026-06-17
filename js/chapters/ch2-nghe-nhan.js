/* CHUONG II - RICH ELEMENT-LEVEL ANIMATIONS */

(() => {
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const ANIMATIONS = [
    'scale-pop',
    'slide-up', 
    'slide-right',
    'slide-left',
    'rotate-in',
    'fade-zoom'
  ];

  function assignAnimations(container, offset) {
    if (!container) return;
    const paragraphs = container.querySelectorAll('.bpt-prose p');
    paragraphs.forEach((p, i) => {
      const animIndex = (i + (offset || 0)) % ANIMATIONS.length;
      p.setAttribute('data-anim', ANIMATIONS[animIndex]);
    });
  }

  const moDau = document.querySelector('#section-bpt-ch2-mo-dau');
  const ngheNhan = document.querySelector('#section-bpt-ch2-nghe-nhan');
  const nguHanh = document.querySelector('#section-bpt-ch2-ngu-hanh');
  const baoTon = document.querySelector('#section-bpt-ch2-bao-ton');

  if (moDau) assignAnimations(moDau, 0);
  if (ngheNhan) assignAnimations(ngheNhan, 2);
  if (nguHanh) {
    const textBlock = nguHanh.querySelector('.bpt-ngu-hanh__text');
    if (textBlock) assignAnimations(textBlock, 1);
  }
  if (baoTon) assignAnimations(baoTon, 4);

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: "-5% 0px" }
  );

  document.querySelectorAll('.bpt-prose p, .bpt-kicker, .bpt-ca-dao')
    .forEach(el => obs.observe(el));

  /* ── Scene visibility: adds bpt-nhn-visible to scenes ──── */
  const sceneObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bpt-nhn-visible');
        }
      });
    },
    { threshold: 0.2, rootMargin: "-5% 0px" }
  );

  document.querySelectorAll(
    '.bpt-nghe-nhan__scene--kicker, .bpt-nghe-nhan__scene--intro, .bpt-nghe-nhan__scene--portrait, .bpt-nghe-nhan__scene--closing'
  ).forEach(el => sceneObs.observe(el));

  /* ── Scroll-driven cross-fade reveal: 3h-sang → 3h-sang-2 ── */
  if (ngheNhan) {
    const revealTopEl = ngheNhan.querySelector('.bpt-nghe-nhan__reveal-top');
    if (revealTopEl) {
      let revealTicking = false;

      function updateRevealCrossFade() {
        const rect = ngheNhan.getBoundingClientRect();
        const vh = window.innerHeight;
        const sectionHeight = ngheNhan.offsetHeight;
        const scrolled = -rect.top;
        const totalScroll = sectionHeight - vh;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

        revealTopEl.style.opacity = progress;

        revealTicking = false;
      }

      window.addEventListener('scroll', () => {
        if (!revealTicking) {
          requestAnimationFrame(updateRevealCrossFade);
          revealTicking = true;
        }
      }, { passive: true });
    }
  }

})();
