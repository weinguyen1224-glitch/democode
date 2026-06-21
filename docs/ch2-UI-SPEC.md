---
phase: 2
slug: chuong-ii-ngot-bui-hoa-quyen
status: draft
created: 2026-06-16
source: ch2-UI-SPEC.md
reference: animation-phu-the-ngu-hanh/banh-phu-the-ngu-hanh.html
---

# UI Design Contract -- Chương II: Ngọt Bùi Hòa Quyện

> Khóa thiết kế cho 3 section của Chương II trước khi implement.

## 1. Scope

| Item | Contract |
|------|----------|
| Sections | #section-bpt-ch2-divider, #section-bpt-ch2-ngu-hanh, #section-bpt-ch2-vi-ngot, #section-bpt-ch2-nghe-nhan |
| Editable files | css/chapters/ch2.css, js/chapters/ch2.js, js/ch2-imgs.js, HTML in Ch2 sections |
| Protected | style-00.css through style-04.css, inline JS, story runtime |
| GSAP | 3.12.5 (CDN, defer) -- typeof gsap check before every call |
| Breakpoints | 375px, 420px, 768px, 1440px |
| Motion policy | CSS-first; JS only for scroll triggers, click interaction, GSAP tween; prefers-reduced-motion guards |

## 2. Section Architecture

### 2.1 Layout Map

- #section-bpt-ch2-divider: Chapter divider (II + title)
- #section-bpt-ch2-ngu-hanh: INTERACTIVE unwrap + burst, rice-paper bg
- #section-bpt-ch2-vi-ngot: Split scene (placeholder visual + text)
- #section-bpt-ch2-nghe-nhan: Quote block (closing section)

### 2.2 Color per Section

