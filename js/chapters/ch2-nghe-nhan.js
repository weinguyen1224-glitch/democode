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

  /* ── Scroll-driven cross-fade reveal: integrated with ScrollEngine ── */
  if (ngheNhan) {
    const revealTopEl = ngheNhan.querySelector('.bpt-nghe-nhan__reveal-top');
    if (revealTopEl) {
      function updateRevealCrossFade(frame) {
        const rect = ngheNhan.getBoundingClientRect();
        const scrolled = -rect.top;
        const totalScroll = ngheNhan.offsetHeight - frame.viewportH;
        const raw = totalScroll > 0 ? Math.max(0, Math.min(1, scrolled / totalScroll)) : 0;
        const progress = raw < 0.001 ? 0 : raw > 0.999 ? 1 : raw * raw * (3 - 2 * raw);
        revealTopEl.style.opacity = progress;
        return true;
      }

      if (window.BPT && window.BPT.ScrollEngine) {
        window.BPT.ScrollEngine.register({
          id: 'ch2-crossfade',
          priority: window.BPT.ScrollEngine.PRIORITY.NORMAL,
          update: updateRevealCrossFade,
        });
      } else {
        let ticking = false;
        window.addEventListener('scroll', () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              updateRevealCrossFade({ viewportH: window.innerHeight });
              ticking = false;
            });
            ticking = true;
          }
        }, { passive: true });
        updateRevealCrossFade({ viewportH: window.innerHeight });
      }
    }
  }

})();
