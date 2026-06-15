-- ============================================================
-- STORAGE POLICIES: Upload ảnh bài viết
-- ============================================================

-- 1. Tạo bucket "post-images" và thiết lập là Public bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Cho phép Public có thể tải/đọc ảnh (để hiển thị trên app)
CREATE POLICY "Public có thể đọc ảnh post-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'post-images' );

-- 3. Cho phép User đã đăng nhập được phép Upload (Insert) ảnh
-- Bắt buộc ảnh phải lưu vào đúng thư mục "posts/{user_id}/..."
CREATE POLICY "User có thể upload ảnh bài viết của chính mình"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images' AND 
  name LIKE 'posts/' || auth.uid() || '/%'
);

-- (Tuỳ chọn) 4. Cho phép User xóa ảnh của chính họ (nếu sau này cần)
CREATE POLICY "User có thể xoá ảnh bài viết của chính mình"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images' AND 
  name LIKE 'posts/' || auth.uid() || '/%'
);
