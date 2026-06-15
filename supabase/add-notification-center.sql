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
