-- ============================================================
-- STORAGE POLICIES: Avatar người dùng
-- Chạy file này trong Supabase SQL Editor khi deploy hạ tầng
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-avatars', 'profile-avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public có thể đọc ảnh avatar"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-avatars');

CREATE POLICY "User có thể upload avatar của chính mình"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  name LIKE 'avatars/' || auth.uid() || '/%'
);

CREATE POLICY "User có thể cập nhật avatar của chính mình"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  name LIKE 'avatars/' || auth.uid() || '/%'
)
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  name LIKE 'avatars/' || auth.uid() || '/%'
);

CREATE POLICY "User có thể xóa avatar của chính mình"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  name LIKE 'avatars/' || auth.uid() || '/%'
);
