# 🎯 HƯỚNG DẪN FRONT-END AGENT — BÁNH PHU THÊ WEBSITE

## 1. TỔNG QUAN DỰ ÁN

Website storytelling văn hóa về **Bánh Phu Thê** — đặc sản Đình Bảng, Bắc Ninh.  
Mục tiêu: Kể câu chuyện nguồn gốc → cấu tạo → kỹ nghệ → văn hóa đương đại → lời thề thủy chung thông qua scroll-driven interactive web.

**Tech stack hiện tại:**
- Platform: **Shorthand** (story editor, quản lý sections/backgrounds)
- Custom CSS: `css/custom.css` (additive overrides only, không edit Shorthand runtime CSS)
- Custom JS: `js/custom.js` (scroll observer, progress bar, scene effects)
- Fonts: Josefin Sans, Lato, Mulish, Oswald, Outfit, PT Serif, Poppins, Quicksand (Google Fonts)
- Layout: Full-width sections, 100vh hero, backdrop-filter glassmorphism cards

**Nguyên tắc bắt buộc:**
- ✅ Chỉ thêm CSS vào `css/custom.css` — KHÔNG sửa `style-00.css` → `style-04.css`
- ✅ Chỉ thêm JS vào `js/custom.js` — KHÔNG sửa `inline-*.js`, `story.*.min.js`, `footer.*.min.js`
- ✅ Giữ nguyên cấu trúc Shorthand section IDs
- ✅ Ưu tiên CSS-first animations, chỉ dùng JS khi cần scroll trigger / interaction logic
- ✅ Responsive: mobile-first, test tại 375px / 768px / 1440px

---

## 2. CẤU TRÚC 5 CHƯƠNG — NỘI DUNG & INTERACTION

### COVER / HERO
| Yếu tố | Yêu cầu |
|--------|---------|
| Background | Ảnh làng quê Bắc Ninh với yếu tố nổi bật |
| Trung tâm | Hình bánh Phu Thê đặt giữa |
| Tone | Tươi sáng, ấm áp |
| Text | Title: "BÁNH PHU THÊ" / Sub: "GÓI TRỌN LỜI THỀ SẮC SON QUA HÀNG THIÊN NIÊN KỶ" / "ĐÌNH BẢNG - TỪ SƠN BẮC NINH" |
| Effect | Hiện tại: glassmorphism card + backdrop-filter. Cần: thêm animation chữ xuất hiện theo thứ tự (title → sub → kicker) |

### CHƯƠNG I — Nguồn gốc của Bánh Phu Thê
**5 phần — scroll reveal từng phần:**

| Phần | Asset | Hiệu ứng |
|------|-------|----------|
| 1. Vùng đất Kinh Bắc | Background thủy mặc + Ảnh cổng làng | Cổng làng fade-in on scroll, background parallax nhẹ |
| 2. Truyền thuyết | Tranh minh họa truyền thuyết | Tranh + text slide-in từ 2 bên |
| 3. Dấu ấn lịch sử | Ảnh cung đình nhà Lý / tư liệu | Fade-in + text bên cạnh |
| 4. Làng nghề truyền thống | Ảnh nghệ nhân làm bánh | Fade-in + text bên cạnh |
| 5. Chiếc bánh Phu Thê | Ảnh bánh thành phẩm | Bánh center → **zoom dần vào bánh** khi cuộn tiếp → chuyển sang Chương II |

**Nội dung text:** Xem file `TTHT END TERM.txt` — Chương 1 (từ "Dưới bóng thâm nghiêm..." đến "nhắc nhở đôi lứa về đạo nghĩa vợ chồng")

---

### CHƯƠNG II — Ngọt Bùi Hòa Quyện, Vẹn Tròn Đạo Phu Thê
**3 phần — interactive + scroll reveal:**

