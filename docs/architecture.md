# Kiến trúc v5.1

## Data flow

`User Event → AppController → Model → AppState.patch() → UIManager.render()`

### Model
Không truy cập DOM. Bao gồm:
- `NumerologyCalculator`
- `LunarConverter`
- `AstrologyCalculator`
- `TarotEngine`
- `DateScorer`

### View
`UIManager` chỉ render giao diện và animation.

### Controller
`AppController` dùng event delegation ở document-level, đọc input và gọi Model.

### State
`AppState` là nguồn trạng thái trung tâm: view, profile, Tarot result, date result.

## Vì sao kiến trúc này tốt hơn 1 file?
- Có thể sửa Tarot độc lập với Tử vi.
- Browser cache từng CSS/JS riêng.
- Dễ lazy-load feature trong bản kế tiếp.
- Dễ viết unit test cho Model.
- Dễ thêm backend/API mà không trộn với DOM.
- Git diff nhỏ và ít conflict hơn khi nhiều người cùng làm.
