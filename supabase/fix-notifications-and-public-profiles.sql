-- ============================================================
-- E-XANH Notifications & Public Profiles Migration
-- 1. Create notifications table for user notifications (replacing user_notifications)
-- 2. Create public_profiles view for safe public access
-- ============================================================

-- 1. Create notifications table
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
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by uuid references public.profiles(id) on delete set null
);

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

-- Migrate old data from user_notifications to notifications (optional)
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'user_notifications'
  ) then
    insert into public.notifications (
      id,
      user_id,
      type,
      severity,
      title,
      message,
      action_url,
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
      legacy.action_url,
      legacy.is_read,
      legacy.created_by,
      legacy.created_at
    from public.user_notifications as legacy
    on conflict (id) do nothing;
  end if;
end $$;

-- 2. Create public_profiles view
drop view if exists public.public_profiles;

create view public.public_profiles as
select id, name, avatar_url, facebook_url, created_at
from public.profiles;

-- Grant select on public_profiles view
grant select on public.public_profiles to authenticated, anon;