| Phần | Asset | Hiệu ứng |
|------|-------|----------|
| 1. Ngũ Hành trong chiếc bánh | Bánh trung tâm + 5 nguyên liệu vòng tròn | **INTERACTIVE**: 5 nguyên liệu (Mộc/Kim/Thổ/Hỏa/Thủy) chuyển động nhẹ quanh bánh. **Click** → highlight thành phần + hiển thị text Ngũ Hành tương ứng + phàn bánh nổi bật |
| 2. Hương vị hòa hợp | Vỏ bánh, nhân đậu, sợi dừa, hoa bưởi | Từng nguyên liệu appear on scroll + text mô tả hương vị bên cạnh |
| 3. Trích dẫn nghệ nhân | Ảnh nghệ nhân | Trích dẫn Nguyễn Đình Minh (68 tuổi) trong khối quote nổi bật |

**Chi tiết Ngũ Hành (dữ liệu cho interactive):**
- 🟢 **Mộc** (Xanh - Lá dong/chuối): Sinh sôi, phát triển, mái ấm đơm hoa
- ⚪ **Kim** (Trắng - Dừa nạo, đường ngọt thanh): Tinh khiết, thủy chung, bền vững
- 🟡 **Thổ** (Vàng - Quả dành dành, nhân đậu xanh): Ổn định, ấm áp, nền tảng hạnh phúc
- 🔴 **Hỏa** (Đỏ - Sợi lạt đỏ buộc bánh): Niềm vui cưới, ngọn lửa yêu thương
- 🔵 **Thủy** (Nước - Vỏ trong veo): Hài hòa, linh hoạt, dòng chảy cảm xúc

**Nội dung text:** Xem `TTHT END TERM.txt` — Chương 2 (từ "Nếu chỉ nhìn thoáng qua..." đến "gìn giữ một phần hồn cốt văn hóa Việt Nam")

---

### CHƯƠNG III — Kỹ nghệ tạc hình hạnh phúc
**3 phần — infographic + quote:**

| Phần | Asset | Hiệu ứng |
|------|-------|----------|
| 1. Divider | Chữ "Kỹ nghệ tạc hình hạnh phúc" | Fade-in divider |
| 2. Quy trình làm bánh | Infographic vòng tròn: 5 vòng nhỏ icon + 1 hình trung tâm (nghệ nhân ép bột khuôn đồng) | **INTERACTIVE**: Circular flow, 6 bước click/scroll → hiển thị chi tiết từng bước |
| 3. Trích dẫn thợ làm bánh | Quote Nguyễn Đăng Mạnh | Khối quote nổi bật |

**6 bước quy trình (dữ liệu cho infographic):**
1. Chọn nguyên liệu — nếp cái hoa vàng, đỗ xanh, đường mía
2. Sên nhân đậu xanh — lửa nhỏ, đảo đều tay nhiều giờ
3. Ủ bột + nước dành dành — căn màu vàng chuẩn xác
4. Nặn bánh vuông — tay dàn đều, kín kẽ không hở
5. Hấp bánh — vỏ chuyển vàng trong óng ánh
6. Gói lá + buộc lạt đỏ — nút chữ Thập, không lỏng không chặt

**Sợi chỉ đỏ:** Chạy dọc bên trái toàn timeline 6 bước — như đường kẻ kết nối, đến bước 6 thì "buộc" thật sự vào bánh.

**Nội dung text:** Xem `TTHT END TERM.txt` — phần quy trình làm bánh chi tiết

---

### CHƯƠNG IV — Lát cắt văn hóa trong nhịp sống đương đại
**4 phần — before/after slider + scroll:**

| Phần | Asset | Hiệu ứng |
|------|-------|----------|
| 1. Divider | Chữ "Lát cắt văn hóa trong nhịp sống đương đại" | Fade-in |
| 2. Before/After | Bánh Phu Thê truyền thống ↔ Hiện đại | **SLIDER**: Kéo nút ← xưa / → nay. Thanh trượt chuyển đổi hình ảnh |
| 3. Title | "TỪ CHIẾC CHÕNG TRE ĐẾN TIỆC CƯỚI SANG TRỌNG" | Appear with slider |
| 4. Món quà hạnh phúc | Ảnh bánh làm quà biếu tặng | Fade-in + text bên cạnh |

**Assets:** Ảnh tráp ăn hỏi, bàn thờ gia tiên, bánh truyền thống, bánh hiện đại, bánh quà tặng

---

