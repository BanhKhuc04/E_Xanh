CREATE TABLE IF NOT EXISTS public.admin_login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  login_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL
);

ALTER TABLE public.admin_login_history ENABLE ROW LEVEL SECURITY;

-- Policy: Admin có thể xem lịch sử đăng nhập của chính mình
CREATE POLICY "Admin có thể xem lịch sử của mình" 
  ON public.admin_login_history
  FOR SELECT 
  USING (auth.uid() = admin_id);

-- Policy: Cho phép ghi log đăng nhập từ frontend
CREATE POLICY "Cho phép ghi log đăng nhập" 
  ON public.admin_login_history
  FOR INSERT 
  WITH CHECK (true);
