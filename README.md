# Huyền Các v5.1 — Modular Architecture

Bản này giữ nguyên chức năng của v5.0 nhưng tách dự án thành nhiều module có trách nhiệm rõ ràng.

## Deploy lên GitHub Pages

Đây là SPA static thuần HTML/CSS/JavaScript, **không có database, backend hoặc bước build bắt buộc**. Chỉ cần upload toàn bộ cấu trúc thư mục lên repository GitHub.

Trong GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**, chọn branch chứa source (thường là `main`) và thư mục `/ (root)`.

File `.nojekyll` đã được giữ sẵn để GitHub Pages phục vụ trực tiếp cấu trúc static của dự án.

## Cấu trúc

```text
Huyen_Cac_v5_1_Modular/
├─ index.html                  # SPA shell / markup
├─ manifest.webmanifest        # PWA metadata
├─ sw.js                       # cache static assets
├─ package.json
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css            # palette / design tokens
│  │  ├─ components.css        # button, panel, form, chip...
│  │  ├─ layout.css            # topbar + SPA shell
│  │  ├─ motion.css            # modal + animation
│  │  ├─ responsive.css
│  │  └─ features/
│  │     ├─ home.css
│  │     ├─ shared.css
│  │     ├─ tarot.css
│  │     ├─ numerology.css
│  │     ├─ horoscope.css
│  │     └─ dates.css
│  └─ js/
│     ├─ app.js                # entry point
│     ├─ data/                 # constants
│     ├─ utils/                # format helpers
│     ├─ models/               # pure business logic, NO DOM
│     ├─ state/                # AppState
│     ├─ config/               # FeatureConfig
│     ├─ views/                # UI rendering
│     ├─ controllers/          # event delegation / orchestration
│     └─ services/             # service worker client
├─ tests/
│  └─ model-smoke.mjs
└─ docs/
   └─ architecture.md
```

## Test logic

```bash
npm test
```

Không cần cài package ngoài.
