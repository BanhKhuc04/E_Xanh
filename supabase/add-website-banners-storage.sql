-- ============================================================
-- E-XANH — Website Banners & Storage
-- ============================================================

-- 1. TẠO BẢNG WEBSITE_BANNERS
CREATE TABLE IF NOT EXISTS public.website_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bật RLS
ALTER TABLE public.website_banners ENABLE ROW LEVEL SECURITY;

-- Policy (Tránh lỗi nếu đã chạy trước đó)
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.website_banners;
DROP POLICY IF EXISTS "Only admins can modify banners" ON public.website_banners;

CREATE POLICY "Anyone can view active banners" 
ON public.website_banners FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can modify banners" 
ON public.website_banners FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 2. TẠO BUCKET LƯU TRỮ (website-banners)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('website-banners', 'website-banners', true)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS CHO BUCKET
DROP POLICY IF EXISTS "Public access to website-banners" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload to website-banners" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete from website-banners" ON storage.objects;
DROP POLICY IF EXISTS "Admin update to website-banners" ON storage.objects;

-- Xem ảnh công khai
CREATE POLICY "Public access to website-banners" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'website-banners');

-- Admin upload
CREATE POLICY "Admin upload to website-banners" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'website-banners' 
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin delete
CREATE POLICY "Admin delete from website-banners" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'website-banners' 
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin update
CREATE POLICY "Admin update to website-banners" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'website-banners' 
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
