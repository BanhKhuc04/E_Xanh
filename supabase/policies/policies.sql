-- ============================================================
-- E-XANH Row Level Security Policies
-- Chạy file này SAU schema.sql trong Supabase SQL Editor
-- ============================================================

-- ============================================
-- PROFILES
-- ============================================

-- Hàm phụ trợ kiểm tra admin (bỏ qua RLS để tránh đệ quy)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Ai cũng đọc được profile (tên, avatar hiển thị công khai)
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (true);

-- User chỉ sửa profile của chính mình
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin đọc + sửa tất cả profiles
CREATE POLICY "profiles_admin_all"
  ON profiles FOR ALL
  USING (is_admin());


-- ============================================
-- CATEGORIES
-- ============================================

-- Ai cũng đọc được danh mục
CREATE POLICY "categories_select_public"
  ON categories FOR SELECT
  USING (true);

-- Chỉ admin tạo/sửa/xóa danh mục
CREATE POLICY "categories_admin_manage"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- POSTS
-- ============================================

-- Ai cũng đọc được bài đã duyệt
CREATE POLICY "posts_select_approved"
  ON posts FOR SELECT
  USING (status = 'approved');

-- Tác giả đọc được bài của chính mình (kể cả pending/rejected)
CREATE POLICY "posts_select_own"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);

-- Staff (admin + moderator) đọc được tất cả bài
CREATE POLICY "posts_select_staff"
  ON posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- User tạo bài mới (author_id phải = uid, status mặc định pending)
CREATE POLICY "posts_insert_own"
  ON posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND status = 'pending'
  );

-- Tác giả sửa bài của mình nhưng KHÔNG được tự set approved
CREATE POLICY "posts_update_own"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (status IN ('pending', 'hidden'));

-- Staff duyệt/từ chối/ẩn bài bất kỳ
CREATE POLICY "posts_update_staff"
  ON posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Tác giả xóa bài của mình
CREATE POLICY "posts_delete_own"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- Admin xóa bài bất kỳ
CREATE POLICY "posts_delete_admin"
  ON posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- COMMENTS
-- ============================================

-- Ai cũng đọc được bình luận visible
CREATE POLICY "comments_select_visible"
  ON comments FOR SELECT
  USING (status = 'visible');

-- Staff đọc tất cả bình luận (kể cả hidden/reported/spam)
CREATE POLICY "comments_select_staff"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- User đã đăng nhập tạo bình luận (user_id = uid)
CREATE POLICY "comments_insert_own"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User sửa bình luận của mình
CREATE POLICY "comments_update_own"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Staff ẩn/xóa bình luận bất kỳ
CREATE POLICY "comments_update_staff"
  ON comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "comments_delete_staff"
  ON comments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- User xóa bình luận của mình
CREATE POLICY "comments_delete_own"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POST_LIKES
-- ============================================

-- Ai cũng đọc được ai đã thích (public)
CREATE POLICY "post_likes_select_public"
  ON post_likes FOR SELECT
  USING (true);

-- User quản lý like của chính mình
CREATE POLICY "post_likes_insert_own"
  ON post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_likes_delete_own"
  ON post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SAVED_POSTS
-- ============================================

-- User chỉ đọc bài đã lưu của chính mình
CREATE POLICY "saved_posts_select_own"
  ON saved_posts FOR SELECT
  USING (auth.uid() = user_id);

-- User lưu bài cho chính mình
CREATE POLICY "saved_posts_insert_own"
  ON saved_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User bỏ lưu bài của chính mình
CREATE POLICY "saved_posts_delete_own"
  ON saved_posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REPORTS
-- ============================================

-- User tạo báo cáo (reporter_id = uid)
CREATE POLICY "reports_insert_own"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- User đọc report của chính mình
CREATE POLICY "reports_select_own"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Staff đọc tất cả reports
CREATE POLICY "reports_select_staff"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Staff xử lý reports (update status)
CREATE POLICY "reports_update_staff"
  ON reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- ============================================
