-- Cập nhật view public_profiles để bổ sung website_url và user_preferences
-- Khắc phục lỗi Frontend không tải được Avatar do thiếu cột
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
    user_preferences
FROM public.profiles;