| Section | Background | Text | Accent |
|---------|-----------|------|--------|
| Divider | var(--color-rice-paper, #F7E8CB) | var(--color-ink, #221A14) | var(--color-red-thread, #972023) |
| Ngũ Hành | var(--color-rice-paper, #F7E8CB) | var(--color-ink, #221A14) | Ngũ hành palette (see 3.3) |
| Hương vị | var(--color-rice-paper, #F7E8CB) | var(--color-ink, #221A14) | var(--color-sticky-rice-gold, #F8D077) |
| Nghệ nhân | Dark overlay | var(--color-rice-paper, #F7E8CB) | var(--color-red-thread, #972023) |

## 3. Unwrap Animation Contract

### 3.1 Interaction Flow

IDLE -> USER CLICK -> UNWRAP SEQUENCE -> BURST -> INTERACT CARDS

| State | Visual | Trigger |
|-------|--------|---------|
| IDLE | Bánh closed (frame 1), hint pulsing, warm glow | Page load |
| CLICK | Hint fades, glow brightens | Click/tap/Enter on .bpt-banh-wrap |
| UNWRAP | 7-frame quickSwap (6 steps), particles + ripple, progress arc fills | Auto after click |
| BURST | Bánh shrinks, 5 hanh cards fly out, golden particle explosion | Auto after unwrap |
| INTERACT | Click card -> info panel appears outward; other cards dim | User click |

### 3.2 Frame Sequence

| Step | From->To | Ripple Color | Particles | Gap (ms) |
|------|----------|-------------|-----------|----------|
| 1 | f1->f2 | rgba(220,80,60,0.7) | 25 red/orange, speed 3.5 | 280 |
| 2 | f2->f3 | rgba(210,70,50,0.5) | 20 red, speed 3 | 250 |
| 3 | f3->f4 | rgba(60,180,60,0.5) | 30 green, speed 4.5 | 250 |
| 4 | f4->f5 | rgba(40,160,40,0.5) | 35 green, speed 4 | 250 |
| 5 | f5->f6 | rgba(240,200,40,0.6) | 45 gold, speed 5 | 250 |
| 6 | f6->f7 | rgba(240,180,20,0.7) | 60 gold/amber, speed 6 | 280 |

quickSwap: gsap.to(wrap, {scale:0.95, duration:0.14}) -> swap opacity -> gsap.to(wrap, {scale:1, duration:0.18})

### 3.3 Canvas FX

- Particles: gravity-affected, alpha decay, round/square mix, rAF loop
- Ripple: expanding circle from center, r=0 alpha=0.7, +6/frame, -0.022/frame
- Burst: 120 particles, 7 colors (gold->green->blue->red)

### 3.4 Progress Ring

- SVG circle, stroke-dasharray: 1099, dashoffset 1099->0
- Opacity 0.4->0.7 during unwrap, fades to 0 at burst

### 3.5 Image Loading

- All 7 frames from js/ch2-imgs.js (base64 WebP, ~259K total)
- .bpt-banh-wrap::after spinner during load, .is-loaded hides spinner

### 3.6 Reduced Motion

| Component | Normal | Reduced Motion |
|-----------|--------|----------------|
| Unwrap | 6-step GSAP | Instant: show frame 7 only |
| Particles | Full system | None |
| Ripple | Canvas ripple | None |
| Burst | GSAP back.out | Instant position, 0.01s duration |
| Hint float | CSS animation | None |

## 4. Ngũ Hành Burst Contract

### 4.1 Burst Angles and Distances

| Hành | Angle | Desktop Dist | Mobile (x0.65) | Small Phone (x0.55) |
|------|-------|-------------|----------------|---------------------|
| Mộc | -90 | 320px | 208px | 176px |
| Kim | -18 | 340px | 221px | 187px |
| Thổ | 54 | 330px | 214px | 181px |
| Hỏa | 126 | 340px | 221px | 187px |
| Thủy | 198 | 320px | 208px | 176px |

### 4.2 Card Sizes

| Breakpoint | Card W | Img Size | Name | Badge | Desc |
|-----------|--------|----------|------|-------|------|
| Desktop | 190px | 120px | 16px | 13px | 12px |
| <=768px | 100px | 48px | 12px | 11px | 8px |
| <=420px | 90px | 38px | 11px | 10px | hidden |

### 4.3 Card Images

| Hành | Source | Format |
|------|--------|--------|
| Mộc | assets/background-remover/ladong.png + lachuoi.png | PNG pair |
| Kim | assets/background-remover/dua.png + duong.png | PNG pair |
| Thổ | assets/background-remover/dau.png | PNG pair |
| Hỏa | assets/background-remover/soi-lat-do.png | Single PNG |
| Thủy | Inline SVG (water drop) | SVG |

### 4.4 Burst Timeline

- t=0.00: Bánh scale 0.55, opacity 0.15, ring fade
- t=0.00: 120 golden particles explode
- t=0.11: Mộc card flies to position (back.out 1.9)
- t=0.22: Kim card
- t=0.33: Thổ card
- t=0.44: Hỏa card
- t=0.55: Thủy card
- t=1.20: Finale text fades in

### 4.5 Finale Text

- Centered in orbit: "Ngũ Hành Viên Mãn" + subtitle
- Desktop: 280px wide; Mobile: 180px; Small phone: 140px

## 5. Info Panel Contract

### 5.1 Placement Rules -- CRITICAL

Panel always appears OUTWARD from orbit center, NEVER overlapping center text.

| Hành | Card Position | Panel Direction |
|------|--------------|----------------|
| Mộc (top) | Above center | Panel ABOVE Mộc |
| Kim (upper-right) | Right of center | Panel RIGHT of Kim |
| Thổ (lower-right) | Below-right of center | Panel RIGHT of Thổ |
| Hỏa (lower-left) | Below-left of center | Panel LEFT of Hỏa |
| Thủy (upper-left) | Left of center | Panel LEFT of Thủy |

### 5.2 Algorithm

1. Calculate card direction from orbit center (dx, dy)
2. If |dy| > |dx| (vertical-dominant):
   - Card above center (Mộc): panel ABOVE card; fallback to side if no room
   - Card below center: panel BELOW card; fallback to side
3. If |dx| > |dy| (horizontal-dominant):
   - Card right (Kim, Thổ): panel RIGHT; fallback below
   - Card left (Hỏa, Thủy): panel LEFT; fallback below
4. Clamp all offsets within orbit bounds (>= 4px margin)
5. Mobile: same logic, smaller panel

### 5.3 Panel Sizes

| Breakpoint | Panel W | Font Name | Font Badge | Font Meaning |
|-----------|---------|-----------|------------|-------------|
| Desktop | 220px | 1rem | 0.82rem | 0.88rem |
| <=768px | 160px | 0.82rem | 0.68rem | 0.72rem |
| <=420px | 140px | 0.75rem | 0.62rem | 0.66rem |

### 5.4 Panel Visual

- Background: var(--color-cream-white, #FFF8EA)
- Left border: 3px solid --hanh-color (dynamic per hành)
- Border-radius: 12px desktop, 8px mobile
- Box-shadow: 0 4px 20px rgba(0,0,0,0.08)
- Entry animation: translateY(8px) scale(0.96) -> translateY(0) scale(1), 280ms ease
- aria-live=polite, aria-atomic=true

### 5.5 Click Behavior

- Active card: opacity 1, others dimmed to 0.4
- Click same card: dismiss panel, restore all
- Click outside: dismiss panel
- Keyboard: Enter/Space on focused card

## 6. Responsive Contract

### 6.1 Desktop (>768px)

- Bánh: clamp(240px, 50vw, 340px) square, centered
- Orbit: min-height 620px, max-width 1200px, overflow visible
- Cards: 190px, absolute positioned, radial burst
- Hint: below bánh, bottom -54px
- Padding: clamp(60px,10vh,120px) vertical

### 6.2 Tablet (<=768px)

- Bánh: 160x160px
- Orbit: min-height 480px, width 100vw
- Cards: 100px, images 48px, desc 8px
- Burst distances x0.65
- Padding: clamp(36px,6vh,60px) vertical

### 6.3 Small Phone (<=420px)

- Bánh: 130x130px
- Orbit: min-height 420px
- Cards: 90px, images 38px, desc hidden
- Burst distances x0.55
- Hint: 0.62rem
- Padding: clamp(28px,5vh,48px) vertical

### 6.4 Overlap Prevention Rules

- Cards clamped within orbit bounds (4px margin)
- Info panel clamped within orbit bounds
- Finale text has z-index 50, cards z-index 100
- No horizontal scroll at 375px
- Hint text positioned with safe bottom offset

## 7. Section p2: Hương vị hòa hợp

- Split scene: visual left (50%) + text right (50%)
- Visual: placeholder SVG with warm tones (no real image yet)
- Scroll: .bpt-split-scene.bpt-reveal fade in via IntersectionObserver
- Background: var(--color-rice-paper, #F7E8CB)

## 8. Section p3: Trích dẫn nghệ nhân

- Full-width centered blockquote
- Dark overlay background
- Text in cream/white for contrast
- Scroll: .bpt-prose.bpt-reveal fade in

## 9. Chapter Divider

- Background: var(--color-rice-paper, #F7E8CB)
- Red thread line, chapter number II
- Scale-up entrance animation via .bpt-reveal

## 10. Accessibility Contract

| Feature | Implementation |
|---------|---------------|
| Bánh wrap | role=button, tabindex=0, aria-label |
| Hành cards | role=button, tabindex=0, aria-label |
| Info panel | aria-live=polite, aria-atomic=true |
| Focus visible | 2px solid #972023, 4px offset |
| Keyboard | Enter/Space triggers click |
| Canvas/SVG | aria-hidden=true |
| Alt text | Vietnamese descriptive per frame |
| Reduced motion | All animations bypassed |

## 11. Performance Contract

| Concern | Solution |
|---------|----------|
| 7 base64 frames | ~259K total, sync loaded |
| Canvas particles | rAF loop, auto-stops when empty |
| GSAP tweens | will-change on animated elements |
| Scroll listeners | passive:true, IntersectionObserver |
| Mobile perf | Fewer/smaller particles, smaller canvas |

## 12. Known Issues to Fix

| Issue | Priority | Fix |
|-------|----------|-----|
| Click bánh không chạy frame | Critical | prefersReducedMotion() must be module-level |
| Mộc info panel đè lên trung tâm | High | Panel above Mộc, not below |
| Cards dính fixed trên màn hình | High | Use position:absolute in orbit, not fixed |
| Thủy icon quá to trên mobile | Medium | Clamp SVG size to match others |
| No replay after burst | Low | Consider reset/replay button |
| 768px font snap | Low | Add clamp() transition |

## 13. File Responsibility Map

| File | Responsibility |
|------|---------------|
| js/ch2-imgs.js | Base64 frame images (sync) |
| js/chapters/ch2.js | Unwrap, burst, particles, ripple, info panel, scroll |
| css/chapters/ch2.css | Layout, cards, animation, responsive, reduced-motion |
| index.html | Section structure, hành card HTML, alt text |

## 14. Checker Sign-Off

- [ ] D1 Copywriting: Vietnamese UI text, descriptive alt, hint text unified
- [ ] D2 Visuals: Rice-paper bg, warm glow, consistent image style
- [ ] D3 Color: Ngũ hành palette per UI-SPEC 3.3, rice-paper bg, cream panel, red accent
- [ ] D4 Typography: Vollkorn body, Oswald labels, responsive clamp, mobile min 10px
- [ ] D5 Spacing: 4px scale, orbit min-heights, card sizes, panel positioning
- [ ] D6 Experience: Click->unwrap->burst->interact, keyboard, reduced-motion, no overlap

Status: Draft -- awaiting implementation and browser verification
