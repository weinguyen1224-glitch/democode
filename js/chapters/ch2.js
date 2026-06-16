/* ═══════════════════════════════════════════════════════════ */
/* CHƯƠNG II — Ngũ Hành Interactive                            */
/* Click bánh → unwrap 7 frames → burst ngũ hành cards         */
/* Requires: GSAP (cdn), IMGS (ch2-imgs.js)                    */
/* ═══════════════════════════════════════════════════════════ */

(() => {
  const section = document.getElementById('section-bpt-ch2-ngu-hanh');
  if (!section) return;

  /* ── DOM refs ───────────────────────────────────────────── */
  const wrap     = section.querySelector('.bpt-banh-wrap');
  const hint     = section.querySelector('.bpt-banh-hint');
  const canvas   = section.querySelector('.bpt-canvas-fx');
  const glow     = section.querySelector('.bpt-banh-glow');
  const progRing = section.querySelector('.bpt-prog-ring');
  const progArc  = section.querySelector('.bpt-prog-arc');
  const infoPanel   = section.querySelector('.bpt-ngu-hanh__info');
  const infoName    = infoPanel?.querySelector('.bpt-ngu-hanh__info-name');
  const infoBadge   = infoPanel?.querySelector('.bpt-ngu-hanh__info-badge');
  const infoMeaning = infoPanel?.querySelector('.bpt-ngu-hanh__info-meaning');

  if (!wrap || !canvas) return;

  const ctx2d = canvas.getContext('2d');
  const CIRCUMFERENCE = 1099;
  const isMobile = () => window.innerWidth <= 768;
  const isSmallPhone = () => window.innerWidth <= 420;
  const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Data 5 hành ────────────────────────────────────────── */
  const NGU_HANH = {
    moc:  { name: '🌿 MỘC',  color: '#4A7C59', badge: 'Lá dong · Lá chuối — Sinh sôi · Sức sống', meaning: 'Bao bọc bên ngoài chiếc bánh là lớp lá dong, lá chuối xanh mướt – sắc màu của cỏ cây, của sự sinh sôi và sức sống bền bỉ. Trong quan niệm ngũ hành, Mộc tượng trưng cho sự phát triển, cho mái ấm gia đình luôn đơm hoa kết trái và tràn đầy sinh khí.' },
    kim:  { name: '⬡ KIM',   color: '#8A8070', badge: 'Dừa nạo · Đường phèn — Tinh khiết · Thủy chung', meaning: 'Vị ngọt thanh hòa quyện cùng những sợi dừa trắng trong nhân bánh gợi liên tưởng đến hành Kim. Đây là biểu tượng của sự tinh khiết, thủy chung và bền vững – những giá trị cốt lõi trong tình nghĩa phu thê.' },
    tho:  { name: '◈ THỔ',   color: '#D4A843', badge: 'Nhân đậu xanh · Dành dành — Ổn định · Ấm áp', meaning: 'Màu vàng óng của lớp vỏ bánh được nhuộm từ quả dành dành tự nhiên hòa quyện với sắc vàng của nhân đậu xanh bên trong. Hành Thổ tượng trưng cho sự ổn định, ấm áp và là nền tảng vững chắc nâng đỡ hạnh phúc gia đình qua năm tháng.' },
    hoa:  { name: '🔥 HỎA',  color: '#972023', badge: 'Sợi lạt đỏ — Niềm vui · Gắn kết', meaning: 'Nổi bật trên nền xanh của lớp lá là sợi lạt đỏ thắm buộc chéo quanh cặp bánh. Sắc đỏ của hành Hỏa tượng trưng cho niềm vui ngày cưới, cho ngọn lửa yêu thương và sự gắn kết nồng ấm của đôi lứa.' },
    thuy: { name: '💧 THỦY', color: '#6B9BC3', badge: 'Nước — Hài hòa · Linh hoạt · Bền bỉ', meaning: 'Để tạo nên lớp vỏ trong veo, mềm mại đặc trưng của bánh phu thê không thể thiếu nước – yếu tố đại diện cho hành Thủy. Thủy là biểu tượng của sự hài hòa, linh hoạt và dòng chảy cảm xúc bền bỉ, kết nối hai con người trong cuộc sống hôn nhân.' },
  };

  /* Burst config — responsive: radial on ALL screens, scaled down on mobile */
  function getBurstConfig() {
    const mobile = isMobile();
    const small  = isSmallPhone();
    // Mobile: scale distances more aggressively, smaller cards
    const scale  = small ? 0.55 : mobile ? 0.65 : 1;
    const cardW = small ? 90 : mobile ? 100 : 190;
    return { scale, cardW, cardHalfW: cardW / 2 };
  }

  /* Burst angles — evenly distributed 72° apart, all diagonal
     Desktop uses these angles directly.
     Mobile uses same angles but distances are scaled via getBurstConfig().scale */
  const HANH_BURST = [
    { key: 'moc',  angle: -90,  dist: 320, colors: ['#40c030','#80e050','#b0f070'] },
    { key: 'kim',  angle: -18,  dist: 340, colors: ['#c8e0f8','#e0f0ff','#ffffff'] },
    { key: 'tho',  angle: 54,   dist: 330, colors: ['#f0c010','#f8e040','#fff080'] },
    { key: 'hoa',  angle: 126,  dist: 340, colors: ['#972023','#C41E3A','#E84050'] },
    { key: 'thuy', angle: 198,  dist: 320, colors: ['#1890e0','#30c0f8','#70d8ff'] },
  ];

  /* ── Assign frame images from IMGS (ch2-imgs.js) ──────── */
  const frameIds = ['bpt-f1','bpt-f2','bpt-f3','bpt-f4','bpt-f5','bpt-f6','bpt-f7'];
  const frameKeys = ['banh-frame-1','banh-frame-2','banh-frame-3','banh-frame-4','banh-frame-5','banh-frame-6','banh-frame-7'];

  if (typeof IMGS !== 'undefined') {
    frameIds.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el && IMGS[frameKeys[i]]) el.src = IMGS[frameKeys[i]];
    });
    // Mark bánh as loaded once first frame has data
    if (wrap) wrap.classList.add("is-loaded");
    const assetMap = {
      'bpt-img-ladong': 'assets/background-remover/ladong.png',
      'bpt-img-lachuoi': 'assets/background-remover/lachuoi.png',
      'bpt-img-dua': 'assets/background-remover/dua.png',
      'bpt-img-duong': 'assets/background-remover/duong.png',
      'bpt-img-dau': 'assets/background-remover/dau.png',
      'bpt-img-soi-lat': 'soi-lat-do',
    };
    Object.entries(assetMap).forEach(([elId, src]) => {
      const el = document.getElementById(elId);
      if (!el) return;
      if (src === 'soi-lat-do' && IMGS['soi-lat-do']) el.src = IMGS['soi-lat-do'];
      else el.src = src;
    });
  }

  const frames = frameIds.map(id => document.getElementById(id)).filter(Boolean);

  /* ── Particle system (canvas) ─────────────────────────── */
  let particles = [];
  let rafP = null;

  function addParticles(n, colors, ox, oy, spread) {
    const cw = canvas.width;
    const ch = canvas.height;
    ox = ox || cw / 2;
    oy = oy || ch / 2;
    spread = spread || 5;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 0.8 + Math.random() * spread;
      particles.push({
        x: ox, y: oy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 0.5,
        r: 1.5 + Math.random() * 3.5,
        alpha: 0.9 + Math.random() * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        decay: 0.008 + Math.random() * 0.012,
        shape: Math.random() > 0.6 ? 'sq' : 'c',
      });
    }
    if (!rafP) runParticles();
  }

  function runParticles() {
    const cw = canvas.width;
    const ch = canvas.height;
    function tick() {
      ctx2d.clearRect(0, 0, cw, ch);
      particles = particles.filter(p => p.alpha > 0.02);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.09;
        p.alpha -= p.decay;
        ctx2d.save();
        ctx2d.globalAlpha = Math.max(0, p.alpha);
        ctx2d.fillStyle = p.color;
        if (p.shape === 'sq') {
          ctx2d.fillRect(p.x - p.r/2, p.y - p.r/2, p.r, p.r);
        } else {
          ctx2d.beginPath();
          ctx2d.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx2d.fill();
        }
        ctx2d.restore();
      }
      if (particles.length) rafP = requestAnimationFrame(tick);
      else { rafP = null; ctx2d.clearRect(0, 0, cw, ch); }
    }
    rafP = requestAnimationFrame(tick);
  }

  /* ── Progress arc ──────────────────────────────────────── */
  function setProgress(t) {
    if (progArc) progArc.style.strokeDashoffset = CIRCUMFERENCE * (1 - t);
  }

  /* ── Ripple on canvas ──────────────────────────────────── */
  function doRipple(color) {
    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2, cy = ch / 2;
    let r = 0, alpha = 0.7;
    const col = color || 'rgba(200,160,60,0.6)';
    function draw() {
      ctx2d.save();
      ctx2d.strokeStyle = col;
      ctx2d.lineWidth = 2;
      ctx2d.globalAlpha = alpha;
      ctx2d.beginPath();
      ctx2d.arc(cx, cy, r, 0, Math.PI * 2);
      ctx2d.stroke();
      ctx2d.restore();
      r += 6;
      alpha -= 0.022;
      if (alpha > 0) requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── Quick swap: scale-dip mask for seamless frame transition ── */
  function quickSwap(from, to, onDone) {
    if (typeof gsap === 'undefined') { from.style.opacity = '0'; to.style.opacity = '1'; if (onDone) onDone(); return; }
    gsap.to(wrap, {
      scale: 0.95,
      duration: 0.14,
      ease: 'power2.in',
      onComplete: () => {
        from.style.opacity = '0';
        to.style.opacity = '1';
        gsap.to(wrap, {
          scale: 1,
          duration: 0.18,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(wrap, { scale: 1 });
            if (onDone) onDone();
          },
        });
      },
    });
  }

  /* ── Position info panel beside clicked card ──────────── */
  function positionInfoPanel(cardEl) {
    if (!infoPanel || !cardEl) return;
    const orbit = section.querySelector('.bpt-ngu-hanh__orbit');
    if (!orbit) return;
    const oRect = orbit.getBoundingClientRect();
    const cRect = cardEl.getBoundingClientRect();
    const panelW = isSmallPhone() ? 140 : isMobile() ? 160 : 220;
    const panelH = infoPanel.offsetHeight || 120;

    if (isMobile()) {
      // Mobile: determine card direction from center for outward placement
      const cardCX = cRect.left + cRect.width / 2;
      const cardCY = cRect.top + cRect.height / 2;
      const orbitCX = oRect.left + oRect.width / 2;
      const orbitCY = oRect.top + oRect.height / 2;
      const dx = cardCX - orbitCX;
      const dy = cardCY - orbitCY;
      const leftOffset = Math.max(8, Math.min(oRect.width - panelW - 8, (oRect.width - panelW) / 2));

      // Card above center → panel above card; below center → panel below card
      if (dy < 0) {
        let topOffset = cRect.top - oRect.top - panelH - 8;
        if (topOffset < 8) topOffset = 8;
        gsap.set(infoPanel, { left: leftOffset, top: topOffset });
      } else {
        let topOffset = cRect.bottom - oRect.top + 8;
        topOffset = Math.min(topOffset, oRect.height - panelH - 8);
        gsap.set(infoPanel, { left: leftOffset, top: topOffset });
      }
      return;
    }

    // Desktop: place panel AWAY from orbit center (outward)
    const cardCX = cRect.left + cRect.width / 2;
    const cardCY = cRect.top + cRect.height / 2;
    const orbitCX = oRect.left + oRect.width / 2;
    const orbitCY = oRect.top + oRect.height / 2;
    const dx = cardCX - orbitCX;
    const dy = cardCY - orbitCY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    let leftOffset, topOffset;

    if (absDy > absDx) {
      // Vertical-dominant: card is above/below center
      if (dy < 0) {
        // Card above center (e.g. Mộc at -90°) → panel ABOVE card
        topOffset = cRect.top - oRect.top - panelH - 10;
        if (topOffset < 4) {
          // Not enough room above → place to the side instead
          topOffset = cRect.top - oRect.top + (cRect.height - panelH) / 2;
          if (dx >= 0) {
            leftOffset = cRect.right - oRect.left + 10;
          } else {
            leftOffset = cRect.left - oRect.left - panelW - 10;
          }
          if (leftOffset === undefined || leftOffset < 4 || leftOffset + panelW > oRect.width - 4) {
            leftOffset = Math.max(4, Math.min(oRect.width - panelW - 4, cRect.left - oRect.left));
          }
        }
      } else {
        // Card below center → panel BELOW card
        topOffset = cRect.bottom - oRect.top + 10;
        if (topOffset + panelH > oRect.height - 4) {
          // Not enough room below → place to the side
          topOffset = cRect.top - oRect.top + (cRect.height - panelH) / 2;
          if (dx >= 0) {
            leftOffset = cRect.right - oRect.left + 10;
          } else {
            leftOffset = cRect.left - oRect.left - panelW - 10;
          }
          if (leftOffset === undefined || leftOffset < 4 || leftOffset + panelW > oRect.width - 4) {
            leftOffset = Math.max(4, Math.min(oRect.width - panelW - 4, cRect.left - oRect.left));
          }
        }
      }
      if (leftOffset === undefined) {
        leftOffset = Math.max(4, Math.min(oRect.width - panelW - 4, cRect.left - oRect.left + (cRect.width - panelW) / 2));
      }
    } else {
      // Horizontal-dominant: card is left/right of center
      if (dx > 0) {
        leftOffset = cRect.right - oRect.left + 10;
        if (leftOffset + panelW > oRect.width - 8) {
          leftOffset = Math.max(4, Math.min(oRect.width - panelW - 4, cRect.left - oRect.left));
          topOffset = cRect.bottom - oRect.top + 10;
        }
      } else {
        leftOffset = cRect.left - oRect.left - panelW - 10;
        if (leftOffset < 8) {
          leftOffset = Math.max(4, Math.min(oRect.width - panelW - 4, cRect.left - oRect.left));
          topOffset = cRect.bottom - oRect.top + 10;
        }
      }
      if (topOffset === undefined) {
        topOffset = cRect.top - oRect.top + (cRect.height - panelH) / 2;
      }
    }

    // Final clamps
    leftOffset = Math.max(4, Math.min(leftOffset, oRect.width - panelW - 4));
    topOffset = Math.max(4, Math.min(topOffset, oRect.height - panelH - 4));

    gsap.set(infoPanel, { left: leftOffset, top: topOffset });
  }

  /* ── Ngũ Hành burst ───────────────────────────────────── */
  let burstDone = false;

  function burstHanh() {
    if (typeof gsap === 'undefined') return;

    const orbit = section.querySelector('.bpt-ngu-hanh__orbit');
    if (!orbit) return;
    const oRect = orbit.getBoundingClientRect();
    
    const cx = oRect.left + oRect.width / 2;
    const cy = oRect.top + oRect.height / 2;
    const cfg = getBurstConfig();

    // Shrink bánh
    gsap.to(wrap, { scale: 0.55, opacity: 0.15, duration: prefersReducedMotion() ? 0.01 : 0.55, ease: 'power3.in' });
    if (progRing) gsap.to(progRing, { opacity: 0, duration: prefersReducedMotion() ? 0.01 : 0.4 });

    // Big golden burst
    !prefersReducedMotion() && addParticles(120, ['#f8d820','#f0a010','#e06010','#a0d020','#20c060','#60a8f0','#f04020'], canvas.width/2, canvas.height/2, 9);

    HANH_BURST.forEach((h, i) => {
      const rad = (h.angle * Math.PI) / 180;
      const dist = h.dist * cfg.scale;
      const tx = cx + Math.cos(rad) * dist - cfg.cardHalfW - oRect.left;
      const ty = cy + Math.sin(rad) * dist - cfg.cardHalfW - oRect.top;
      // Clamp so cards stay inside orbit bounds
      const clampedTx = Math.max(4, Math.min(tx, oRect.width - cfg.cardW - 4));
      const clampedTy = Math.max(4, Math.min(ty, oRect.height - cfg.cardW - 4));
      const startX = cx - cfg.cardHalfW - oRect.left;
      const startY = cy - cfg.cardHalfW - oRect.top;

      const el = document.getElementById('bpt-hc-' + h.key);
      if (!el) return;
      const nameEl = el.querySelector('.hc-name');
      const badge = el.querySelector('.hc-badge');
      const desc = el.querySelector('.hc-desc');

      gsap.set(el, {
        position: 'absolute',
        left: Math.max(0, startX),
        top: Math.max(0, startY),
        opacity: 0,
        scale: 0.15,
        rotation: (Math.random() - 0.5) * 80,
        pointerEvents: 'none',
      });

      const delay = i * 0.11;
      gsap.to(el, {
        left: clampedTx,
        top: clampedTy,
        opacity: 1,
        scale: 1,
        rotation: (Math.random() - 0.5) * 10,
        duration: prefersReducedMotion() ? 0.01 : 0.75,
        delay: delay,
        ease: 'back.out(1.9)',
        onStart: () => !prefersReducedMotion() && addParticles(20, h.colors, canvas.width/2, canvas.height/2, 5),
        onComplete: () => { el.style.pointerEvents = 'auto'; },
      });

      if (nameEl) gsap.to(nameEl, { opacity: 1, duration: 0.4, delay: delay + 0.45 });
      if (badge)  gsap.to(badge,  { opacity: 1, y: 0, duration: 0.4, delay: delay + 0.6 });
      if (desc)   gsap.to(desc,   { opacity: 1, duration: 0.35, delay: delay + 0.75 });
    });

    // Finale text — center of orbit
    const finaleEl = section.querySelector('.bpt-finale-text');
    if (finaleEl) {
      const fw = isMobile() ? 180 : 280;
      gsap.set(finaleEl, {
        left: oRect.width / 2 - fw / 2,
        top: oRect.height / 2 - 30,
        width: fw,
      });
      setTimeout(() => {
        gsap.set(finaleEl, { opacity: 0, scale: 0.85, y: 10 });
        gsap.to(finaleEl, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' });
      }, 1200);
    }

    burstDone = true;
  }

  /* ── Hanh card click → info panel beside card ────────── */
  let activeHanh = null;

  function updateInfoPanel(hanhKey, cardEl) {
    if (!infoPanel) return;
    const data = NGU_HANH[hanhKey];
    if (!data) return;
    if (infoName)    infoName.textContent    = data.name;
    if (infoBadge)   infoBadge.textContent   = data.badge;
    if (infoMeaning) infoMeaning.textContent = data.meaning;
    infoPanel.style.setProperty('--hanh-color', data.color);

    // Position beside card
    positionInfoPanel(cardEl);
    infoPanel.classList.add('is-visible');
  }

  // Delegate clicks on hanh cards
  section.addEventListener('click', (e) => {
    if (!burstDone) return;
    const card = e.target.closest('.bpt-hanh-card');
    if (!card) {
      if (activeHanh) {
        activeHanh = null;
        if (infoPanel) infoPanel.classList.remove('is-visible');
        section.querySelectorAll('.bpt-hanh-card').forEach(c => c.style.opacity = '1');
      }
      return;
    }
    const hanhKey = card.dataset.hanh;
    const data = NGU_HANH[hanhKey];
    if (!data) return;
    if (activeHanh === hanhKey) {
      activeHanh = null;
      if (infoPanel) infoPanel.classList.remove('is-visible');
      section.querySelectorAll('.bpt-hanh-card').forEach(c => c.style.opacity = '1');
      return;
    }

    activeHanh = hanhKey;
    section.querySelectorAll('.bpt-hanh-card').forEach(c => {
      c.style.opacity = c.dataset.hanh === hanhKey ? '1' : '0.4';
      c.style.transition = 'opacity 280ms ease';
    });
    updateInfoPanel(hanhKey, card);
  });

  // Keyboard support for hanh cards
  section.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.bpt-hanh-card');
      if (card && burstDone) {
        e.preventDefault();
        card.click();
      }
    }
  });

  /* ── Main click → unwrap sequence ─────────────────────── */
  let animating = false;

  function startUnwrap() {
    if (animating || burstDone) return;
    if (typeof gsap === 'undefined') return;
    // Reduced motion: skip animation, show final state immediately
    if (prefersReducedMotion()) {
      frames.forEach((f, i) => { if (f) { f.style.opacity = i === 6 ? "1" : "0"; f.style.transform = "none"; } });
      if (progArc) progArc.style.strokeDashoffset = "0";
      if (hint) { hint.style.opacity = "0"; hint.style.pointerEvents = "none"; }
      burstHanh();
      return;
    }
    animating = true;

    if (hint) { hint.style.opacity = '0'; hint.style.pointerEvents = 'none'; }
    if (glow) glow.classList.add('is-bright');

    const steps = [
      { from: 0, to: 1, ripple: 'rgba(220,80,60,0.7)',  pColor: ['#cc4020','#e86040','#ff8060'], pN: 25, pSp: 3.5 },
      { from: 1, to: 2, ripple: 'rgba(210,70,50,0.5)',  pColor: ['#cc3818','#e05030'],            pN: 20, pSp: 3   },
      { from: 2, to: 3, ripple: 'rgba(60,180,60,0.5)',  pColor: ['#40b030','#70c840','#a8e060'],  pN: 30, pSp: 4.5 },
      { from: 3, to: 4, ripple: 'rgba(40,160,40,0.5)',  pColor: ['#30a020','#60c030','#90d858'],  pN: 35, pSp: 4   },
      { from: 4, to: 5, ripple: 'rgba(240,200,40,0.6)', pColor: ['#d0a010','#f0c820','#f8e060'],  pN: 45, pSp: 5   },
      { from: 5, to: 6, ripple: 'rgba(240,180,20,0.7)', pColor: ['#f0c010','#f8d840','#fff090','#e09010'], pN: 60, pSp: 6 },
    ];
    const gaps = [280, 250, 250, 250, 250, 280];

    function runStep(i) {
      if (i >= steps.length) {
        gsap.to(glow, {
          background: 'radial-gradient(circle, rgba(240,180,40,0.28) 0%, transparent 70%)',
          duration: 0.5,
          yoyo: true,
          repeat: 1,
        });
        setTimeout(burstHanh, 350);
        return;
      }
      const s = steps[i];
      !prefersReducedMotion() && doRipple(s.ripple);
      !prefersReducedMotion() && addParticles(s.pN, s.pColor, canvas.width/2, canvas.height/2, s.pSp);
      quickSwap(frames[s.from], frames[s.to], () => {
        setProgress((i + 1) / 6);
        setTimeout(() => runStep(i + 1), gaps[i]);
      });
    }

    if (progArc) gsap.set(progArc, { strokeDashoffset: CIRCUMFERENCE });
    if (progRing) gsap.to(progRing, { opacity: 0.7, duration: 0.4 });
    setTimeout(() => runStep(0), 100);
  }

  wrap.addEventListener('click', startUnwrap);
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startUnwrap(); }
  });

  /* ── Scroll fade-in ────────────────────────────────────── */
  if (!prefersReducedMotion()) {
    const reveals = section.querySelectorAll('.bpt-reveal');
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveals.forEach(el => el.classList.add('bpt-visible'));
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (reveals.length) obs.observe(section);
  }
})();

