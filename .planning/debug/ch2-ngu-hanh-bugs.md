---
status: resolved
trigger: "Chương 2 nhiều lỗi: click không hiệu ứng, ảnh nguyên liệu không load (chưa xóa nền), transform conflict"
created: 2026-06-16
updated: 2026-06-16
---

# Current Focus
hypothesis: "3 root causes confirmed and fixed"
next_action: "n/a — resolved"

# Evidence
- timestamp: 2026-06-16T10:00
  observation: "assets/animation-banh-phu-the/ có ảnh nhưng chưa xóa nền; background-remover/ có đầy đủ 5 ảnh đã xóa nền"
- timestamp: 2026-06-16T10:05
  observation: "IMGS object trong animation file CHỈ có banh-frame-1..7 và soi-lat-do. ladong/lachuoi/dua/dau/duong KHÔNG tồn tại"
- timestamp: 2026-06-16T10:10
  observation: "CSS .bpt-ngu-hanh__item có animation: bpt-ring-counter → override style.transform set bởi positionItems()"
- timestamp: 2026-06-16T10:15
  observation: ".is-active { transform: scale(1.2) !important } → override JS translate(x,y) → item nhảy về giữa"

# Resolution
root_cause: "3 bugs: (1) img src path sai → dùng background-remover/, (2) CSS animation conflict với JS transform → dùng CSS vars --tx/--ty, (3) !important override → dùng --item-scale var"
fix: "Rewrote CH2 CSS+JS: positionItems() set --tx/--ty CSS vars thay vì style.transform, .item-inner wrapper counter-rotates thay vì .item, is-active/dimmed dùng --item-scale var, img src → background-remover/, bánh center → base64 inline"
verification: "JS syntax OK (node -c), HTML structure valid (5 buttons with item-inner), CSS vars present, asset paths correct"
files_changed:
  - index.html (img src, thêm item-inner wrappers, banh center base64)
  - css/custom.css (rewrite CH2 block, bpt-counter-spin, --tx/--ty/--item-scale)
  - js/custom.js (rewrite CH2 block, CSS var positioning)
