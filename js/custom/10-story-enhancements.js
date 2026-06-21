/* ═══════════════════════════════════════════════════════════
   STORY ENHANCEMENTS — Sequential Cascading Animations
   
   QUY TẮC:
   - KHÔNG chạy cho elements trong scrollmation (.bpt-sm-text)
   - Chỉ chạy cho .bpt-prose trong scenes bình thường
   - Tuần tự: paragraph này xong mới đến paragraph kia
   ═══════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════
// CASCADING PROSE REVEAL — Chỉ cho .bpt-prose (KHÔNG .bpt-sm-text)
// ═══════════════════════════════════════════════════════════
(() => {
  // Chỉ chọn .bpt-prose, KHÔNG chọn .bpt-sm-text (đã có scrollmation)
  const proseBlocks = document.querySelectorAll('.bpt-prose:not(.bpt-sm-text):not(.bpt-no-cascade)');
  if (!proseBlocks.length) return;

  const PROSE_DELAY = 400;
  const WORD_DELAY = 0.06;

  proseBlocks.forEach(block => {
    const paragraphs = block.querySelectorAll('p:not(.bpt-ca-dao p)');
    
    paragraphs.forEach((p, pIndex) => {
      if (p.dataset.cascadeReady) return;
      
      const text = p.innerHTML;
      const words = text.split(/(\s+)/);
      
      let wordIndex = 0;
      const wrapped = words.map(part => {
        if (/\s+/.test(part)) return part;
        const totalDelay = (pIndex * PROSE_DELAY / 1000) + (wordIndex * WORD_DELAY);
        wordIndex++;
        return `<span class="cascade-word" style="--cascade-delay: ${totalDelay.toFixed(3)}s">${part}</span>`;
      }).join('');
      
      p.innerHTML = wrapped;
      p.dataset.cascadeReady = 'true';
      p.classList.add('cascade-paragraph');
    });
  });

  const cascadeObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.cascadeTriggered) {
          e.target.dataset.cascadeTriggered = 'true';
          
          const paragraphs = e.target.querySelectorAll('.cascade-paragraph');
          paragraphs.forEach((p, index) => {
            setTimeout(() => p.classList.add('cascade-active'), index * PROSE_DELAY);
          });
        }
      });
    },
    { threshold: 0.2, rootMargin: "-10% 0px -20% 0px" }
  );

  proseBlocks.forEach(block => cascadeObs.observe(block));
})();

// ═══════════════════════════════════════════════════════════
// KICKER CHARACTER REVEAL — Tuần tự từng chữ
// ═══════════════════════════════════════════════════════════
(() => {
  const kickers = document.querySelectorAll('.bpt-kicker');
  if (!kickers.length) return;

  const CHAR_DELAY = 0.05;

  kickers.forEach((k, index) => {
    if (k.dataset.charReady) return;
    
    const text = k.textContent.trim();
    k.innerHTML = text.split('').map((char, i) => 
      `<span class="kicker-char" style="--char-delay: ${(index * 0.3) + (i * CHAR_DELAY)}s">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
    
    k.dataset.charReady = 'true';
  });

  const kickerObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('kicker-reveal-active');
        } else {
          e.target.classList.remove('kicker-reveal-active');
        }
      });
    },
    { threshold: 0.8 }
  );

  kickers.forEach(k => kickerObs.observe(k));
})();

// ═══════════════════════════════════════════════════════════
// OPACITY FOCUS — Chỉ opacity, KHÔNG blur
// ═══════════════════════════════════════════════════════════
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 769) return; // skip on mobile — too expensive per-frame

  const proseBlocks = document.querySelectorAll('.bpt-prose, .bpt-sm-text');
  if (!proseBlocks.length) return;

  let ticking = false;
  
  function updateFocus() {
    const vh = window.innerHeight;
    const viewportCenter = vh / 2;
    
    proseBlocks.forEach(block => {
      const rect = block.getBoundingClientRect();
      const blockCenter = rect.top + rect.height / 2;
      const distance = Math.abs(blockCenter - viewportCenter);
      const maxDistance = vh * 0.5;
      
      const opacity = Math.max(0.5, 1 - (distance / maxDistance) * 0.5);
      block.style.opacity = opacity.toFixed(3);
    });
    
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateFocus);
      ticking = true;
    }
  }

  const visObs = new IntersectionObserver(
    (entries) => {
      const hasVisible = entries.some(e => e.isIntersecting);
      if (hasVisible) {
        window.addEventListener('scroll', onScroll, { passive: true });
        updateFocus();
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    },
    { rootMargin: "10% 0px" }
  );

  proseBlocks.forEach(block => visObs.observe(block));
})();

// ═══════════════════════════════════════════════════════════
// QUOTE DECORATION — Dấu ngoặc kép
// ═══════════════════════════════════════════════════════════
(() => {
  const quotes = document.querySelectorAll('.bpt-ca-dao');
  if (!quotes.length) return;

  quotes.forEach(q => {
    if (q.dataset.quoteDecorated) return;
    
    const before = document.createElement('span');
    before.className = 'quote-deco quote-deco-before';
    before.textContent = '"';
    
    const after = document.createElement('span');
    after.className = 'quote-deco quote-deco-after';
    after.textContent = '"';
    
    q.prepend(before);
    q.append(after);
    q.dataset.quoteDecorated = 'true';
  });

  const quoteObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('quote-active');
        } else {
          e.target.classList.remove('quote-active');
        }
      });
    },
    { threshold: 0.4 }
  );

  quotes.forEach(q => quoteObs.observe(q));
})();

// ═══════════════════════════════════════════════════════════
// SIDEBAR PROGRESS — Vạch bên trái
// ═══════════════════════════════════════════════════════════
(() => {
  const sections = document.querySelectorAll('.bpt-scene, .bpt-sm-panel');
  if (!sections.length) return;

  sections.forEach(s => {
    if (s.querySelector('.sidebar-progress')) return;
    
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar-progress';
    s.appendChild(sidebar);
  });

  const sbObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        const sidebar = e.target.querySelector('.sidebar-progress');
        if (!sidebar) return;
        
        if (e.isIntersecting) {
          sidebar.classList.add('sidebar-in');
          sidebar.classList.remove('sidebar-out');
        } else {
          sidebar.classList.remove('sidebar-in');
          sidebar.classList.add('sidebar-out');
        }
      });
    },
    { threshold: 0.1, rootMargin: "-5% 0px" }
  );

  sections.forEach(s => sbObs.observe(s));
})();

/* ═══════════════════════════════════════════════════════════ */
