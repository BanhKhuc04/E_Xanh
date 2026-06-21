
-- ============================================================
-- 00_consolidated_setup.sql
-- ============================================================

-- ============================================
-- 1. PROFILES EXTENSION & PUBLIC VIEW
-- ============================================
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


-- 2. Create public_profiles view
drop view if exists public.public_profiles;

create view public.public_profiles as
select id, name, avatar_url, facebook_url, created_at
from public.profiles;

-- Grant select on public_profiles view
grant select on public.public_profiles to authenticated, anon;


-- ============================================
-- 2. ADMIN ACTION LOGS
-- ============================================
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


-- ============================================
-- 3. FOLLOWS
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_follows (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(follower_id, following_id),
  CONSTRAINT check_not_self_follow CHECK (follower_id <> following_id)
);

ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép xem danh sách follow" ON public.user_follows;
CREATE POLICY "Cho phép xem danh sách follow"
ON public.user_follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "User chỉ được insert với follower_id là chính mình" ON public.user_follows;
CREATE POLICY "User chỉ được insert với follower_id là chính mình"
ON public.user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "User chỉ được xóa follow của chính mình" ON public.user_follows;
CREATE POLICY "User chỉ được xóa follow của chính mình"
ON public.user_follows FOR DELETE USING (auth.uid() = follower_id);

-- ============================================
-- 4. BANNERS
-- ============================================
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


-- ============================================
-- 5. AVATAR STORAGE
-- ============================================
-- ============================================================
-- STORAGE POLICIES: Avatar người dùng
-- Chạy file này trong Supabase SQL Editor khi deploy hạ tầng
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-avatars', 'profile-avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public có thể đọc ảnh avatar"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-avatars');

CREATE POLICY "User có thể upload avatar của chính mình"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  name LIKE 'avatars/' || auth.uid() || '/%'
);

CREATE POLICY "User có thể cập nhật avatar của chính mình"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  name LIKE 'avatars/' || auth.uid() || '/%'
)
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  name LIKE 'avatars/' || auth.uid() || '/%'
);

CREATE POLICY "User có thể xóa avatar của chính mình"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  name LIKE 'avatars/' || auth.uid() || '/%'
);


-- ============================================
-- 6. NOTIFICATION CENTER & SYSTEM SETTINGS
-- ============================================
-- ============================================================
-- E-XANH Notification Center Migration
-- Tạo schema chuẩn cho:
-- 1. notifications
-- 2. notification_batches
-- 3. system_settings
-- 4. website_announcements (nâng cấp display_type / updated_by)
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'platform_settings'
  ) then
    insert into public.system_settings (key, value, updated_at, updated_by)
    select key, value, updated_at, updated_by
    from public.platform_settings
    on conflict (key) do update
    set
      value = excluded.value,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by;
  end if;
end $$;

alter table public.system_settings enable row level security;

drop policy if exists "system_settings_select_public" on public.system_settings;
drop policy if exists "system_settings_admin_manage" on public.system_settings;

create policy "system_settings_select_public"
  on public.system_settings
  for select
  using (true);

create policy "system_settings_admin_manage"
  on public.system_settings
  for all
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

create table if not exists public.notification_batches (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  notification_type text not null default 'system',
  severity text not null default 'info'
    check (severity in ('info', 'warning', 'critical')),
  action_url text,
  target_type text not null
    check (target_type in ('all_active', 'role', 'specific_user')),
  target_value jsonb,
  recipient_count integer not null default 0,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by uuid references public.profiles(id) on delete set null
);

alter table public.notification_batches enable row level security;

drop policy if exists "notification_batches_staff_select" on public.notification_batches;
drop policy if exists "notification_batches_staff_insert" on public.notification_batches;
drop policy if exists "notification_batches_staff_update" on public.notification_batches;

create policy "notification_batches_staff_select"
  on public.notification_batches
  for select
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

create policy "notification_batches_staff_insert"
  on public.notification_batches
  for insert
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
    and created_by = auth.uid()
  );

create policy "notification_batches_staff_update"
  on public.notification_batches
  for update
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  severity text not null default 'info'
    check (severity in ('info', 'warning', 'critical')),
  title text not null,
  message text not null,
  action_url text,
  related_type text,
  related_id text,
  is_read boolean not null default false,
  batch_id uuid references public.notification_batches(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by uuid references public.profiles(id) on delete set null
);

alter table public.notifications
  add column if not exists severity text default 'info',
  add column if not exists action_url text,
  add column if not exists related_type text,
  add column if not exists related_id text,
  add column if not exists batch_id uuid references public.notification_batches(id) on delete set null,
  add column if not exists revoked_at timestamptz,
  add column if not exists revoked_by uuid references public.profiles(id) on delete set null;

update public.notifications
set severity = case
  when coalesce(type, 'system') in ('danger', 'critical', 'warning', 'comment_warning') then 'warning'
  else 'info'
end
where severity is null;

alter table public.notifications
  alter column severity set default 'info';

