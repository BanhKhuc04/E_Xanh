-- ============================================================
-- Fix Post Policies
-- Chạy file này trong Supabase SQL Editor để sửa lỗi đệ quy
-- khi admin duyệt bài viết
-- ============================================================

-- 1. Tạo function is_staff để kiểm tra quyền không đệ quy
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
END;
$$;

-- 2. Xóa các policy hiện tại của bảng posts
DROP POLICY IF EXISTS "posts_select_approved" ON posts;
DROP POLICY IF EXISTS "posts_select_own" ON posts;
DROP POLICY IF EXISTS "posts_select_staff" ON posts;
DROP POLICY IF EXISTS "posts_insert_own" ON posts;
DROP POLICY IF EXISTS "posts_update_own" ON posts;
DROP POLICY IF EXISTS "posts_update_staff" ON posts;
DROP POLICY IF EXISTS "posts_delete_own" ON posts;
DROP POLICY IF EXISTS "posts_delete_admin" ON posts;

-- 3. Tạo lại các policy sử dụng is_staff() và is_admin()

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
  USING (is_staff());

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
  USING (is_staff());

-- Tác giả xóa bài của mình
CREATE POLICY "posts_delete_own"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- Admin xóa bài bất kỳ
CREATE POLICY "posts_delete_admin"
  ON posts FOR DELETE
  USING (is_admin());
