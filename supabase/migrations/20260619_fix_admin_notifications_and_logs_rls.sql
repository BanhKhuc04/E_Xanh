create extension if not exists pgcrypto;

create or replace function public.is_admin_or_moderator()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'moderator')
      and coalesce(profiles.status, 'active') = 'active'
  );
$$;

revoke all on function public.is_admin_or_moderator() from public;
grant execute on function public.is_admin_or_moderator() to authenticated;

create table if not exists public.admin_action_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table if exists public.notifications enable row level security;
alter table if exists public.notification_batches enable row level security;
alter table if exists public.admin_action_logs enable row level security;

drop policy if exists "notifications_select_own" on public.notifications;
drop policy if exists "notifications_update_own" on public.notifications;
drop policy if exists "notifications_staff_insert" on public.notifications;
drop policy if exists "notifications_staff_update" on public.notifications;
drop policy if exists "notifications_staff_select" on public.notifications;

create policy "notifications_select_own"
  on public.notifications
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_admin_or_moderator()
  );

create policy "notifications_update_own"
  on public.notifications
  for update
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_admin_or_moderator()
  )
  with check (
    user_id = auth.uid()
    or public.is_admin_or_moderator()
  );

create policy "notifications_staff_insert"
  on public.notifications
  for insert
  to authenticated
  with check (
    public.is_admin_or_moderator()
    and created_by = auth.uid()
  );

create policy "notifications_staff_update"
  on public.notifications
  for update
  to authenticated
  using (public.is_admin_or_moderator())
  with check (public.is_admin_or_moderator());

drop policy if exists "notification_batches_staff_select" on public.notification_batches;
drop policy if exists "notification_batches_staff_insert" on public.notification_batches;
drop policy if exists "notification_batches_staff_update" on public.notification_batches;

create policy "notification_batches_staff_select"
  on public.notification_batches
  for select
  to authenticated
  using (public.is_admin_or_moderator());

create policy "notification_batches_staff_insert"
  on public.notification_batches
  for insert
  to authenticated
  with check (
    public.is_admin_or_moderator()
    and created_by = auth.uid()
  );

create policy "notification_batches_staff_update"
  on public.notification_batches
  for update
  to authenticated
  using (public.is_admin_or_moderator())
  with check (public.is_admin_or_moderator());

drop policy if exists "admin_action_logs_staff_select" on public.admin_action_logs;
drop policy if exists "admin_action_logs_staff_insert" on public.admin_action_logs;
drop policy if exists "Admins can read admin logs" on public.admin_action_logs;
drop policy if exists "Admins can create admin logs" on public.admin_action_logs;

create policy "admin_action_logs_staff_select"
  on public.admin_action_logs
  for select
  to authenticated
  using (public.is_admin_or_moderator());

create policy "admin_action_logs_staff_insert"
  on public.admin_action_logs
  for insert
  to authenticated
  with check (
    public.is_admin_or_moderator()
    and admin_id = auth.uid()
  );
