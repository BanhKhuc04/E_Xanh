-- ============================================================
-- ADMIN AUDIT MIGRATION
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- 1. Bổ sung các cột cho bảng profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS admin_note TEXT;

-- Migration data từ admin_user_notes (nếu có) sang profiles.admin_note
UPDATE public.profiles p
SET admin_note = n.note
FROM public.admin_user_notes n
WHERE p.id = n.target_user_id AND n.note IS NOT NULL AND n.note != '';

-- 2. Bảo mật RLS profiles (Ngăn chặn user tự sửa quyền và trạng thái)
-- Tạo function trigger kiểm tra các cột không được tự ý sửa
CREATE OR REPLACE FUNCTION check_profile_update_permission()
RETURNS TRIGGER AS $$
BEGIN
  -- Nếu là admin/moderator thì cho phép cập nhật mọi cột
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ) THEN
    RETURN NEW;
  END IF;

  -- Nếu là user thông thường tự cập nhật chính mình, chặn sửa các cột nhạy cảm
  IF auth.uid() = NEW.id THEN
    IF NEW.role IS DISTINCT FROM OLD.role OR
       NEW.status IS DISTINCT FROM OLD.status OR
       NEW.ban_reason IS DISTINCT FROM OLD.ban_reason OR
       NEW.banned_at IS DISTINCT FROM OLD.banned_at OR
       NEW.banned_by IS DISTINCT FROM OLD.banned_by OR
       NEW.deleted_at IS DISTINCT FROM OLD.deleted_at OR
       NEW.deleted_by IS DISTINCT FROM OLD.deleted_by OR
       NEW.admin_note IS DISTINCT FROM OLD.admin_note
    THEN
      RAISE EXCEPTION 'You do not have permission to modify restricted fields';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào bảng profiles (trước khi UPDATE)
DROP TRIGGER IF EXISTS tr_check_profile_update ON public.profiles;
CREATE TRIGGER tr_check_profile_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION check_profile_update_permission();


-- 3. Tạo/Cập nhật bảng system_settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Di chuyển dữ liệu cũ từ platform_settings nếu có
INSERT INTO public.system_settings (key, value, updated_at, updated_by)
SELECT key, value, updated_at, updated_by FROM public.platform_settings
ON CONFLICT (key) DO NOTHING;

DROP POLICY IF EXISTS "system_settings_select_public" ON public.system_settings;
CREATE POLICY "system_settings_select_public"
  ON public.system_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "system_settings_admin_manage" ON public.system_settings;
CREATE POLICY "system_settings_admin_manage"
  ON public.system_settings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- 4. Tạo bảng notifications nội bộ chuẩn xác theo yêu cầu
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_type TEXT,
  related_id TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_staff_insert" ON public.notifications;
CREATE POLICY "notifications_staff_insert"
  ON public.notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Nếu đã có dữ liệu trong user_notifications thì copy sang
INSERT INTO public.notifications (id, user_id, type, title, message, is_read, created_at, created_by)
SELECT id, user_id, type, title, message, is_read, created_at, created_by
FROM public.user_notifications
ON CONFLICT DO NOTHING;


-- 5. Cập nhật bảng admin_action_logs
CREATE TABLE IF NOT EXISTS public.admin_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_action_logs_staff_select" ON public.admin_action_logs;
CREATE POLICY "admin_action_logs_staff_select"
  ON public.admin_action_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS "admin_action_logs_staff_insert" ON public.admin_action_logs;
CREATE POLICY "admin_action_logs_staff_insert"
  ON public.admin_action_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
    AND admin_id = auth.uid()
  );

-- Đổi dữ liệu cũ nếu muốn (tùy chọn, giả định target_type = 'user')
INSERT INTO public.admin_action_logs (id, admin_id, action, target_type, target_id, metadata, created_at)
SELECT id, admin_id, action, 'user', target_user_id::text, 
  jsonb_build_object('old', old_value, 'new', new_value, 'reason', reason), created_at
FROM public.admin_audit_logs
WHERE target_user_id IS NOT NULL
ON CONFLICT DO NOTHING;