alter table public.notifications enable row level security;

drop policy if exists "notifications_select_own" on public.notifications;
drop policy if exists "notifications_update_own" on public.notifications;
drop policy if exists "notifications_staff_insert" on public.notifications;
drop policy if exists "notifications_staff_update" on public.notifications;

create policy "notifications_select_own"
  on public.notifications
  for select
  using (
    auth.uid() = user_id
    and revoked_at is null
  );

create policy "notifications_update_own"
  on public.notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notifications_staff_insert"
  on public.notifications
  for insert
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

create policy "notifications_staff_update"
  on public.notifications
  for update
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

create index if not exists notifications_batch_idx
  on public.notifications (batch_id, user_id);

create index if not exists notification_batches_created_idx
  on public.notification_batches (created_at desc);

do $$
declare
  has_user_notifications boolean;
  has_action_url boolean;
  has_related_type boolean;
  has_related_id boolean;
begin
  select exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'user_notifications'
  ) into has_user_notifications;

  if has_user_notifications then
    select exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'user_notifications'
        and column_name = 'action_url'
    ) into has_action_url;

    select exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'user_notifications'
        and column_name = 'related_type'
    ) into has_related_type;

    select exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'user_notifications'
        and column_name = 'related_id'
    ) into has_related_id;

    execute format(
      $sql$
      insert into public.notifications (
        id,
        user_id,
        type,
        severity,
        title,
        message,
        action_url,
        related_type,
        related_id,
        is_read,
        created_by,
        created_at
      )
      select
        legacy.id,
        legacy.user_id,
        coalesce(legacy.type, 'system') as type,
        case
          when legacy.type in ('danger', 'warning') then 'warning'
          else 'info'
        end as severity,
        legacy.title,
        legacy.message,
        %1$s as action_url,
        %2$s as related_type,
        %3$s as related_id,
        legacy.is_read,
        legacy.created_by,
        legacy.created_at
      from public.user_notifications as legacy
      on conflict (id) do nothing
      $sql$,
      case when has_action_url then 'legacy.action_url' else 'null::text' end,
      case when has_related_type then 'legacy.related_type' else 'null::text' end,
      case when has_related_id then 'legacy.related_id' else 'null::text' end
    );
  end if;
end $$;

create table if not exists public.website_announcements (
  id uuid primary key default gen_random_uuid(),
  title text,
  message text not null,
  type text not null default 'info',
  display_type text not null default 'top_bar',
  is_active boolean not null default true,
  start_at timestamptz,
  end_at timestamptz,
  cta_label text,
  cta_url text,
  priority integer not null default 100,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.website_announcements
  add column if not exists display_type text,
  add column if not exists updated_by uuid references public.profiles(id) on delete set null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'website_announcements'
      and column_name = 'display_mode'
  ) then
    update public.website_announcements
    set display_type = case
      when coalesce(display_mode, 'static') = 'marquee' then 'top_bar'
      else 'top_bar'
    end
    where display_type is null;
  else
    update public.website_announcements
    set display_type = 'top_bar'
    where display_type is null;
  end if;
end $$;

alter table public.website_announcements
  alter column display_type set default 'top_bar';

do $$
begin
  if exists (
    select 1
    from information_schema.check_constraints
    where constraint_name = 'website_announcements_type_check'
  ) then
    alter table public.website_announcements drop constraint website_announcements_type_check;
  end if;
exception
  when undefined_object then null;
end $$;

alter table public.website_announcements
  add constraint website_announcements_type_check
  check (type in ('info', 'warning', 'success', 'maintenance', 'critical'));

do $$
begin
  if exists (
    select 1
    from information_schema.check_constraints
    where constraint_name = 'website_announcements_display_type_check'
  ) then
    alter table public.website_announcements drop constraint website_announcements_display_type_check;
  end if;
exception
  when undefined_object then null;
end $$;

alter table public.website_announcements
  add constraint website_announcements_display_type_check
  check (display_type in ('top_bar', 'banner', 'popup'));

alter table public.website_announcements enable row level security;

drop policy if exists "website_announcements_public_select_active" on public.website_announcements;
drop policy if exists "website_announcements_staff_select_all" on public.website_announcements;
drop policy if exists "website_announcements_staff_insert" on public.website_announcements;
drop policy if exists "website_announcements_staff_update" on public.website_announcements;
drop policy if exists "website_announcements_staff_delete" on public.website_announcements;

create policy "website_announcements_public_select_active"
  on public.website_announcements
  for select
  using (
    is_active = true
    and (start_at is null or start_at <= now())
    and (end_at is null or end_at >= now())
  );

create policy "website_announcements_staff_select_all"
  on public.website_announcements
  for select
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

create policy "website_announcements_staff_insert"
  on public.website_announcements
  for insert
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

create policy "website_announcements_staff_update"
  on public.website_announcements
  for update
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

create policy "website_announcements_staff_delete"
  on public.website_announcements
  for delete
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

