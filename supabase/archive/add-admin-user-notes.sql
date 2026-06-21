create table if not exists public.admin_user_notes (
  id uuid primary key default gen_random_uuid(),
  target_user_id uuid not null unique references auth.users(id) on delete cascade,
  note text not null default '',
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_user_notes enable row level security;

drop policy if exists "admin_user_notes_staff_select" on public.admin_user_notes;
drop policy if exists "admin_user_notes_staff_insert" on public.admin_user_notes;
drop policy if exists "admin_user_notes_staff_update" on public.admin_user_notes;

create policy "admin_user_notes_staff_select"
  on public.admin_user_notes
  for select
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

create policy "admin_user_notes_staff_insert"
  on public.admin_user_notes
  for insert
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
    and updated_by = auth.uid()
  );

create policy "admin_user_notes_staff_update"
  on public.admin_user_notes
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
    and updated_by = auth.uid()
  );

create index if not exists admin_user_notes_target_idx
  on public.admin_user_notes (target_user_id);