### CHƯƠNG V — Lời Thề Còn Đó, Vị Ngọt Còn Đây
**4 phần — scroll-driven animation + audio:**

| Phần | Asset | Hiệu ứng |
|------|-------|----------|
| 1. Hạnh phúc hôm nay | Ảnh đôi trẻ áo dài cầm tráp bánh trước cổng nhà cổ | Wide shot fullscreen + text bên cạnh/dưới |
| 2. Lời thề thủy chung | Audio podcast + nhạc quan họ | Nút play audio, text trích dẫn nổi bật khi phát |
| 3. Đi tìm giá trị cốt lõi | 4 frame bánh (nguyên lá → mở 30% → mở 60% → mở hoàn toàn) | **SCROLL-DRIVEN**: Cuộn → chuyển frame 1→2→3→4. Lá mở dần, lộ bánh vàng bên trong. Text kết bài đồng thời xuất hiện |
| 4. Thưởng bánh | Ảnh bánh thành phẩm | Bánh center + thông điệp kết thúc + CTA button |

**Thông điệp kết:** *"Giống như chiếc bánh Phu Thê phải mở lớp lá xanh mới thấy được phần nhân vàng óng bên trong, con người cũng phải đi qua những thăng trầm của cuộc sống mới tìm thấy giá trị cốt lõi của hạnh phúc và sự gắn bó."*

**Câu ca dao cuối:** *"Đôi ta như bánh phu thê / Đẹp duyên, vẹn nghĩa, chẳng nề gian nan."*

---

## 3. DESIGN SYSTEM

> Cập nhật từ `COLOUR PALLET.pdf`: tài liệu PDF này là visual direction chính cho màu, font, key visual, minh họa và một số layout mẫu. Các màu/font dưới đây ưu tiên theo PDF; các màu Ngũ Hành cũ chỉ dùng như màu phụ trong interactive khi cần phân biệt trạng thái.

### Màu sắc

#### 3.1 Palette chính từ `COLOUR PALLET.pdf`
| Token | Mã màu | Vai trò | Mô tả sử dụng chi tiết |
|-------|--------|---------|-------------------------|
| `--color-rice-paper` | `#F7E8CB` | Nền kem / giấy dó | Dùng làm nền sáng chủ đạo cho toàn bộ emagazine, đặc biệt các section kể chuyện, quote, infographic. Tạo cảm giác giấy thủ công, làng nghề, mềm và ấm. Không dùng trắng tinh nếu không bắt buộc. |
| `--color-sticky-rice-gold` | `#F8D077` | Vàng bánh / nhân đậu | Dùng cho highlight nhẹ, hover state, icon nguyên liệu, vệt sáng trên bánh, underline tiêu đề phụ. Tránh dùng làm nền text dài vì dễ giảm contrast. |
| `--color-betel-leaf-green` | `#698456` | Xanh lá chính | Dùng cho heading chính, nhãn chương, border trang trí, icon lá, trạng thái active dịu. Đây là màu nhận diện chính thay cho xanh `#4A7C59` cũ. |
| `--color-red-thread` | `#972023` | Đỏ lạt / key visual | Dùng cho CTA, sợi lạt đỏ xuyên suốt, timeline, slider handle, chapter number, emphasis quan trọng. Đây là màu đỏ chính thay cho `#C41E3A` cũ khi cần bám PDF. |

#### 3.2 Mapping palette vào UI
| Thành phần | Màu đề xuất | Ghi chú triển khai |
|------------|-------------|--------------------|
| Body background | `#F7E8CB` hoặc lớp texture giấy dó nhạt | Có thể thêm noise/paper texture opacity thấp để giống slide PDF. |
| Heading lớn | `#698456` trên nền sáng, `#F7E8CB` trên nền ảnh tối | Heading trong PDF dùng xanh lá, chữ rất cao/nén, uppercase. |
| Heading section / emphasis | `#972023` | Dùng đỏ cho tên block lớn như “KEY VISUAL”, “CẤU TẠO NGŨ HÀNH”. |
| Body text | `#1A1A1A` / `#221A14` | PDF dùng body serif đen, không quá xám. |
| Quote | `#698456`, italic/script | Quote nổi bật màu xanh, mềm hơn heading. |
| Button chính | nền `#972023`, text `#F7E8CB` | Hover: nền tối hơn, thêm shadow đỏ nhẹ. |
| Card / panel | `rgb(247 232 203 / 0.88)` hoặc trắng kem | Ưu tiên paper-card hơn glassmorphism đen nếu section sáng. |
| Border / divider | `#972023` hoặc `#698456` | Divider mảnh, giống sợi lạt/dòng dẫn chuyện. |

