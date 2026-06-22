-- Thêm cột Gamification
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';

-- Cập nhật view public_profiles để expose 2 cột này cho Frontend hiển thị an toàn
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
    id, 
    name, 
    avatar_url, 
    cover_url, 
    bio, 
    COALESCE(area, NULL::text) AS area, 
    facebook_url, 
    created_at,
    website_url, 
    user_preferences,
    points,
    badges
FROM public.profiles;

-- Hàm RPC cộng điểm an toàn
CREATE OR REPLACE FUNCTION public.add_user_points(target_user_id UUID, points_to_add INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET points = COALESCE(points, 0) + points_to_add
    WHERE id = target_user_id;
END;
$$;
