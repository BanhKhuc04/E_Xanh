create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id) on delete cascade,
  target_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  reason text,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_logs enable row level security;

drop policy if exists "admin_audit_logs_staff_select" on public.admin_audit_logs;
drop policy if exists "admin_audit_logs_staff_insert" on public.admin_audit_logs;

create policy "admin_audit_logs_staff_select"
  on public.admin_audit_logs
  for select
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

create policy "admin_audit_logs_staff_insert"
  on public.admin_audit_logs
  for insert
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
    and admin_id = auth.uid()
  );

create index if not exists admin_audit_logs_created_idx
  on public.admin_audit_logs (created_at desc);

create index if not exists admin_audit_logs_target_idx
  on public.admin_audit_logs (target_user_id, created_at desc);