-- DEVICES
-- ============================================

-- Ai cũng đọc được thiết bị visible
CREATE POLICY "devices_select_visible"
  ON devices FOR SELECT
  USING (is_visible = true);

-- Staff đọc tất cả thiết bị (kể cả ẩn)
CREATE POLICY "devices_select_staff"
  ON devices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Chỉ admin tạo/sửa/xóa thiết bị
CREATE POLICY "devices_admin_insert"
  ON devices FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "devices_admin_update"
  ON devices FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "devices_admin_delete"
  ON devices FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- ELECTRICITY_CHECKS
-- ============================================

-- User chỉ đọc lượt kiểm tra của chính mình
CREATE POLICY "electricity_checks_select_own"
  ON electricity_checks FOR SELECT
  USING (auth.uid() = user_id);

-- User tạo lượt kiểm tra cho chính mình
CREATE POLICY "electricity_checks_insert_own"
  ON electricity_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User xóa lượt kiểm tra của chính mình
CREATE POLICY "electricity_checks_delete_own"
  ON electricity_checks FOR DELETE
  USING (auth.uid() = user_id);

-- Admin đọc tất cả (thống kê)
CREATE POLICY "electricity_checks_select_admin"
  ON electricity_checks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- ELECTRICITY_CHECK_ITEMS
-- ============================================

-- User đọc chi tiết kiểm tra của mình (qua check_id → user_id)
CREATE POLICY "electricity_check_items_select_own"
  ON electricity_check_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM electricity_checks
      WHERE id = check_id AND user_id = auth.uid()
    )
  );

-- User tạo chi tiết (qua check_id → user_id)
CREATE POLICY "electricity_check_items_insert_own"
  ON electricity_check_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM electricity_checks
      WHERE id = check_id AND user_id = auth.uid()
    )
  );

-- User xóa chi tiết (qua check_id → user_id)
CREATE POLICY "electricity_check_items_delete_own"
  ON electricity_check_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM electricity_checks
      WHERE id = check_id AND user_id = auth.uid()
    )
  );

-- Admin đọc tất cả
CREATE POLICY "electricity_check_items_select_admin"
  ON electricity_check_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PLATFORM_SETTINGS
-- ============================================

-- Ai cũng đọc được cài đặt nền tảng
CREATE POLICY "platform_settings_select_public"
  ON platform_settings FOR SELECT
  USING (true);

-- Chỉ admin tạo/sửa cài đặt
CREATE POLICY "platform_settings_admin_insert"
  ON platform_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "platform_settings_admin_update"
  ON platform_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- SYSTEM_BACKUPS
-- ============================================

CREATE POLICY "system_backups_admin_select"
  ON system_backups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "system_backups_admin_insert"
  ON system_backups FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- WEBSITE_ANNOUNCEMENTS
-- ============================================

ALTER TABLE website_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "website_announcements_public_select_active" ON website_announcements;
DROP POLICY IF EXISTS "website_announcements_staff_select_all" ON website_announcements;
DROP POLICY IF EXISTS "website_announcements_staff_insert" ON website_announcements;
DROP POLICY IF EXISTS "website_announcements_staff_update" ON website_announcements;
DROP POLICY IF EXISTS "website_announcements_admin_delete" ON website_announcements;
DROP POLICY IF EXISTS "website_announcements_staff_delete" ON website_announcements;

CREATE POLICY "website_announcements_public_select_active"
  ON website_announcements FOR SELECT
  USING (
    is_active = true
    AND (start_at IS NULL OR start_at <= now())
    AND (end_at IS NULL OR end_at >= now())
  );

CREATE POLICY "website_announcements_staff_select_all"
  ON website_announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "website_announcements_staff_insert"
  ON website_announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "website_announcements_staff_update"
  ON website_announcements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "website_announcements_staff_delete"
  ON website_announcements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );
