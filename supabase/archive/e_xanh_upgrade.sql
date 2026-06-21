-- 1. Bảng posts: Thêm content_blocks jsonb
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS content_blocks jsonb DEFAULT '[]'::jsonb;

-- 2. Bảng profiles: Thêm facebook_url text
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS facebook_url text;

-- 3. Cập nhật view public.public_profiles để xuất facebook_url
DROP VIEW IF EXISTS public.public_profiles CASCADE;

CREATE VIEW public.public_profiles AS
SELECT 
    id, 
    name, 
    avatar_url, 
    cover_url,
    bio, 
    COALESCE(area, null::text) AS area,
    facebook_url,
    created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;