#### 3.3 Palette Ngũ Hành phụ
Palette này vẫn dùng riêng cho interactive Chương II để phân biệt 5 hành. Khi conflict visual, ưu tiên palette PDF ở trên.

| Hành | Mã màu | Sử dụng |
|------|--------|---------|
| Mộc | `#4A7C59` | Accent xanh lá, lá dong |
| Kim | `#F5F0E8` | Background sáng, text nhẹ, dừa |
| Thổ | `#D4A843` | Accent vàng, nhân đậu, vỏ bánh |
| Hỏa | `#C41E3A` | Lạt đỏ, CTA, highlight |
| Thủy | `#6B9BC3` | Accent nước, vỏ trong |
| Nền chính | `#1A1A1A` / `#F5F0E8` | Dark/Light section toggle |
| Text chính | `#FFFFFF` (dark bg) / `#1A1A1A` (light bg) | — |

### Typography

#### 3.4 Font direction từ `COLOUR PALLET.pdf`
| Cấp chữ | Font trong PDF | Vai trò | Fallback web đề xuất | Mô tả style |
|---------|----------------|---------|----------------------|-------------|
| Tiêu đề chính | `DNS GIBSONS ONE SEMI BOLD` | Title hero, chapter title lớn, block title quan trọng | `Oswald`, `Bebas Neue`, `Anton`, `Josefin Sans` | Chữ uppercase/condensed, rất cao, nét dày, tạo cảm giác poster văn hóa đương đại. Tracking hơi chặt, line-height thấp. |
| Tiêu đề phụ | `DFVNWESTWES` | Subtitle chương, dòng mềm “Bánh phu thê, lạt mềm buộc chặt” | `Vollkorn`, `PT Serif`, `Cormorant Garamond` | Serif trang trí, mềm hơn title, dùng màu xanh lá. Không dùng quá nhiều để tránh rối. |
| Nội dung | `Vollkorn` | Body copy dài, storytelling | `Vollkorn`, `PT Serif`, `Georgia` | PDF dùng serif đen, đọc như bài báo/emagazine. Ưu tiên paragraph rộng vừa, line-height 1.65–1.8. |
| Trích dẫn | `MJ MILESTONE FONT` | Ca dao, quote nghệ nhân, câu kết | `Pacifico`, `Dancing Script`, `Playfair Display Italic` | Script/italic mềm, màu xanh lá, size lớn, đặt thoáng. Chỉ dùng cho quote ngắn. |

#### 3.5 Quy tắc chữ
- **Hero title**: uppercase `BÁNH PHU THÊ`, màu `#698456`, font condensed, size `clamp(4rem, 13vw, 12rem)`, line-height `0.85–0.95`.
- **Chapter subtitle**: màu `#698456`, serif decorative, size `clamp(1.6rem, 4vw, 4rem)`, đặt ngay dưới title.
- **Body**: dùng serif `Vollkorn`/fallback, size `clamp(1.05rem, 1.6vw, 1.45rem)`, line-height `1.7`, max-width `760px`.
- **Quote**: script/italic, màu `#698456`, căn giữa hoặc lệch nhẹ, size lớn hơn body 1.4–1.8 lần.
- **Kicker/Label**: dùng condensed uppercase màu `#972023`, tracking `0.04em–0.08em`.
- **Không trộn quá nhiều font trong cùng một viewport**: mỗi màn hình tối đa 3 cấp chữ rõ ràng: title/subtitle/body hoặc body/quote/label.
- Kích thước cũ vẫn hợp lệ khi cần nhanh: `clamp(2rem, 5vw, 4.75rem)` cho heading thường.

