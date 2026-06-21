# TASK: Fix các vấn đề đã audit — Project E-Xanh

> File này tổng hợp từ: (1) audit code thủ công, (2) audit RLS trên Supabase thật,
> (3) đối chiếu chéo Code ↔ Database schema thật để xác nhận từng phát hiện không
> phải suy đoán. Mỗi mục đều có file/dòng cụ thể.

---

## ƯU TIÊN 1 — Bảo mật nghiêm trọng (fix ngay, ảnh hưởng production)

### 1.1 Rò rỉ dữ liệu: bảng `profiles` cho phép public đọc toàn bộ
**Vị trí:** Policy `"Public profiles are viewable by everyone."` (SELECT, qual: `true`)
**Nguồn:** `supabase/policies/security_policies.sql`

Policy này cho phép **bất kỳ ai, kể cả chưa đăng nhập**, SELECT toàn bộ cột của
bảng `profiles`, bao gồm các cột nội bộ/nhạy cảm: `email`, `ban_reason`,
`banned_by`, `admin_note`, `deleted_by`, `deleted_at`.

Hệ thống đã có view `public_profiles` để lọc dữ liệu công khai an toàn — nhưng
policy cũ này trên bảng gốc vẫn đang active song song, vô hiệu hóa mục đích của
view đó.

**Việc cần làm:**
- Xóa policy `"Public profiles are viewable by everyone."` trên bảng `profiles`
- Xác nhận mọi nơi trong code cần hiển thị profile công khai đã dùng view
  `public_profiles` thay vì bảng `profiles` trực tiếp
- Audit toàn bộ `supabase/policies/security_policies.sql` — đây là file cũ,
  cần xác định có an toàn để xóa hẳn không (xem mục 1.3)

### 1.2 Bug chức năng: xóa bình luận luôn thất bại âm thầm
**Vị trí code:** `src/services/interactionService.js:285-300`, hàm `deleteMyComment()`
```js
const { error } = await supabase
  .from('comments')
  .delete()
  .eq('id', commentId)
  .eq('user_id', session.user.id)
```
**Vấn đề:** Bảng `comments` trên Supabase **không có DELETE policy nào** (đã xác
nhận bằng truy vấn `pg_policies` — chỉ có INSERT, SELECT, 2× UPDATE). RLS sẽ chặn
ở DB layer, trả về 0 rows affected mà không throw error rõ ràng → người dùng bấm
"Xóa bình luận", giao diện không báo lỗi, nhưng bình luận **vẫn còn nguyên** trong DB.

**Việc cần làm:**
- Thêm migration tạo DELETE policy cho `comments`:
  `WITH CHECK (auth.uid() = user_id)` cho user thường, cộng thêm điều kiện
  cho staff/admin nếu cần quyền xóa bình luận vi phạm
- Sau khi thêm policy, kiểm tra lại `deleteMyComment()` có xử lý đúng trường hợp
  `error` trả về (hiện tại đã có check, chỉ cần xác nhận hoạt động đúng sau khi
  policy được thêm)

### 1.3 File RLS cũ gây xung đột/policy thừa trên `posts` và `profiles`
**Nguồn nghi vấn:** `supabase/policies/security_policies.sql` (file cũ, không
`DROP POLICY IF EXISTS` trước khi tạo mới) tồn tại song song với
`supabase/policies/policies.sql` (file mới, đúng logic hơn).

Hiện tại bảng `profiles` có **9 policy** cùng tồn tại (bao gồm cả bản
`role: public` cũ và bản `role: authenticated` mới) — không sai logic nghiêm
trọng vì các policy SELECT/INSERT là OR với nhau, nhưng:
- Khó bảo trì, dễ vô tình mở lại lỗ hổng khi sửa policy sau này
- Chính là nguồn gốc của lỗ hổng 1.1 ở trên

**Việc cần làm:**
- Chạy truy vấn sau để liệt kê toàn bộ policy trùng lặp trên `posts` và `profiles`:
```sql
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename IN ('posts', 'profiles', 'comments')
ORDER BY tablename, cmd, policyname;
```
- So sánh với `supabase/policies/policies.sql` (bản đúng) để xác định policy nào
  trong `security_policies.sql` là dư thừa/nguy hiểm
- Viết migration DROP các policy cũ không cần thiết, giữ lại bản đúng duy nhất
  cho mỗi (table, cmd)
- Cân nhắc xóa hẳn `supabase/policies/security_policies.sql` khỏi repo sau khi
  xác nhận không còn migration nào phụ thuộc vào nó, để tránh ai đó chạy lại
  nhầm trong tương lai

---

## ƯU TIÊN 2 — Chức năng có giao diện nhưng chưa hoạt động đúng

