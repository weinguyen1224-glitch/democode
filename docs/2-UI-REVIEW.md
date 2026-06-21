# Phase 2 — UI Review: Emagazine Lens

**Audited:** 2026-06-16
**Baseline:** UI-SPEC.md + emagazine storytelling best practices
**Perspective:** Web emagazine — scroll-driven editorial experience for cultural storytelling

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | `lang="en"` on Vietnamese content; title "Trang chính"; no OG description; alt text partially fixed but 5 images still `alt=""` |
| 2. Visuals | 2/4 | 36MB GIF on disk; placeholder images in production (bpt-placeholder-img); Thủy SVG vs PNG inconsistency; missing photo assets for p2/p3/p4 |
| 3. Color | 4/4 | CSS var() system fully aligned with UI-SPEC §3; Ngũ Hành palette matches; semantic rules followed |
| 4. Typography | 3/4 | Font stacks match spec; mobile badge/name sizes fixed; 768px breakpoint snap remains; no `font-display: swap` |
| 5. Spacing | 3/4 | Section/card/text widths use clamp(); info panel boundary-checked; orbit tight on ≤420px; no rhythm system across chapters |
| 6. Experience Design | 2/4 | Scroll-driven structure works; no replay on bánh interaction; 36MB GIF blocks slow connections; no share/social metadata; no table-of-contents navigation |

**Overall: 16/24**

---

## Detailed Findings

### Pillar 1: Copywriting (2/4)

**CRITICAL — Wrong `lang` attribute:**
- `<html lang="en">` but entire content is Vietnamese. Should be `lang="vi"`.
- Impact: screen readers mispronounce; search engines misclassify language; accessibility failure (WCAG 3.1.1).

**CRITICAL — Missing social/emagazine metadata:**
- `<title>Trang chính</title>` — generic, not descriptive. Emagazine needs SEO-optimized title like "Bánh Phu Thê — Lời thề sắc son | Đình Bảng, Bắc Ninh".
- No `<meta name="description">` — no summary for search/social sharing.
- `twitter:title` = "Trang chính" — same problem.
- No `og:image`, no `og:description`, no `og:type="article"`. Emagazines depend on rich social cards; currently shares render as blank/generic.

**WARNING — 5 images still have empty `alt=""`:**
- Lines 121, 173, 206, 239, 272: Shorthand media sections with `alt=""`. These are decorative background images but still need descriptive alt or `role="presentation"` for accessibility.

**FIXED ✓ — Bánh frame alt text:**
- All 7 bánh frames now have descriptive Vietnamese alt text (e.g., "Bánh phu thê nguyên vẹn gói trong lá dong").

**IMPROVEMENT — Emagazine editorial voice:**
- Content tone is excellent — warm, ceremonial, culturally grounded. Matches UI-SPEC §14.
- Ca dao quotes are properly formatted as `<blockquote>` with `<footer>`.
- Missing: chapter subtitles in `<meta>` for social preview cards.

---

### Pillar 2: Visuals (2/4)

**CRITICAL — 36MB GIF in production:**
- `assets/gif/thiet-ke-bao-bi-truyen-thong-lucky-brand-1-8c274acf41.gif` = 36MB on disk.
- `fetchpriority="low"` mitigates but doesn't solve transfer size. For emagazine, a 36MB asset blocks first meaningful paint on slow connections.
- **Fix:** Convert to MP4/WebM (<2MB) or use animated WebP (<5MB).

**WARNING — Placeholder images in production HTML:**
- Multiple `bpt-placeholder-img` divs with gradient backgrounds instead of real photography. Emagazines rely on editorial photography as primary visual storytelling; placeholders undermine credibility.
- p2 "Hương vị hòa hợp" — split-scene has no visual side (`bpt-split-scene__visual` missing).
- p3 "Nghệ nhân" — no artisan portrait.
- p4 "Bảo tồn" — closing section has no hero image.

**WARNING — Thủy SVG vs PNG inconsistency:**
- Thủy (Water) element uses a different format than other hanh elements. In an emagazine, visual consistency across the interactive component is essential for editorial credibility.

