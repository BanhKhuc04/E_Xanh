# AUDIT E-XANH

Ngày audit: `2026-06-20`

Phạm vi đã kiểm tra: `src/`, `supabase/`, `vite.config.js`, `package.json`, `npm run build`, `npm run lint`.

Ghi chú phạm vi: repo gốc chứa nhiều thư mục zip/archive/QA ngoài app chính; báo cáo này tập trung vào ứng dụng runtime trong `e-xanh/`.

## Route Inventory

### Public/User Routes

- [ ] Route `/` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/HomePage.jsx:1` — Trang chủ gồm `HeroSection`, `FeaturedPosts`, `ElectricityPreview`, `CommunityPreview`, `HomeCTA`; các CTA chính hoạt động nhưng một số hành động trong preview còn là placeholder — Ưu tiên: Trung bình
- [ ] Route `/meo-tiet-kiem` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/TipsPage.jsx:1` — Có tìm kiếm, lọc, phân trang, gọi `getTipPosts()` và `getCategories()`, có loading/error state; phần state sync đang dùng effect gây render thừa — Ưu tiên: Trung bình
- [ ] Route `/meo-tiet-kiem/:slug` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/PostDetailPage.jsx:1` — Có like/save/follow/share/report/comment, gọi `getPostBySlug()`, `getApprovedPosts()` và interaction services; UX xử lý lỗi còn dùng `alert/prompt` — Ưu tiên: Cao
- [ ] Route `/cong-dong` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/CommunityPage.jsx:1` — Có lọc feed, like/save/comment/share, load more, composer modal, active members; logic lớn đang nằm trực tiếp trong page và error feed chưa surface rõ ra UI — Ưu tiên: Trung bình
- [ ] Route `/cong-dong/:id` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/CommunityPostDetailPage.jsx:1` — Có like/save/comment/share, kiểm tra quyền xem bài chưa duyệt, comment inline; báo cáo bình luận còn dùng `prompt/alert` blocking — Ưu tiên: Trung bình
- [ ] Route `/dang-bai` — ✅ Hoàn thiện & tối ưu — `src/pages/user/CreatePostPage.jsx:1` — Form đăng bài có autosave, upload ảnh bìa, inline image crop/upload, validate, cooldown, preview live; redirect khi chưa đăng nhập hoạt động đúng — Ưu tiên: Thấp
- [ ] Route `/dang-nhap` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/auth/LoginPage.jsx:1` — Form đăng nhập email/password, Cloudflare Turnstile, Google OAuth, banner auth, loading/error đầy đủ; nhánh Google chưa có error surface tại UI — Ưu tiên: Trung bình
- [ ] Route `/dang-ky` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/auth/RegisterPage.jsx:1` — Form đăng ký có validate mạnh, Turnstile, Google OAuth, resend mail xác nhận; thao tác resend còn dùng `alert` thô — Ưu tiên: Trung bình
- [ ] Route `/quen-mat-khau` — ✅ Hoàn thiện & tối ưu — `src/pages/auth/ForgotPasswordPage.jsx:1` — Form quên mật khẩu có cooldown resend, neutral success message, loading/error rõ ràng — Ưu tiên: Thấp
- [ ] Route `/dat-lai-mat-khau` — ✅ Hoàn thiện & tối ưu — `src/pages/auth/ResetPasswordPage.jsx:1` — Luồng recovery kiểm tra token/session, resend email, đổi mật khẩu, redirect sau thành công khá đầy đủ — Ưu tiên: Thấp
- [ ] Route `/auth/callback` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/auth/AuthCallbackPage.jsx:1` — Callback Google login tự tạo profile và redirect theo role; logic tạo profile đang duplicate thay vì đi qua service dùng chung — Ưu tiên: Trung bình
- [ ] Route `/tai-khoan` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/AccountPage.jsx:1` — Có profile header, thống kê, bài viết của tôi, bài lưu, bình luận gần đây; thiếu error state riêng cho từng khối dữ liệu — Ưu tiên: Trung bình
- [ ] Route `/tai-khoan/cai-dat` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/SettingsUserPage.jsx:1` — Có cập nhật hồ sơ, avatar/cover, privacy, notification prefs, gửi email reset password; đang tự nhận diện schema thiếu migration và chạy ở chế độ tương thích — Ưu tiên: Cao
- [ ] Route `/nguoi-dung/:userId` — 🔴 Chưa hoạt động / lỗi — `src/pages/user/PublicProfilePage.jsx:1` — Phụ thuộc `public_profiles` view và `user_follows`; route có thể chạy nhưng tính năng follow/profile public sẽ vỡ nếu DB mới chỉ apply `schema.sql` gốc — Ưu tiên: Cao
- [ ] Route `/ve-chung-toi` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/AboutPage.jsx:1` — Trang tĩnh, CTA/link hoạt động; đang dùng ảnh team dung lượng lớn và `<img>` raw thay vì pipeline tối ưu ảnh — Ưu tiên: Trung bình
- [ ] Route `/dieu-khoan` — ✅ Hoàn thiện & tối ưu — `src/pages/user/TermsPage.jsx:1` — Trang điều khoản tĩnh, có mục lục anchor và metadata cơ bản — Ưu tiên: Thấp
- [ ] Route `/lien-he` — 🔴 Chưa hoạt động / lỗi — `src/pages/user/ContactPage.jsx:1` — Form validate tốt nhưng submit chỉ giả lập timeout, không gọi API/backend thật nên dữ liệu không được lưu/gửi đi — Ưu tiên: Cao
- [ ] Route `/kiem-tra-tien-dien` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/ElectricityCheckPage.jsx:1` — Có nhập thiết bị, tính toán, breakdown, save history, load device list từ DB; khi save server lỗi sẽ fallback local nhưng UI không phân biệt rõ server-save với local-save — Ưu tiên: Trung bình
- [ ] Route `/lich-su-kiem-tra` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/ElectricityHistoryPage.jsx:1` — Có lọc, xem chi tiết, tính lại, xóa từng mục/xóa tất cả; phần xóa tất cả bypass service và gọi Supabase trực tiếp trong page — Ưu tiên: Trung bình
- [ ] Route `/bai-da-luu` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/SavedPostsPage.jsx:1` — Có search/filter/sort, unsave, hero động; sidebar còn nút thư mục không có handler và `recentlyRead` đang hard-code rỗng — Ưu tiên: Trung bình
- [ ] Route `*` — ✅ Hoàn thiện & tối ưu — `src/pages/shared/NotFoundPage.jsx:1` — 404 page đơn giản, CTA điều hướng rõ ràng — Ưu tiên: Thấp

