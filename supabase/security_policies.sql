-- =========================================================================
-- FILE HƯỚNG DẪN SQL RLS (CHỈ CHẠY THỦ CÔNG TRONG SUPABASE SQL EDITOR)
-- =========================================================================

-- MỤC TIÊU:
-- Bảo mật các hành động của admin (update status, delete, set role, set user status).
-- Front-end đã có AdminRoute nhưng không ngăn được việc gọi trực tiếp qua API.
-- File này nhằm đảm bảo Supabase RLS chặn các hành vi leo thang quyền hạn từ user thường.

-- LƯU Ý QUAN TRỌNG:
-- Nếu project đã bật RLS và cấu hình trước đó, hãy cẩn thận khi chạy lệnh DROP POLICY.
-- Chỉ chạy những lệnh nào thực sự cần thiết và bị thiếu trên server.

-- 1. BẢNG posts: CHỈ ADMIN/MODERATOR ĐƯỢC PHÉP UPDATE STATUS / DELETE
-- Giả sử đã có RLS cho `posts`. Bạn cần đảm bảo user thường không thể tự update `status` của bài mình thành 'published'.

-- Policy: Admin/Moderator được update bất kỳ bài nào (bao gồm duyệt, từ chối, khóa)
-- DROP POLICY IF EXISTS "posts_update_staff" ON posts;
CREATE POLICY "posts_update_staff"
ON posts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- Policy: Admin/Moderator được quyền xóa bài viết
-- DROP POLICY IF EXISTS "posts_delete_staff" ON posts;
CREATE POLICY "posts_delete_staff"
ON posts
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- Policy bổ sung cho user: Người dùng có thể sửa bài của mình, NHƯNG KHÔNG ĐƯỢC TỰ DUYỆT BÀI
-- (Logic này cần xử lý bằng hàm trigger nếu muốn chặn hoàn toàn việc đổi cột `status` từ client của user thường)


-- 2. BẢNG profiles: CHỈ ADMIN MỚI ĐƯỢC PHÉP ĐỔI `role` VÀ `status`
-- Cấu hình chặn user tự sửa `role` đã được xử lý phía client (chỉ whitelist: name, bio, avatar).
-- Tuy nhiên ở RLS, để chặn triệt để, thông thường ta cần sử dụng Security Definer Function để đổi role,
-- hoặc tạo 1 bảng riêng biệt không cho client update.
-- Nếu dùng RLS, ta có thể cho phép admin update profile của người khác:

-- DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin"
ON profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);


-- 3. BẢNG devices: CHỈ ADMIN/MODERATOR ĐƯỢC QUYỀN INSERT/UPDATE/DELETE (nếu đúng logic)
-- Tùy thuộc logic app. Nếu admin là người thêm thiết bị điện mẫu vào hệ thống:

-- DROP POLICY IF EXISTS "devices_insert_admin" ON devices;
CREATE POLICY "devices_insert_admin"
ON devices
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- DROP POLICY IF EXISTS "devices_update_admin" ON devices;
CREATE POLICY "devices_update_admin"
ON devices
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- DROP POLICY IF EXISTS "devices_delete_admin" ON devices;
CREATE POLICY "devices_delete_admin"
ON devices
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- ĐÃ XONG. 
-- KHÔNG CHẠY TỰ ĐỘNG. FILE NÀY CHỈ LÀ TÀI LIỆU HƯỚNG DẪN.
