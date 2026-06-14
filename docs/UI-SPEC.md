---
phase: FE-GUIDE
slug: banh-phu-the-storytelling-website
status: approved
shadcn_initialized: false
preset: none
created: 2026-06-14
source: FE-GUIDE.md
---

# UI Design Contract — Bánh Phu Thê Storytelling Website

> Visual and interaction contract for the Shorthand-based Bánh Phu Thê emagazine. This file locks the UI direction before implementation: spacing, typography, color, motion, responsive behavior, accessibility, and component-level interaction rules.

---

## 1. Scope

| Item | Contract |
|------|----------|
| Product | Scroll-driven cultural storytelling website about Bánh Phu Thê, Đình Bảng, Bắc Ninh |
| Source of truth | `FE-GUIDE.md` |
| Platform | Shorthand story export/editor |
| Editable files | `css/custom.css`, `js/custom.js`, HTML only when adding required content structure |
| Protected files | Do not edit `style-00.css` → `style-04.css`, `inline-*.js`, `story.*.min.js`, `footer.*.min.js` |
| Primary experience | 5-chapter interactive emagazine: origin → structure → craft → modern culture → closing vow |
| Breakpoints to verify | `375px`, `768px`, `1440px` |
| Motion policy | CSS-first; JS only for scroll ratio, click state, dragging, audio controls |

---

## 2. Design System

| Property | Value |
|----------|-------|
| Tool | Shorthand + additive custom CSS/JS |
| Preset | Not applicable |
| Component library | None |
| Icon library | Inline SVG / custom illustration preferred; no external icon dependency unless already present |
| Primary font stack | `Oswald`, `Bebas Neue`, `Anton`, `Josefin Sans`, sans-serif |
| Body font stack | `Vollkorn`, `PT Serif`, `Georgia`, serif |
| Quote font stack | `Pacifico`, `Dancing Script`, `Playfair Display`, cursive/serif italic |
| Visual style | Vietnamese cultural editorial, paper texture, watercolor, red-thread motif |
| UI density | Spacious, magazine-like, high whitespace, low chrome |

---

## 3. Color Contract

### 3.1 Primary Palette

| Token | Value | Role | Usage |
|-------|-------|------|-------|
| `--color-rice-paper` | `#F7E8CB` | Dominant 60% | Page background, paper panels, infographic base, light sections |
| `--color-sticky-rice-gold` | `#F8D077` | Supporting 20% | Bánh surface, ingredient highlights, warm accents, small decorative fills |
| `--color-betel-leaf-green` | `#698456` | Brand 15% | Main headings, quote color, leaf motifs, calm active states |
| `--color-red-thread` | `#972023` | Accent 5% | Red-thread motif, CTAs, timelines, slider handle, chapter emphasis |
| `--color-ink` | `#221A14` | Text | Body copy on light backgrounds |
| `--color-cream-white` | `#FFF8EA` | Surface | High-contrast cards on darker/visual backgrounds |

### 3.2 Semantic Rules

| UI Element | Required Color Behavior |
|------------|-------------------------|
| Body background | Prefer `#F7E8CB`; avoid pure white except image negative space |
| Main title | `#698456` on light scenes; `#F7E8CB` on dark image scenes |
| Section emphasis | `#972023` for chapter numbers, key visual labels, strong dividers |
| Body text | `#221A14` on light; `#F7E8CB` on dark overlays |
| Quote text | Usually `#698456`; can use `#972023` only for final vow emphasis |
| CTA | Background `#972023`, text `#F7E8CB`, hover darker red |
| Card border | `rgb(151 32 35 / 0.18)` or `rgb(105 132 86 / 0.22)` |
| Focus ring | 2px `#972023`, 2px offset, visible on all interactive controls |

### 3.3 Ngũ Hành Supporting Palette

Use only inside the Chapter II Ngũ Hành component. The page-level identity still follows the primary palette.

| Hành | Value | Usage |
|------|-------|-------|
| Mộc | `#4A7C59` | Leaves, growth, home/family warmth |
| Kim | `#F5F0E8` | Coconut, purity, faithful bond |
| Thổ | `#D4A843` | Mung bean, gardenia yellow, stable foundation |
| Hỏa | `#972023` preferred over old `#C41E3A` | Red string, wedding joy, love flame |
| Thủy | `#6B9BC3` | Clear wrapper, flow, harmony |

### 3.4 Color Accessibility