### Admin Routes

- [ ] Route `/admin` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/admin/AdminDashboardPage.jsx:1` — Có load stats, danh sách bài gần đây và bài chờ duyệt; layout dùng inline style và min-width lớn nên chưa thân thiện màn nhỏ — Ưu tiên: Trung bình
- [ ] Route `/admin/quan-ly-bai-viet` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/admin/PostManagementPage.jsx:1` — Có CRUD, duyệt/từ chối, chọn nhiều, upload inline image, loading/error/toast đầy đủ; component page quá lớn, khó maintain — Ưu tiên: Trung bình
- [ ] Route `/admin/duyet-bai-viet` — 🟡 Hoạt động nhưng chưa tối ưu — `src/app/router.jsx:206` — Chỉ là alias redirect sang `/admin/quan-ly-bai-viet`; giữ được backward compatibility nhưng tăng bề mặt route không cần thiết — Ưu tiên: Thấp
- [ ] Route `/admin/quan-ly-binh-luan` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/admin/CommentManagementPage.jsx:1` — Có moderation, note, warning notification, bulk actions và confirm dialog; còn phụ thuộc schema comments moderation mới để đủ tính năng — Ưu tiên: Trung bình
- [ ] Route `/admin/quan-ly-nguoi-dung` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/admin/UserManagementPage.jsx:1` — Có phân quyền, khóa/mở, vô hiệu hóa, ghi chú admin, bulk actions, confirm dialog; page tự mang nhiều logic nghiệp vụ và hiển thị nhiều warning migration — Ưu tiên: Trung bình
- [ ] Route `/admin/quan-ly-thiet-bi` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/admin/DeviceManagementPage.jsx:1` — Có CRUD, ẩn/hiện, bulk actions, tips card; thiếu trạng thái error UI rõ nếu initial fetch lỗi — Ưu tiên: Trung bình
- [ ] Route `/admin/thong-ke` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/admin/StatisticsPage.jsx:1` — Có filter thời gian, charts/cards top posts/devices, loading state; chủ yếu là read-only analytics, chưa có retry/error UX rõ — Ưu tiên: Thấp
- [ ] Route `/admin/thong-bao-he-thong` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/admin/SystemNotificationPage.jsx:1` — Có preview audience, gửi batch, revoke, history modal; chỉ hoạt động đầy đủ khi DB có `notifications` + `notification_batches` — Ưu tiên: Cao
- [ ] Route `/admin/cai-dat` — ⏳ Đang dang dở — `src/pages/admin/SettingsPage.jsx:1` — Có save settings, backup, export, reset; riêng 2FA và login history mới là khung giao diện, chưa có backend thực — Ưu tiên: Cao
- [ ] Route `/admin/cai-dat-giao-dien` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/admin/ThemeSettingsPage.jsx:1` — Có quản lý banner ảnh/video, crop, poster, reorder, active/delete; phụ thuộc table/storage `website_banners` và component quá lớn — Ưu tiên: Cao
- [ ] Route `/admin/khong-co-quyen` — ✅ Hoàn thiện & tối ưu — `src/pages/admin/AdminAccessDeniedPage.jsx:1` — Có CTA quay về trang chủ và logout/switch account — Ưu tiên: Thấp

## Detailed Findings By Page / Module

### `/` Trang chủ

- [ ] Nút lưu ở block "Bài viết nổi bật" — ⏳ Đang dang dở — `src/components/home/FeaturedPosts.jsx:106` — Button hiện rõ trên UI nhưng bị `disabled` và tự ghi "Tính năng đang phát triển", dễ gây hiểu nhầm rằng save đã có — Ưu tiên: Trung bình
- [ ] Bộ action Thích/Bình luận/Lưu trong preview cộng đồng — ⏳ Đang dang dở — `src/components/home/CommunityPreview.jsx:164` — 3 action đều chỉ `Link` sang trang chi tiết, chưa thực thi hành vi tương ứng tại chỗ — Ưu tiên: Trung bình

### `/meo-tiet-kiem`

- [ ] Đồng bộ category từ query string — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/TipsPage.jsx:74` — Dùng `useEffect` để `setSelectedCategory`, bị eslint cảnh báo cascading render; nên derive trực tiếp từ `location.search` — Ưu tiên: Thấp
- [ ] Reset phân trang khi đổi filter — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/TipsPage.jsx:80` — `setCurrentPage(1)` trong effect là đúng về hành vi nhưng tạo thêm render và warning lint — Ưu tiên: Thấp

### `/meo-tiet-kiem/:slug`

