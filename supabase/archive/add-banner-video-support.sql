-- ============================================================
-- E-XANH — Website banner video support
-- Draft migration only. Review before running in Supabase.
-- ============================================================

ALTER TABLE public.website_banners
  ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS poster_url TEXT;

UPDATE public.website_banners
SET media_type = 'image'
WHERE media_type IS NULL OR trim(media_type) = '';

ALTER TABLE public.website_banners
  ALTER COLUMN media_type SET DEFAULT 'image';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'website_banners_media_type_check'
  ) THEN
    ALTER TABLE public.website_banners
      ADD CONSTRAINT website_banners_media_type_check
      CHECK (media_type IN ('image', 'video'));
  END IF;
END $$;

COMMENT ON COLUMN public.website_banners.media_type IS 'image | video';
COMMENT ON COLUMN public.website_banners.video_url IS 'Public URL of uploaded banner video.';
COMMENT ON COLUMN public.website_banners.poster_url IS 'Poster/fallback image for video banners.';