- Body text on `#F7E8CB` must use `#221A14` or darker.
- Small text must not use `#F8D077` directly on `#F7E8CB`.
- `#972023` on `#F7E8CB` is valid for labels/buttons; do not reduce opacity below 0.85 for text.
- Image overlays must include a contrast layer if text is placed on top.

---

## 4. Typography Contract

### 4.1 Type Roles

| Role | Font | Size | Weight | Line Height | Usage |
|------|------|------|--------|-------------|-------|
| Display / Hero | `Oswald` or closest DNS Gibsons fallback | `clamp(4rem, 13vw, 12rem)` | 700 | `0.85–0.95` | `BÁNH PHU THÊ`, major chapter posters |
| Section Title | `Oswald` / `Josefin Sans` | `clamp(2.4rem, 7vw, 6.5rem)` | 700 | `0.95–1.05` | Chapter names, key visual blocks |
| Subtitle | `Vollkorn` / `PT Serif` | `clamp(1.6rem, 4vw, 4rem)` | 700 | `1.1–1.25` | “Bánh phu thê, lạt mềm buộc chặt” |
| Body | `Vollkorn` / `PT Serif` | `clamp(1.05rem, 1.6vw, 1.45rem)` | 400–500 | `1.65–1.8` | Story paragraphs, explanations |
| Label / Kicker | `Oswald` | `0.78rem–1rem` | 600–700 | `1.2` | Chapter labels, ingredient names |
| Quote | Script/italic fallback | `clamp(1.5rem, 3.2vw, 3.4rem)` | 400–600 | `1.25–1.45` | Ca dao, artisan quotes |
| Caption | `Vollkorn` / `Lato` | `0.875rem–1rem` | 400 | `1.45` | Image captions, source notes |

### 4.2 Typography Rules

- Hero and chapter display text must feel like cultural poster typography: condensed, tall, confident.
- Body copy must feel editorial, not app-like. Serif is preferred for long cultural narration.
- Quote style is reserved for short emotional lines only; never use script for paragraphs.
- Every viewport should show at most 3 dominant type styles at once.
- Long all-caps copy is forbidden except headings/labels because Vietnamese diacritics reduce readability.

---

## 5. Spacing Scale

Declared values are multiples of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `4px` | Icon offsets, fine decorative gaps |
| `sm` | `8px` | Label gaps, control internals |
| `md` | `16px` | Default component spacing |
| `lg` | `24px` | Text block gaps, mobile section padding |
| `xl` | `32px` | Card padding, scene block gap |
| `2xl` | `48px` | Desktop component gap, quote spacing |
| `3xl` | `64px` | Major section rhythm |
| `4xl` | `80px` | Desktop section padding |
| `5xl` | `120px` | Hero/chapter poster vertical breathing room |

### 5.1 Layout Values

| Property | Value |
|----------|-------|
| Section padding | `clamp(24px, 6vw, 80px)` |
| Card padding | `clamp(24px, 4vw, 48px)` |
| Text max width | `760px` |
| Card max width | `min(620px, 92vw)` |
| Wide content max width | `1180px` |
| Hero min height | `100vh` |
| Editorial scene min height | `min(100vh, 920px)` unless content requires more |
| Card radius | `18px` desktop, `14px` mobile |

Exceptions: full-bleed Shorthand background media can exceed layout max width; content overlay must still obey readable max width.

---

## 6. Surface & Texture Contract

| Surface | CSS Direction | Usage |
|---------|---------------|-------|
| Paper panel | `background: rgb(247 232 203 / 0.88); border: 1px solid rgb(151 32 35 / 0.18); box-shadow: 0 18px 60px rgb(34 26 20 / 0.12)` | Default cards on light/editorial scenes |
| Dark image overlay | `background: rgb(0 0 0 / 0.34); backdrop-filter: blur(10px); border: 1px solid rgb(255 255 255 / 0.18)` | Only when text sits over a dark/photo background |
| Paper texture | Low-opacity noise/grain or paper image | Page/section background, opacity subtle enough not to affect readability |
| Watercolor image | Transparent PNG/WebP preferred | Bánh, ingredients, characters, cultural illustrations |
| Red-thread line | `#972023`, 2–4px, rounded caps | Chapter connector, timeline, slider divider, path motif |

Glassmorphism is no longer the default visual language. Paper/editorial surfaces take priority.

---

## 7. Key Visual Contract — Sợi Lạt Đỏ

The red string is the core visual metaphor. It must appear from beginning to end as a consistent visual system, not random decoration.