- [ ] Báo cáo bài viết — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/PostDetailPage.jsx:351` — Dùng `window.prompt` + `alert`; không có modal, validation inline, loading hay retry UX — Ưu tiên: Cao
- [ ] Like/Lưu/Theo dõi ở bài chi tiết — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/PostDetailPage.jsx:175` — Các lỗi auth/API vẫn surface bằng `alert`, riêng follow mới có `actionLoading`, còn like/save không có trạng thái busy riêng — Ưu tiên: Trung bình
- [ ] Card "Chủ đề nổi bật" sidebar — ⏳ Đang dang dở — `src/pages/user/PostDetailPage.jsx:396` — Chỉ render text "Đang cập nhật..." nên đang là placeholder chứ chưa có dữ liệu/chức năng thật — Ưu tiên: Thấp
- [ ] Link "Chỉnh sửa hồ sơ" ở sidebar tác giả — 🔴 Chưa hoạt động / lỗi — `src/components/posts/AuthorSidebarCard.jsx:67` — Khi `isCurrentUser=true`, label là "Chỉnh sửa hồ sơ" nhưng link vẫn đi tới `/nguoi-dung/:id`, không phải trang cài đặt hồ sơ — Ưu tiên: Trung bình

### `/cong-dong` và `/cong-dong/:id`

- [ ] Báo cáo bình luận — 🟡 Hoạt động nhưng chưa tối ưu — `src/components/community/InlineCommentSection.jsx:215` — Dùng `window.prompt` + `alert`, chưa có modal/report workflow nhất quán với phần còn lại — Ưu tiên: Trung bình
- [ ] Feed cộng đồng load user/like/save trực tiếp trong page — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/CommunityPage.jsx:105` — Logic fetch user session, likes, saves, active members đang dồn vào page khiến component lớn và khó test/reuse — Ưu tiên: Trung bình
- [ ] Đồng bộ effect của `CommunityPage` — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/CommunityPage.jsx:239` — `useEffect` thiếu dependency `currentUser?.id` theo eslint, có nguy cơ stale state khi session đổi trong runtime — Ưu tiên: Thấp

### `/dang-nhap`, `/dang-ky`, `/auth/callback`

- [ ] Resend email xác nhận sau đăng ký — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/auth/RegisterPage.jsx:185` — Hành vi có gọi Supabase thật nhưng chỉ phản hồi bằng `alert`, không có loading/toast đồng bộ UI auth — Ưu tiên: Thấp
- [ ] OAuth callback tạo profile thủ công — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/auth/AuthCallbackPage.jsx:38` — Tự insert `profiles` ngay trong page thay vì tái dùng service/trigger flow chung; dễ lệch logic với nhánh email signup — Ưu tiên: Trung bình

### `/tai-khoan` và `/tai-khoan/cai-dat`

- [ ] Dashboard tài khoản cá nhân — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/AccountPage.jsx:69` — `Promise.all` tải bài viết/bài lưu/bình luận nhưng không có error state riêng; API fail sẽ rơi về empty UI khó phân biệt với "không có dữ liệu" — Ưu tiên: Trung bình
- [ ] Cài đặt tài khoản phụ thuộc migration mới — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/SettingsUserPage.jsx:591` — Chính UI đã cảnh báo thiếu migration cho preferences/website/cover; nếu DB mới chỉ chạy schema gốc thì trải nghiệm không hoàn chỉnh — Ưu tiên: Cao

### `/nguoi-dung/:userId`

