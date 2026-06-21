# AUDIT HỢP NHẤT — Dự án E-XANH

Nguồn: Hợp nhất 2 báo cáo audit độc lập
- **Báo cáo A** — Antigravity (Opus + Gemini 3.1 High)
- **Báo cáo B** — Codex

Ngày hợp nhất: `2026-06-20`

## Cách đọc file này

- Sắp xếp theo **độ ưu tiên** (Cao → Trung → Thấp), xuyên suốt toàn bộ dự án — không chia theo trang.
- Mỗi mục có cờ nguồn:
  - 🔵 **Cả 2 agent cùng phát hiện** → độ tin cậy cao, gần như chắc chắn là vấn đề thật.
  - 🟣 **Chỉ 1 agent phát hiện** → cần tự kiểm tra lại code trước khi yêu cầu AI sửa, vì có thể agent kia bỏ sót *hoặc* agent này nhận định sai.
- Trạng thái dùng quy ước cũ: ✅ Hoàn thiện | 🟡 Chưa tối ưu | 🔴 Lỗi/Chưa hoạt động | ⏳ Dang dở | 🗑️ Thừa | ➕ Thiếu.
- Giao cho Claude Code: mỗi lần làm **1 mục hoặc 1 nhóm nhỏ liên quan**, không làm tràn lan nhiều mục cùng lúc — dễ review và dễ rollback nếu sai.

---

## 🔴 ƯU TIÊN CAO

### Bảo mật & Lỗ hổng nghiêm trọng

- [ ] 🟣A 🔴 **Lộ dữ liệu lịch sử tiền điện của người khác** | `src/services/electricityService.js:85` | Hàm `getElectricityCheckById` không lọc theo `user_id` — biết ID là xem được bill người khác | **Cực cao — sửa ngay**
- [ ] 🟣A 🔴 **Fake CAPTCHA** | Toàn bộ trang Auth (`LoginPage`, `RegisterPage`, ...) | Token Turnstile lấy ở frontend nhưng không gửi lên server verify — CAPTCHA chỉ mang tính trang trí | Cao
- [ ] 🟣A 🔴 **Race condition đếm Like/Save** | `src/services/interactionService.js:62` | Logic đọc DB → +1 → ghi DB, dễ sai số khi nhiều request cùng lúc. Cần đổi sang SQL Trigger hoặc Supabase RPC `increment` | Cao
- [ ] 🟣B 🔴 **Supabase client null-safety** | `src/lib/supabase.js:17` | Client có thể là `null` nhưng `authService`, `followService` và nhiều service khác gọi thẳng `supabase.auth/...` — sập app `Cannot read properties of null` nếu thiếu `.env` | Cao

### Tính năng giả / không hoạt động thật

- [ ] 🔵 🔴 **Form Liên hệ giả** | `src/pages/user/ContactPage.jsx:56` | Submit chỉ `setTimeout` rồi báo thành công — **không hề gửi dữ liệu đi đâu** | Cao
- [ ] 🟣B 🔴 **Follow / Public Profile phụ thuộc draft migration chưa apply** | `src/pages/user/PublicProfilePage.jsx:43,138`, `supabase/drafts/create_user_follows.sql`, `supabase/drafts/profile_cover_migration.sql` | Bảng `user_follows` và view `public_profiles` chỉ nằm ở **draft SQL**, không có trong `schema.sql` gốc — nếu môi trường mới chỉ chạy schema gốc thì cả route `/nguoi-dung/:userId` sẽ vỡ | Cao — **việc đầu tiên cần làm là kiểm tra DB thật đã apply migration này chưa**
- [ ] 🟣B ➕ **`website_banners` chỉ có ở draft backend** | `supabase/drafts/add-website-banners-storage.sql:6` | Hero/banner công khai và trang `/admin/cai-dat-giao-dien` phụ thuộc bảng + storage bucket này chưa chắc đã có trên DB chính thức | Cao
- [ ] 🟣B ➕ **`notifications` / `notification_batches` chưa thuộc schema nền** | `supabase/drafts/fix-notifications-and-public-profiles.sql:8` | Navbar, admin topbar, trang gửi thông báo hệ thống sẽ tự "degrade" nếu migration chưa chạy | Cao

### Hiệu năng nghiêm trọng

- [ ] 🟣A 🔴 **N+1 query ở thống kê admin** | `src/services/adminUserService.js:361`, `analyticsService.js` | Đang fetch toàn bộ bảng về rồi đếm bằng JS thay vì `SELECT COUNT(*)` ở DB — sẽ treo máy khi dữ liệu lớn | Cao

### Logic lỗi / dễ vỡ

