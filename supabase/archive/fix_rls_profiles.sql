-- Bật RLS cho bảng profiles nếu chưa bật
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Cấp quyền (Grants) cơ bản cho role authenticated
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

-- Xóa policy cũ nếu có (để tạo lại cho chắc chắn)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile." ON public.profiles;

-- 1. Cho phép tất cả mọi người (kể cả chưa đăng nhập) xem profiles
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT 
USING (true);

-- 2. Cho phép người dùng đăng nhập tự cập nhật profile của chính mình
CREATE POLICY "Users can update own profile." 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. Cho phép người dùng insert profile của chính mình (nếu không dùng trigger Security Definer)
CREATE POLICY "Users can insert own profile." 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);