- [ ] Public profile view — 🔴 Chưa hoạt động / lỗi — `src/pages/user/PublicProfilePage.jsx:43` — Page đọc trực tiếp từ `public_profiles`; view này không có trong `supabase/schema.sql` gốc mà nằm ở migration bổ sung — Ưu tiên: Cao
- [ ] Follow / unfollow user — 🔴 Chưa hoạt động / lỗi — `src/pages/user/PublicProfilePage.jsx:138` — UI đã tự báo "Tính năng đang bảo trì. Vui lòng chạy file SQL."; backend `user_follows` mới nằm ở draft migration — Ưu tiên: Cao
- [ ] Nút theo dõi trên hồ sơ công khai — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/PublicProfilePage.jsx:241` — Dùng button trần, không dùng hệ `btn btn--*`, khiến style và trạng thái disabled/loading không đồng nhất với toàn site — Ưu tiên: Thấp

### `/lien-he`

- [ ] Form liên hệ — 🔴 Chưa hoạt động / lỗi — `src/pages/user/ContactPage.jsx:56` — Submit chỉ `setTimeout` giả lập thành công, không gọi email service, bug report service hay backend nào — Ưu tiên: Cao

### `/kiem-tra-tien-dien` và `/lich-su-kiem-tra`

- [ ] Lưu lịch sử kiểm tra điện — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/ElectricityCheckPage.jsx:299` — Khi save Supabase lỗi sẽ fallback local và vẫn hiển thị thông báo thành công; user không biết dữ liệu chưa đồng bộ lên server — Ưu tiên: Trung bình
- [ ] Xóa toàn bộ lịch sử — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/ElectricityHistoryPage.jsx:189` — Page gọi `supabase.from('electricity_checks').delete()` trực tiếp thay vì đi qua service, làm phân tán logic API và error handling — Ưu tiên: Trung bình

### `/bai-da-luu`

- [ ] Sidebar "Thư mục lưu" — 🔴 Chưa hoạt động / lỗi — `src/components/posts/SavedSidebar.jsx:14` — Các button thư mục không có `onClick`, không đổi filter dù UI trông như control thật — Ưu tiên: Trung bình
- [ ] Khối "Bài đọc gần đây" — ⏳ Đang dang dở — `src/pages/user/SavedPostsPage.jsx:206` — `recentlyRead` đang truyền `[]`, nên cả module sidebar phụ luôn ở trạng thái chưa triển khai — Ưu tiên: Thấp

### Admin Settings / Theme / Notifications

- [ ] Xác minh 2 bước cho admin — ⏳ Đang dang dở — `src/components/admin/settings/AdminSecuritySettingsCard.jsx:10` — UI tự mô tả "chưa được bật trong phiên bản hiện tại" và toggle luôn disabled — Ưu tiên: Cao
- [ ] Lịch sử đăng nhập admin — ⏳ Đang dang dở — `src/components/admin/settings/AdminSecuritySettingsCard.jsx:56` — Chỉ có placeholder "Chưa có dữ liệu..." và không có API thật cấp dữ liệu phiên đăng nhập — Ưu tiên: Trung bình
- [ ] Notification Center dùng cho navbar + admin topbar + page gửi thông báo — 🟡 Hoạt động nhưng chưa tối ưu — `src/services/notificationService.js:56` — Service tự nhận diện thiếu bảng/cột/policy và degrade, nghĩa là feature chưa thể coi là ổn định nếu migration chưa apply đủ — Ưu tiên: Cao
- [ ] Giao diện banner/hero công khai — 🟡 Hoạt động nhưng chưa tối ưu — `src/services/bannerService.js:188` — Service đã phải bắt lỗi "table `website_banners` không tồn tại", cho thấy backend route `/admin/cai-dat-giao-dien` chưa self-contained với schema gốc — Ưu tiên: Cao

### Shared Layout / Support / Guards

- [ ] Support Center đang map "active site notice" thành "admin notice" — 🟡 Hoạt động nhưng chưa tối ưu — `src/components/common/SupportCenter.jsx:21` — Logic hiện tại dùng site notice công khai làm thông báo admin fallback; semantics lệch và dễ gây nhầm dữ liệu — Ưu tiên: Trung bình
- [ ] User navbar notification polling — 🟡 Hoạt động nhưng chưa tối ưu — `src/layouts/user/UserNavbar.jsx:105` — Polling mỗi `45s` cho mọi user login; không có backoff/websocket và vẫn phụ thuộc notification schema sẵn sàng — Ưu tiên: Thấp
- [ ] Admin topbar notification polling — 🟡 Hoạt động nhưng chưa tối ưu — `src/layouts/admin/AdminTopbar.jsx:168` — Polling lặp lại theo pathname, tiếp tục tăng network chatter và vẫn dựa trên migration notifications — Ưu tiên: Thấp
- [ ] Supabase client null-safety — 🔴 Chưa hoạt động / lỗi — `src/lib/supabase.js:17` — Client có thể là `null`, nhưng nhiều service cốt lõi như `authService` và `followService` vẫn gọi `supabase.auth/...` trực tiếp, có nguy cơ crash runtime khi thiếu env — Ưu tiên: Cao

## UI / Responsive Audit

- [ ] Layout card phụ trong admin dashboard — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/admin/AdminDashboardPage.jsx:114` — `minmax(400px, 1fr)` khiến khối phụ dễ chật/overflow ở viewport nhỏ hơn ~400px — Ưu tiên: Trung bình
- [ ] Hàng nút trên trang 404 — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/shared/NotFoundPage.jsx:12` — Flex row không có `flexWrap`, có nguy cơ vỡ dòng xấu trên mobile hẹp — Ưu tiên: Thấp
- [ ] Inconsistency style nút/trạng thái trên public profile — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/PublicProfilePage.jsx:241` — Nút follow không dùng design token `btn btn--*`, khiến hover/focus/loading không đồng nhất với các trang khác — Ưu tiên: Thấp
- [ ] Inline styling dày đặc trong admin/public pages — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/admin/AdminDashboardPage.jsx:80` — Nhiều page còn phụ thuộc inline style cho spacing/layout/trạng thái, làm UI khó đồng nhất và khó scale theme — Ưu tiên: Trung bình

## Performance Audit

- [ ] Ảnh content/demo quá nặng — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/AboutPage.jsx:15` — Các asset đang dùng ngoài public có file rất lớn (`public/demo-posts/covers/*.png` ~1.6–2.0MB, `public/images/team/viet-anh.jpg` ~947KB), sẽ làm LCP và bandwidth xấu — Ưu tiên: Cao
- [ ] Bundle chính còn nặng — 🟡 Hoạt động nhưng chưa tối ưu — `vite.config.js:24` — `npm run build` cho thấy `dist/assets/index-*.js ~203.67kB`, `supabase-*.js ~209.62kB`, `vendor-*.js ~178.10kB`, `router-*.js ~75.06kB`; cần tiếp tục tách logic nặng khỏi critical path — Ưu tiên: Trung bình
- [ ] Dynamic import `bannerService` không còn hiệu quả — 🟡 Hoạt động nhưng chưa tối ưu — `src/components/home/HeroSection.jsx:10` — Build báo `[INEFFECTIVE_DYNAMIC_IMPORT]` vì `bannerService` vừa dynamic import vừa static import ở nhiều page khác — Ưu tiên: Trung bình
- [ ] `OptimizedImage` dùng setState trong effect — 🟡 Hoạt động nhưng chưa tối ưu — `src/components/common/OptimizedImage.jsx:33` — Bị eslint `react-hooks/set-state-in-effect`, có thể tạo render cascade không cần thiết ở component ảnh dùng rất rộng — Ưu tiên: Trung bình
- [ ] `SmartImage` reset state bằng effect và tạo component trong render — 🟡 Hoạt động nhưng chưa tối ưu — `src/components/media/SmartImage.jsx:21` — Vừa set state trong effect vừa khai báo `FallbackContent` trong render; eslint đã bắt cả 2 vấn đề — Ưu tiên: Trung bình
- [ ] `UserAvatar` reset lỗi bằng effect — 🟡 Hoạt động nhưng chưa tối ưu — `src/components/common/UserAvatar.jsx:28` — Pattern này cũng bị eslint cảnh báo cascading render, ảnh hưởng component xuất hiện rất nhiều nơi — Ưu tiên: Thấp
- [ ] `SupportModal` reset tab bằng effect — 🟡 Hoạt động nhưng chưa tối ưu — `src/components/common/SupportModal.jsx:30` — Mỗi lần mở modal đều set state ngay trong effect; không nghiêm trọng nhưng là mùi hiệu năng/cấu trúc — Ưu tiên: Thấp
- [ ] `TipsPage` dùng effect để mutate UI state dẫn tới lint warning — 🟡 Hoạt động nhưng chưa tối ưu — `src/pages/user/TipsPage.jsx:74` — Cùng một page vừa sync query param vừa reset pagination bằng effect, làm lifecycle phức tạp hơn cần thiết — Ưu tiên: Thấp

