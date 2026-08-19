# Huyền Các v5.5 — Architecture

## Dual runtime

Source bảo trì được tách thành ES modules trong `assets/js/`; trình duyệt tải `assets/js/app.bundle.js` dạng classic deferred script để cùng một source chạy được bằng `file://` và GitHub Pages.

```text
ES module source
  ↓ bundle
app.bundle.js
  ├─ file://
  └─ GitHub Pages
```

Service Worker và Manifest chỉ kích hoạt trên `http:` / `https:`.

## Runtime flow

```text
DOM Event
  ↓
AppController (event delegation)
  ↓
Pure Model
  ├─ TarotEngine
  ├─ NumerologyCalculator
  ├─ LunarConverter
  ├─ AstrologyCalculator
  ├─ CompatibilityCalculator
  └─ DateScorer
  ↓
AppState.patch()
  ↓ only changed keys
UIManager.render()
  ↓
DOM
```

## Compatibility model

`CompatibilityCalculator` không thao tác DOM. Nó tạo snapshot của hai hồ sơ rồi tổng hợp sáu chiều:

1. Giá trị & hướng sống
2. Nhu cầu cảm xúc
3. Giao tiếp & biểu đạt
4. Can Chi & Ngũ hành
5. Phát triển & bổ trợ
6. Nhịp hiện tại

Trọng số thay đổi nhẹ theo ngữ cảnh Tổng quan / Tình cảm / Bạn bè / Công việc / Gia đình. Điểm tổng hợp là **UI reference score**, không phải xác suất, chẩn đoán hoặc dự đoán mối quan hệ.

## State/privacy

`AppState` có `compatibility`, nhưng hồ sơ người được so sánh không được ghi qua `StorageModel`. Chỉ hồ sơ chính của người dùng được lưu LocalStorage nếu họ đồng ý.

## 3D interaction

`InteractionManager` dùng một delegated `pointermove` + `requestAnimationFrame`. Tarot tách riêng:

```text
.tarot-card-shell → pointer tilt
.tarot-card-inner → front/back flip
.tarot-reading    → deal entrance
```

Các feature cards, metric cards và compatibility cards dùng tilt nhẹ; hiệu ứng tự tắt với coarse pointer và `prefers-reduced-motion`.

## Reference-first UX

Một notice toàn cục và disclaimer trong chức năng Độ hợp nhắc rõ: Tarot/Thần số học/Can Chi/điểm độ hợp chỉ là hệ quy chiếu tham khảo. Người dùng cần ưu tiên hành vi, giao tiếp, giá trị, ranh giới, hoàn cảnh và quyền tự quyết.