| Meaning | UI Representation |
|---------|-------------------|
| Dòng thời gian | Scroll progress line with chapter nodes |
| Con đường lịch sử | Red path guiding scene order in Chapter I |
| Tơ hồng nhân duyên | Thread connecting people, quote, wedding tray, closing vow |
| Dây buộc chiếc bánh | Red line wraps/frames bánh images and ingredient panels |
| Kết nối truyền thống–hiện đại | Red line transforms into UI divider/slider/timeline in later chapters |

### 7.1 Implementation Rules

- Use one consistent red: `#972023`.
- Animate reveal with `transform: scaleX()` / `scaleY()`; do not animate layout dimensions.
- Keep motion slow and ceremonial, not playful.
- Use rounded ends for thread-like softness.
- Red thread should never obscure body text or important image details.

---

## 8. Chapter Layout Contracts

### 8.1 Cover / Hero

| Element | Contract |
|---------|----------|
| Background | Bright warm rural Bắc Ninh or paper-texture scene; avoid dark tech aesthetic |
| Centerpiece | Bánh Phu Thê image/illustration centered or slightly below title |
| Title | `BÁNH PHU THÊ`, huge green condensed text |
| Subtitle | Cultural promise line below title; serif or clean uppercase depending composition |
| Kicker | `ĐÌNH BẢNG - TỪ SƠN BẮC NINH` |
| Quote | Optional ca dao in script green near lower third |
| Animation | Title → subtitle → kicker → bánh reveal; stagger 120–220ms |

### 8.2 Chapter I — Origin

| Scene | Layout | Motion |
|-------|--------|--------|
| Kinh Bắc land | Watercolor/paper background + gate image | Gate fade-in, light parallax |
| Legend | Traditional character illustration + adjacent text | Left/right slide-in, no heavy overlay |
| History | Royal/court document/photo | Soft fade, paper card text |
| Craft village | Artisan photo/illustration | Fade-up, red thread node |
| Finished bánh | Center bánh | Slow zoom into bánh → transition Chapter II |

### 8.3 Chapter II — Ngũ Hành & Flavor

| Scene | Layout | Motion |
|-------|--------|--------|
| Ngũ Hành | Central bánh + 5 elements around; fallback vertical list mobile | Gentle orbit 20s; click highlights active element |
| Flavor harmony | Ingredient reveal stack: wrapper, mung bean, coconut, pomelo flower | Sequential fade-up, text side panel |
| Artisan quote | Portrait + quote block | Quote ink reveal or soft fade |

### 8.4 Chapter III — Craft Process

| Scene | Layout | Motion |
|-------|--------|--------|
| Divider | Large red/green title “Kỹ nghệ tạc hình hạnh phúc” | Fade-in + red-thread underline |
| Process | 6-step circular flow desktop; vertical red-thread timeline mobile | Click/scroll step activation |
| Quote | Nguyễn Đăng Mạnh quote | Paper-card highlight |

### 8.5 Chapter IV — Traditional to Contemporary

| Scene | Layout | Motion |
|-------|--------|--------|
| Headline | “Từ chiếc chõng tre đến tiệc cưới sang trọng” | Split phrase reveal |
| Before/After | `thời xưa` left, `hiện đại` right | Slider with red-thread handle; mobile tabs |
| Three regions | Bắc–Trung–Nam map/path | Red path connects regional nodes |
| Ritual uses | Offering, wedding tray, gift | Card grid or horizontal scroll with restrained motion |

### 8.6 Chapter V — Closing Vow

| Scene | Layout | Motion |
|-------|--------|--------|
| Couple scene | Young couple / wedding tray | Soft parallax/fade |
| Audio | Custom play button + waveform | Waveform active only while playing |
| Unwrapping | 4 stacked frames | Scroll ratio switches frame 1 → 4 |
| Closing | “LỜI THỀ CÒN ĐÓ, VỊ NGỌT CÒN ĐÂY” | Final red/green display title; thread resolves into still frame |

---

## 9. Interactive Component Contracts

### 9.1 Ngũ Hành Interactive

| Behavior | Contract |
|----------|----------|
| Layout desktop | 5 items positioned 72° apart around bánh |
| Layout mobile | Bánh first, then stacked/list items; no tiny orbit targets |
| Idle motion | Slow CSS rotation, 20s infinite; disabled in reduced motion |
| Click state | Active item scale `1.15`, glow, panel updates; inactive opacity `0.4` |
| Text panel | Shows element name, ingredient, meaning, short cultural explanation |
| Keyboard | Items are buttons with `aria-pressed`; Enter/Space activate |
| Default state | First item active or neutral “Chọn một nguyên liệu” panel |

### 9.2 Process Timeline / Infographic

