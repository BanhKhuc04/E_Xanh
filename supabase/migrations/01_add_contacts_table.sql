-- ============================================================
-- 01_add_contacts_table.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Cho phép tất cả mọi người gửi liên hệ (kể cả chưa đăng nhập)
DROP POLICY IF EXISTS "Cho phép public gửi liên hệ" ON public.contacts;
CREATE POLICY "Cho phép public gửi liên hệ" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

-- Chỉ admin mới được đọc danh sách liên hệ
DROP POLICY IF EXISTS "Chỉ admin mới xem được danh sách liên hệ" ON public.contacts;
CREATE POLICY "Chỉ admin mới xem được danh sách liên hệ" 
ON public.contacts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'moderator')
  )
);

-- Chỉ admin mới được cập nhật (đổi status)
DROP POLICY IF EXISTS "Chỉ admin mới cập nhật được liên hệ" ON public.contacts;
CREATE POLICY "Chỉ admin mới cập nhật được liên hệ" 
ON public.contacts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'moderator')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'moderator')
  )
);