### Key Visual — Sợi Lạt Đỏ

`COLOUR PALLET.pdf` xác định **sợi lạt đỏ** là hình ảnh dẫn dắt xuyên suốt toàn bộ emagazine. Đây không chỉ là chi tiết buộc bánh mà là metaphor chính cho tình yêu, hôn nhân, gia đình và sự kết nối truyền thống–hiện đại.

#### 3.6 Ý nghĩa cần thể hiện
| Biểu tượng | Cách diễn giải trong UI |
|------------|--------------------------|
| Dòng thời gian | Sợi đỏ chạy dọc/trục ngang qua các mốc lịch sử, chương I → IV. |
| Con đường lịch sử | Sợi đỏ như path dẫn mắt người đọc qua từng scene. |
| Tơ hồng nhân duyên | Sợi đỏ nối nhân vật, quote, tráp cưới, câu ca dao. |
| Dây buộc chiếc bánh | Sợi đỏ ôm/đóng khung ảnh bánh, tạo motif packaging. |
| Kết nối truyền thống và hiện đại | Sợi đỏ chuyển từ nét vẽ thủ công sang line UI hiện đại/slider/timeline. |

#### 3.7 Pattern triển khai sợi lạt
- **Progress indicator**: thay progress bar thường bằng line đỏ mảnh, có node tại mỗi chương.
- **Chapter divider**: dùng một đường lạt đỏ uốn nhẹ đi qua số chương hoặc title.
- **Timeline Chương III**: line đỏ chính là trục quy trình, node đỏ là từng bước làm bánh.
- **Before/After slider Chương IV**: handle slider mô phỏng nút/khoen lạt đỏ; đường chia ảnh là một sợi lạt kéo dọc.
- **Interactive Ngũ Hành**: Hỏa/lạt đỏ là điểm nhấn active, không để các màu khác lấn át key visual.
- **Closing Chương V**: sợi đỏ gom các scene về câu kết “Lời thề còn đó, vị ngọt còn đây”.
- **Motion**: line reveal theo scroll bằng `scaleX/scaleY`, tốc độ chậm, không rung/nhấp nháy.

### Art Direction / Minh họa

#### 3.8 Style hình ảnh từ PDF
- **Bánh Phu Thê**: vẽ theo phong cách watercolor/hand-drawn trên nền giấy, có lá xanh, bánh vàng, lạt đỏ, cảm giác thủ công. Nếu dùng ảnh thật, nên xử lý tách nền/xóa phông và đặt trên nền kem để đồng bộ.
- **Nhân vật kể chuyện**: vẽ nhân vật dân gian/áo truyền thống theo nét minh họa phẳng, thanh, màu trầm; chèn text từng scene cạnh nhân vật thay vì overlay dày lên ảnh.
- **Texture**: ưu tiên giấy dó, grain, mép giấy, nét mực/watercolor nhẹ. Tránh gradient neon, glassmorphism quá hiện đại hoặc shadow nặng.
- **Layout**: nhiều khoảng trắng, text căn giữa hoặc chia 2 cột rộng; không cần card dày nếu nền đã sạch.
- **Reference visual**: PDF có link Behance `https://www.behance.net/gallery/248676567/Nhu-Dua-Co-Doi-Card-Design?tracking_source=search_projects|vietnamese+culture&l=97` làm nguồn cảm hứng văn hóa Việt/thiệp minh họa.

