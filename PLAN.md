# PLAN — Redesign Chương 1 Content Sections (từ Phần 1)

## Mục tiêu
Redesign 5 phần nội dung Chương 1 (p1–p5) theo **patterns hiệu ứng + layout + typography** từ site tham khảo `thamkhao/web1` (Shorthand phở story), giữ nguyên `section-bpt-ch1-divider`.

---

## Thiết kế hiệu ứng — Phiên bản hiện tại (v2)

### Nguyên tắc chung
- **Tốc độ nhanh** — tất cả transition durations 0.4–0.6s, dùng `cubic-bezier(0.86, 0.01, 1, 1)` (web1's TransitionIn pattern)
- **Hiệu ứng hướng** — slide từ trái/phải thay vì chỉ fade-up, tạo cảm giác "hất" khi lướt xuống
- **Stagger ngắn** — delay giữa các phần tử 0.06–0.16s thay vì 0.15–0.45s
- **IntersectionObserver nhanh** — threshold 0.15, rootMargin `-10%` thay vì `-40px`

### P1 — Vùng đất Kinh Bắc (`bpt-text-over-media`)
- **Pattern:** TextOverMedia (web1 pos-2)
- **Hiệu ứng:** Full-bleed bg scale 1.08→1 (4s ken-burns), overlay gradient, text slide-up 40px (0.5s)
- **Bg opacity:** 0.6s cubic-bezier nhanh + 0.15s delay
- **Text opacity:** 0.5s cubic-bezier nhanh + 0.3s delay
- **Section reveal:** `.bpt-reveal` → translateY(30px) 0.45s (layered effect with inner)
- **Kicker:** uppercase, gold, decorative underline

### P2 — Truyền thuyết cung đình (`bpt-split-scene`)
- **Pattern:** Split-scene + directional slide
- **Hình ảnh:** Slide từ phải sang trái `translateX(60px)` → 0, opacity 0→1, 0.45s
- **Text kicker:** Slide từ trái `translateX(-30px)` → 0, 0.4s
- **Text paragraphs:** Slide từ trái `translateX(-30px)` → 0, stagger 0.08s/0.16s/0.24s, 0.4s each
- **Cream background** `rgba(247,230,196,1)`
- **Em tags** italic gold glow

### P3 — Dấu ấn lịch sử (`bpt-scrollpoints`)
- **Pattern:** Scrollpoints (web1 pos-14)
- **Cards:** Slide từ phải `translateX(80px)` → 0, opacity 0→1, 0.4s fast
- **Sticky image** left 55%, cards right 45%
- **Min-height** 70vh per card (compact, không quá giãn)
- **Cream card bg** + left accent bar + shadow
- **Each card** observed individually via IntersectionObserver (threshold 0.15, rootMargin -10%)

### P4 — Nghi thức cưới hỏi (`bpt-split-scene--reverse`)
- **Pattern:** Split-scene reverse + directional slide
- **Hình ảnh:** Slide từ trái `translateX(-60px)` → 0, 0.45s
- **Text kicker:** Slide từ phải `translateX(30px)` → 0, 0.4s
- **Text paragraphs:** Slide từ phải `translateX(30px)` → 0, stagger 0.08s
- **Cream background**

### P5 — Chiếc bánh Phu Thê (`bpt-scrollmation-scene`)
- **Pattern:** BackgroundScrollmation (web1 pos-17/18)
- **Text content:** Slide từ trái `translateX(-60px)` → 0, 0.45s fast + 0.15s delay
- **Gradient overlay:** 270deg matching web1
- **Box-shadow** extension for solid bg
- **Sticky bg** 100vh

---

## Files Modified

| File | Changes |
|------|---------|
| `css/custom.css` | All animation timings changed to 0.4–0.6s with fast cubic-bezier; directional slides (translateX) for P2/P4/P5; P3 cards translateX(80px); P1 faster entrance; stagger delays reduced |
| `js/custom.js` | IntersectionObserver thresholds & rootMargin updated; per-element observers for split-scene images; card observer uses threshold 0.15 rootMargin -10% |
| `index.html` | No structural changes (HTML same as prior version) |

## Animation Timing Summary

| Section | Element | Initial State | Transition | Duration | Delay |
|---------|---------|---------------|------------|----------|-------|
| P1 | Section | translateY(30px) opacity:0 | slide+fade | 0.45s | 0 |
| P1 | Bg image | scale(1.08) opacity:0 | fade+zoom | 0.6s/4s | 0.15s |
| P1 | Inner text | translateY(40px) opacity:0 | slide+fade | 0.5s | 0.3s |
| P2 | Image | translateX(60px) opacity:0 | slide+fade | 0.45s | 0 |
| P2 | Kicker | translateX(-30px) opacity:0 | slide+fade | 0.4s | 0 |
| P2 | Paragraphs | translateX(-30px) opacity:0 | slide+fade | 0.4s | stagger |
| P3 | Cards | translateX(80px) opacity:0 | slide+fade | 0.4s | per-card |
| P4 | Image | translateX(-60px) opacity:0 | slide+fade | 0.45s | 0 |
| P4 | Kicker | translateX(30px) opacity:0 | slide+fade | 0.4s | 0 |
| P4 | Paragraphs | translateX(30px) opacity:0 | slide+fade | 0.4s | stagger |
| P5 | Text inner | translateX(-60px) opacity:0 | slide+fade | 0.45s | 0.15s |

## Responsive Breakpoints
- 768px: scrollpoints stacks vertically, text-over-media full-width, split-scene stacks
- 375px: reduced font sizes

## Accessibility
- `prefers-reduced-motion: reduce` → all animations disabled, full opacity, no transforms
- `aria-hidden="true"` on decorative overlays
- Semantic HTML structure preserved

## Design Language (from web1 analysis)
- **Colors**: Brown text `rgba(110,72,30,1)` on cream `rgba(247,230,196,1)`
- **Font**: `Mulish,sans-serif` for body; `Vollkorn` for ca-dao/quotes
- **Kicker pattern**: uppercase, letter-spacing 0.12–0.18em, decorative underline `::after`
- **Overlay gradient**: `linear-gradient(270deg, transparent 0%, transparent 2%, rgba(bg,0.78) 30%, rgba(bg,0.95) 58%, rgba(bg,1) 100%)` + box-shadow extension
- **Card pattern**: cream bg, border-radius, shadow, left accent bar
- **`<em>`**: italic, font-weight:600, contrasting color
- **Easing**: `cubic-bezier(0.86, 0.01, 1, 1)` — web1's TransitionIn curve (fast snap, no slow drift)
