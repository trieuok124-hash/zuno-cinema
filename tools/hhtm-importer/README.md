# ZUNO Import Assistant

Extension Chrome/Edge (Manifest V3) quét metadata và URL iframe của từng tập khi người dùng truy cập HHTM. **Không vượt CORS, DRM, đăng nhập hoặc hạn chế quyền truy cập.** Link iframe không nhất thiết là link video và chưa được xác minh phát được.

1. Tải thư mục này về máy.
2. Mở chrome://extensions, bật Developer mode, Load unpacked, chọn thư mục hhtm-importer.
3. Mở trang phim hhtm.my, bấm biểu tượng extension, chọn số tập và quét.
4. Tải JSON để kiểm tra từng tập. Chỉ dùng với nguồn được phép sử dụng.

Khi website dựng player bằng JavaScript sau khi tải HTML, extension có thể không tìm thấy iframe. Kết quả ghi rõ not_found/error; không tự suy đoán URL.