### 2.1 Message lỗi lỗi thời: tính năng Follow/Unfollow báo "đang bảo trì" dù DB đã sẵn sàng
**Vị trí:** `src/pages/user/PublicProfilePage.jsx:135, 144`
```js
alert(error?.message?.includes('does not exist')
  ? 'Tính năng đang bảo trì. Vui lòng chạy file SQL.'
  : 'Lỗi: ' + (error.message || 'Không thể theo dõi'))
```
**Vấn đề:** Code giả định bảng `user_follows` có thể chưa tồn tại trên DB và hiện
message "đang bảo trì" cho trường hợp đó. Đã xác nhận bảng `user_follows` **tồn
tại thật trên Supabase** và **có đủ RLS policy** (INSERT/SELECT/DELETE). Message
này hiện chỉ gây hiểu lầm cho người dùng nếu lỗi xảy ra vì lý do khác (vd. lỗi
mạng, lỗi quyền) — vì điều kiện check `includes('does not exist')` đã lỗi thời.

**Việc cần làm:**
- Xóa nhánh check `does not exist` lỗi thời, thay bằng xử lý lỗi chuẩn
- Test lại luồng follow/unfollow thật trên môi trường có dữ liệu để xác nhận
  hoạt động đúng end-to-end (UI → service → DB → RLS)

### 2.2 Tương tự: trang Liên hệ (Contact) báo sai message dù đã có backend
**Vị trí:** `src/pages/user/ContactPage.jsx` (dòng ~75, theo audit code trước)
**Vấn đề:** Form đã gọi đúng tới bảng `contacts` (đã setup), nhưng phần xử lý lỗi
vẫn hard-code message "Tính năng đang bảo trì: Hệ thống chưa có schema/backend"
— message không khớp với thực tế hệ thống hiện tại.

**Việc cần làm:** Cập nhật lại logic/message lỗi cho khớp với trạng thái backend
thật, tương tự cách xử lý ở mục 2.1.

### 2.3 Nút "Xem chi tiết" trong Admin Post Preview — disabled cứng, không có logic
**Vị trí:** `src/components/admin/posts/AdminPostPreview.jsx` (~dòng 104-112)
```jsx
<button type="button" className="btn btn--secondary" disabled
  title="Tính năng đang phát triển" aria-disabled="true">
  Xem chi tiết
</button>
```
**Vấn đề:** Nút luôn `disabled`, không phụ thuộc state nào — là placeholder UI
thuần túy, click không có tác dụng. (Có thể là chủ đích chưa làm, cần xác nhận
với chủ dự án có muốn hoàn thiện tính năng này không, hay tạm ẩn nút đi thay vì
hiện disabled.)

### 2.4 Nút "Lưu bài" (bookmark icon) trong FeaturedPosts trên trang chủ — disabled cứng
**Vị trí:** `src/components/home/FeaturedPosts.jsx` (~dòng 101-106)
```jsx
<button className="fp-card__save-btn" title="Tính năng đang phát triển"
  disabled aria-disabled="true">
  <Bookmark size={18} strokeWidth={2.1} />
</button>
```
**Vấn đề:** Hệ thống đã có chức năng lưu bài hoạt động đầy đủ ở nơi khác
(`src/services/interactionService.js`, dùng trong `PostCard.jsx`,
`PostDetailPage.jsx`), nhưng nút tương tự ở khu vực "Bài viết nổi bật" trên
trang chủ lại bị khóa cứng — không nhất quán trải nghiệm.

**Việc cần làm:** Nối nút này với cùng logic save/unsave đã có sẵn trong
`interactionService.js`, thay vì để disabled.

### 2.5 Badge "Sắp ra mắt" — placeholder chủ đích (không phải bug, chỉ liệt kê để theo dõi)
- `src/pages/user/SettingsUserPage.jsx:780, 887` — cài đặt thông báo, tự động
  đăng xuất: chưa có luồng xử lý, hiện badge "Sắp ra mắt" rõ ràng cho user biết
- `src/pages/auth/ForgotPasswordPage.jsx:137`,
  `src/pages/auth/ResetPasswordPage.jsx:334` — text "Ảnh minh họa đang cập nhật"
  thay cho hình ảnh thật ở layout xác thực

Đây là các placeholder **có chủ đích, đã thông báo rõ cho người dùng** — không
cần fix gấp, chỉ liệt kê để bạn quyết định có ưu tiên hoàn thiện hay không.

---

## ƯU TIÊN 3 — UX: dùng `alert()` thay vì hệ thống Toast

Toàn bộ các vị trí sau đang dùng `alert()` mặc định của trình duyệt (ngắt luồng,
trải nghiệm kém) thay vì toast notification của hệ thống:

