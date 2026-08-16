# DouyinVH

Userscript Việt hóa giao diện web Douyin, tập trung vào nhãn hệ thống và không dịch nội dung do người dùng đăng.

## Tính năng

- Dịch menu, điều hướng, nút, tooltip, placeholder, nhãn trợ năng, hồ sơ cá nhân và chân trang.
- Theo dõi DOM động của Douyin SPA bằng `MutationObserver`.
- Dịch exact-match để không thay đổi caption, hashtag, tên tài khoản hoặc bình luận.
- Dịch có kiểm soát một số nhãn động trên hồ sơ như mã Douyin và số người đang phát trực tiếp.
- Không cần build: file `.user.js` có thể cài trực tiếp.

## Cài đặt

1. Cài Tampermonkey hoặc Violentmonkey trên Chrome.
2. Mở trang quản lý userscript và tạo script mới.
3. Xóa nội dung mẫu.
4. Dán toàn bộ nội dung của `douyin-vh.user.js`.
5. Lưu script, mở lại `https://www.douyin.com/` và tải lại trang.

Có thể mở trực tiếp file `douyin-vh.user.js` trong trình duyệt để trình quản lý userscript nhận diện phần cài đặt.

## Phạm vi an toàn

Script chỉ dịch chuỗi có trong từ điển và nằm ở vùng giao diện hoặc phần tử tương tác. Vùng feed thông thường bị loại trừ; caption, hashtag, tên tài khoản, bình luận và metadata video không được dịch tự động. Các mẫu động như `抖音号：...` và `N人正在直播` chỉ được nhận diện trong vùng thông tin hồ sơ.

Nếu Douyin thêm một nhãn giao diện mới, bổ sung cặp `tiếng Trung: 'bản dịch tiếng Việt'` vào `translations` trong `douyin-vh.user.js`. Không thêm quy tắc dịch theo substring vì có thể làm thay đổi nội dung người dùng.

## Kiểm thử

```powershell
npm test
```

Kiểm tra cú pháp userscript:

```powershell
node --check douyin-vh.user.js
```

## Ghi chú

- Douyin có thể thay đổi cấu trúc DOM hoặc nhãn theo tài khoản, khu vực và phiên bản web.
- Từ điển hiện tại ưu tiên các nhãn quan sát được ở trang đề xuất và các điều khiển video phổ biến.
- Khi cần tắt nhanh, tắt userscript trong Tampermonkey/Violentmonkey rồi tải lại trang.
