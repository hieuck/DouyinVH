# Douyin Vietnamese Userscript Design

**Date:** 2026-08-16

## Goal

Việt hóa giao diện hệ thống của Douyin Web bằng một userscript cài trực tiếp qua Tampermonkey hoặc Violentmonkey, đồng thời không dịch caption, hashtag, tên tài khoản hoặc nội dung do người dùng đăng.

## Scope

### Included

- Nhãn điều hướng và menu hệ thống.
- Nút, tooltip, placeholder, `aria-label` và thông báo giao diện.
- Điều khiển trình phát như tốc độ, phát liên tục, toàn màn hình và âm thanh.
- Các thành phần render sau khi tải trang hoặc thay đổi route trong SPA.

### Excluded

- Caption, hashtag, tên tài khoản, bình luận và metadata video.
- Dịch máy hoặc tự động suy đoán các chuỗi chưa có trong từ điển.
- Thay đổi URL, API, dữ liệu đăng nhập hoặc nội dung video.

## Chosen Approach

Userscript đơn tệp với ba lớp:

1. **Từ điển exact-match:** chỉ thay chuỗi UI đã biết, giữ nguyên khoảng trắng đầu/cuối và không dịch chuỗi chứa thêm nội dung.
2. **Bộ lọc vùng UI:** ưu tiên `header`, `nav`, `aside`, vùng ARIA và phần tử tương tác; loại trừ vùng nội dung feed. Các nút điều khiển trong player vẫn được phép dịch.
3. **Theo dõi DOM động:** quét lần đầu sau `document-idle`, sau đó dùng `MutationObserver` có debounce để xử lý render động mà không tạo vòng lặp.

## Runtime Behavior

- Metadata match `https://www.douyin.com/*` và chạy ở `document-idle`.
- Nếu userscript được chạy lại, controller cũ không được tạo thêm.
- Chỉ quan sát `childList`, `characterData` và ba thuộc tính giao diện: `title`, `aria-label`, `placeholder`.
- Việc dịch phải idempotent: chuỗi tiếng Việt đã dịch không bị thay đổi thêm.
- Khi không có `MutationObserver` hoặc `document`, API khởi động an toàn và không làm hỏng trang.

## Files

- `douyin-vh.user.js`: userscript độc lập, có API nội bộ để kiểm thử Node.
- `tests/douyin-vh.test.js`: kiểm thử từ điển, exact-match và chính sách vùng UI.
- `package.json`: lệnh `npm test` dùng Node built-in test runner.
- `README.md`: hướng dẫn cài đặt, cập nhật và mở rộng từ điển.

## Acceptance Criteria

- Các nhãn hệ thống quan sát được trên trang hiện tại được dịch sang tiếng Việt.
- Một caption hoặc hashtag có chứa chuỗi tiếng Trung không bị dịch nếu không phải exact-match trong vùng UI cho phép.
- Thành phần UI được thêm sau khi tải trang cũng được dịch.
- `npm test` chạy thành công.
- Userscript có thể được dán trực tiếp vào Tampermonkey/Violentmonkey mà không cần build.
