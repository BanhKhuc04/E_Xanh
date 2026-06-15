-- ============================================================
-- E-XANH PROFILE SETTINGS + COVER IMAGE MIGRATION
-- Chạy toàn bộ file này trong Supabase SQL Editor
-- ============================================================

BEGIN;

-- 1. Bổ sung các cột còn thiếu cho profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cover_url TEXT,
  ADD COLUMN IF NOT EXISTS facebook_url TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS user_preferences JSONB NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.profiles
SET user_preferences = COALESCE(user_preferences, '{}'::jsonb)
WHERE user_preferences IS NULL;

-- 2. Hàm kiểm tra staff/admin không đệ quy
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'moderator')
  );
END;
$$;

-- 3. Grant an toàn để user chỉ update được field hợp lệ qua app
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (
  name,
  bio,
  avatar_url,
  cover_url,
  facebook_url,
  website_url,
  user_preferences,
  updated_at
) ON public.profiles TO authenticated;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_staff" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_staff" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

CREATE POLICY "profiles_select_own_or_staff"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR public.is_staff()
  );

CREATE POLICY "profiles_update_own_or_staff"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR public.is_staff()
  )
  WITH CHECK (
    auth.uid() = id
    OR public.is_staff()
  );

CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4. View public profile chỉ lộ field an toàn + cờ privacy cần thiết cho frontend
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS
SELECT
  p.id,
  p.name,
  p.avatar_url,
  p.cover_url,
  p.bio,
  to_jsonb(p) ->> 'area' AS area,
  CASE
    WHEN COALESCE((p.user_preferences ->> 'show_facebook')::boolean, true) THEN p.facebook_url
    ELSE NULL
  END AS facebook_url,
  p.created_at,
  COALESCE(p.user_preferences ->> 'profile_visibility', 'public') AS profile_visibility,
  COALESCE((p.user_preferences ->> 'show_facebook')::boolean, true) AS show_facebook,
  COALESCE((p.user_preferences ->> 'show_public_posts')::boolean, true) AS show_public_posts,
  COALESCE((p.user_preferences ->> 'allow_search_index')::boolean, true) AS allow_search_index
FROM public.profiles AS p;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 5. Storage bucket + policy cho ảnh bìa
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-covers', 'profile-covers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "profile_covers_public_read" ON storage.objects;
DROP POLICY IF EXISTS "profile_covers_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "profile_covers_update_own" ON storage.objects;
DROP POLICY IF EXISTS "profile_covers_delete_own" ON storage.objects;

CREATE POLICY "profile_covers_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-covers');

CREATE POLICY "profile_covers_insert_own"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-covers'
    AND name LIKE 'covers/' || auth.uid() || '/%'
  );

CREATE POLICY "profile_covers_update_own"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-covers'
    AND name LIKE 'covers/' || auth.uid() || '/%'
  )
  WITH CHECK (
    bucket_id = 'profile-covers'
    AND name LIKE 'covers/' || auth.uid() || '/%'
  );

CREATE POLICY "profile_covers_delete_own"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-covers'
    AND name LIKE 'covers/' || auth.uid() || '/%'
  );

COMMIT;