/* ═══════════════════════════════════════════════════════════ */
/* CHƯƠNG II — EMAGAZINE SCROLL EFFECTS                        */
/* Char reveals, word staggers, highlight sweeps, parallax      */
/* ═══════════════════════════════════════════════════════════ */

(() => {
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  /* ── Helper: wrap each char in a span ───────────────────── */
  function wrapChars(el, cls = 'bpt-char') {
    const text = el.textContent;
    el.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      span.style.transitionDelay = `${i * 0.03}s`;
      el.appendChild(span);
    }
  }

  /* ── Helper: wrap each word in a span ────────────────────── */
  function wrapWords(el, cls = 'bpt-word') {
    const text = el.textContent;
    const words = text.split(/\s+/);
    el.innerHTML = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = word;
      span.style.transitionDelay = `${i * 0.06}s`;
      el.appendChild(span);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode('\u00A0'));
      }
    });
  }

  /* ── Helper: wrap words in a paragraph with fly-in ─────── */
  function wrapWordsFly(el) {
    const text = el.textContent;
    const words = text.split(/\s+/);
    el.innerHTML = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'bpt-word bpt-word-fly';
      span.textContent = word;
      span.style.transitionDelay = `${i * 0.04}s`;
      el.appendChild(span);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode('\u00A0'));
      }
    });
  }

  /* ── 1. Chapter Divider — char/word kinetic reveal ─────── */
  const dividerNum = document.querySelector('#section-bpt-ch2-divider .bpt-divider-num');
  const dividerTitle = document.querySelector('#section-bpt-ch2-divider .bpt-divider-title');
  const dividerSub = document.querySelector('#section-bpt-ch2-divider .bpt-divider-sub');

  if (dividerNum) wrapChars(dividerNum);
  if (dividerTitle) wrapWords(dividerTitle);
  if (dividerSub) wrapChars(dividerSub);

  /* ── 2. Ngũ Hành section — kicker char reveal + word wave ─ */
  const nhKicker = document.querySelector('#section-bpt-ch2-ngu-hanh .bpt-kicker');
  if (nhKicker) wrapChars(nhKicker);

  const nhParas = document.querySelectorAll('#section-bpt-ch2-ngu-hanh .bpt-prose p');
  nhParas.forEach(p => {
    p.classList.add('bpt-ngu-hanh__p-wave');
    wrapWords(p, 'bpt-word');
  });

  /* ── 3. Highlight sweep — find <em> and wrap with highlight ─ */
  document.querySelectorAll('#section-bpt-ch2-mo-dau em, #section-bpt-ch2-bao-ton em').forEach(em => {
    const wrapper = document.createElement('span');
    wrapper.className = 'bpt-highlight';
    em.parentNode.insertBefore(wrapper, em);
    wrapper.appendChild(em);
  });

  /* ── 4. Typewriter wrap for ca-dao blockquotes ─────────── */
  document.querySelectorAll('.bpt-ca-dao--typewriter').forEach(bq => {
    const lines = bq.querySelectorAll('p');
    lines.forEach((line, i) => {
      const div = document.createElement('div');
      div.className = 'bpt-typewriter-line';
      div.style.transitionDelay = `${i * 0.2 + 0.3}s`;
      div.innerHTML = line.innerHTML;
      line.parentNode.insertBefore(div, line);
      line.remove();
    });
  });

  /* ── 5. Floating words — ambient text particles ─────────── */
  const floatWords = ['trời tròn', 'đất vuông', 'ngũ hành', 'mộc', 'kim', 'thổ', 'hỏa', 'thủy', 'hòa quyện', 'phu thê', 'tình nghĩa', 'thủy chung'];

  function spawnFloatWord(container) {
    const word = document.createElement('span');
    word.className = 'bpt-float-word';
    word.textContent = floatWords[Math.floor(Math.random() * floatWords.length)];
    word.style.fontSize = `${0.7 + Math.random() * 0.6}rem`;
    word.style.left = `${10 + Math.random() * 80}%`;
    word.style.bottom = `${-5 + Math.random() * 10}%`;
    word.style.animationDuration = `${5 + Math.random() * 4}s`;
    word.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(word);
    setTimeout(() => word.remove(), 12000);
  }

  // Ambient dots for sections
  function createAmbientDots(section) {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'bpt-ambient-dots';
    section.style.position = 'relative';
    section.insertBefore(dotsContainer, section.firstChild);

    const colors = ['#972023', '#F8D077', '#4A7C59', '#6B9BC3', '#D4A843'];
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('span');
      dot.className = 'bpt-ambient-dot';
      const size = 3 + Math.random() * 5;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${20 + Math.random() * 70}%`;
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      dot.style.animationDelay = `${Math.random() * 6}s`;
      dot.style.animationDuration = `${6 + Math.random() * 5}s`;
      dotsContainer.appendChild(dot);
    }
  }

  /* ── 6. Section progress bars ───────────────────────────── */
  const ch2Sections = document.querySelectorAll(
    '#section-bpt-ch2-mo-dau, #section-bpt-ch2-bao-ton'
  );
  ch2Sections.forEach(sec => {
    const bar = document.createElement('div');
    bar.className = 'bpt-section-progress';
    sec.style.position = 'relative';
    sec.appendChild(bar);
  });

  /* ── 7. Scroll-driven effects — IntersectionObserver ──── */
  const allReveals = document.querySelectorAll(
    '#section-bpt-ch2-divider, #section-bpt-ch2-mo-dau .bpt-split-scene, #section-bpt-ch2-mo-dau .bpt-prose, ' +
    '#section-bpt-ch2-bao-ton .bpt-prose, .bpt-ingredient-card'
  );

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('bpt-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  allReveals.forEach(el => revealObs.observe(el));

  /* ── 8. Highlight sweep observer ────────────────────────── */
  const highlights = document.querySelectorAll('.bpt-highlight');
  const hlObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('bpt-highlight--visible');
        hlObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4, rootMargin: '0px 0px -60px 0px' });

  highlights.forEach(hl => hlObs.observe(hl));

  /* ── 9. Word-fly reveal observer ─────────────────────────── */
  const wordFlys = document.querySelectorAll('.bpt-word-fly');
  const wfObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.closest('.bpt-prose, .bpt-split-scene__text');
        if (parent) parent.classList.add('bpt-visible');
        wfObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  wordFlys.forEach(wf => wfObs.observe(wf));

  /* ── 10. Scroll-driven parallax text ────────────────────── */
  const parallaxTexts = document.querySelectorAll('.bpt-parallax-text');
  if (parallaxTexts.length && window.innerWidth >= 769) {
    let ticking = false;
    function updateParallax() {
      parallaxTexts.forEach(el => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top < vh && rect.bottom > 0) {
          const progress = (vh - rect.top) / (vh + rect.height);
          const shift = (progress - 0.5) * 16;
          el.style.transform = `translateY(${shift.toFixed(1)}px)`;
        }
      });
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 11. Scroll progress for section bars ───────────────── */
  function updateSectionProgress() {
    ch2Sections.forEach(sec => {
      const bar = sec.querySelector('.bpt-section-progress');
      if (!bar) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
        const secHeight = sec.offsetHeight;
        bar.style.height = `${progress * secHeight}px`;
      }
    });
    requestAnimationFrame(updateSectionProgress);
  }

  // Throttle progress to scroll only
  let progressTicking = false;
  window.addEventListener('scroll', () => {
    if (!progressTicking) {
      requestAnimationFrame(updateSectionProgress);
      progressTicking = true;
    }
  }, { passive: true });

  /* ── 12. Spawn floating words periodically ─────────────── */
  const floatSections = document.querySelectorAll('#section-bpt-ch2-mo-dau, #section-bpt-ch2-bao-ton');
  floatSections.forEach(sec => {
    createAmbientDots(sec);
    let floatInterval;
    const floatObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Spawn initial batch
        for (let i = 0; i < 3; i++) {
          setTimeout(() => spawnFloatWord(sec), i * 800);
        }
        floatInterval = setInterval(() => spawnFloatWord(sec), 3000);
      } else {
        clearInterval(floatInterval);
      }
    }, { threshold: 0.1 });
    floatObs.observe(sec);
  });

  /* ── 13. Add shimmer class to specific sections ─────────── */
  document.querySelectorAll('#section-bpt-ch2-mo-dau').forEach(sec => {
    sec.classList.add('bpt-scene--shimmer');
  });

  /* ── 14. Add kicker sweep class ──────────────────────────── */
  document.querySelectorAll('#section-bpt-ch2-mo-dau .bpt-kicker, #section-bpt-ch2-bao-ton .bpt-kicker').forEach(k => {
    k.classList.add('bpt-kicker--sweep');
  });

  /* ── 16. Add cascade class to bao-ton prose ─────────────── */
  const baoTonProse = document.querySelector('#section-bpt-ch2-bao-ton .bpt-prose');
  if (baoTonProse) baoTonProse.classList.add('bpt-prose--cascade');

  /* ── 17. Add directional split-scene classes ────────────── */
  document.querySelectorAll('#section-bpt-ch2-mo-dau .bpt-split-scene').forEach(ss => {
    ss.classList.add('bpt-split-scene--left');
  });

  /* ── 18. Divider decorative line ─────────────────────────── */
  const divider = document.querySelector('#section-bpt-ch2-divider');
  if (divider && !divider.querySelector('.bpt-divider-line')) {
    const line = document.createElement('span');
    line.className = 'bpt-divider-line';
    divider.appendChild(line);
  }

  /* ═══════════════════════════════════════════════════════════ */
  /* NGHỆ NHÂN — Immersive Cinematic Scroll Effects             */
  /* ═══════════════════════════════════════════════════════════ */

  const nhnSection = document.getElementById('section-bpt-ch2-nghe-nhan');
  if (nhnSection && !prefersReduced) {

    /* ── Wrap lead paragraph words for stagger reveal ──────── */
    const leadEl = nhnSection.querySelector('.bpt-nghe-nhan__lead');
    if (leadEl) {
      const text = leadEl.textContent;
      const words = text.split(/\s+/);
      leadEl.innerHTML = '';
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'bpt-nhn-word';
        span.textContent = word;
        span.style.transitionDelay = `${0.2 + i * 0.035}s`;
        leadEl.appendChild(span);
        if (i < words.length - 1) {
          leadEl.appendChild(document.createTextNode('\u00A0'));
        }
      });
    }

    /* ── Scene IntersectionObserver — reveal each scene ────── */
    const scenes = nhnSection.querySelectorAll('.bpt-nghe-nhan__scene');
    const sceneObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bpt-nhn-visible');
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });

    scenes.forEach(s => sceneObs.observe(s));

    /* ── Parallax background on scroll ─────────────────────── */
    const bgImg = nhnSection.querySelector('.bpt-nghe-nhan__bg-img');
    if (bgImg && window.innerWidth >= 769) {
      let nhnTicking = false;
      function updateNhnParallax() {
        const rect = nhnSection.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top < vh && rect.bottom > 0) {
          const progress = (vh - rect.top) / (vh + rect.height);
          const shift = (progress - 0.5) * 60;
          bgImg.style.transform = `translateY(${shift.toFixed(1)}px) scale(1.05)`;
        }
        nhnTicking = false;
      }
      window.addEventListener('scroll', () => {
        if (!nhnTicking) {
          requestAnimationFrame(updateNhnParallax);
          nhnTicking = true;
        }
      }, { passive: true });
    }

    /* ── Ambient particles ─────────────────────────────────── */
    const particlesContainer = nhnSection.querySelector('.bpt-nghe-nhan__particles');
    if (particlesContainer) {
      const PARTICLE_COLORS = [
        'rgba(248, 208, 119, 0.5)',
        'rgba(151, 32, 35, 0.3)',
        'rgba(247, 232, 203, 0.35)',
        'rgba(212, 168, 67, 0.4)',
      ];

      function spawnNhnParticle() {
        if (particlesContainer.children.length > 20) return;
        const dot = document.createElement('span');
        dot.className = 'bpt-nghe-nhan__particle';
        const size = 2 + Math.random() * 4;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.left = `${10 + Math.random() * 80}%`;
        dot.style.bottom = `${Math.random() * 30}%`;
        dot.style.background = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        const dur = 5 + Math.random() * 6;
        dot.style.animation = `bpt-nhn-particle-float ${dur}s ease-out forwards`;
        particlesContainer.appendChild(dot);
        setTimeout(() => dot.remove(), dur * 1000);
      }

      let nhnFloatInterval;
      const nhnFloatObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          for (let i = 0; i < 4; i++) {
            setTimeout(() => spawnNhnParticle(), i * 600);
          }
          nhnFloatInterval = setInterval(spawnNhnParticle, 2000);
        } else {
          clearInterval(nhnFloatInterval);
        }
      }, { threshold: 0.05 });
      nhnFloatObs.observe(nhnSection);
    }

    /* ── Scroll indicator — show only in artisan section ───── */
    const scrollHint = nhnSection.querySelector('.bpt-nghe-nhan__scroll-hint');
    if (scrollHint) {
      const scrollObs = new IntersectionObserver(([entry]) => {
        scrollHint.classList.toggle('bpt-nhn-show', entry.isIntersecting);
      }, { threshold: 0.1 });
      scrollObs.observe(nhnSection);
    }

    /* ── Video bar — click to expand ──────────────────────── */
    const videoBar = document.getElementById('bpt-nhn-video-bar');
    const videoOverlay = document.getElementById('bpt-nhn-video-overlay');
    const videoClose = document.getElementById('bpt-nhn-video-close');

    if (videoBar && videoOverlay) {
      videoBar.addEventListener('click', () => {
        videoOverlay.classList.add('bpt-nhn-active');
        const vid = videoOverlay.querySelector('video');
        if (vid) vid.play();
      });

      function closeVideo() {
        videoOverlay.classList.remove('bpt-nhn-active');
        const vid = videoOverlay.querySelector('video');
        if (vid) { vid.pause(); vid.currentTime = 0; }
      }

      if (videoClose) videoClose.addEventListener('click', closeVideo);

      videoOverlay.querySelector('.bpt-nhn-video-overlay__backdrop')
        .addEventListener('click', closeVideo);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoOverlay.classList.contains('bpt-nhn-active')) {
          closeVideo();
        }
      });
    }
  }

})();
