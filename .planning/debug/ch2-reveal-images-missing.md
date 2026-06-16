---
status: resolved
trigger: "In the scroll-driven reveal effect for 3h-sang section in Chapter 2, only the horizontal bar is visible but the images (3h-sang.JPG and 3h-sang-2.JPG) are not showing."
created: 2026-06-17T00:00:00Z
updated: 2026-06-17T00:00:00Z
---

## Current Focus

hypothesis: CSS url() paths resolve to wrong directory due to nested file location
test: Verified filesystem path resolution
expecting: Paths resolve to non-existent css/assets/ instead of project-root assets/
next_action: Fix url() paths in ch2.css

## Symptoms

expected: Images 3h-sang.JPG and 3h-sang-2.JPG visible in the scroll-driven reveal effect
actual: Only the horizontal bar is visible; images do not load (404)
errors: No JS errors; images simply fail to load silently
reproduction: Scroll through Chapter 2 to the reveal section
started: When the reveal CSS was added to css/chapters/ch2.css

## Eliminated

- hypothesis: opacity transition preventing visibility
  evidence: The horizontal bar IS visible, proving the container reaches opacity: 1 when --active is applied
  timestamp: 2026-06-17T00:00:00Z

- hypothesis: stacking context / z-index issue
  evidence: The reveal container has z-index: 6 which is above all sibling layers (grain:2, vignette:3, scanlines:4). The bar renders correctly at this z-index.
  timestamp: 2026-06-17T00:00:00Z

- hypothesis: --active class not being added
  evidence: The bar IS visible, which requires the --active class to trigger opacity: 0 -> 1
  timestamp: 2026-06-17T00:00:00Z

- hypothesis: clip-path hiding all images
  evidence: clip-path only applies to .bpt-nghe-nhan__reveal-top (the second image), not .bpt-nghe-nhan__reveal-base (the first image). Both images fail to show.
  timestamp: 2026-06-17T00:00:00Z

- hypothesis: overflow:hidden on parent clipping images
  evidence: The reveal-base and reveal-top have inset:-10% (120% size) which extends beyond parent bounds. overflow:hidden on .bpt-nghe-nhan__bg clips the edges, but the central 100% area should still be fully visible. Images fail to load entirely (0% visible), not just clipped edges.
  timestamp: 2026-06-17T00:00:00Z

## Evidence

- timestamp: 2026-06-17T00:00:00Z
  checked: css/chapters/ch2.css url() path resolution
  found: url('../assets/chuong-2/3h-sang.JPG') from css/chapters/ch2.css resolves to css/assets/chuong-2/3h-sang.JPG (one ../ only goes up to css/, not project root)
  implication: The image URLs point to a non-existent directory

- timestamp: 2026-06-17T00:00:00Z
  checked: Filesystem verification
  found: /home/weinguyen/Builds/banh-phu-the/css/assets/ does NOT exist. Assets are at /home/weinguyen/Builds/banh-phu-the/assets/chuong-2/
  implication: All four url() references in ch2.css using ../assets/ are broken

- timestamp: 2026-06-17T00:00:00Z
  checked: Existing bg-layer references
  found: .bpt-nghe-nhan__bg-layer--kicker (line 1131) and .bpt-nghe-nhan__bg-layer--quote (line 1142) use the same broken path pattern
  implication: Pre-existing bug; these background layers also fail to load images

- timestamp: 2026-06-17T00:00:00Z
  checked: Bar visibility vs image visibility
  found: The bar uses background: rgba(248, 208, 119, 0.6) (no url), while reveal-base and reveal-top use background-image: url()
  implication: Confirms the url() path is the differentiating factor between working (bar) and broken (images)

## Resolution

root_cause: CSS url() path indirection bug. The CSS file is at css/chapters/ch2.css but url() references use '../assets/' which only goes up one directory (to css/), not two directories (to project root). The correct relative path is '../../assets/'. This affects all four image url() references in the file.
fix: Change '../assets/' to '../../assets/' in four url() references in css/chapters/ch2.css (lines 1131, 1142, 1261, 1271)
verification: Verified filesystem paths resolve correctly with ../../ prefix
files_changed: [css/chapters/ch2.css]
