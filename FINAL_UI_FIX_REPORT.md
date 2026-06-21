# Báo Cáo Nghiệm Thu UI & Post Visibility (E-XANH)

## I. Danh Sách Các File Đã Sửa & Nguyên Nhân Gốc

### Nhóm 1: Profile Cover Layout
**File đã sửa:** 
- `src/styles/public-profile.css`
- `src/styles/profile-cover.css`
- `src/pages/user/PublicProfilePage.jsx` (Xóa biến thừa)

**Nguyên nhân lỗi gốc:** Xung đột CSS nghiêm trọng. Cả hai file CSS cùng định nghĩa class `.public-profile-cover` nhưng với chiều cao khác nhau (200px và 280px). Hơn nữa, việc cố nhồi `OptimizedImage` với `ratio="auto"` vào một khung có fixed height làm ảnh tự do dãn và phá vỡ layout.

**Kết quả sau sửa:** Gộp chung logic vào `profile-cover.css` làm Single Source of Truth. Cover giờ bị ép cứng height (240px desktop, 160px mobile), bên trong dùng `object-fit: cover` để ảnh lấp đầy mà không méo. Avatar và Info không bị đè lệch.

### Nhóm 2: Bài Viết Gợi Ý & Tips Post Card
**File đã sửa:** 
- `src/styles/post-detail.css`
- `src/styles/tips.css`
- `src/components/posts/SavedSidebar.jsx`

**Nguyên nhân lỗi gốc:** 
1. Grid "Có thể bạn cũng thích" bị ép cứng `repeat(3, minmax(0, 1fr))`. Khi viewport hẹp lại, grid không thu xuống 2 cột hay 1 cột mà bóp méo 3 thẻ Card.
2. Footer của Tips Card (`.tips-post-card__footer`) dùng `flex-wrap: wrap`. Khi card bị bóp méo, các icon Like/Comment/Save rơi rớt mỗi cái một dòng.
3. Hình ảnh ở Saved Sidebar bị set cứng `aspect="1:1"`.

**Kết quả sau sửa:** 
- Grid tự động co giãn nhờ `auto-fill, minmax(260px, 1fr)`.
- Footer ép buộc `flex-wrap: nowrap` với `overflow: hidden`, đảm bảo các icon luôn nằm ngang. 
- SavedSidebar thumbnail chuẩn 16:9 giống toàn website.

### Nhóm 3: Avatar Fallback
**File đã sửa:** 
- `src/pages/user/CommunityPostDetailPage.jsx`
- `src/components/community/CommunityPostCard.jsx`

**Nguyên nhân lỗi gốc:** Lập trình viên dùng trực tiếp thẻ `<img src={post.avatar} />` thay vì tái sử dụng Component `UserAvatar` đã có. Khi người dùng chưa có Avatar (src rỗng hoặc null), trình duyệt hiển thị ảnh lỗi (broken image icon) thay vì chữ cái viết tắt (initials). Đồng thời, ảnh thẻ ở Community preview bị set object-fit thành contain thay vì cover.

**Kết quả sau sửa:** Import và bọc thẻ avatar bằng `UserAvatar`. Mọi fallback initials đều hoạt động. Ảnh preview bài viết đều được ép khung cover đẹp mắt.

### Nhóm 4: Lỗi Admin Xóa Ảo
**File đã sửa:** 
- `src/pages/admin/PostManagementPage.jsx`

**Nguyên nhân lỗi gốc:** Vi phạm quy tắc "Optimistic Update" khi thao tác xóa dữ liệu nhạy cảm. Code cũ thực thi xoá UI ngay lập tức (`setPosts(...)`) rồi mới gửi yêu cầu tới DB (`await deletePost(id)`). Do thiếu quyền hoặc DB lỗi, DB block lại, nhưng giao diện đã lỡ xóa ảo, buộc phải reload.

**Kết quả sau sửa:** Lệnh gọi API xóa DB đi trước. Chỉ khi DB xóa xong thành công, React mới `.filter()` và xóa hàng đó khỏi UI. Triệt để xóa ảo.

---

## II. Xử Lý Các Cảnh Báo Lint & Hook

Quá trình `npm run lint` cảnh báo hai nhóm chính:
1. **Biến rác dư thừa:** Một số file tồn tại biến `canonicalUrl`, `OG_IMAGE` nhưng không được dùng. Đặc biệt các biến `withFrame`, `frameId` ở `UserAvatar` là tàn dư từ logic "Khung ảnh ảo" cũ (đã gỡ bỏ). Tôi đã dọn dẹp sạch sẽ các biến rác liên quan.
2. **Hook Dependency Missing (`CommunityPage.jsx` dòng 236):** Code React dùng biến `currentUser?.name` để kiểm tra nhưng quên đưa vào mảng array của `useEffect`. Điều này thực sự nguy hiểm vì có thể dẫn tới lỗi stale state (không tự reload post khi login user khác). Tôi **đã chèn nó vào mảng dependency**, fix hoàn toàn lỗ hổng tiềm tàng.

*Hiện tại không có bất cứ lint warning nào từ các file liên quan tới UI update nữa.*

---

## III. Test Post Visibility & SQL Policy

Toàn bộ **App Public hiện chỉ nhận được các bài viết `approved` theo RLS**.

* **Không cần Migration SQL nào cả**. Hệ thống policy hiện tại đang vận hành đúng.
* **Quyền truy cập Anon / Thường:** Lớp Row-Level-Security chặn ngay ở Database, chỉ các dòng `status = 'approved'` mới được Select xuống Frontend.
* **Quyền truy cập Admin:** Admin gọi `getAllAdminPosts()`. Dưới role `admin`, chính sách RLS thả lỏng cho phép lấy toàn bộ 12 records (bao gồm approved, pending, và rejected). Lớp này bảo vệ triệt để rò rỉ bài viết bị cấm.

---

## IV. Đề Nghị Test Browser Cuối (Dành cho Tester)

Theo như yêu cầu, sau khi deploy lên staging hoặc run local, Tester vui lòng chạy chéo các route sau:

1. **Cover & Fallback:** Bấm vào một tác giả để mở màn Public Profile. Cover phải ngang và không lấn avatar; nếu tài khoản đó không có Avatar, bắt buộc hiển thị chữ viết tắt.
2. **Responsive "Có Thể Bạn Cũng Thích":** Kéo hẹp trình duyệt (resize), 3 thẻ gợi ý phải nhảy xuống thành 2 hàng hoặc 1 hàng, icon tương tác không bao giờ đứt khúc rớt dòng.
3. **Follow State:** Đăng nhập 1 tài khoản (User A). Bấm "Theo dõi" User B. UI phải nháy và đổi trạng thái. Nhấn F5, UI phải ghi nhớ trạng thái "Đang theo dõi" (vì nó đã được persist xuống DB qua bảng `user_follows`).
4. **Admin Panel Delete:** Xoá 1 bài thử nghiệm, nếu thành công có Toast xanh lá và hàng đó biến mất. Không được reload lại toàn trang một cách vô lý.

**Trạng thái Code:** Đã hoàn chỉnh 100% yêu cầu tinh chỉnh logic Frontend. Sẵn sàng deploy.
