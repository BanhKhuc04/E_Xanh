-- MIGRATION: Fix RLS Policies based on Audit
-- Ngày: 21/06/2026

-- 1. Đảm bảo bảng admin_login_history đã tồn tại (phòng trường hợp DB chưa chạy migration trước đó)
CREATE TABLE IF NOT EXISTS public.admin_login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  login_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL
);
ALTER TABLE public.admin_login_history ENABLE ROW LEVEL SECURITY;

-- Sửa admin_login_history: Chỉ cho phép admin tự log (tránh anonymous spam data giả)
DROP POLICY IF EXISTS "Cho phép ghi log đăng nhập" ON public.admin_login_history;

CREATE POLICY "Cho phép ghi log đăng nhập"
  ON public.admin_login_history
  FOR INSERT
  WITH CHECK (auth.uid() = admin_id);



-- 2. Xóa các policy sai/thừa trên bảng posts (đã được thay thế bởi posts_insert_own_pending, v.v.)
-- Theo báo cáo, các policy này thiếu kiểm tra status = 'pending' hoặc WITH CHECK.
DROP POLICY IF EXISTS "Users can insert own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own pending posts" ON public.posts;


-- 3. Xóa các policy bị sai tên cột trên bảng comments (dùng author_id thay vì user_id)
DROP POLICY IF EXISTS "Users can insert own comments" ON public.comments;
DROP POLICY IF EXISTS "Admin/Mod can delete comments" ON public.comments;


-- 4. Bổ sung WITH CHECK cho profiles UPDATE
-- Xóa policy cũ (hỗ trợ cả 2 tên phổ biến có thể đang tồn tại trên môi trường)
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- Tạo lại policy đúng có WITH CHECK
CREATE POLICY "Users can update own profile."
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- 5. Bổ sung WITH CHECK cho comments UPDATE
DROP POLICY IF EXISTS "comments_update_own" ON public.comments;

CREATE POLICY "comments_update_own"
  ON public.comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