| Behavior | Contract |
|----------|----------|
| Desktop | Circular flow around central artisan image |
| Mobile | Vertical red-thread timeline left; content right |
| Steps | 6 steps: chọn → sên → ủ → nặn → hấp → gói |
| Active state | Red step number, slight scale, visible detail text |
| Scroll behavior | IntersectionObserver sets active step when step enters 50% viewport |
| Click behavior | Click step manually updates active detail |

### 9.3 Before/After Slider

| Behavior | Contract |
|----------|----------|
| Desktop | Drag red-thread handle horizontally, default 50/50 |
| Labels | Left `Thời xưa`, right `Hiện nay` / `Hiện đại` |
| Implementation | Prefer CSS `clip-path` or width masking; avoid layout thrash |
| Keyboard | Handle supports ArrowLeft/ArrowRight increments of 5% |
| Mobile | Use tab toggle instead of drag slider |

### 9.4 Frame Animation

| Behavior | Contract |
|----------|----------|
| Frames | 4 images: nguyên lá → mở 30% → mở 60% → mở hoàn toàn |
| Mapping | 0–25%, 25–50%, 50–75%, 75–100% scroll ratio |
| CSS | Stacked absolute images, opacity transition 300ms |
| JS | One rAF-throttled scroll listener or IntersectionObserver + scroll ratio |
| Reduced motion | Show final/most informative frame with static text |

### 9.5 Audio Player

| Behavior | Contract |
|----------|----------|
| UI | Custom play/pause button + waveform line |
| Audio | Podcast + quan họ background only if asset exists |
| State | While playing: waveform active, transcript/quote highlighted |
| Accessibility | Native audio backed by custom controls; `aria-label`; Space toggles when focused |
| Fallback | If no audio asset, show transcript/quote block; no broken player |

---

## 10. Motion Contract

| Motion Type | Duration | Easing | Notes |
|-------------|----------|--------|-------|
| Text reveal | `450–700ms` | `cubic-bezier(.2,.8,.2,1)` | Stagger title/subtitle/kicker |
| Scene fade-up | `600–900ms` | ease-out | Translate max `24px` |
| Red-thread reveal | `900–1400ms` | ease-in-out | Transform scale only |
| Hover scale | `160–220ms` | ease-out | Max `1.03`; active Ngũ Hành can reach `1.15` |
| Image zoom | Scroll-driven | linear by ratio | Use transform; no top/left changes |
| Slider drag | immediate | none | Use rAF while dragging |

Reduced motion: disable orbit, parallax, zoom, light sweep, waveform animation, and scroll frame switching. Keep content visible and interactions functional.

---

## 11. Responsive Contract

| Breakpoint | Layout Rules |
|------------|--------------|
| `≤ 375px` | Single column; all interactions become list/tabs; no horizontal overflow; title can wrap into 2–3 lines |
| `376–767px` | Mobile-first layout, paper cards full-width, timeline vertical |
| `768–1023px` | Two-column layouts allowed; orbit can remain if target size ≥ 44px |
| `≥ 1024px` | Full editorial compositions, circular flow, before/after slider, wide image/text pairings |
| `≥ 1440px` | Cap content width; avoid stretched paragraphs; use whitespace and large display type |

Touch target minimum: `44px × 44px`.

---

## 12. Accessibility Contract

- Every image must have Vietnamese alt text describing cultural content, not filenames.
- Decorative red-thread/paper textures use `aria-hidden="true"` or CSS pseudo-elements.
- Interactive items must be reachable by keyboard in visual order.
- Focus states must be visible against paper and image backgrounds.
- Text overlays must pass contrast; add overlay layer when needed.
- No information should exist only in motion; reduced-motion/static users still get all content.
- Audio player must expose play/pause state and transcript/quote fallback.

---

## 13. Performance Contract

| Area | Rule |
|------|------|
| Scroll JS | Use IntersectionObserver when possible; throttle scroll ratio work with `requestAnimationFrame` |
| Animation properties | Animate `opacity` and `transform`; avoid `top`, `left`, `width`, `height` except slider mask if unavoidable |
| Images | Prefer compressed WebP/AVIF, correct intrinsic dimensions, lazy-load below fold |
| Frame sequence | Only 4 frames; preload current/next if needed; no large sprite sheet unless optimized |
| CSS | Additive overrides in `css/custom.css`; avoid broad selectors that fight Shorthand runtime |
| JS | Additive logic in `js/custom.js`; guard missing DOM nodes; no console errors |
| Fonts | Use available Google Fonts/fallback; avoid blocking on unavailable custom fonts |

