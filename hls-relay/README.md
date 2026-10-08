# ZUNO HLS Relay (Cloudflare Worker riêng)

Không thay đổi Worker đang phục vụ website ZUNO. Deploy dự án con này như một Worker riêng bằng Cloudflare Workers Builds hoặc Wrangler.

- Root directory: `hls-relay`
- Build command: để trống
- Deploy command: `npx wrangler deploy`
- Wrangler config: `wrangler.toml`

Sau deploy, URL ví dụ: `https://zuno-hls-relay.<account>.workers.dev/hls/<server_uuid>`.

Worker đọc URL nguồn từ Supabase bằng server UUID, không nhận URL đích tùy ý. Chỉ chấp nhận HTTPS thuộc `streamrpt.xyz` cùng host với server đã lưu, chặn redirect và ghi lại URI trong playlist HLS. Nếu nguồn dùng segment host khác, cookie, referrer, token, DRM hoặc không cho proxy, nó có thể không phát.

Để website sử dụng, đặt biến `HLS_RELAY_BASE` trong `config.js` bằng địa chỉ Worker sau khi triển khai. Không đặt khi chưa deploy. Chi phí/băng thông và quyền proxy cần được kiểm tra. Cần giới hạn truy cập trước khi phát hành công khai nếu dự kiến lưu lượng lớn.