| File | Dòng | Ngữ cảnh |
|---|---|---|
| `src/components/community/InlineCommentSection.jsx` | 218, 224, 226 | Báo cáo bình luận |
| `src/components/posts/PostCard.jsx` | 31, 41, 45 | Lưu bài, lỗi tương tác |
| `src/pages/user/PublicProfilePage.jsx` | 120, 135, 144 | Follow/unfollow |
| `src/pages/user/SavedPostsPage.jsx` | 95 | Lỗi khi bỏ lưu bài |
| `src/pages/user/PostDetailPage.jsx` | 172, 200, 208, 236, 245, 250, 278, 351, 357, 359 | Like, save, follow, report (nhiều nhất) |
| `src/pages/auth/RegisterPage.jsx` | 182, 184 | Gửi lại email xác nhận |

**Việc cần làm:** Thay toàn bộ `alert(...)` bằng hàm `toast()`/`toast.error()`
của hệ thống hiện có. Ưu tiên `PostDetailPage.jsx` trước vì có nhiều nhất (10 vị
trí) và là trang người dùng truy cập nhiều nhất.

---

## ƯU TIÊN 4 — Hiệu năng

### 4.1 N+1 query trong Admin User Service
**Vị trí:** `src/services/adminUserService.js:434`
**Vấn đề:** Đếm số liệu (posts, comments, saved, electricity checks) cho danh
sách user dùng vòng lặp `.map()` + `Promise.all()` với 4 query riêng mỗi user.
Với 20 user → 80 query đồng thời tới Supabase → rủi ro cạn kết nối hoặc bị rate
limit.
**Đề xuất:** Chuyển thành 1 Postgres RPC function, group by `user_id`, gọi 1 lần
duy nhất.

### 4.2 Thiếu `loading="lazy"` trên nhiều thẻ `<img>`
**File ảnh hưởng:** `AvatarUploader.jsx`, `BrandLogo.jsx`, `CommunityPreview.jsx`,
`SettingsUserPage.jsx` (và có thể còn nơi khác — nên grep lại
`<img` không qua `SmartImage`/`OptimizedImage` toàn bộ `src/` để chắc chắn đủ).
**Đề xuất:** Thêm `loading="lazy"` cho ảnh below-the-fold, hoặc tái cấu trúc dùng
chung component `SmartImage` đã có sẵn trong hệ thống.

### 4.3 CSS build chậm — nhiều file CSS lắt nhắt, có thể có unused CSS
**Đề xuất:** Gộp các file CSS nhỏ, dùng tool kiểm tra unused CSS (ví dụ
PurgeCSS hoặc tính năng tương đương trong Vite) để loại bỏ phần không dùng.

---

## ƯU TIÊN 5 — Đề xuất tính năng phát triển tiếp (không gấp, tham khảo)

Dựa trên hạ tầng sẵn có (hệ thống điểm trong `profiles`, post types, community,
electricity tracking):

1. **Huy hiệu Gamification** — cấp badge tự động ("Chuyên gia tiết kiệm",
   "Người đóng góp") dựa trên điểm tích lũy sẵn có, hiển thị cạnh tên trên diễn đàn
2. **Gợi ý thiết bị tiết kiệm điện** — dựa trên dữ liệu `electricity_checks` /
   `electricity_check_items` user đã nhập, gợi ý thiết bị tiêu thụ điện cao cần thay
3. **Báo cáo điện năng hàng tháng qua Email** — Supabase Edge Function chạy
   cronjob, tổng hợp dữ liệu tháng, gửi qua Resend/SendGrid
4. **Thử thách Tiết kiệm Xanh hàng tháng** — user tham gia challenge (vd. giảm 5%
   hóa đơn so với tháng trước), cộng điểm nếu đạt
5. **Lưu bộ lọc tìm kiếm tại TipsPage** — cho phép lưu cấu hình filter hay dùng
   để truy cập nhanh lần sau

---

## Ghi chú cho Antigravity / Opus khi xử lý

- **Không tự động apply migration RLS lên production** — chỉ viết migration file,
  để người dùng tự review và chạy thủ công qua Supabase Dashboard hoặc CLI
- Với mục 1.3 (dọn dẹp `security_policies.sql`), cần liệt kê rõ từng policy sẽ
  bị DROP và policy nào sẽ giữ lại trước khi viết migration, để dễ review
- Ưu tiên xử lý theo đúng thứ tự 1 → 2 → 3 → 4 → 5 trong file này; nhóm 1 ảnh
  hưởng bảo mật thật, cần làm trước cả các nhóm còn lại
- Sau khi có kế hoạch (plan) từ việc phân tích sâu, bàn giao lại cho Claude Code
  (Sonnet) để thực thi từng phần theo plan đã duyệt
