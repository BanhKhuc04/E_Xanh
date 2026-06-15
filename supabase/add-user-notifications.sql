create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Thông báo hệ thống',
  message text not null,
  type text not null default 'info'
    check (type in ('info', 'success', 'warning', 'danger', 'role', 'account')),
  action_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

alter table public.user_notifications enable row level security;

drop policy if exists "user_notifications_select_own" on public.user_notifications;
drop policy if exists "user_notifications_update_own_read_state" on public.user_notifications;
drop policy if exists "user_notifications_staff_insert" on public.user_notifications;

create policy "user_notifications_select_own"
  on public.user_notifications
  for select
  using (auth.uid() = user_id);

create policy "user_notifications_update_own_read_state"
  on public.user_notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_notifications_staff_insert"
  on public.user_notifications
  for insert
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
    and user_id is not null
  );

create index if not exists user_notifications_user_created_idx
  on public.user_notifications (user_id, created_at desc);