---

## 14. Copywriting Contract

| Element | Copy |
|---------|------|
| Hero title | `BÁNH PHU THÊ` |
| Hero subtitle | `GÓI TRỌN LỜI THỀ SẮC SON QUA HÀNG THIÊN NIÊN KỶ` |
| Hero kicker | `ĐÌNH BẢNG - TỪ SƠN BẮC NINH` |
| Chapter I subtitle | `Bánh phu thê, lạt mềm buộc chặt` |
| Chapter IV headline | `Từ chiếc chõng tre đến tiệc cưới sang trọng` |
| Before label | `Thời xưa` |
| After label | `Hiện nay` or `Hiện đại` — choose one and use consistently |
| Closing title | `LỜI THỀ CÒN ĐÓ, VỊ NGỌT CÒN ĐÂY` |
| Final ca dao | `Đôi ta như bánh phu thê / Đẹp duyên, vẹn nghĩa, chẳng nề gian nan.` |
| Primary CTA | If needed only at end: `Khám phá câu chuyện` or `Xem lại hành trình` |
| Error/fallback | `Nội dung tương tác chưa sẵn sàng. Vui lòng xem phần mô tả bên dưới.` |

Copy tone: warm, ceremonial, culturally grounded, editorial. Avoid salesy e-commerce phrasing.

---

## 15. Asset Contract

| Asset Type | Requirement |
|------------|-------------|
| Bánh Phu Thê main | High-res, transparent background preferred; watercolor or clean cut-out |
| Ingredients | Consistent illustration style; no mixed clipart/photo unless intentionally separated |
| Characters | Traditional Vietnamese/Kinh Bắc attire, flat/watercolor style, calm expressions |
| Backgrounds | Paper texture, village gate, Kinh Bắc landscape, craft village, wedding setting |
| Process icons | 6 consistent line/illustration icons |
| Audio | Podcast/quan họ file plus transcript fallback |
| Frame sequence | 4 matching images with same crop and lighting |

Do not mix noisy stock photos with watercolor illustrations in the same scene unless card framing makes the contrast intentional.

---

## 16. Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | None | not required |
| third-party UI registries | None | not allowed without explicit review |
| CDN scripts | None new by default | require source and fallback review |

No component registry is required. This is a Shorthand/custom CSS implementation.

---

## 17. Implementation Guardrails

- Keep Shorthand section IDs intact.
- Add styles only to `css/custom.css` unless explicitly restructuring HTML.
- Add scripts only to `js/custom.js`.
- Guard JS selectors: missing optional chapter assets must not break the page.
- Use class names scoped to this project, e.g. `.bpt-*`, to avoid Shorthand collisions.
- Do not replace content logic while adding visual frames/animations.
- Prefer CSS variables for all locked tokens.

Suggested root variables:

```css
:root {
  --color-rice-paper: #F7E8CB;
  --color-sticky-rice-gold: #F8D077;
  --color-betel-leaf-green: #698456;
  --color-red-thread: #972023;
  --color-ink: #221A14;
  --space-section: clamp(24px, 6vw, 80px);
  --space-card: clamp(24px, 4vw, 48px);
}
```

---

## 18. QA Checklist

- [ ] 5 chapters have clear divider/title hierarchy.
- [ ] Red-thread motif appears consistently, not randomly.
- [ ] Palette matches `COLOUR PALLET.pdf`.
- [ ] Body copy remains readable on all backgrounds.
- [ ] Ngũ Hành works with mouse, touch, keyboard.
- [ ] Process infographic has mobile vertical timeline fallback.
- [ ] Before/after slider has mobile tab fallback.
- [ ] Frame animation respects reduced motion.
- [ ] Audio player has accessible fallback.
- [ ] No horizontal overflow at `375px`.
- [ ] No console errors if optional assets are missing.
- [ ] All images have Vietnamese alt text.
- [ ] Animations use transform/opacity where possible.

---

## 19. Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS — locked key Vietnamese copy and fallback tone.
- [x] Dimension 2 Visuals: PASS — paper/watercolor/red-thread art direction specified.
- [x] Dimension 3 Color: PASS — PDF palette mapped to semantic tokens and contrast rules.
- [x] Dimension 4 Typography: PASS — display/body/quote roles and fallback stacks defined.
- [x] Dimension 5 Spacing: PASS — 4px scale, section/card/text widths fixed.
- [x] Dimension 6 Registry Safety: PASS — no shadcn/third-party registry dependency.

**Approval:** approved 2026-06-14