#### 3.9 Scene direction theo PDF
| Scene / Component | Direction bổ sung |
|-------------------|-------------------|
| Cover / Hero | Title cực lớn màu xanh trên nền kem/ảnh sáng; subtitle dưới title; quote script xanh ở cuối màn hình. |
| Chương I | Có thể mở bằng layout poster: title xanh lớn, subtitle serif xanh, paragraph serif đen, quote script xanh. |
| Truyền thuyết | Dùng nhân vật minh họa truyền thống; text theo từng scene cạnh nhân vật, không cần ảnh thật nếu chưa có. |
| Bánh minh họa | Ưu tiên vẽ bánh giống slide PDF: lá xanh, bánh vàng, lạt đỏ, nét watercolor theo main inspo. |
| Ngũ Hành | PDF đưa 2 hướng: option 1 dạng exploded ingredients + text list; option 2 dạng vòng tròn quanh bánh. FE có thể giữ interactive vòng tròn nhưng style nên theo nền kem + minh họa mềm. |
| Chương IV | Headline “Từ chiếc chõng tre đến tiệc cưới sang trọng”; before/after slider dùng nhãn “thời xưa” / “hiện đại”. |
| Ba miền | Có scene “nối dọc 3 miền”: dùng sợi đỏ/đường map kết nối Bắc–Trung–Nam, mỗi điểm có bánh/phong tục tương ứng. |
| Truyền thống vs hiện đại | Dùng hình bánh Phu Thê truyền thống đã xóa phông, đặt trên nền kem, đối chiếu với packaging/tráp hiện đại. |
| Closing | Dòng kết chính: “LỜI THỀ CÒN ĐÓ, VỊ NGỌT CÒN ĐÂY” — dùng title đỏ/xanh lớn, nền tối giản. |

### Spacing
- Section padding: `clamp(24px, 6vw, 80px)`
- Card padding: `clamp(24px, 4vw, 48px)`
- Card max-width: `min(620px, 92vw)`
- Border-radius cards: `18px` (desktop), `14px` (mobile)

### Hiệu ứng chung
- Paper-card mặc định: `background: rgb(247 232 203 / 0.88); border: 1px solid rgb(151 32 35 / 0.18); box-shadow: 0 18px 60px rgb(34 26 20 / 0.12)`
- Glassmorphism chỉ dùng trên ảnh tối: `background: rgb(0 0 0 / 0.34); backdrop-filter: blur(10px); border: 1px solid rgb(255 255 255 / 0.18)`
- Scroll reveal: `IntersectionObserver` threshold `[0.25, 0.5, 0.75]`
- Scene transition: progress bar + light sweep + orb (đã có trong custom.css/js)
- Red-thread reveal: pseudo-element `::before`/`::after` màu `#972023`, animate `transform: scaleX()` hoặc `scaleY()` theo scroll state
- `prefers-reduced-motion`: tắt toàn bộ animation

---

## 4. INTERACTIVE COMPONENTS — SPEC CHI TIẾT

### 4.1 Ngũ Hành Interactive (Chương II)
```
Layout: Bánh trung tâm + 5 nguyên liệu vòng tròn
Position: 5 items = 72° apart (360°/5)
Animation: rotate nhẹ (CSS animation, 20s infinite)
Click behavior:
  - Click item → item scale(1.15) + glow shadow
  - Các item khác → opacity 0.4
  - Text panel hiện → hiển thị ý nghĩa Ngũ Hành
  - Click lại / click item khác → chuyển đổi
Mobile: Stack dọc, bánh trên + 5 items dưới dạng list
```

### 4.2 Infographic Quy trình (Chương III)
```
Layout: Circular flow — 5 vòng nhỏ quanh 1 hình trung tâm
6 bước: số đỏ + icon + text ngắn
Sợi chỉ đỏ: border-left 2px #C41E3A chạy dọc timeline
Click/scroll từng bước → highlight bước + text chi tiết hiện
Mobile: Chuyển sang vertical timeline (sợi chỉ đỏ dọc bên trái)
```

### 4.3 Before/After Slider (Chương IV)
```
Container: position relative, overflow hidden
2 images: position absolute, full container
Slider handle: absolute, draggable, cursor ew-resize
- Default: 50/50 split
- Kéo handle → clip-path hoặc width thay đổi
- Labels: "Thời xưa" (trái) / "Hiện nay" (phải)
Mobile: Tab toggle thay vì slider (do touch UX)
```

### 4.4 Scroll-Driven Frame Animation (Chương V, Phần 3)
```
4 frames: bánh nguyên lá → mở 30% → mở 60% → mở hoàn toàn
Trigger: scroll position trong section
Implementation:
  - 4 <img> stacked, opacity 0/1 dựa trên scroll %
  - Section scroll: 0-25% → frame 1, 25-50% → frame 2, 50-75% → frame 3, 75-100% → frame 4
  - Text kết bài fade-in đồng thời frame 3-4
  - CSS: opacity transition 300ms
  - JS: scroll listener → tính ratio → switch frame
```

