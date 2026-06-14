-- ============================================================
-- E-XANH — Website Announcements
-- Tạo bảng thông báo website + RLS cho admin/moderator
-- ============================================================

CREATE TABLE IF NOT EXISTS public.website_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info'
    CHECK (type IN ('info', 'success', 'warning', 'danger')),
  display_mode TEXT NOT NULL DEFAULT 'static'
    CHECK (display_mode IN ('static', 'marquee')),
  position TEXT NOT NULL DEFAULT 'top'
    CHECK (position IN ('top')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  cta_label TEXT,
  cta_url TEXT,
  priority INT NOT NULL DEFAULT 100,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_at IS NULL OR start_at IS NULL OR end_at >= start_at)
);

CREATE INDEX IF NOT EXISTS website_announcements_priority_idx
  ON public.website_announcements (priority DESC, created_at DESC);

ALTER TABLE public.website_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "website_announcements_public_select_active" ON public.website_announcements;
DROP POLICY IF EXISTS "website_announcements_staff_select_all" ON public.website_announcements;
DROP POLICY IF EXISTS "website_announcements_staff_insert" ON public.website_announcements;
DROP POLICY IF EXISTS "website_announcements_staff_update" ON public.website_announcements;
DROP POLICY IF EXISTS "website_announcements_admin_delete" ON public.website_announcements;

CREATE POLICY "website_announcements_public_select_active"
  ON public.website_announcements
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "website_announcements_staff_select_all"
  ON public.website_announcements
  FOR SELECT
  USING (public.is_staff());

CREATE POLICY "website_announcements_staff_insert"
  ON public.website_announcements
  FOR INSERT
  WITH CHECK (public.is_staff());

CREATE POLICY "website_announcements_staff_update"
  ON public.website_announcements
  FOR UPDATE
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "website_announcements_admin_delete"
  ON public.website_announcements
  FOR DELETE
  USING (public.is_admin());
