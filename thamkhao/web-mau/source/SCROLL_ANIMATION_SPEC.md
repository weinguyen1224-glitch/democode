# Đặc tả kỹ thuật: Scroll-Driven Sticky Media Animation

> Phân tích từ Shorthand story tại `/web-mau/source/html/index.html`  
> Ngày: 2026-06-16

---

## Mục lục

1. [Tổng quan cơ chế](#1-tổng-quan-cơ-chế)
2. [Pattern A — Scrollpoints (Pan/Zoom trên Canvas)](#2-pattern-a--scrollpoints-panzoom-trên-canvas)
3. [Pattern B — Background Scrollmation (Cross-fade ảnh full-screen)](#3-pattern-b--background-scrollmation-cross-fade-ảnh-full-screen)
4. [Lý do hoạt động mượt mà](#4-lý-do-hoạt-động-mượt-mà)
5. [Tham số tinh chỉnh](#5-tham-số-tinh-chỉnh)
6. [Checklist tích hợp](#6-checklist-tích-hợp)

---

## 1. Tổng quan cơ chế

Website sử dụng **hai pattern độc lập**, mỗi pattern phục vụ một loại section khác nhau:

| Pattern | Section mẫu | Hiệu ứng | Công nghệ cốt lõi |
|---|---|---|---|
| **Scrollpoints** | `#section-vs6xqVK3EW` (nghệ nhân Ánh Tuyết) | Ảnh tĩnh pan/zoom theo vùng highlight khi scroll | Canvas 2D + tween JS |
| **Background Scrollmation** | `#section-IlL6h42G7A`, `#section-NejokTVo7J` | Ảnh full-screen fade in/out + scale khi scroll qua | CSS sticky + opacity/transform transition |

**Nguyên lý chung của cả hai:**  
Media được ghim cứng trong viewport bằng `position: sticky`, trong khi text/content scroll bình thường phía trên. JS lắng nghe scroll event và cập nhật visual state mà **không đụng vào layout DOM** → không reflow → không jank.

---

## 2. Pattern A — Scrollpoints (Pan/Zoom trên Canvas)

### 2.1 Ý tưởng

Một ảnh lớn được render lên `<canvas>`. Khi user scroll qua từng "điểm" (scrollpoint), camera tự động pan + zoom vào vùng quan tâm trong ảnh bằng Canvas 2D transform — không dùng CSS, không tạo DOM mới.

### 2.2 Cấu trúc HTML

```html
<section class="scrollpoints-section">

  <!-- Canvas sticky: dán cứng trong viewport suốt quá trình scroll -->
  <canvas class="scrollpoints-canvas" role="img" aria-label="[mô tả ảnh]"></canvas>

  <!-- Track: chiều cao = số_điểm × 100vh, tạo "không gian scroll" -->
  <div class="scrollpoints-track">

    <div class="sp-point" data-highlight='{"x":14.5,"y":9.7,"w":19.4,"h":19.9}' data-align="right">
      <div class="sp-text sp-text--right">
        <p>Nội dung đoạn 1...</p>
      </div>
    </div>

    <div class="sp-point" data-highlight='{"x":15.2,"y":58.7,"w":17.6,"h":18.2}' data-align="right">
      <div class="sp-text sp-text--right">
        <p>Nội dung đoạn 2...</p>
      </div>
    </div>

    <!-- Thêm sp-point tùy ý -->

  </div>
</section>
```

> **Lưu ý `data-highlight`:** `x`, `y`, `w`, `h` là **phần trăm** so với kích thước ảnh gốc (0–100). Không dùng pixel tuyệt đối để đảm bảo responsive.

### 2.3 CSS cốt lõi

```css
/* ── Section wrapper ── */
.scrollpoints-section {
  position: relative;
}

/* ── Canvas: sticky full-viewport ── */
.scrollpoints-canvas {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  display: block;
  z-index: 0;
}

/* ── Track: tạo chiều cao scroll ── */
.scrollpoints-track {
  position: relative;
  z-index: 1;
  /* margin-top âm để text overlay lên canvas */
  margin-top: -100vh;
}

/* ── Mỗi điểm scroll = 1 màn hình ── */
.sp-point {
  height: 100vh;
  display: flex;
  align-items: center;
  pointer-events: none; /* canvas nhận click nếu cần */
}

/* ── Text block ── */
.sp-text {
  pointer-events: auto;
  max-width: 40%;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 4px;
}

.sp-text--right { margin-left: auto; }
.sp-text--left  { margin-right: auto; }

/* ── Accessibility: reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .scrollpoints-canvas {
    /* Vẫn sticky nhưng không tween — chuyển ngay */
  }
}
```

### 2.4 Thuật toán JavaScript

```js
class Scrollpoints {
  constructor(section) {
    this.section = section;
    this.canvas  = section.querySelector('.scrollpoints-canvas');
    this.ctx     = this.canvas.getContext('2d');
    this.points  = Array.from(section.querySelectorAll('.sp-point'));
    this.img     = new Image();

    // Camera state (đơn vị: pixel ảnh gốc)
    this.cam = { x: 0, y: 0, zoom: 1 };
    this.target = { x: 0, y: 0, zoom: 1 };

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.rafId = null;
    this.hidden = false;

    this._init();
  }

  _init() {
    this.img.onload = () => {
      this._resize();
      this._setTargetFromPoint(this.points[0], true); // instant, không tween
      this._render();
    };
    this.img.src = this.section.dataset.media;

    // Scroll listener: passive = không block paint
    window.addEventListener('scroll', () => this._onScroll(), { passive: true });
    window.addEventListener('resize', () => this._resize(),   { passive: true });

    // Ẩn canvas khi section ra khỏi viewport (tiết kiệm GPU)
    const observer = new IntersectionObserver(([entry]) => {
      this.hidden = !entry.isIntersecting;
    }, { rootMargin: '20% 0px' });
    observer.observe(this.section);
  }

  _resize() {
    this.canvas.width  = this.canvas.clientWidth  * devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * devicePixelRatio;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
    this._render();
  }

  _onScroll() {
    if (this.hidden) return;

    // Tìm điểm đang active: center viewport (50vh) nằm trong điểm nào
    const mid = window.innerHeight / 2;
    let active = this.points[0];
    for (const pt of this.points) {
      const r = pt.getBoundingClientRect();
      if (r.top < mid && r.bottom > mid) { active = pt; break; }
    }

    this._setTargetFromPoint(active, false);

    // Kick off RAF loop nếu chưa chạy
    if (!this.rafId) this._loop();
  }

  _setTargetFromPoint(point, instant = false) {
    const h = JSON.parse(point.dataset.highlight); // {x,y,w,h} theo %
    const iw = this.img.naturalWidth;
    const ih = this.img.naturalHeight;
    const cw = this.canvas.clientWidth;
    const ch = this.canvas.clientHeight;

    // Tâm của vùng highlight (pixel ảnh gốc)
    const cx = iw * (h.x + h.w / 2) / 100;
    const cy = ih * (h.y + h.h / 2) / 100;

    // Zoom để vùng highlight vừa khít canvas (thêm padding 10%)
    const zx = cw / (iw * h.w / 100) * 0.9;
    const zy = ch / (ih * h.h / 100) * 0.9;
    const zoom = Math.min(zx, zy);

    this.target = { x: cx, y: cy, zoom };

    if (instant || this.reducedMotion) {
      this.cam = { ...this.target };
      this._render();
    }
  }

  _loop() {
    const LERP = 0.08; // 0.04 = mượt hơn, 0.15 = nhanh hơn

    const dx   = this.target.x    - this.cam.x;
    const dy   = this.target.y    - this.cam.y;
    const dz   = this.target.zoom - this.cam.zoom;
    const done = Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1 && Math.abs(dz) < 0.001;

    if (done) {
      this.cam = { ...this.target };
      this.rafId = null;
      this._render();
      return;
    }

    this.cam.x    += dx * LERP;
    this.cam.y    += dy * LERP;
    this.cam.zoom += dz * LERP;

    this._render();
    this.rafId = requestAnimationFrame(() => this._loop());
  }

  _render() {
    const cw = this.canvas.clientWidth;
    const ch = this.canvas.clientHeight;
    const { x, y, zoom } = this.cam;

    // Transform: đưa điểm (x,y) vào trung tâm canvas với scale zoom
    const tx = cw / 2 - x * zoom;
    const ty = ch / 2 - y * zoom;

    this.ctx.clearRect(0, 0, cw, ch);
    this.ctx.save();
    this.ctx.setTransform(zoom, 0, 0, zoom, tx, ty);
    this.ctx.drawImage(this.img, 0, 0, this.img.naturalWidth, this.img.naturalHeight);
    this.ctx.restore();
  }
}

// Khởi tạo
document.querySelectorAll('[data-scrollpoints]')
  .forEach(el => new Scrollpoints(el));
```

---

## 3. Pattern B — Background Scrollmation (Cross-fade ảnh full-screen)

### 3.1 Ý tưởng

Section có chiều cao `N × 100vh`. Một "khung ảnh" sticky ghim trong viewport. Khi scroll percent đi qua ngưỡng của từng ảnh, ảnh cũ fade out, ảnh mới fade in — tạo cảm giác ảnh "bay vào" theo từng đoạn text.

### 3.2 Cấu trúc HTML

```html
<section class="bgsm-section" data-bgsm>

  <!-- Text layer: scroll bình thường -->
  <div class="bgsm-text-layer">
    <div class="bgsm-text-block">
      <p>Đoạn nội dung 1 — ảnh 1 hiển thị</p>
    </div>
    <div class="bgsm-text-block">
      <p>Đoạn nội dung 2 — ảnh 2 hiển thị</p>
    </div>
    <div class="bgsm-text-block">
      <p>Đoạn nội dung 3 — ảnh 3 hiển thị</p>
    </div>
  </div>

  <!-- Media layer: sticky, các ảnh chồng nhau -->
  <div class="bgsm-media-layer">
    <div class="bgsm-item" data-index="0">
      <picture>
        <source srcset="img1-large.webp" media="(min-width: 900px)">
        <img src="img1.jpg" alt="Mô tả ảnh 1" loading="lazy">
      </picture>
    </div>
    <div class="bgsm-item" data-index="1">
      <picture>
        <img src="img2.jpg" alt="Mô tả ảnh 2" loading="lazy">
      </picture>
    </div>
    <div class="bgsm-item" data-index="2">
      <picture>
        <img src="img3.jpg" alt="Mô tả ảnh 3" loading="lazy">
      </picture>
    </div>
  </div>

</section>
```

### 3.3 CSS cốt lõi

```css
/* ── Section: chiều cao tạo không gian scroll ── */
.bgsm-section {
  position: relative;
  /* Tự động: JS tính min-height = số_ảnh × 100vh */
}

/* ── Text layer: nằm trên media, z-index cao ── */
.bgsm-text-layer {
  position: relative;
  z-index: 2;
}

.bgsm-text-block {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 4rem 2rem;
  max-width: 500px;
}

/* ── Media layer: sticky, toàn màn hình ── */
.bgsm-media-layer {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
  /* Kéo lên để nằm dưới text đã render trước */
  margin-top: calc(-1 * var(--section-height, 300vh));
}

/* ── Mỗi ảnh: absolute, xếp chồng ── */
.bgsm-item {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(1.05);  /* xuất phát hơi phóng to → khi active thu về 1 = bay vào */
  transition:
    opacity   0.6s ease-out,
    transform 0.8s ease-out;
  will-change: opacity, transform;
}

.bgsm-item picture,
.bgsm-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Trạng thái active ── */
.bgsm-item.is-active {
  opacity: 1;
  transform: scale(1);
  z-index: 1;
}

/* ── Pre-load ảnh tiếp theo (invisible nhưng đã render) ── */
.bgsm-item.is-primed {
  opacity: 0;
  transform: scale(1.05);
  z-index: 0;
}

/* ── Gradient overlay: text dễ đọc trên ảnh ── */
.bgsm-text-block {
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.5) 60%,
    transparent 100%
  );
}

/* ── Reduced motion: tắt transition ── */
@media (prefers-reduced-motion: reduce) {
  .bgsm-item {
    transition: none;
    transform: scale(1);
  }
}
```

### 3.4 Thuật toán JavaScript

```js
class BackgroundScrollmation {
  constructor(section) {
    this.section   = section;
    this.items     = Array.from(section.querySelectorAll('.bgsm-item'));
    this.textLayer = section.querySelector('.bgsm-text-layer');
    this.mediaLayer= section.querySelector('.bgsm-media-layer');

    this.currentIndex = -1;

    this._init();
  }

  _init() {
    const N = this.items.length;

    // Đặt chiều cao section = N × 100vh để có đủ không gian scroll
    this.section.style.minHeight = `${N * 100}vh`;

    // Kéo media layer lên dưới text
    this.mediaLayer.style.marginTop = `calc(-${N * 100}vh)`;
    this.section.style.setProperty('--section-height', `${N * 100}vh`);

    // Ảnh đầu tiên luôn hiển thị ngay
    this._activateItem(0, true);

    // Scroll listener: passive
    window.addEventListener('scroll', () => this._onScroll(), { passive: true });

    // Dừng khi section off-screen
    const obs = new IntersectionObserver(([e]) => {
      this._active = e.isIntersecting;
    }, { rootMargin: '10% 0px' });
    obs.observe(this.section);
  }

  _onScroll() {
    if (!this._active) return;

    const rect   = this.section.getBoundingClientRect();
    const total  = rect.height - window.innerHeight;
    // pct: 0 khi section vừa vào viewport, 1 khi section vừa rời viewport
    const pct    = Math.max(0, Math.min(1, -rect.top / total));

    const N      = this.items.length;
    const index  = Math.min(N - 1, Math.floor(pct * N));

    if (index !== this.currentIndex) {
      this._activateItem(index);
    }
  }

  _activateItem(index, instant = false) {
    const prev = this.currentIndex;
    this.currentIndex = index;

    this.items.forEach((item, i) => {
      item.classList.remove('is-active', 'is-primed');

      if (i === index) {
        item.classList.add('is-active');
      } else if (i === index + 1) {
        // Pre-load ảnh kế tiếp
        item.classList.add('is-primed');
      }
    });

    // Instant (không transition) cho lần đầu
    if (instant) {
      const el = this.items[index];
      el.style.transition = 'none';
      requestAnimationFrame(() => {
        el.style.removeProperty('transition');
      });
    }
  }
}

// Khởi tạo tất cả sections
document.querySelectorAll('[data-bgsm]')
  .forEach(el => new BackgroundScrollmation(el));
```

---

## 4. Lý do hoạt động mượt mà

### 4.1 Năm yếu tố kỹ thuật

| # | Kỹ thuật | Vì sao quan trọng |
|---|---|---|
| 1 | **`position: sticky` cho media** | Trình duyệt xử lý ở compositor thread — không tốn CPU JS, không reflow layout |
| 2 | **`{ passive: true }` cho scroll listener** | Browser không đợi JS hoàn thành trước khi scroll → scroll instant, animate sau |
| 3 | **Canvas 2D thay `<img>` DOM (Pattern A)** | Pan/zoom không trigger layout/paint, chỉ rasterize lại canvas |
| 4 | **`requestAnimationFrame` loop** | Đồng bộ với vsync màn hình (16.67ms/60fps), không drop frame |
| 5 | **`will-change: opacity, transform`** | GPU layer hóa element trước → transition không cần repaint, chỉ composite |

### 4.2 Những thứ KHÔNG dùng

| Tránh | Thay bằng |
|---|---|
| `setInterval` / `setTimeout` cho animation | `requestAnimationFrame` |
| `scroll` listener không `passive` | `{ passive: true }` |
| Thay đổi `width`, `height`, `top`, `margin` khi scroll | Chỉ thay `opacity`, `transform` |
| Tạo/xóa DOM element trong scroll handler | Chuẩn bị DOM trước, chỉ toggle class |
| `getBoundingClientRect()` nhiều lần trong 1 frame | Batch read trước, write sau |

---

## 5. Tham số tinh chỉnh

### Pattern A — Scrollpoints

| Tham số | Giá trị mặc định | Ảnh hưởng |
|---|---|---|
| `LERP` (lerp factor) | `0.08` | `0.04` = mượt hơn, lag hơn · `0.15` = nhanh hơn, giật hơn |
| Zoom padding | `0.9` (90%) | Nhỏ hơn = zoom nhiều hơn vào vùng highlight |
| Ngưỡng done (`< 0.1px`) | `0.1` | Giảm nếu muốn dừng chính xác hơn |
| `data-highlight` đơn vị | `%` of ảnh | Không đổi sang pixel — sẽ mất responsive |

### Pattern B — Background Scrollmation

| Tham số | Giá trị mặc định | Ảnh hưởng |
|---|---|---|
| `transition-duration` | `0.6s` | Dài hơn = cross-fade nhẹ nhàng hơn |
| `transform: scale(1.05)` | `1.05` | Tăng lên `1.1` để hiệu ứng bay rõ hơn, `1.0` để tắt |
| `min-height` mỗi text-block | `100vh` | Giảm nếu muốn chuyển ảnh nhanh hơn khi scroll |
| `is-primed` pre-load distance | `index + 1` | Tăng lên `+ 2` nếu ảnh nặng, cần pre-load sớm hơn |

---

## 6. Checklist tích hợp

### Bắt buộc

- [ ] Media layer dùng `position: sticky; top: 0`
- [ ] Scroll listener có `{ passive: true }`
- [ ] Animation chỉ thay đổi `opacity` và/hoặc `transform` — không đụng layout property
- [ ] `will-change` đặt trước khi animate
- [ ] `prefers-reduced-motion`: tắt tween/transition, chuyển trạng thái ngay lập tức
- [ ] `IntersectionObserver`: dừng listener khi section off-screen
- [ ] Canvas resize theo `devicePixelRatio` để nét trên màn hình Retina

### Nên có

- [ ] `loading="lazy"` cho ảnh không phải ảnh đầu tiên
- [ ] `<picture>` + `srcset` để serve WebP và kích thước phù hợp
- [ ] `aria-label` cho canvas (accessibility)
- [ ] Ảnh đầu tiên: không lazy load, đặt `fetchpriority="high"`
- [ ] Fallback cho bot/crawler: `position: absolute` thay sticky (bot không scroll)

### Kiểm tra trước khi release

- [ ] Chrome DevTools → Performance tab: không có Layout/Paint trong scroll
- [ ] Lighthouse: CLS = 0 (không shift layout)
- [ ] Test trên mobile Safari (iOS) — sticky behavior khác Chrome
- [ ] Test `prefers-reduced-motion: reduce` trong hệ thống

---

*Spec này dựa trên phân tích mã nguồn `scrollpoints.676667.min.js` và `story.676667.min.js` của nền tảng Shorthand.*