## Dead / Unused / Cleanup Candidates

- [ ] `SmartVideo` — 🗑️ Thừa / không dùng (đề xuất xoá) — `src/components/media/SmartVideo.jsx:5` — Không có import nào trong `src/`, chỉ tăng chi phí bảo trì và đang có lint warning unused imports — Ưu tiên: Thấp
- [ ] `ImageSkeleton` — 🗑️ Thừa / không dùng (đề xuất xoá) — `src/components/media/ImageSkeleton.jsx:3` — Không có import runtime nào trong app hiện tại — Ưu tiên: Thấp
- [ ] Import `heroImage` trong `AuthHero` — 🗑️ Thừa / không dùng (đề xuất xoá) — `src/components/auth/AuthHero.jsx:3` — Bị eslint `no-unused-vars` — Ưu tiên: Thấp
- [ ] Import `PostAuthorAvatar` trong `PostDetailPage` — 🗑️ Thừa / không dùng (đề xuất xoá) — `src/pages/user/PostDetailPage.jsx:8` — Đã không còn dùng sau khi UI chuyển qua `ArticleHeader`/`AuthorSidebarCard` — Ưu tiên: Thấp
- [ ] Helper/import thừa trong service upload/banner/profile/post — 🗑️ Thừa / không dùng (đề xuất xoá) — `src/services/bannerService.js:4` — Các import `validateImageFile`, `validateVideoFile`, `ALLOWED_PROFILE_IMAGE_TYPES`, `MEDIA_VALIDATION`, `createSafeFileName`, `logError` đang dư thừa ở một số service theo kết quả lint — Ưu tiên: Thấp

