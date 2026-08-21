# Huyền Các v5.9 — Dễ hiểu trước, chi tiết sau

Bản này ưu tiên người dùng phổ thông: mỗi chức năng hiển thị **kết luận → nên làm gì → phần “Vì sao?”**. Thuật ngữ, điểm số nội bộ và công thức vẫn được giữ nhưng mặc định thu gọn.

# Huyền Các v5.9 — Fortune Flow & Private Identity

Bản static chạy được cả `file:///.../index.html` và GitHub Pages.

## Thay đổi chính v5.9

- **Xem bói** được tổ chức lại theo đúng mạch: **Tài chính → Tương lai nên làm gì/cần tránh gì dựa vào độ tuổi → Đường tình duyên**.
- Các phân tích tương lai sử dụng **độ tuổi hiện tại + năm cá nhân + các trục thần số học** để đưa ra ưu tiên thực hành; không trình bày như dự đoán sự kiện chắc chắn.
- Thêm **CCCD và số điện thoại tùy chọn** ở hồ sơ chính và hồ sơ người so sánh. Dữ liệu gốc không tham gia các phép tính huyền học và không được lưu; ứng dụng chỉ tạo một fingerprint cục bộ để phân biệt các hồ sơ có tên/ngày sinh giống nhau.
- Fingerprint cục bộ chỉ được dùng để phân biệt profile và giúp trải Tarot deterministic không bị trùng hoàn toàn ở hai hồ sơ giống dữ liệu cơ bản.
- Mọi nội dung vẫn có nguyên tắc: **kết quả chỉ để tham khảo; hành vi, hoàn cảnh và quyết định của chính mỗi người quan trọng hơn mô hình tính toán**.

Static SPA thuần HTML/CSS/JavaScript. Không cần database hoặc backend.

## Chạy trực tiếp bằng file://

Giải nén thư mục và mở `index.html` bằng Chrome/Edge, ví dụ:

`file:///C:/Users/KHOICNM/Downloads/Huyen_Cac_v5_5_Compatibility_UX/index.html`

Runtime dùng `assets/js/app.bundle.js` dạng classic deferred script, nên không phụ thuộc ES Module khi chạy `file://`.

## GitHub Pages

Upload toàn bộ thư mục lên repository rồi bật **Settings → Pages → Deploy from a branch → main → /(root)**.

Service Worker và Web App Manifest chỉ kích hoạt trên `http/https`; khi mở bằng `file://` chúng tự bỏ qua.

## Chức năng chính

- Tarot: Auto 6 lá / 3 lá, deterministic theo dữ liệu và ngày xem, 3D flip + tilt.
- Thần số học: 8 chỉ số, tương quan nội bộ và báo cáo phân tích sâu.
- Tử vi/Can Chi: ngày âm, Can Chi năm-ngày-giờ, Tam hợp/Lục hợp/Lục xung, Cung phi, Ngũ hành.
- **Độ hợp hai người:** so sánh 6 chiều gồm giá trị & hướng sống, nhu cầu cảm xúc, giao tiếp, Can Chi & Ngũ hành, phát triển và nhịp hiện tại.
- Xem ngày: xếp hạng minh bạch, Top 3, phân bố điểm và từng yếu tố cộng/trừ.

## Nguyên tắc của chức năng “Độ hợp”

`CompatibilityCalculator` là một **mô hình tham khảo**, không phải xác suất thành công của mối quan hệ. Điểm 0–100 chỉ giúp trực quan hóa dữ liệu nội bộ của ứng dụng.

Kết quả luôn nhắc người dùng ưu tiên dữ kiện đời thực: giá trị sống, hành vi, giao tiếp, tôn trọng, ranh giới, sự an toàn, trách nhiệm và lựa chọn của chính hai người.

Thông tin người được so sánh không lưu vào LocalStorage; chỉ tồn tại trong State của trang hiện tại.

## Kiến trúc

Source ES6 được giữ trong `assets/js/` theo Model / View / Controller / State. Runtime trình duyệt dùng `assets/js/app.bundle.js` để tương thích đồng thời file:// và GitHub Pages.

Chạy smoke test logic khi cần:

`npm test`


## v5.6 — Trang Độ hợp được thiết kế lại
- Chuyển từ dashboard chấm điểm sang “bản đồ mối quan hệ”.
- Form hai hồ sơ hiển thị đối xứng, không còn sidebar dài.
- Điểm tổng được hạ vai trò; ưu tiên mẫu quan hệ, đồng điệu nền tảng và vùng cần chủ động.
- Can Chi/Ngũ hành/Cung phi chuyển xuống phần tham khảo mở rộng.
- Thêm 3 câu hỏi đối thoại theo ngữ cảnh quan hệ.
- Giảm checklist thực tế còn 4 tiêu chí cốt lõi.


## v5.7.1 — Xem bói tự nhiên hơn & Xem ngày gọn hơn
- Thần số học chuyển từ dashboard điểm số sang câu chuyện vận hành: trạng thái tốt, khoảng cách trong/ngoài, điểm dễ mắc kẹt, chu kỳ hiện tại và bài tập 30 ngày.
- Các thước đo 0–100 được đưa xuống phần kỹ thuật thu gọn.
- Xem ngày chuyển sang decision-first: bộ lọc ngang, ngày nổi bật + 3 lý do chính, Top 3; phân bố và toàn bộ danh sách nằm trong accordion.


## v5.7.1
- Đồng nhất tuyệt đối chiều rộng hai trường “Từ ngày” và “Đến ngày” trên Chrome/Edge và responsive.