### 4.5 Audio Player (Chương V, Phần 2)
```
Custom UI: Nút play/pause + waveform animation
Audio: podcast + nhạc quan họ nền
Khi phát: text trích dẫn fadeIn + highlight
Accessibility: aria-label, keyboard play/pause (Space)
```

---

## 5. THỨ TỰ IMPLEMENT

| Bước | Task | File | Priority |
|------|------|------|----------|
| 1 | Cấu trúc HTML cho 5 chương (section IDs, dividers, text blocks) | `index.html` | P0 |
| 2 | Base styles: colors, typography, spacing, glassmorphism | `css/custom.css` | P0 |
| 3 | Cover hero: animation chữ xuất hiện + background parallax | `css/custom.css` + `js/custom.js` | P0 |
| 4 | Chương I: scroll reveal 5 phần + zoom vào bánh cuối chương | `js/custom.js` | P0 |
| 5 | Chương II: Ngũ Hành interactive (click → highlight + text) | `css/custom.css` + `js/custom.js` | P1 |
| 6 | Chương III: Infographic vòng tròn + timeline dọc mobile | `css/custom.css` + `js/custom.js` | P1 |
| 7 | Chương IV: Before/After slider | `css/custom.css` + `js/custom.js` | P1 |
| 8 | Chương V: 4-frame scroll animation + audio player | `css/custom.css` + `js/custom.js` | P2 |
| 9 | Responsive polish + reduced-motion + final QA | All | P2 |

---

## 6. CHECKLIST QUALITY

- [ ] Mỗi chapter có divider rõ ràng (chữ chương + số La Mã)
- [ ] Scroll reveal mượt, không giật (IntersectionObserver + CSS transform/opacity)
- [ ] Interactive elements: hover/click state rõ, cursor pointer
- [ ] Mobile: mọi interactive có fallback (tab thay slider, list thay vòng tròn)
- [ ] `prefers-reduced-motion: reduce` → tắt animation, giữ nội dung hiển thị
- [ ] Alt text cho mọi ảnh (mô tả bằng tiếng Việt)
- [ ] Không có console error
- [ ] Font load: kiểm tra Google Fonts có render đúng
- [ ] Performance: tránh layout thrashing, dùng `will-change` đúng chỗ, `requestAnimationFrame`

---

## 7. ASSETS CẦN CHUẨN BỊ

### Chương I
1. Background thủy mặc
2. Ảnh cổng làng Kinh Bắc
3. Tranh minh họa truyền thuyết bánh Phu Thê
4. Ảnh minh họa lịch sử/cung đình nhà Lý
5. Ảnh nghệ nhân làm bánh
6. Ảnh bánh Phu Thê thành phẩm

### Chương II
1. Bánh Phu Thê trung tâm (high-res, transparent background)
2. 5 icon/minh họa: lá dong, dừa nạo, đậu xanh/dành dành, sợi lạt đỏ, nước/vỏ bánh
3. Ảnh nghệ nhân Nguyễn Đình Minh

### Chương III
1. Hình minh họa nghệ nhân ép bột khuôn đồng
2. 6 icon quy trình (chọn, sên, ủ, nặn, hấp, gói)
3. Ảnh thợ Nguyễn Đăng Mạnh

### Chương IV
1. Ảnh bánh Phu Thê truyền thống (chợ quê)
2. Ảnh bánh Phu Thê hiện đại (tráp cưới/hộp quà)
3. Ảnh tráp ăn hỏi
4. Ảnh bánh trên bàn thờ
5. Ảnh bánh làm quà biếu

### Chương V
1. Ảnh đôi trẻ áo dài cầm tráp
2. Audio podcast + nhạc quan họ
3. Frame 1-4: bánh từ nguyên lá → mở hoàn toàn
4. Ảnh bánh thành phẩm (closing)

---

*Tài liệu này là nguồn chân lý (single source of truth) cho FE agent. Mọi quyết định thiết kế đều tham chiếu về đây.*