- [ ] 🟣A 🔴 **Magic number để phân biệt ID** | `src/pages/user/SavedPostsPage.jsx:86` | Dùng `String(postId).length < 30` để đoán loại ID — rất dễ sai khi đổi định dạng ID | Cao
- [ ] 🟣A 🔴 **AdminRoute check quyền lặp 2 lần** | `src/app/guards/AdminRoute.jsx:54` | Dependency `[loading]` trong `useEffect` gây chạy lại vòng lặp check quyền | Cao
- [ ] 🟣A 🔴 **UserRoute thiếu check tài khoản bị khoá** | `src/app/guards/UserRoute.jsx` | Chỉ check có `session` hay không, không check tài khoản có bị block/khoá | Cao
- [ ] 🟣A 🔴 **Error handling im lặng khi load devices** | `src/pages/user/ElectricityCheckPage.jsx:101` | Lỗi khi load danh sách thiết bị từ API bị bỏ qua, không báo gì cho user | Cao
- [ ] 🟣A 🔴 **AccountPage không có error handling** | `src/pages/user/AccountPage.jsx:83` | Nếu fetch bài viết/bài lưu/bình luận lỗi, UI chỉ hiện trống trơn, không báo lỗi | Cao

### UX nghiêm trọng (dùng API/UI gốc trình duyệt)

- [ ] 🔵 🟡 **`window.prompt()` / `window.alert()` thay vì Modal/Toast** | Nhiều nơi: `PostDetailPage.jsx:351,176`, `InlineCommentSection.jsx:215` | Báo cáo bài viết, báo lỗi like/save dùng popup native xấu, không nhất quán UX | Cao

### Cấu trúc code / migration cần dọn

- [ ] 🟣B ⏳ **Cài đặt 2FA và lịch sử đăng nhập admin chỉ là UI khung** | `src/components/admin/settings/AdminSecuritySettingsCard.jsx:10,56` | Toggle luôn disabled, không có backend thật phía sau | Cao
- [ ] 🟣B 🟡 **Trang Cài đặt tài khoản tự cảnh báo thiếu migration** | `src/pages/user/SettingsUserPage.jsx:591` | UI tự nhận diện schema thiếu và chạy chế độ tương thích cho preferences/website/cover | Cao

---

## 🟡 ƯU TIÊN TRUNG BÌNH

### Kiến trúc / trùng lặp logic

- [ ] 🟣A 🟡 **Trùng lặp code follow/unfollow** | `followService.js` và `interactionService.js` | Hàm bị viết lặp ở 2 nơi | Trung
- [ ] 🟣A 🟡 **Trùng lặp logic quyền xem bài (draft/hidden)** | `src/services/postService.js:219` | Lặp lại ở cả `getPostBySlug` và `getPostById` | Trung
- [ ] 🟣A 🟡 **Stale cache không bao giờ huỷ** | `notificationService.js`, `settingsService.js` | Biến `AVAILABILITY_CACHE` ở ngoài function, phải F5 mới cập nhật | Trung
- [ ] 🔵 🟡 **Query Supabase trực tiếp trong page thay vì qua service** | `CommunityPage.jsx:146`, `PublicProfilePage.jsx:43`, `ElectricityHistoryPage.jsx:188-189` | Logic DB phân tán ra nhiều page thay vì tập trung ở service layer | Trung
- [ ] 🔵 🟡 **File/Hook quá lớn, cần tách nhỏ** | `SettingsUserPage.jsx` (942 dòng), `ThemeSettingsPage.jsx` (750 dòng), `SystemNotificationPage.jsx` (764 dòng), `usePostComposerForm.js` (941 dòng) | Một component/hook gánh quá nhiều trách nhiệm, khó test và maintain | Trung
- [ ] 🟣B 🟡 **OAuth callback tự tạo profile thủ công** | `src/pages/auth/AuthCallbackPage.jsx:38` | Insert `profiles` trực tiếp trong page thay vì qua service chung, dễ lệch logic với signup bằng email | Trung

### Tính năng dang dở / placeholder gây hiểu nhầm

- [ ] 🔵 ⏳ **Nút Like/Comment/Save trong preview chỉ là Link** | `HomePage.jsx`, `CommunityPreview.jsx:164` | Trông như nút hành động tại chỗ nhưng thực chất chuyển hướng trang, gây nhầm lẫn | Trung
- [ ] 🟣B 🔴 **Sidebar "Thư mục lưu" không có handler** | `src/components/posts/SavedSidebar.jsx:14` | Các nút thư mục không có `onClick`, trông như control thật nhưng không làm gì | Trung
- [ ] 🟣B 🔴 **Link "Chỉnh sửa hồ sơ" sai đích** | `src/components/posts/AuthorSidebarCard.jsx:67` | Khi là chính chủ, label "Chỉnh sửa hồ sơ" nhưng vẫn dẫn tới `/nguoi-dung/:id` thay vì trang cài đặt | Trung
- [ ] 🟣A 🔴 **Logout thiếu xử lý lỗi** | `src/pages/user/AccountPage.jsx:118` | Không xử lý khi `authService.signOut()` thất bại | Trung

