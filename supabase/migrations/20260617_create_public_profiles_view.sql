-- ============================================================
-- Migration: Tạo view public_profiles
-- Cho phép anon/authenticated đọc thông tin công khai của user
-- Không expose: email, role, status, ban_reason, deleted_at, ...
-- ============================================================

-- 1. Tạo view chỉ expose các trường an toàn
CREATE OR REPLACE VIEW public_profiles AS
SELECT
  id,
  COALESCE(NULLIF(name, ''), 'Thành viên E-XANH') AS name,
  avatar_url,
  bio,
  created_at
FROM profiles
WHERE COALESCE(status, '') NOT IN ('deleted', 'blocked');

-- 2. Cho phép anon và authenticated SELECT view này
GRANT SELECT ON public_profiles TO anon, authenticated;

-- 3. (Optional) Nếu muốn RLS áp dụng qua view, enable security invoker
-- ALTER VIEW public_profiles SET (security_invoker = true);
-- Không cần nếu dùng SECURITY DEFINER mặc định của view

-- Ghi chú:
-- View này không expose: email, role, status, ban_reason, banned_at,
-- banned_by, deleted_at, deleted_by, updated_at.
-- Guest (anon) chỉ thấy id, name, avatar_url, bio, created_at
-- của các user không bị deleted/blocked.
