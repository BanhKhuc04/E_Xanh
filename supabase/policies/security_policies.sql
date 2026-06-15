-- Kiểm tra policy hiện tại
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Bật RLS cho các bảng quan trọng nếu chưa bật
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- BẢNG PROFILES

-- Policy 1: Bất kỳ ai cũng có thể xem hồ sơ công khai
CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT USING (true);

-- Policy 2: User tự update thông tin (Khuyến cáo dùng RPC để bảo mật tuyệt đối)
-- Lưu ý: Postgres RLS không hỗ trợ column-level trực tiếp trong WITH CHECK.
-- Do đó ứng dụng client KHÔNG ĐƯỢC PHÉP gửi role/status. 
-- Nếu muốn chặt chẽ 100%, hãy xóa quyền UPDATE trên bảng profiles cho user thường và dùng hàm RPC.
CREATE POLICY "Users can insert their own profile." 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- (Chỉ admin mới được update role/status - Tốt nhất thực hiện qua Database Function / RPC gọi bẳng service_role)
-- Ví dụ RPC:
/*
CREATE OR REPLACE FUNCTION update_user_role_status(target_id uuid, new_role text, new_status text)
RETURNS void AS $$
BEGIN
  IF (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' THEN
    UPDATE profiles SET role = new_role, status = new_status WHERE id = target_id;
  ELSE
    RAISE EXCEPTION 'Not authorized';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

-- BẢNG POSTS

CREATE POLICY "Posts viewable by everyone if approved" 
ON posts FOR SELECT 
USING (status = 'approved' OR auth.uid() = author_id OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'moderator'));

CREATE POLICY "Users can insert own posts" 
ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own pending posts" 
ON posts FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Admin/Mod can update any post status" 
ON posts FOR UPDATE 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'moderator'));

CREATE POLICY "Only admin can delete posts" 
ON posts FOR DELETE 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- BẢNG COMMENTS

CREATE POLICY "Comments viewable by everyone" 
ON comments FOR SELECT USING (true);

CREATE POLICY "Users can insert own comments" 
ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admin/Mod can delete comments" 
ON comments FOR DELETE 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'moderator') OR auth.uid() = author_id);

-- BẢNG POST_LIKES

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see all likes" 
ON post_likes FOR SELECT USING (true);

CREATE POLICY "Users can like/unlike posts" 
ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their likes" 
ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- BẢNG SAVED_POSTS

ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own saved posts" 
ON saved_posts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save posts" 
ON saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave posts" 
ON saved_posts FOR DELETE USING (auth.uid() = user_id);

-- BẢNG DEVICES

CREATE POLICY "Anyone can view devices" 
ON devices FOR SELECT USING (true);

CREATE POLICY "Only admins can modify devices" 
ON devices FOR ALL 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- BẢNG WEBSITE_BANNERS (banners)

ALTER TABLE website_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners" 
ON website_banners FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can modify banners" 
ON website_banners FOR ALL 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- BẢNG WEBSITE_ANNOUNCEMENTS

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
USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'moderator'));

CREATE POLICY "website_announcements_staff_insert"
ON website_announcements FOR INSERT
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'moderator'));

CREATE POLICY "website_announcements_staff_update"
ON website_announcements FOR UPDATE
USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'moderator'))
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'moderator'));

CREATE POLICY "website_announcements_staff_delete"
ON website_announcements FOR DELETE
USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'moderator'));

-- GHI CHÚ QUAN TRỌNG:
-- Chạy đoạn script này trên Supabase SQL Editor.
-- Client-side whitelist đã được bổ sung nhưng RLS là lớp khiên bảo mật cuối cùng chặn hacker!