### Error handling / UX lỗi

- [ ] 🔵 🟡 **Dùng `alert()` cho thông báo lỗi thay vì Toast** | `PublicProfilePage.jsx:138`, `SavedPostsPage.jsx:95`, `RegisterPage.jsx:185` | Không đồng nhất với UX toast ở phần còn lại của site | Trung
- [ ] 🟣B 🟡 **Báo lỗi API admin chỉ bằng `console.error`** | `src/pages/admin/AdminDashboardPage.jsx:45` | Không hiển thị gì lên UI cho admin biết có lỗi | Cao *(đã ghi nhận ở bản A là Cao, gộp lại theo mức Trung vì không chặn use-case chính)*
- [ ] 🟣B 🟡 **Save lịch sử điện: fallback local nhưng báo "thành công" như lưu server** | `src/pages/user/ElectricityCheckPage.jsx:299` | User không biết dữ liệu chưa đồng bộ lên server khi Supabase lỗi | Trung
- [ ] 🟣A 🟡 **Thiếu confirm khi xoá từng mục lịch sử điện** | `ElectricityHistoryPage.jsx` | Chỉ nút "xoá tất cả" có confirm, xoá từng mục thì không | Trung

### Hiệu năng

- [ ] 🟣B 🟡 **Ảnh demo/content quá nặng** | `public/demo-posts/covers/*.png` (~1.6–2.0MB), `public/images/team/viet-anh.jpg` (~947KB) | Ảnh hưởng LCP và băng thông nặng | Cao *(gộp theo mức Trung vì không ảnh hưởng tính đúng — vẫn nên ưu tiên sớm)*
- [ ] 🔵 🟡 **Bundle chính còn nặng** | `index.js` ~203KB, `supabase.js` ~209KB, `vendor.js` ~178KB, `router.js` ~75KB | Cần tách thêm logic nặng ra khỏi critical path / lazy load | Trung
- [ ] 🟣B 🟡 **Dynamic import `bannerService` không hiệu quả** | `src/components/home/HeroSection.jsx:10` | Build báo `[INEFFECTIVE_DYNAMIC_IMPORT]` vì vừa dynamic vừa static import ở nơi khác | Trung
- [ ] 🟣B 🟡 **Pattern set-state-trong-effect lặp ở nhiều component ảnh dùng rộng** | `OptimizedImage.jsx:33`, `SmartImage.jsx:21`, `UserAvatar.jsx:28` | ESLint `react-hooks/set-state-in-effect` — tạo render cascade thừa | Trung

### Khác

- [ ] 🟣A 🟡 **Dependency thiếu trong `useEffect`** | `CommunityPage.jsx:239` | `currentUser` dùng trong effect nhưng thiếu trong dependency array | Trung
- [ ] 🟣A 🟡 **Bảng quản trị có thể vỡ trên màn nhỏ** | `src/components/admin/` | Cần test responsive / thêm scroll ngang | Trung
- [ ] 🟣A 🟡 **Quản lý state Auth nằm sai chỗ** | `src/layouts/user/UserLayout.jsx` | Logic `onAuthStateChange` nên đưa vào Global Context/Store thay vì nằm trong Layout | Trung
- [ ] 🟣B 🟡 **Support Center map sai field thông báo** | `src/components/common/SupportCenter.jsx:21` | Dùng site notice công khai làm fallback cho admin notice — lệch semantics | Trung
- [ ] 🟣B ➕ **`site_notices` / `bug_reports` chưa hợp nhất vào schema nền** | `supabase/migrations/20260618_create_site_notices_and_bug_reports.sql:1` | Support center và bug manager không ổn định nếu môi trường mới chỉ chạy `schema.sql` | Trung

---

## ⚪ ƯU TIÊN THẤP

### Code style / dọn dẹp

