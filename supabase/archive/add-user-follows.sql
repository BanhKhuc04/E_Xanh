DROP VIEW IF EXISTS public.public_profiles CASCADE;

CREATE VIEW public.public_profiles AS
SELECT 
    id, 
    name, 
    avatar_url, 
    bio, 
    area, 
    created_at
FROM public.profiles;

-- Bật bảo mật (nếu view hỗ trợ RLS ở cấp cơ sở, PostgreSQL tự pass through).
-- Không cấp quyền trực tiếp cho public mà để RLS của profiles hoặc cấp quyền SELECT cho anon/authenticated.
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Tạo bảng user_follows
CREATE TABLE IF NOT EXISTS public.user_follows (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(follower_id, following_id),
  CONSTRAINT check_not_self_follow CHECK (follower_id <> following_id)
);

-- Bật RLS
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Policy 1: Ai cũng có thể xem follow (Read)
DROP POLICY IF EXISTS "Cho phép xem danh sách follow" ON public.user_follows;
CREATE POLICY "Cho phép xem danh sách follow"
ON public.user_follows
FOR SELECT
USING (true);

-- Policy 2: Chỉ user đăng nhập mới được follow người khác (Insert)
DROP POLICY IF EXISTS "User chỉ được insert với follower_id là chính mình" ON public.user_follows;
CREATE POLICY "User chỉ được insert với follower_id là chính mình"
ON public.user_follows
FOR INSERT
WITH CHECK (auth.uid() = follower_id);

-- Policy 3: Chỉ user đăng nhập mới được hủy follow của chính mình (Delete)
DROP POLICY IF EXISTS "User chỉ được xóa follow của chính mình" ON public.user_follows;
CREATE POLICY "User chỉ được xóa follow của chính mình"
ON public.user_follows
FOR DELETE
USING (auth.uid() = follower_id);
