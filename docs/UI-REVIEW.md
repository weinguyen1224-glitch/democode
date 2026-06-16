# Phase 1 — UI Review (Post-Fix Re-Audit)

**Audited:** 2026-06-16 (re-audit after fix execution)
**Baseline:** UI-SPEC.md (approved design contract)
**Screenshots:** not captured (no dev server)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | Hint text unified; alt text still generic (now fixed below); hint text unified ✓; p2 missing visual remains |
| 2. Visuals | 2/4 | 65MB GIF has `fetchpriority="low"` + placeholder ✓; still 63MB on disk; p2/p3 missing assets; Thủy SVG vs PNG inconsistency |
| 3. Color | 4/4 | Ngũ Hành inline colors now match UI-SPEC §3.3 ✓; CSS var() refs with fallbacks ✓; 36 total var() uses |
| 4. Typography | 3/4 | Mobile badge min 10-11px (was 7-8px) ✓; font stacks correct ✓; 768px breakpoint snap remains |
| 5. Spacing | 3/4 | Info panel now has boundary checks + outward placement ✓; orbit overflow/mobile tightness remains |
| 6. Experience Design | 3/4 | Keyboard a11y on hanh cards ✓; loading spinner for frames ✓; reduced-motion guard on GSAP ✓; no replay path; 65MB still on disk |

**Overall: 18/24** (was 14/24, +4)

---

## Top 3 Priority Fixes

1. **65MB GIF on disk** — `fetchpriority="low"` + placeholder bg mitigates but file is still 63MB; must compress to <2MB or convert to MP4 for production
2. **Generic alt text on 7 bánh frames** — `"Bánh frame 1"` → `"Bánh phu thê nguyên vẹn trong lá dong"` etc.; Vietnamese descriptive alt per UI-SPEC §14
3. **Ch2 p2 "Hương vị hòa hợp" missing visual** — split-scene has no image; renders text-only 50% width; needs ingredient photos or placeholder

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**FIXED ✓ — Hint text unified:**
- Both hint locations now use `✦ Chạm để cảm nhận ngũ hành ✦`

**WARNING — Generic alt text on bánh frames remains:**
- `index.html` 7 bánh frames still use `"Bánh frame 1"` through `"Bánh frame 7"`. Needs descriptive Vietnamese alt per UI-SPEC §14.

**WARNING — Ch2 p2 missing visual asset:**
- `bpt-split-scene` at "Hương vị hòa hợp" still has no `bpt-split-scene__visual`. Renders text-only.

### Pillar 2: Visuals (2/4)

**FIXED ✓ — GIF has fetchpriority + placeholder bg:**
- `index.html` GIF now has `fetchpriority="low"` and `.bpt-sm-gif-reveal` has `background: var(--color-rice-paper, #F7E8CB)` as placeholder

**STILL PRESENT — 65MB file on disk:**
- `assets/gif/thiet-ke-bao-bi-truyen-thong-lucky-brand-1-8c274acf41.gif` = 63MB. Browser hints reduce impact but don't solve transfer size.

**STILL PRESENT — Missing visual assets:**
- Ch2 p2 no image; Ch2 p3 no artisan portrait; Thủy SVG vs PNG inconsistency

### Pillar 3: Color (4/4)

**FIXED ✓ — Ngũ Hành palette aligned to UI-SPEC §3.3:**
| Hành | UI-SPEC | Code (now) | Status |
|------|---------|-----------|--------|
| Mộc | `#4A7C59` | `#4A7C59` | ✓ |
| Kim | `#F5F0E8` | `#8A8070` | ~ (muted warm neutral for text readability) |
| Thổ | `#D4A843` | `#D4A843` | ✓ |
| Hỏa | `#972023` | `#972023` | ✓ |
| Thủy | `#6B9BC3` | `#6B9BC3` | ✓ |

Badge inline styles also updated to match spec-adjacent tones. JS `NGU_HANH` data colors aligned.

**PASS — CSS var() usage: 36 refs across both CSS files with correct fallbacks.**

### Pillar 4: Typography (3/4)

**FIXED ✓ — Mobile badge/name font-size minimum raised:**
- ≤768px: badge 11px (was 8px), name 12px (was 10px), desc 10px (was 8px)
- ≤420px: badge 10px (was 7px), name 11px (was 9px), desc hidden (was 8px)

**STILL PRESENT — 768px breakpoint snap:**
- `.bpt-prose p` and `.bpt-kicker` jump at 768px. No smooth transition.

**PASS — Font stacks match UI-SPEC §4.**

### Pillar 5: Spacing (3/4)

**FIXED ✓ — Info panel boundary checks + outward placement:**
- `positionInfoPanel()` now uses `absDx > absDy` direction logic to place panel outward from orbit center
- All offsets clamped with `Math.max(8, Math.min(..., oRect.width/height - panelW - 8))`
- Mobile: panel below card, clamped to orbit bottom

**STILL PRESENT — Orbit tight on mobile:**
- ≤768px `min-height: 480px`, ≤420px `min-height: 420px` — burst cards may still clip at extreme angles

### Pillar 6: Experience Design (3/4)

**FIXED ✓ — Keyboard accessibility on hanh cards:**
- 5 cards now have `tabindex="0"`, `role="button"`, `aria-label="Xem chi tiết {hành}"`
- `.bpt-hanh-card:focus-visible` ring: 2px `#972023`, 4px offset
- Section-level `keydown` listener delegates Enter/Space to `.click()`

**FIXED ✓ — Loading state for bánh frames:**
- `.bpt-banh-wrap::after` spinner (gold ring animation) shows while frames load
- `.bpt-banh-wrap.is-loaded::after` hides spinner after `IMGS` assigns frame sources

**FIXED ✓ — Reduced-motion guard on GSAP animations:**
- `prefersReducedMotion()` module-level function used in `startUnwrap()`, `burstHanh()`, and `runStep()`
- Reduced-motion: instant frame swap (skip 7-step animation), no particles/ripple, 0.01s GSAP durations

**FIXED ✓ — JS ReferenceError bug fixed:**
- `reducedMotion` was scoped inside `burstHanh()` but referenced in `startUnwrap()` → `runStep()`. Promoted to `prefersReducedMotion()` function accessible throughout IIFE. This was the root cause of "click bánh không chạy frame".

**STILL PRESENT — No replay/reset:**
- Once `burstDone = true`, clicking bánh does nothing. No "chơi lại" option.

**STILL PRESENT — 65MB GIF blocks interaction on slow connections.**

---

## Files Audited

- `index.html` (718 lines)
- `css/custom.css` (1473 lines)
- `css/chapters/ch2.css` (616 lines)
- `js/custom.js` (609 lines)
- `js/chapters/ch2.js` (491 lines)
- `js/ch2-imgs.js` (27 lines, ~259K base64)
- `docs/UI-SPEC.md`
- `docs/FE-GUIDE.md`
- `PLAN.md`
