# Huyền Các v5.2 — Deep Analysis & 3D Experience

SPA static thuần HTML/CSS/JavaScript, không database, không backend và không có bước build bắt buộc. Bản v5.2 giữ kiến trúc module của v5.1 nhưng bổ sung phân tích sâu hơn và một lớp tương tác 3D được tối ưu để không gắn `pointermove` listener cho từng card.

## Deploy GitHub Pages

Upload toàn bộ thư mục này lên repository. Trong GitHub chọn **Settings → Pages → Build and deployment → Deploy from a branch**, chọn branch `main` và `/ (root)`.

`.nojekyll`, `manifest.webmanifest` và Service Worker đã cấu hình theo đường dẫn tương đối, vì vậy vẫn hoạt động khi website nằm trong subfolder dạng `username.github.io/repository/`.

## Nâng cấp chính v5.2

- Tarot: mặt sau lá bài, animation chia bài + lật 3D, tilt theo con trỏ, phân tích mẫu xuôi/ngược và pha Major Arcana nổi bật.
- Thần số học: thêm lớp tương quan Chủ đạo↔Biểu đạt, Linh hồn↔Nhân cách, Chủ đạo↔Năm cá nhân và nhóm chỉ số nổi bật.
- Tử vi: thêm ma trận quan hệ Địa Chi giữa trụ năm, ngày và giờ; tóm tắt hành Thiên Can nổi bật và Cung phi.
- Xem ngày: thêm Lục hợp và Tứ hành xung vào mô hình tham khảo, Top 3, phân bố điểm toàn khoảng và độ tách biệt giữa ngày #1 và #2.
- Performance: State bỏ qua patch không đổi, scroll dùng `requestAnimationFrame`, 3D dùng một delegated pointer listener, hỗ trợ `prefers-reduced-motion`, `content-visibility` cho khối dài.
- Service Worker: cache theo scope tương đối, phù hợp GitHub Pages project site.

## Cấu trúc

```text
Huyen_Cac_v5_2_Deep_3D/
├─ index.html
├─ manifest.webmanifest
├─ sw.js
├─ package.json
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css
│  │  ├─ components.css
│  │  ├─ layout.css
│  │  ├─ motion.css
│  │  ├─ responsive.css
│  │  └─ features/
│  │     ├─ home.css
│  │     ├─ shared.css
│  │     ├─ tarot.css
│  │     ├─ numerology.css
│  │     ├─ horoscope.css
│  │     └─ dates.css
│  └─ js/
│     ├─ app.js
│     ├─ data/
│     ├─ utils/
│     ├─ models/
│     ├─ state/
│     ├─ config/
│     ├─ views/
│     ├─ controllers/
│     └─ services/
│        ├─ service-worker-client.js
│        └─ interaction-manager.js
├─ tests/
│  └─ model-smoke.mjs
└─ docs/
   └─ architecture.md
```

## Test logic tùy chọn

Nếu máy có Node.js, có thể chạy `npm test`. Website không cần Node.js để chạy trên GitHub Pages.