- [ ] 🟣A 🟡 **Inline style thay vì CSS class** | `TipsPage.jsx:334`, `CommunityPostDetailPage.jsx`, `AdminDashboardPage.jsx:80` | Rải rác inline style nhiều nơi, khó đồng nhất theme | Thấp
- [ ] 🟣A 🟡 **Duplicated CSS** | `src/styles/global.css:204-430` | Bản copy trùng lặp của đoạn CSS phía trên, làm phình dung lượng | Trung *(thấp công sức sửa, nên làm sớm dù tác động nhỏ)*
- [ ] 🔵 🗑️ **Dead code / import thừa** | `SmartVideo.jsx`, `ImageSkeleton.jsx`, `AuthHero.jsx:3` (`heroImage`), `PostDetailPage.jsx:8` (`PostAuthorAvatar`), `userNotificationService.js`, nhiều import thừa trong `bannerService.js:4` | Không còn được dùng ở đâu trong `src/`, an toàn để xoá | Thấp
- [ ] 🟣A 🗑️ **Tab thừa trên Public Profile** | `PublicProfilePage.jsx` | Chỉ có 1 tab ("Bài viết") nhưng vẫn thiết kế dạng tabs | Thấp

### UI nhỏ

- [ ] 🟣A 🟡 **Loading state chỉ là text "Đang tải..."** | `PostDetailPage.jsx:153`, `CreatePostPage.jsx:27` | Thiếu Skeleton/Spinner | Trung *(gộp Thấp vì không chặn chức năng)*
- [ ] 🟣A 🟡 **Not-found state sơ sài** | `CommunityPostDetailPage.jsx:271` | Chỉ có thẻ `p` và `h2` | Thấp
- [ ] 🟣A 🟡 **FAQ không thu gọn/mở rộng được** | `ContactPage.jsx:187` | Text cứng, nên làm Accordion | Thấp
- [ ] 🟣B 🟡 **Nút follow không dùng design token chung** | `PublicProfilePage.jsx:241` | Dùng button trần, style/hover/loading không đồng nhất | Thấp
- [ ] 🟣B 🟡 **Hàng nút trang 404 thiếu `flexWrap`** | `NotFoundPage.jsx:12` | Có nguy cơ vỡ dòng trên mobile hẹp | Thấp
- [ ] 🟣B 🟡 **Modal lịch sử điện thiếu Escape + focus trap** | `ElectricityHistoryPage.jsx` | Hành vi modal chưa chuẩn accessibility | Thấp
- [ ] 🟣B 🟡 **Polling notification không có backoff** | `UserNavbar.jsx:105` (45s), `AdminTopbar.jsx:168` | Tăng network chatter, nên cân nhắc WebSocket về sau | Thấp
- [ ] 🟣A ⏳ **Nút bookmark "Bài viết nổi bật" disabled không có tooltip** | `FeaturedPosts.jsx:106` | Disabled với text "Tính năng đang phát triển" nhưng không rõ ràng | Thấp
- [ ] 🟣B ⏳ **Card "Chủ đề nổi bật" sidebar chỉ là placeholder** | `PostDetailPage.jsx:396` | Text "Đang cập nhật..." | Thấp
- [ ] 🟣B ⏳ **Khối "Bài đọc gần đây" luôn rỗng** | `SavedPostsPage.jsx:206` | `recentlyRead` truyền cứng `[]` | Thấp

### Bảo mật nhẹ / cải thiện thêm

- [ ] 🟣A 🟡 **XSS tiềm ẩn ở parser markdown thủ công** | `src/utils/markdown.js` | Dùng Regex tự viết, không có thư viện chống XSS như DOMPurify | Trung *(nên cân nhắc nâng lên Cao nếu nội dung markdown có thể do user nhập tự do)*

---

## Việc đầu tiên nên làm trước khi sửa code

Trước khi giao bất kỳ mục nào ở trên cho AI sửa, nên xác minh 1 việc nền tảng:

> **DB thật (production/staging) đã apply những file trong `supabase/drafts/` và `supabase/migrations/` chưa?**

Vì nhiều mục 🔴 Cao ở trên (Follow, Public Profile, Banner, Notifications) đều phụ thuộc việc này — nếu DB đã có migration rồi thì các mục đó tự động hạ xuống mức thấp hơn nhiều, ngược lại nếu chưa thì đây là việc cần làm **trước tiên**, trước cả việc sửa code.

## Gợi ý thứ tự giao việc cho Claude Code

1. Xác minh trạng thái migration DB (xem mục trên)
2. Sửa 4 lỗi bảo mật nghiêm trọng (lộ dữ liệu điện, race condition, fake CAPTCHA, null-safety Supabase)
3. Sửa Form Liên hệ giả + N+1 query thống kê
4. Thay toàn bộ `window.prompt/alert` bằng Modal/Toast (làm 1 lần, dùng chung 1 component, áp dụng lại nhiều chỗ)
5. Dọn dead code (an toàn, nhanh, ít rủi ro — tốt để "khởi động")
6. Tách các file/hook quá lớn thành component nhỏ
7. Phần UI nhỏ + performance còn lại
