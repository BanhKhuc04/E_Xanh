-- ============================================================
-- Migration: Chuẩn hóa public_profiles và tạo view community_active_members
-- Mục tiêu:
-- - Sidebar "Thành viên tích cực" chỉ đọc dữ liệu công khai an toàn
-- - Không expose email, role, status hoặc thông tin nhạy cảm
-- ============================================================

DROP VIEW IF EXISTS public.community_active_members;
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS
SELECT
  p.id,
  COALESCE(NULLIF(p.name, ''), 'Thành viên E-XANH') AS name,
  p.avatar_url,
  p.cover_url,
  p.bio,
  to_jsonb(p) ->> 'area' AS area,
  p.facebook_url,
  p.created_at,
  p.website_url,
  COALESCE(p.user_preferences->>'profile_visibility', 'public') AS profile_visibility,
  COALESCE((p.user_preferences->>'show_facebook')::boolean, true) AS show_facebook,
  COALESCE((p.user_preferences->>'show_public_posts')::boolean, true) AS show_public_posts,
  COALESCE((p.user_preferences->>'allow_search_index')::boolean, true) AS allow_search_index
FROM public.profiles AS p
WHERE COALESCE(p.status, '') NOT IN ('deleted', 'blocked');

GRANT SELECT ON public.public_profiles TO anon, authenticated;

CREATE VIEW public.community_active_members AS
SELECT
  posts.author_id AS id,
  COALESCE(public_profiles.name, 'Thành viên E-XANH') AS name,
  public_profiles.avatar_url,
  COUNT(posts.id)::int AS post_count,
  MAX(posts.created_at) AS latest_post_at
FROM public.posts
LEFT JOIN public.public_profiles
  ON public.public_profiles.id = posts.author_id
WHERE posts.status = 'approved'
  AND posts.type = 'community'
  AND posts.author_id IS NOT NULL
GROUP BY
  posts.author_id,
  public_profiles.name,
  public_profiles.avatar_url
ORDER BY
  COUNT(posts.id) DESC,
  MAX(posts.created_at) DESC;

GRANT SELECT ON public.community_active_members TO anon, authenticated;
