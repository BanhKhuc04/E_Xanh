-- ==========================================
-- BATCH 6: Fix Security & RLS Policies
-- ==========================================

-- 1. DROP các policy cũ gây rò rỉ hoặc trùng lặp trên bảng profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- 2. Thêm policy cho phép tác giả xóa bình luận của mình trên bảng comments
--    (Bảng comments trước đây chưa có policy DELETE nào cả)
CREATE POLICY "comments_delete_own" 
ON comments 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 3. Thêm policy cho phép staff/admin xóa bình luận vi phạm
CREATE POLICY "comments_delete_staff" 
ON comments 
FOR DELETE 
TO authenticated 
USING (current_user_is_staff());

-- Hoàn tất Batch 6.