**WARNING — No image optimization pipeline:**
- No WebP/AVIF sources with `<picture>`.
- Google Fonts CSS loaded externally but no preconnect hint.
- No `width`/`height` attributes on most `<img>` tags → layout shift (CLS) during load.

**POSITIVE — Visual storytelling structure:**
- Chapter dividers with decorative red-line motif.
- Grain overlay + vignette on bpt-scene sections → paper texture feel.
- Glassmorphism intro card → modern emagazine entrance.
- Scroll-driven cinematic transitions (bpt-sm-section) → strong editorial rhythm.

---

### Pillar 3: Color (4/4)

**PASS — Color system fully aligned:**

| Token | UI-SPEC | Code | Status |
|-------|---------|------|--------|
| `--color-rice-paper` | `#F7E8CB` | `#F7E8CB` | ✓ |
| `--color-sticky-rice-gold` | `#F8D077` | `#F8D077` | ✓ |
| `--color-betel-leaf-green` | `#698456` | `#698456` | ✓ |
| `--color-red-thread` | `#972023` | `#972023` | ✓ |
| `--color-ink` | `#221A14` | `#221A14` | ✓ |
| `--color-cream-white` | `#FFF8EA` | `#FFF8EA` | ✓ |

- CSS var() with fallbacks used throughout (36+ references).
- Ngũ Hành inline colors match UI-SPEC §3.3 (JS `NGU_HANH` data aligned).
- Focus ring uses `#972023` per spec.
- Dark overlays use proper contrast layers for text readability.

**MINOR — Kim badge color:**
- UI-SPEC specifies `#F5F0E8` for Kim; code uses `#8A8070` (muted warm neutral). This is a conscious readability decision (white text on `#F5F0E8` fails contrast). Documented and acceptable.

---

### Pillar 4: Typography (3/4)

**PASS — Font stacks match UI-SPEC §4:**

| Role | Spec | Code | Status |
|------|------|------|--------|
| Display | Oswald → Bebas Neue | `font-family: 'Oswald', sans-serif` | ✓ |
| Body | Vollkorn → PT Serif → Georgia | `font-family: 'Vollkorn', 'PT Serif', Georgia, serif` | ✓ |
| Quote | Pacifico → Dancing Script | `font-family: 'Pacifico', 'Dancing Script', cursive` | ✓ |
| Kicker | Oswald | `font-family: 'Oswald', sans-serif` | ✓ |

**PASS — Responsive sizing with `clamp()`:**
- Display: `clamp(4rem, 13vw, 12rem)` ✓
- Section title: `clamp(2rem, 5vw, 3.6rem)` ✓
- Body: `clamp(1.2rem, 2vw, 1.65rem)` with `line-height: 1.85` ✓
- Kicker: `clamp(0.82rem, 1.3vw, 0.95rem)` ✓

**WARNING — 768px breakpoint snap:**
- `.bpt-prose p` and `.bpt-kicker` jump at 768px without smooth transition. Emagazines should use `clamp()` or fluid typography to avoid jarring size changes mid-scroll.

**WARNING — No `font-display: swap`:**
- Google Fonts loaded via `<link>` but no `&display=swap` parameter. This can cause FOIT (Flash of Invisible Text) on slow connections, which breaks emagazine reading flow.

**IMPROVEMENT — Letter spacing on kickers:**
- Kickers use `letter-spacing: 0.18em` → animated entrance to `0.2em`. Good editorial touch, but the animation (`kicker-entrance` keyframe) creates a subtle layout shift. Consider using `will-change: letter-spacing` or pre-calculating width.

---

### Pillar 5: Spacing (3/4)

**PASS — Spacing system uses `clamp()`:**
- Section padding: `clamp(24px, 6vw, 80px)` — matches UI-SPEC `--space-section`.
- Card padding: `clamp(24px, 4vw, 48px)` — matches `--space-card`.
- Prose max-width: `min(720px, 92vw)` — good emagazine reading width.

**PASS — Info panel boundary checks:**
- `positionInfoPanel()` uses `absDx > absDy` direction logic + `Math.max(8, Math.min(...))` clamping. No overflow issues.

**WARNING — Orbit tight on mobile (≤420px):**
- `.bpt-ngu-hanh__orbit` min-height: 420px with 5 cards at 90px each. Burst angles don't scale enough — cards may overlap or clip at extreme angles.
- Emagazine mobile experience requires generous spacing; 420px orbit is cramped.

