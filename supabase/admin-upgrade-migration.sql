-- ============================================================
-- E-XANH Admin Upgrade Migration
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- ============================================
-- 1. MỞ RỘNG COMMENTS — Thêm moderation fields
-- ============================================
ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS moderation_reason TEXT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMPTZ;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS hidden_by UUID REFERENCES profiles(id);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS spam_at TIMESTAMPTZ;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS spam_by UUID REFERENCES profiles(id);

-- Mở rộng status constraint cho comments
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_status_check;
ALTER TABLE comments ADD CONSTRAINT comments_status_check
  CHECK (status IN ('visible', 'hidden', 'reported', 'spam', 'deleted'));

-- ============================================
-- 2. MỞ RỘNG PROFILES — Thêm ban/delete fields
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ban_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned_by UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

-- Mở rộng status constraint cho profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_status_check
  CHECK (status IN ('active', 'locked', 'pending', 'deleted', 'blocked'));

-- ============================================
-- 2.5. MỞ RỘNG USER_NOTIFICATIONS — metadata tương thích
-- ============================================
ALTER TABLE user_notifications ADD COLUMN IF NOT EXISTS related_type TEXT;
ALTER TABLE user_notifications ADD COLUMN IF NOT EXISTS related_id TEXT;

-- ============================================
-- 3. SEED platform_settings (reuse existing table)
-- ============================================
INSERT INTO platform_settings (key, value) VALUES
  ('site_name', '"E-XANH"'),
  ('site_slogan', '"Dùng điện thông minh, sống xanh bền vững."'),
  ('support_email', '"support@exanh.vn"'),
  ('site_description', '"E-XANH giúp người trẻ tiết kiệm điện, chia sẻ kinh nghiệm sống xanh và theo dõi chi phí điện hằng tháng."'),
  ('require_post_approval', 'true'),
  ('enable_comment_moderation', 'true'),
  ('auto_logout_admin_minutes', '30'),
  ('saved_posts_hero_image', '""'),
  ('allow_reporting', 'true'),
  ('auto_hide_reported', 'false'),
  ('notify_new_post_pending', 'true'),
  ('notify_reported_comment', 'true'),
  ('notify_new_user', 'false')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 4. RLS cho platform_settings
-- ============================================
DROP POLICY IF EXISTS "platform_settings_public_read" ON platform_settings;
CREATE POLICY "platform_settings_public_read" ON platform_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "platform_settings_admin_update" ON platform_settings;
CREATE POLICY "platform_settings_admin_update" ON platform_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "platform_settings_admin_insert" ON platform_settings;
CREATE POLICY "platform_settings_admin_insert" ON platform_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 5. SYSTEM_BACKUPS — sao lưu ứng dụng mức dữ liệu
-- ============================================
CREATE TABLE IF NOT EXISTS public.system_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_backups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "system_backups_admin_select" ON public.system_backups;
DROP POLICY IF EXISTS "system_backups_admin_insert" ON public.system_backups;

CREATE POLICY "system_backups_admin_select"
  ON public.system_backups FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "system_backups_admin_insert"
  ON public.system_backups FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS system_backups_created_idx
  ON public.system_backups (created_at DESC);