## Backend / Migration Gaps

- [ ] `user_follows` chỉ tồn tại ở draft migration — ➕ Thiếu, cần phát triển thêm — `supabase/drafts/create_user_follows.sql:2` — Feature follow đang dựa vào draft SQL thay vì base schema/migration chính thức — Ưu tiên: Cao
- [ ] `public_profiles` view không nằm trong `schema.sql` gốc — ➕ Thiếu, cần phát triển thêm — `supabase/drafts/profile_cover_migration.sql:105` — Public profile route phụ thuộc view này để đọc safe fields — Ưu tiên: Cao
- [ ] `notifications` / `notification_batches` chưa phải phần bắt buộc của schema nền — ➕ Thiếu, cần phát triển thêm — `supabase/drafts/fix-notifications-and-public-profiles.sql:8` — Navbar/admin topbar/system notification page đang phải degrade nếu migration chưa chạy — Ưu tiên: Cao
- [ ] `website_banners` chỉ có ở draft backend — ➕ Thiếu, cần phát triển thêm — `supabase/drafts/add-website-banners-storage.sql:6` — Các hero/banner công khai và trang `/admin/cai-dat-giao-dien` đang phụ thuộc bảng + bucket này — Ưu tiên: Cao
- [ ] `site_notices` / `bug_reports` đã có migration riêng nhưng chưa được hợp nhất vào schema nền — ➕ Thiếu, cần phát triển thêm — `supabase/migrations/20260618_create_site_notices_and_bug_reports.sql:1` — Support center và admin bug manager sẽ không ổn định nếu môi trường mới chỉ chạy `schema.sql` — Ưu tiên: Trung bình