**WARNING — No vertical rhythm system:**
- Paragraph spacing uses `1em` margin-bottom. No consistent rhythm scale across chapter transitions. Emagazines benefit from a 4px/8px baseline grid for scroll rhythm.
- Scene transitions (`bpt-scene-transition` = 60px wide, 2px tall) are inconsistent — some chapters have them, others don't.

**POSITIVE — Scene grain + vignette:**
- `.bpt-scene::before` (grain overlay, 0.025 opacity) and `::after` (vignette) add subtle editorial texture without interfering with content spacing.

---

### Pillar 6: Experience Design (2/4)

**CRITICAL — No replay/reset for bánh interaction:**
- Once `burstDone = true`, clicking bánh does nothing. No "chơi lại" option. Users who scroll past and return cannot re-experience the interactive. Emagazine readers often re-visit sections; permanent one-shot interactions frustrate.

**CRITICAL — No social/emagazine sharing infrastructure:**
- No Open Graph metadata (og:title, og:description, og:image, og:type).
- No Twitter Card beyond `twitter:card` and generic `twitter:title`.
- Emagazines live and die by social sharing; without OG tags, shared links render as bare URLs.

**CRITICAL — No table of contents / chapter navigation:**
- 5 chapters, no way to navigate between them. No sticky nav items in `Navigation__itemList` (it's empty). Emagazines need a chapter index or progress indicator for orientation.

**WARNING — 36MB GIF still impacts experience:**
- Even with `fetchpriority="low"`, the browser still eventually downloads 36MB. On 3G connections, this blocks the entire second half of the story.

**WARNING — Progress bar but no chapter indicators:**
- `.scene-progress` (6px, top of page) shows scroll progress. Good, but emagazine readers need to know *which* chapter they're in, not just *how far* they've scrolled.

**POSITIVE — Reduced motion support:**
- `prefers-reduced-motion: reduce` disables all animations, hides grain/vignette, skips GSAP sequences. Meets WCAG 2.3.3.

**POSITIVE — Keyboard accessibility on hanh cards:**
- 5 cards have `tabindex="0"`, `role="button"`, `aria-label`. Section-level `keydown` listener delegates Enter/Space to `.click()`. Focus ring: 2px `#972023`, 4px offset.

**POSITIVE — Skip link:**
- `<a href="#article" id="skip-link">Skip to main content</a>` present. Good accessibility baseline.

---

## Top 6 Priority Fixes (Emagazine Impact)

1. **`lang="vi"` + SEO metadata** — Change `<html lang="en">` to `lang="vi"`. Add `<title>`, `<meta name="description">`, OG tags. This is the single highest-impact emagazine fix — it enables correct screen reader pronunciation, search indexing, and social sharing.

2. **36MB GIF → MP4/WebM** — Convert `thiet-ke-bao-bi-truyen-thong-lucky-brand-1-8c274acf41.gif` to video. A 36MB asset is untenable for an emagazine that should load in <5s on mobile.

3. **Add replay to bánh interaction** — After burst, show a subtle "↻ Chơi lại" button. Reset `burstDone`, re-show frame 1, re-hide cards. Critical for emagazine re-engagement.

4. **Add chapter navigation** — Populate `Navigation__itemList` with 5 chapter links (or add a floating TOC). Emagazine readers need orientation in long-form content.

5. **Add `font-display=swap` to Google Fonts URL** — Append `&display=swap` to the Google Fonts `<link>`. Prevents FOIT on slow connections, improves FCP.

6. **Fill placeholder images with real editorial photography** — `bpt-placeholder-img` divs must be replaced with actual images. Emagazines are visual-first storytelling; gradient placeholders break the editorial contract with readers.

---

## Files Audited

- `index.html` (814 lines)
- `css/custom.css` (2208 lines)
- `css/chapters/ch2.css` (614 lines)
- `js/custom.js` (781 lines)
- `js/chapters/ch2.js` (521 lines)
- `js/ch2-imgs.js` (27 lines, ~259K base64)
- `docs/UI-SPEC.md`
- `docs/FE-GUIDE.md`
- `PLAN.md`
