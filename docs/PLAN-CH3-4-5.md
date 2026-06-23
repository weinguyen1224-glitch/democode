# KẾ HOẠCH XÂY DỰNG CHƯƠNG 3–4–5 — BÁNH PHU THÊ

> **Ngày:** 2026-06-22 | **Nguồn tham khảo:** Múa Rối Nước (mega.vietnamplus.vn)
> **Infrastructure:** Scroll Engine + VisibilityRouter + `.bpt-reveal` pattern

---

## MỤC LỤC

1. [Tổng quan Kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Pattern từ Web Tham Khảo → Áp dụng](#2-pattern-từ-web-tham-khảo--áp-dụng)
3. [CHƯƠNG 3 — Kỹ Nghệ Tạc Hình Hạnh Phúc](#3-chương-3--kỹ-nghệ-tạc-hình-hạnh-phúc)
4. [CHƯƠNG 4 — Từ Chõng Tre Đến Tiệc Cưới](#4-chương-4--từ-chõng-tre-đến-tiệc-cưới)
5. [CHƯƠNG 5 — Lời Thề Còn Đó, Vị Ngọt Còn Đây](#5-chương-5--lời-thề-còn-đó-vị-ngọt-còn-đây)
6. [Thuật toán Tối ưu & Hiệu năng](#6-thuật-toán-tối-ưu--hiệu-năng)
7. [Ma trận Animation Timing](#7-ma-trận-animation-timing)
8. [Responsive & Reduced Motion](#8-responsive--reduced-motion)
9. [File Responsibility Map](#9-file-responsibility-map)
10. [Thứ tự Triển khai](#10-thứ-tự-triển-khai)

---

## 1. TỔNG QUAN KIẾN TRÚC

### 1.1 Infrastructure Hiện có

```
┌─────────────────────────────────────────────────────────┐
│  scroll / resize (passive)                                │
│         │                                                  │
│         ▼                                                  │
│  Scroll Engine (js/core/scroll-engine.js)                 │
│  • 1 rAF/frame • Priority scheduling • Frame budget       │
│         │                                                  │
│    ┌────┴────┐                                            │
│    │  FRAME  │  Cache: scrollY, vh, vw                     │
│    └────┬────┘                                            │
│         │                                                  │
│    ┌────┴───────────────────────────┐                     │
│    │  CRITICAL (0): progress bar     │ ← 01-scene-progress │
│    │  HIGH     (1): scrollmation     │ ← 05-scrollmation   │
│    │  NORMAL   (2): text,cinematic,  │ ← 02-scroll-reveal  │
│    │            zoom, magazine       │   07-text-panels     │
│    │  LOW      (3): parallax, decor  │   06-p2-cinematic   │
│    │  IDLE     (4): off-screen       │                     │
│    └────────────────────────────────┘                     │
│                                                             │
│  VisibilityRouter (js/core/visibility-router.js)           │
│  • IntersectionObserver manager • once/repeat modes        │
│  • threshold + rootMargin configurable                     │
│                                                             │
│  Pattern .bpt-reveal → .bpt-visible (02-scroll-reveal.js)  │
│  • Áp dụng cho mọi element cần scroll reveal               │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Luồng Nội dung 3 Chương

```
[Chương 2: section-bpt-ch2-bao-ton]  ← đã có (dòng 1264 index.html)
        │
        ▼
[Chương 3: KỸ NGHỆ TẠC HÌNH HẠNH PHÚC]
  ├── section-bpt-ch3-divider      ← Divider "III — Kỹ Nghệ Tạc Hình Hạnh Phúc"
  ├── section-bpt-ch3-intro        ← Mở đầu cinematic: "ba giờ sáng..."
  ├── section-bpt-ch3-nguyen-lieu  ← Grid cards: nếp cái hoa vàng, đỗ xanh, đường mía, đu đủ
  ├── section-bpt-ch3-vo-vang      ← Split scene: lớp vỏ đu đủ + dành dành → tơ hồng
  ├── section-bpt-ch3-nhan-banh    ← Split scene: nhân đỗ xanh, sên lửa nhỏ
  ├── section-bpt-ch3-quote        ← Quote nghệ nhân: "Kỳ công nhất của nghề..."
  ├── section-bpt-ch3-u-bot        ← Timeline: ủ bột → nặn bánh
  ├── section-bpt-ch3-hap-goi      ← Split scene: hấp + gói lá dong + lạt đỏ
  └── section-bpt-ch3-thanh-pham   ← Thành phẩm: bánh trong veo như ngọc

[Chương 4: TỪ CHÕNG TRE ĐẾN TIỆC CƯỚI SANG TRỌNG]
  ├── section-bpt-ch4-divider      ← Divider "IV — Từ Chõng Tre..."
  ├── section-bpt-ch4-ba-mien      ← Map Bắc-Trung-Nam: sợi đỏ kết nối 3 miền
  ├── section-bpt-ch4-bien-tau     ← Cards: hương vị mới, màu sắc mới
  ├── section-bpt-ch4-before-after ← Slider: truyền thống vs hiện đại
  └── section-bpt-ch4-ung-dung     ← Grid: tráp cưới, bàn thờ, quà biếu

[Chương 5: LỜI THỀ CÒN ĐÓ, VỊ NGỌT CÒN ĐÂY]
  ├── section-bpt-ch5-divider      ← Divider "V — Lời Thề Còn Đó..."
  ├── section-bpt-ch5-doi-tre      ← Couple scene: đôi trẻ + tráp cưới
  ├── section-bpt-ch5-y-nghia      ← Ý nghĩa biểu tượng: 5 tầng nghĩa
  ├── section-bpt-ch5-unwrap       ← 4-frame scroll: bánh mở dần
  ├── section-bpt-ch5-audio        ← Audio player + quote (nếu có asset)
  └── section-bpt-ch5-closing      ← CLOSING: "LỜI THỀ CÒN ĐÓ, VỊ NGỌT CÒN ĐÂY"
```

### 1.3 Palette & Typography (kế thừa toàn dự án)

| Token | Value | Vai trò |
|-------|-------|---------|
| `--color-rice-paper` | `#F7E8CB` | Nền chính 60% |
| `--color-sticky-rice-gold` | `#F8D077` | Accent vàng 20% |
| `--color-betel-leaf-green` | `#698456` | Title, quote 15% |
| `--color-red-thread` | `#972023` | Accent, sợi đỏ 5% |
| `--color-ink` | `#221A14` | Body text |
| `--color-cream-white` | `#FFF8EA` | Card surface |

**Font stack:**
- Display/Title: `Oswald`, `Josefin Sans`, `DNS Gibsons One`
- Body: `Vollkorn`, `PT Serif`, `Georgia`
- Quote: `Pacifico`, `Dancing Script`, `MJ Milestone`
- Kicker/Label: `Oswald`, `DNS Gibsons One` (condensed, uppercase)

---

## 2. PATTERN TỪ WEB THAM KHẢO → ÁP DỤNG

### 2.1 Phân tích Múa Rối Nước

Web Múa Rối Nước dùng pattern đơn giản nhưng hiệu quả:

```
HTML:  <figure class="outset-lg sc_animate_fadeInLeft">
       <p class="sc_animate_fadeIn">
       <figure class="sc_animate_zoomAndFadeInfinite">
       <section class="sc-te-color-animation">
```

**Các class animation chính:**

| Class | Mô tả | CSS dự đoán |
|-------|-------|-------------|
| `sc_animate_fadeIn` | Fade-in cơ bản | `opacity 0→1 + translateY(30px→0)` |
| `sc_animate_fadeInLeft` | Slide từ trái | `translateX(-60px→0) + opacity 0→1` |
| `sc_animate_zoomAndFadeInfinite` | Zoom nhẹ liên tục | `scale(0.92→1) + fade, sau đó scale nhẹ infinite` |
| `sc_animate_bounceIn` | Bounce-in | `scale(0→1) với overshoot` |
| `sc_animate_jackInTheBox` | Xoay + zoom vào | `rotate(10deg) + scale(0→1)` |
| `sc-te-color-animation` | Text color shift | Tiêu đề đổi màu theo scroll |

**Cơ chế trigger:** jQuery `$.fn.visible()` kiểm tra element trong viewport → thêm class active → CSS transition chạy.

**Bố cục đặc trưng:**
- `<figure class="outset-both">`: Ảnh full-width, tràn lề
- `<figure class="outset-lg">`: Ảnh lớn, tràn nhẹ
- `<figure class="outset-xl">`: Ảnh rất lớn
- `<section>`: Text block với font tuỳ chỉnh (`Sansita Swashed`)
- `<p class="align-center">`: Text căn giữa cho quote/ca dao

### 2.2 Ánh xạ sang Infrastructure BPT

| Múa Rối Nước | Bánh Phu Thê | Ghi chú |
|-------------|-------------|---------|
| `sc_animate_fadeIn` | `.bpt-reveal` → `.bpt-visible` | Fade-up cơ bản |
| `sc_animate_fadeInLeft` | `.bpt-reveal--from-left` | Slide từ trái |
| `sc_animate_zoomAndFadeInfinite` | `.bpt-reveal--zoom` | Scale reveal + ambient float |
| `sc_animate_bounceIn` | `.bpt-reveal--bounce` | Spring reveal cho quote/artisan |
| `sc_animate_jackInTheBox` | `.bpt-reveal--spin` | Rotate reveal cho icon/emoji |
| `outset-both` figure | `.bpt-media--fullbleed` | Ảnh full-width |
| `outset-lg` figure | `.bpt-media--wide` | Ảnh rộng |
| `outset-xl` figure | `.bpt-media--hero` | Ảnh hero |
| Section với font custom | `.bpt-scene` + font trên `.bpt-prose` | Scene container |
| jQuery `$.fn.visible()` | `IntersectionObserver` + `VisibilityRouter` | Hiện đại hơn, không jQuery |

### 2.3 CSS Keyframes Mới (từ tham khảo)

```css
/* Fade + slide từ trái */
@keyframes bpt-fadeInLeft {
  from { opacity: 0; transform: translateX(-60px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Fade + slide từ phải */
@keyframes bpt-fadeInRight {
  from { opacity: 0; transform: translateX(60px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Zoom + fade (dùng cho ảnh hero/infographic) */
@keyframes bpt-zoomFade {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}

/* Bounce-in (cho quote icon/artisan portrait) */
@keyframes bpt-bounceIn {
  0%   { opacity: 0; transform: scale(0.3); }
  50%  { opacity: 1; transform: scale(1.08); }
  70%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}

/* Spin + fade (cho emoji/hành icon) */
@keyframes bpt-spinFade {
  from { opacity: 0; transform: rotate(12deg) scale(0.8); }
  to   { opacity: 1; transform: rotate(0deg) scale(1); }
}
```

---

## 3. CHƯƠNG 3 — KỸ NGHỆ TẠC HÌNH HẠNH PHÚC

> **Trạng thái CSS:** Đã có `css/chapters/ch3-knghenghe.css` (546 dòng)
> **Cần:** HTML structure + JS (nếu có interaction) + hoàn thiện animation timing

### 3.1 Scene Map

| # | Section ID | Layout Pattern | Animation | Nội dung |
|---|-----------|---------------|-----------|----------|
| 1 | `section-bpt-ch3-divider` | Chapter divider | scale-up + red thread | "III / Kỹ Nghệ Tạc Hình Hạnh Phúc" |
| 2 | `section-bpt-ch3-intro` | Dark cinematic intro (đã CSS) | Kicker→body stagger | "ba giờ sáng... người thợ Đình Bảng..." |
| 3 | `section-bpt-ch3-nguyen-lieu` | Grid cards (đã CSS) | Stagger cards fade-up | 4-5 nguyên liệu chính |
| 4 | `section-bpt-ch3-vo-vang` | Split scene img+text | Slide L→R image, R→L text | Đu đủ xanh + dành dành → tơ hồng |
| 5 | `section-bpt-ch3-nhan-banh` | Split scene reverse | Slide R→L image, L→R text | Đỗ xanh + sên lửa nhỏ + kiên nhẫn |
| 6 | `section-bpt-ch3-quote` | Dark cinematic quote (đã CSS) | Quote mark → text → attr | "Kỳ công nhất của nghề..." — Nguyễn Đăng Mạnh |
| 7 | `section-bpt-ch3-u-bot` | Timeline steps (đã CSS) | Alt L/R steps, stagger | Ủ bột → nặn bánh |
| 8 | `section-bpt-ch3-hap-goi` | Split scene | Fade + directional slide | Hấp + gói lá dong + lạt đỏ |
| 9 | `section-bpt-ch3-thanh-pham` | Center focus | Zoom reveal + transition | Thành phẩm: "trong veo như ngọc" |

### 3.2 Animation Timing — Chương 3

**Easing chính:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out mượt, không bounce)

| Scene | Element | From | To | Duration | Delay | Easing |
|-------|---------|------|----|----------|-------|--------|
| Divider | `.bpt-chapter-divider` | `scale(0.9) opacity(0)` | `scale(1) opacity(1)` | 0.6s | 0 | `cubic-bezier(0.22,1,0.36,1)` |
| Divider | Red line `::after` | `scaleX(0)` | `scaleX(1)` | 0.7s | 0.15s | `cubic-bezier(0.22,1,0.36,1)` |
| Intro | `.bpt-kicker` | `translateY(24px) opacity(0)` | `translateY(0) opacity(1)` | 0.8s | 0 | ease |
| Intro | `.bpt-prose` | `translateY(40px) opacity(0)` | `translateY(0) opacity(1)` | 1s | 0.2s | `cubic-bezier(0.22,1,0.36,1)` |
| Nguyên liệu | Cards (nth 1→5) | `translateY(24px) opacity(0)` | `translateY(0) opacity(1)` | 0.7s | 0.1→0.5s stagger | `cubic-bezier(0.22,1,0.36,1)` |
| Vỏ vàng | Image (left) | `translateX(-40px) opacity(0)` | `translateX(0) opacity(1)` | 0.6s | 0 | `cubic-bezier(0.22,1,0.36,1)` |
| Vỏ vàng | Text (right) | `translateX(40px) opacity(0)` | `translateX(0) opacity(1)` | 0.6s | 0.1s | `cubic-bezier(0.22,1,0.36,1)` |
| Nhân bánh | Image (right) | `translateX(40px) opacity(0)` | `translateX(0) opacity(1)` | 0.6s | 0 | `cubic-bezier(0.22,1,0.36,1)` |
| Nhân bánh | Text (left) | `translateX(-40px) opacity(0)` | `translateX(0) opacity(1)` | 0.6s | 0.1s | `cubic-bezier(0.22,1,0.36,1)` |
| Quote | `__mark` («) | `translateY(30px) scale(0.5) opacity(0)` | `translateY(0) scale(1) opacity(0.3)` | 0.8s | 0 | `cubic-bezier(0.34,1.56,0.64,1)` |
| Quote | `__text` | `translateY(40px) opacity(0)` | `Y(0) opacity(1)` | 1s | 0.3s | `cubic-bezier(0.22,1,0.36,1)` |
| Quote | `__attr` | `translateY(20px) opacity(0)` | `Y(0) opacity(1)` | 0.8s | 0.6s | ease |
| Timeline | Step visual (odd) | `translateX(-40px) opacity(0)` | `X(0) opacity(1)` | 0.9s | per-step | `cubic-bezier(0.22,1,0.36,1)` |
| Timeline | Step visual (even) | `translateX(40px) opacity(0)` | `X(0) opacity(1)` | 0.9s | per-step | `cubic-bezier(0.22,1,0.36,1)` |
| Timeline | Step text | `translateY(30px) opacity(0)` | `Y(0) opacity(1)` | 0.9s | 0.15s | `cubic-bezier(0.22,1,0.36,1)` |
| Timeline | Step dot `::before` | `opacity(0)` | `opacity(1)` | 0.6s | 0.3s | ease |
| Hấp gói | Split img | `translateX(-40px) opacity(0)` | `X(0) opacity(1)` | 0.6s | 0 | `cubic-bezier(0.22,1,0.36,1)` |
| Hấp gói | Split text | `translateX(40px) opacity(0)` | `X(0) opacity(1)` | 0.6s | 0.1s | `cubic-bezier(0.22,1,0.36,1)` |
| Thành phẩm | Center image | `scale(0.85) opacity(0)` | `scale(1) opacity(1)` | 1s | 0 | `cubic-bezier(0.22,1,0.36,1)` |
| Thành phẩm | Text below | `translateY(30px) opacity(0)` | `Y(0) opacity(1)` | 0.8s | 0.2s | `cubic-bezier(0.22,1,0.36,1)` |

### 3.3 HTML Structure (template)

```html
<!-- Divider Chương III -->
<div id="section-bpt-ch3-divider" class="Theme-Section bpt-chapter-divider bpt-ch3">
  <div class="bpt-divider-red-line" aria-hidden="true"></div>
  <span class="bpt-divider-num" aria-hidden="true">III</span>
  <h2 class="bpt-divider-title">Kỹ Nghệ Tạc Hình Hạnh Phúc</h2>
</div>

<!-- Intro Cinematic -->
<div id="section-bpt-ch3-intro" class="Theme-Section bpt-scene bpt-ch3-intro bpt-ch3 bpt-reveal">
  <div class="bpt-ch3-intro__content">
    <h3 class="bpt-kicker">Từ ba giờ sáng</h3>
    <div class="bpt-prose">
      <p>Để tạo nên một thức quà trong veo như ngọc, dẻo dai như tình...</p>
    </div>
  </div>
</div>

<!-- Nguyên liệu Grid -->
<div id="section-bpt-ch3-nguyen-lieu" class="Theme-Section bpt-scene bpt-ch3-ingredients bpt-ch3">
  <div class="bpt-ch3-ingredients__grid">
    <div class="bpt-ch3-ingredient-card bpt-reveal">
      <div class="bpt-ch3-ingredient-card__icon">🌾</div>
      <h4 class="bpt-ch3-ingredient-card__name">Nếp cái hoa vàng</h4>
      <p class="bpt-ch3-ingredient-card__desc">...</p>
    </div>
    <!-- ... 4 cards nữa -->
  </div>
</div>

<!-- Vỏ vàng — Split Scene -->
<div id="section-bpt-ch3-vo-vang" class="Theme-Section bpt-scene bpt-split-scene bpt-ch3 bpt-reveal">
  <div class="bpt-split-scene__visual bpt-reveal--from-left">
    <!-- ảnh đu đủ xanh + dành dành -->
  </div>
  <div class="bpt-split-scene__text bpt-reveal--from-right">
    <!-- text về vỏ vàng trong, tơ hồng -->
  </div>
</div>

<!-- Quote Nghệ nhân -->
<div id="section-bpt-ch3-quote" class="Theme-Section bpt-scene bpt-ch3-quote bpt-ch3 bpt-reveal">
  <div class="bpt-ch3-quote__bg"></div>
  <div class="bpt-ch3-quote__content">
    <div class="bpt-ch3-quote__mark" aria-hidden="true">«</div>
    <blockquote class="bpt-ch3-quote__text">
      <p>Kỳ công nhất của nghề là khâu ủ và nặn bột...</p>
    </blockquote>
    <div class="bpt-ch3-quote__attr">
      <cite class="bpt-ch3-quote__attr-name">Nguyễn Đăng Mạnh</cite>
      <span class="bpt-ch3-quote__attr-detail">Nghệ nhân bánh phu thê · Đình Bảng</span>
    </div>
  </div>
</div>

<!-- Timeline steps -->
<div id="section-bpt-ch3-u-bot" class="Theme-Section bpt-scene bpt-ch3-timeline bpt-ch3">
  <div class="bpt-ch3-step bpt-reveal">
    <div class="bpt-ch3-step__visual"><!-- ảnh ủ bột --></div>
    <div class="bpt-ch3-step__text">
      <span class="bpt-ch3-step__num">01</span>
      <h4 class="bpt-ch3-step__title">Ủ bột</h4>
      <p class="bpt-ch3-step__desc">...</p>
    </div>
  </div>
  <div class="bpt-ch3-step bpt-reveal">
    <!-- step 2: Nặn bánh -->
  </div>
</div>

<!-- Hấp & Gói — Split Scene reverse -->
<div id="section-bpt-ch3-hap-goi" class="Theme-Section bpt-scene bpt-split-scene bpt-split-scene--reverse bpt-ch3 bpt-reveal">
  <div class="bpt-split-scene__text bpt-reveal--from-left">
    <!-- text hấp bánh + gói lá -->
  </div>
  <div class="bpt-split-scene__visual bpt-reveal--from-right">
    <!-- ảnh bánh hấp / gói lá dong -->
  </div>
</div>

<!-- Thành phẩm — Center Focus -->
<div id="section-bpt-ch3-thanh-pham" class="Theme-Section bpt-scene bpt-ch3-preservation bpt-ch3 bpt-reveal">
  <div class="bpt-ch3-preservation__content">
    <h3 class="bpt-kicker">Thành phẩm</h3>
    <!-- ảnh bánh center -->
    <div class="bpt-prose">
      <p>...trong veo như ngọc, dẻo dai như tình...</p>
    </div>
  </div>
  <span class="bpt-scene-transition" aria-hidden="true"></span>
</div>
```

### 3.4 CSS Bổ sung (chưa có trong ch3-knghenghe.css)

Cần thêm:
- `.bpt-reveal--from-left` và `--from-right`: directional slide reveal
- `.bpt-reveal--zoom`: scale reveal cho thành phẩm
- `.bpt-reveal--bounce`: bounce-in cho quote mark
- `.bpt-split-scene` mặc định trong ch3 (đã có ở ch1 nhưng cần đảm bảo kế thừa)
- Dark bg accent adjustments cho phù hợp với palette chính

**Lưu ý:** `ch3-knghenghe.css` đã dùng `--ch3-bg: var(--color-rice-paper, #8B1A1A)` — màu fallback `#8B1A1A` là đỏ đậm, có thể không khớp. Nên đổi fallback thành `#1A1209` (dark warm) cho đồng bộ với intro dark cinematic.

---

## 4. CHƯƠNG 4 — TỪ CHÕNG TRE ĐẾN TIỆC CƯỚI

### 4.1 Scene Map

| # | Section ID | Layout Pattern | Animation | Nội dung |
|---|-----------|---------------|-----------|----------|
| 1 | `section-bpt-ch4-divider` | Chapter divider | scale-up | "IV / Từ chiếc chõng tre đến tiệc cưới sang trọng" |
| 2 | `section-bpt-ch4-ba-mien` | Map/Path layout | Path draw + node reveal | Bắc-Trung-Nam: tên gọi khác nhau, sợi đỏ kết nối |
| 3 | `section-bpt-ch4-bien-tau` | Grid cards (3-4 cards) | Stagger cards | Hương vị mới: sầu riêng, trà xanh, khoai môn... |
| 4 | `section-bpt-ch4-before-after` | Before/After Slider | Drag/click | Truyền thống ↔ Hiện đại, packaging cũ ↔ mới |
| 5 | `section-bpt-ch4-ung-dung` | Grid/horizontal scroll | Fade-in cards | Tráp cưới, bàn thờ, quà biếu, lễ Tết |

### 4.2 Scene 2 — Ba Miền (Map Path)

**Ý tưởng:** Sợi chỉ đỏ `#972023` chạy dọc theo hình đất nước (stylized), 3 node tại Bắc (Đình Bảng), Trung (Huế?), Nam (Sài Gòn?). Mỗi node hiển thị tên gọi địa phương.

**Layout Desktop:**
```
┌──────────────────────────────────────────┐
│  [BẮC] ────╮                              │
│  Bánh phu   │  sợi đỏ uốn lượn            │
│  thê        │                              │
│             ├──── [TRUNG]                  │
│             │      Xu xê / Xu xuê          │
│             │                              │
│             ╰──── [NAM]                    │
│                    Xu xê                   │
│                                            │
│  Quote: "Dù tên gọi có khác nhau..."       │
└──────────────────────────────────────────┘
```

**Animation:** Sợi đỏ vẽ dần (`stroke-dasharray` + `stroke-dashoffset`), các node bounce-in tuần tự.

**Implementation:** SVG path với `stroke-dasharray`, trigger bằng IntersectionObserver.

```html
<div id="section-bpt-ch4-ba-mien" class="Theme-Section bpt-scene bpt-ch4-map bpt-reveal">
  <svg class="bpt-ch4-map__path" viewBox="0 0 400 600" aria-hidden="true">
    <path d="M200,50 C180,150 160,250 180,350 C200,450 220,500 200,550"
          fill="none" stroke="#972023" stroke-width="3"
          stroke-linecap="round"
          class="bpt-ch4-map__line" />
    <!-- 3 node circles -->
    <circle cx="200" cy="50" r="12" class="bpt-ch4-map__node" data-region="bac" />
    <circle cx="180" cy="350" r="12" class="bpt-ch4-map__node" data-region="trung" />
    <circle cx="200" cy="550" r="12" class="bpt-ch4-map__node" data-region="nam" />
  </svg>
  <div class="bpt-ch4-map__labels">
    <!-- Label cards hiện theo node active -->
  </div>
</div>
```

**CSS:**
```css
.bpt-ch4-map__line {
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  transition: stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1);
}
.bpt-ch4-map.bpt-visible .bpt-ch4-map__line {
  stroke-dashoffset: 0;
}
.bpt-ch4-map__node {
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bpt-ch4-map.bpt-visible .bpt-ch4-map__node:nth-child(1) { transition-delay: 0.2s; opacity: 1; transform: scale(1); }
.bpt-ch4-map.bpt-visible .bpt-ch4-map__node:nth-child(2) { transition-delay: 0.8s; opacity: 1; transform: scale(1); }
.bpt-ch4-map.bpt-visible .bpt-ch4-map__node:nth-child(3) { transition-delay: 1.4s; opacity: 1; transform: scale(1); }
```

### 4.3 Scene 4 — Before/After Slider

**Pattern từ UI-SPEC §9.3:** Desktop drag handle, mobile tab toggle.

```
Desktop:
┌──────────────────────────────────────────┐
│  THỜI XƯA          │          HIỆN ĐẠI   │
│  [Ảnh bánh truyền   │  [Ảnh bánh hiện    │
│   thống chợ quê]    │   đại/tráp cưới]   │
│                     ▐← handle kéo         │
└──────────────────────────────────────────┘

Mobile:
┌────────────────────────┐
│ [THỜI XƯA] [HIỆN ĐẠI]  │ ← Tabs
│                        │
│  [Ảnh tương ứng]       │
│                        │
└────────────────────────┘
```

**Implementation Desktop:**
- Container `overflow: hidden`, hai ảnh absolute overlap
- Ảnh "hiện đại" (phải) dùng `clip-path: inset(0 0 0 50%)` mặc định
- Handle: `position: absolute`, kéo ngang → cập nhật `clip-path`
- Sợi đỏ là handle

**JS logic:**
```javascript
// Mouse/touch drag
let dragging = false;
handle.addEventListener('mousedown', () => dragging = true);
document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const rect = container.getBoundingClientRect();
  const pct = Math.max(20, Math.min(80, ((e.clientX - rect.left) / rect.width) * 100));
  afterImg.style.clipPath = `inset(0 0 0 ${pct}%)`;
  handle.style.left = `${pct}%`;
});
document.addEventListener('mouseup', () => dragging = false);
```

**Mobile tabs:**
```html
<div class="bpt-ba-tabs">
  <button class="bpt-ba-tab is-active" data-side="left">Thời xưa</button>
  <button class="bpt-ba-tab" data-side="right">Hiện đại</button>
</div>
```

### 4.4 Animation Timing — Chương 4

| Scene | Element | From | To | Duration | Delay | Easing |
|-------|---------|------|----|----------|-------|--------|
| Divider | `.bpt-chapter-divider` | `scale(0.9) opacity(0)` | `scale(1) opacity(1)` | 0.6s | 0 | `cubic-bezier(0.22,1,0.36,1)` |
| Ba miền | Map line | `stroke-dashoffset: full` | `stroke-dashoffset: 0` | 2s | 0 | `cubic-bezier(0.22,1,0.36,1)` |
| Ba miền | Nodes (Bắc→Trung→Nam) | `scale(0) opacity(0)` | `scale(1) opacity(1)` | 0.5s | 0.2/0.8/1.4s | `cubic-bezier(0.34,1.56,0.64,1)` |
| Ba miền | Label cards | `translateY(20px) opacity(0)` | `Y(0) opacity(1)` | 0.6s | same as node | `cubic-bezier(0.22,1,0.36,1)` |
| Biến tấu | Cards (nth 1→4) | `translateY(24px) opacity(0)` | `Y(0) opacity(1)` | 0.7s | 0.1→0.4s stagger | `cubic-bezier(0.22,1,0.36,1)` |
| Before/After | Container | `opacity(0)` | `opacity(1)` | 0.6s | 0 | ease |
| Ứng dụng | Cards grid | `translateY(20px) opacity(0)` | `Y(0) opacity(1)` | 0.6s | stagger 0.1s | `cubic-bezier(0.22,1,0.36,1)` |

---

## 5. CHƯƠNG 5 — LỜI THỀ CÒN ĐÓ, VỊ NGỌT CÒN ĐÂY

### 5.1 Scene Map

| # | Section ID | Layout Pattern | Animation | Nội dung |
|---|-----------|---------------|-----------|----------|
| 1 | `section-bpt-ch5-divider` | Chapter divider | scale-up + red thread | "V / Lời Thề Còn Đó, Vị Ngọt Còn Đây" |
| 2 | `section-bpt-ch5-doi-tre` | Hero couple | Parallax nhẹ + fade | Đôi trẻ + tráp cưới + bánh phu thê |
| 3 | `section-bpt-ch5-y-nghia` | 5-layer reveal | Sequential reveal | 5 tầng ý nghĩa biểu tượng |
| 4 | `section-bpt-ch5-unwrap` | 4-frame scroll | Scroll-driven frame swap | Bánh từ nguyên lá → mở hoàn toàn |
| 5 | `section-bpt-ch5-audio` | Audio player (nếu có asset) | Play/pause + waveform | Podcast/nhạc quan họ + trích dẫn |
| 6 | `section-bpt-ch5-closing` | Finale poster | Grand reveal | "LỜI THỀ CÒN ĐÓ, VỊ NGỌT CÒN ĐÂY" |

### 5.2 Scene 4 — 4-Frame Scroll Unwrap

**Pattern từ UI-SPEC §9.4 & FE-GUIDE §4.4:**

```
Scroll position trong section (0% → 100%):
 0–25%   → Frame 1: Bánh nguyên lá dong
25–50%   → Frame 2: Mở 30% — lộ lớp vỏ vàng
50–75%   → Frame 3: Mở 60% — thấy nhân đỗ xanh
75–100%  → Frame 4: Mở hoàn toàn — bánh lộ rõ
```

**Implementation:**
```html
<div id="section-bpt-ch5-unwrap" class="Theme-Section bpt-scene bpt-ch5-unwrap"
     data-scroll-frames="true">
  <div class="bpt-ch5-unwrap__stage">
    <img class="bpt-ch5-unwrap__frame is-active" src="frame-1.png" alt="Bánh phu thê nguyên lá" />
    <img class="bpt-ch5-unwrap__frame" src="frame-2.png" alt="Bánh phu thê mở 30%" />
    <img class="bpt-ch5-unwrap__frame" src="frame-3.png" alt="Bánh phu thê mở 60%" />
    <img class="bpt-ch5-unwrap__frame" src="frame-4.png" alt="Bánh phu thê mở hoàn toàn" />
  </div>
  <div class="bpt-ch5-unwrap__text">
    <!-- Text tổng kết hiện dần cùng frame 3-4 -->
  </div>
</div>
```

**CSS:**
```css
.bpt-ch5-unwrap__frame {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  object-fit: contain;
}
.bpt-ch5-unwrap__frame.is-active {
  opacity: 1;
}
```

**JS:** Dùng Scroll Engine (priority NORMAL), tính scroll ratio trong section:
```javascript
// Đăng ký với Scroll Engine
const section = document.getElementById('section-bpt-ch5-unwrap');
const frames = section.querySelectorAll('.bpt-ch5-unwrap__frame');
const N = frames.length;

function updateFrames(scrollY, vh) {
  const rect = section.getBoundingClientRect();
  const sectionTop = rect.top + scrollY;
  const sectionHeight = rect.height;
  const viewCenter = scrollY + vh * 0.5;
  const ratio = Math.max(0, Math.min(1,
    (viewCenter - sectionTop) / (sectionHeight - vh)
  ));
  const idx = Math.min(N - 1, Math.floor(ratio * N));
  frames.forEach((f, i) => f.classList.toggle('is-active', i === idx));
}
```

### 5.3 Scene 3 — 5 Tầng Ý Nghĩa (Sequential Reveal)

Layout: 5 cards/layers xếp từ dưới lên, mỗi layer hiện khi scroll.

```
┌─────────────────────────────────────┐
│  5. Lời thề — sợi lạt đỏ buộc chặt  │ ← hiện cuối
│  4. Hạnh phúc — màu vàng sung túc   │
│  3. Gắn kết — nhân trong vỏ         │
│  2. Tình nghĩa — cặp bánh đi đôi    │
│  1. Thủy chung — vị ngọt bùi        │ ← hiện đầu
└─────────────────────────────────────┘
```

Animation: Mỗi layer `translateY(20px) opacity(0)` → `translateY(0) opacity(1)`, stagger 0.2s.

### 5.4 Scene 6 — Closing (Finale Poster)

**Pattern từ web tham khảo:** Dùng figure outset-xl + text lớn center.

```html
<div id="section-bpt-ch5-closing" class="Theme-Section bpt-scene bpt-closing bpt-reveal">
  <div class="bpt-closing__bg"></div>
  <div class="bpt-closing__content">
    <div class="bpt-closing__red-thread" aria-hidden="true"></div>
    <h2 class="bpt-closing__title">LỜI THỀ CÒN ĐÓ</h2>
    <p class="bpt-closing__sub">VỊ NGỌT CÒN ĐÂY</p>
    <div class="bpt-closing__ornament" aria-hidden="true">✧</div>
    <blockquote class="bpt-ca-dao">
      "Bao nhiêu sóng, bấy nhiêu bánh rầu..."
    </blockquote>
  </div>
</div>
```

Animation: Title từ trên xuống, subtitle từ dưới lên, red thread scaleX từ center, ornament spin-fade. Tất cả stagger 0.2s.

### 5.5 Animation Timing — Chương 5

| Scene | Element | From | To | Duration | Delay | Easing |
|-------|---------|------|----|----------|-------|--------|
| Divider | `.bpt-chapter-divider` | `scale(0.9) opacity(0)` | `scale(1) opacity(1)` | 0.6s | 0 | `cubic-bezier(0.22,1,0.36,1)` |
| Đôi trẻ | Background | `scale(1.05) opacity(0)` | `scale(1) opacity(1)` | 1.5s | 0 | ease |
| Đôi trẻ | Text | `translateY(30px) opacity(0)` | `Y(0) opacity(1)` | 0.8s | 0.3s | `cubic-bezier(0.22,1,0.36,1)` |
| 5 tầng | Layers (1→5) | `translateY(20px) opacity(0)` | `Y(0) opacity(1)` | 0.6s | 0.1→0.5s stagger | `cubic-bezier(0.22,1,0.36,1)` |
| Unwrap | Frame swap | `opacity 0→1` | — | 0.4s | continuous | ease |
| Unwrap | Text reveal | `translateY(30px) opacity(0)` | `Y(0) opacity(1)` | 0.8s | frame 3 trigger | `cubic-bezier(0.22,1,0.36,1)` |
| Closing | Title | `translateY(-40px) opacity(0)` | `Y(0) opacity(1)` | 0.9s | 0 | `cubic-bezier(0.22,1,0.36,1)` |
| Closing | Subtitle | `translateY(40px) opacity(0)` | `Y(0) opacity(1)` | 0.9s | 0.2s | `cubic-bezier(0.22,1,0.36,1)` |
| Closing | Red thread | `scaleX(0)` | `scaleX(1)` | 0.8s | 0.4s | `cubic-bezier(0.22,1,0.36,1)` |
| Closing | Ornament | `rotate(45deg) scale(0) opacity(0)` | `rotate(0) scale(1) opacity(1)` | 0.7s | 0.6s | `cubic-bezier(0.34,1.56,0.64,1)` |
| Closing | Quote | `translateY(20px) opacity(0)` | `Y(0) opacity(1)` | 0.8s | 0.8s | `cubic-bezier(0.22,1,0.36,1)` |

---

## 6. THUẬT TOÁN TỐI ƯU & HIỆU NĂNG

### 6.1 Nguyên tắc cốt lõi

1. **CSS-first:** Mọi animation dùng CSS `transition` + `transform` + `opacity`. JS chỉ thay đổi class.
2. **GPU-composite-only:** Chỉ animate `transform` và `opacity` — không animate `width`, `height`, `top`, `left`, `margin`, `padding`.
3. **`will-change` chiến lược:** Thêm `will-change: transform, opacity` khi element sắp vào viewport, gỡ bỏ khi đã ngoài viewport. Scroll Engine đã có `promoteLayer()`/`demoteLayer()`.
4. **IntersectionObserver:** Không chạy animation cho element ngoài màn hình.
5. **Frame budget:** Scroll Engine tự bỏ qua LOW priority khi >12ms, NORMAL khi >14ms.

### 6.2 Scroll Engine Integration

Cho các scene cần scroll-driven animation (ch5 unwrap, ch4 path draw):

```javascript
// Đăng ký module với Scroll Engine — NORMAL priority
if (typeof BPT !== 'undefined' && BPT.ScrollEngine) {
  BPT.ScrollEngine.register('ch5-unwrap', {
    priority: BPT.ScrollEngine.PRIORITY.NORMAL,
    root: document.getElementById('section-bpt-ch5-unwrap'),
    update(scrollY, vh, ctx) {
      const rect = this.root.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return; // off-screen
      const ratio = clamp(0, 1, (scrollY + vh * 0.5 - (rect.top + scrollY)) / (rect.height - vh));
      this.setFrame(ratio);
    }
  });
}
```

### 6.3 Progressive Enhancement cho Mobile

- **Ch4 Before/After:** Desktop = drag slider, Mobile = tab toggle
- **Ch4 Map Path:** Desktop = SVG path draw, Mobile = stacked column
- **Ch3 Timeline:** Desktop = alternating L/R, Mobile = all-left vertical
- **Tất cả grid cards:** `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))`

### 6.4 Performance Targets

| Metric | Desktop | Mobile |
|--------|---------|--------|
| Frame time | ≤16ms | ≤33ms |
| Layout thrashing | 0 (all reads before writes) | 0 |
| Scroll listeners | 1 (engine) | 1 |
| IntersectionObservers | ≤5 per page | ≤5 per page |
| GPU layers | ≤10 promoted at once | ≤5 |

---

## 7. MA TRẬN ANIMATION TIMING

### 7.1 Easing Functions

| Tên | Cubic Bezier | Dùng cho |
|-----|-------------|----------|
| `ease-smooth` | `cubic-bezier(0.22, 1, 0.36, 1)` | Mặc định — fade/slide mượt |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bounce reveal (quote mark, node) |
| `ease-snap` | `cubic-bezier(0.86, 0.01, 1, 1)` | Quick transitions (ch1 pattern) |

### 7.2 Global Timing Constants

```css
:root {
  --bpt-duration-fast: 0.4s;
  --bpt-duration-normal: 0.6s;
  --bpt-duration-slow: 0.9s;
  --bpt-duration-ceremonial: 1.5s;   /* cho hero/closing */
  --bpt-stagger-micro: 0.08s;        /* text lines */
  --bpt-stagger-small: 0.15s;        /* card grid */
  --bpt-stagger-medium: 0.2s;        /* sequential layers */
  --bpt-stagger-large: 0.3s;         /* scene sections */
  --bpt-easing-smooth: cubic-bezier(0.22, 1, 0.36, 1);
  --bpt-easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 8. RESPONSIVE & REDUCED MOTION

### 8.1 Breakpoints

| Breakpoint | Behavior |
|-----------|----------|
| `> 768px` | Desktop: split scene 50/50, timeline alternating, map SVG, drag slider |
| `≤ 768px` | Tablet: split scene stacks, timeline all-left, map stacked, tab toggle |
| `≤ 420px` | Phone: reduced font, single column, smaller cards, no hover effects |

### 8.2 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .bpt-scene-transition,
  .bpt-ch3-quote::before,  /* grain */
  .bpt-ch3-quote::after,   /* vignette */
  .bpt-ch4-map__line {     /* SVG path animation */
    display: none;
  }
  
  /* Show all frames/content immediately */
  .bpt-ch5-unwrap__frame { opacity: 1; position: static; }
  .bpt-ch5-unwrap__frame + .bpt-ch5-unwrap__frame { display: none; }
}
```

---

## 9. FILE RESPONSIBILITY MAP

| File | Responsibility | Trạng thái |
|------|---------------|-----------|
| `index.html` | HTML structure cho toàn bộ ch3/ch4/ch5 | **CẦN TẠO MỚI** (sau `</div><!-- /#section-bpt-ch2-bao-ton -->`) |
| `css/chapters/ch3-knghenghe.css` | CSS chương 3 (đã có 546 dòng) | **CÓ SẴN** — cần audit + bổ sung |
| `css/chapters/ch4-bien-doi.css` | CSS chương 4 | **CẦN TẠO MỚI** |
| `css/chapters/ch5-loi-the.css` | CSS chương 5 | **CẦN TẠO MỚI** |
| `css/custom/ch3-4-common.css` | CSS chung cho directional reveal | **CẦN TẠO MỚI** |
| `js/chapters/ch4-before-after.js` | Before/After slider JS | **CẦN TẠO MỚI** |
| `js/chapters/ch5-unwrap.js` | 4-frame scroll unwrap JS | **CẦN TẠO MỚI** |
| `js/chapters/ch5-audio.js` | Audio player JS (nếu có asset) | **OPTIONAL** |
| `docs/PLAN-CH3-4-5.md` | File kế hoạch này | **HIỆN TẠI** |

**Protected files (KHÔNG SỬA):**
- `css/style-00.css` → `css/style-04.css`
- `js/inline-00.js` → `js/inline-03.js`
- `js/story.667703.min.js`, `js/footer.667703.min.js`
- `js/custom.js.bak`, `js/custom.js.bak2`

---

## 10. THỨ TỰ TRIỂN KHAI

### Phase 1: Nền tảng chung (1 session)
| # | Task | File | Priority |
|---|------|------|----------|
| 1 | Tạo CSS directional reveals (`.bpt-reveal--from-left`, `--from-right`, `--zoom`, `--bounce`) | `css/custom/ch3-4-common.css` | P0 |
| 2 | Link CSS mới vào `index.html` `<head>` | `index.html` | P0 |

### Phase 2: Chương 3 (2 sessions)
| # | Task | File | Priority |
|---|------|------|----------|
| 3 | Audit `ch3-knghenghe.css` — sửa fallback color, đồng bộ timing | `css/chapters/ch3-knghenghe.css` | P0 |
| 4 | Thêm HTML structure 9 scene chương 3 | `index.html` | P0 |
| 5 | Kiểm tra animation `.bpt-reveal` trên tất cả scene ch3 | — | P1 |
| 6 | Responsive test ch3 (375/768/1440) | — | P1 |

### Phase 3: Chương 4 (2 sessions)
| # | Task | File | Priority |
|---|------|------|----------|
| 7 | Tạo `ch4-bien-doi.css` — map path, grid cards, slider, tabs | `css/chapters/ch4-bien-doi.css` | P0 |
| 8 | Tạo `ch4-before-after.js` — drag slider + mobile tabs | `js/chapters/ch4-before-after.js` | P0 |
| 9 | Thêm HTML structure chương 4 | `index.html` | P0 |
| 10 | Responsive test ch4 | — | P1 |

### Phase 4: Chương 5 (2 sessions)
| # | Task | File | Priority |
|---|------|------|----------|
| 11 | Tạo `ch5-loi-the.css` — couple, layers, unwrap, closing | `css/chapters/ch5-loi-the.css` | P0 |
| 12 | Tạo `ch5-unwrap.js` — scroll-driven frame swap | `js/chapters/ch5-unwrap.js` | P0 |
| 13 | Thêm HTML structure chương 5 | `index.html` | P0 |
| 14 | Responsive test ch5 | — | P1 |

### Phase 5: Polish (1 session)
| # | Task | File | Priority |
|---|------|------|----------|
| 15 | Reduced-motion test toàn bộ 3 chương | — | P1 |
| 16 | Alt text tiếng Việt cho mọi ảnh placeholder | `index.html` | P1 |
| 17 | Console error check + performance audit | — | P1 |
| 18 | Cập nhật docs (FE-GUIDE, UI-REVIEW) | `docs/` | P2 |

---

## PHỤ LỤC A: NỘI DUNG VĂN BẢN CHƯƠNG 3–4–5

> Trích từ `docs/TTHT END TERM.txt` và `docs/Bánh Phu thê A.txt`

### Chương 3 — Kỹ nghệ tạc hình hạnh phúc

- **Mở đầu:** "Để tạo nên một thức quà trong veo như ngọc, dẻo dai như tình, người thợ Đình Bảng phải trải qua quy trình chế biến công phu từ lúc trời còn chưa sáng..."
- **Chọn nguyên liệu:** nếp cái hoa vàng, đỗ xanh bở thơm, đường mía, đu đủ xanh già vừa phải
- **Vỏ vàng:** đu đủ xanh nạo sợi + bột nếp + nước cốt dành dành → "sợi tơ hồng"
- **Nhân bánh:** đỗ xanh hấp chín nghiền nhuyễn + sên lửa nhỏ với đường, dừa nạo, hạt sen, mứt bí
- **Quote:** "Kỳ công nhất của nghề là khâu ủ và nặn bột..." — Nguyễn Đăng Mạnh
- **Ủ bột + nặn bánh:** tỉ lệ nước dành dành chuẩn xác, tay cảm độ dẻo
- **Hấp + gói:** hấp cách thủy, gói lá dong + lạt đỏ
- **Thành phẩm:** "trong veo như ngọc, dẻo dai như tình"

### Chương 4 — Từ chõng tre đến tiệc cưới

- **Ba miền:** Bắc gọi bánh phu thê, Trung/Nam gọi xu xê/xu xuê
- **Biến tấu:** nhân sầu riêng, trà xanh, khoai môn, matcha, đậu đỏ...
- **Màu sắc mới:** vỏ bánh đa sắc đáp ứng thẩm mỹ hiện đại
- **Before/After:** bánh truyền thống chợ quê ↔ bánh hộp quà/tráp cưới hiện đại
- **Ứng dụng:** tráp cưới, bàn thờ, quà biếu, lễ Tết

### Chương 5 — Lời thề còn đó, vị ngọt còn đây

- **Tổng kết biểu tượng:** 5 tầng nghĩa — thủy chung, tình nghĩa, gắn kết, hạnh phúc, lời thề
- **Unwrap metaphor:** bánh mở dần = khám phá ý nghĩa
- **Cao trào cảm xúc:** "Giữa dòng chảy không ngừng của thời gian..."
- **Closing:** "LỜI THỀ CÒN ĐÓ, VỊ NGỌT CÒN ĐÂY"

---

*Kế hoạch này là blueprint cho toàn bộ chương 3–4–5. Mọi quyết định thiết kế, animation timing, 
và cấu trúc file đều tham chiếu về đây. Triển khai theo thứ tự Phase 1→5.*
