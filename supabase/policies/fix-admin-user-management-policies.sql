drop policy if exists "saved_posts_select_staff" on public.saved_posts;
create policy "saved_posts_select_staff"
  on public.saved_posts
  for select
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );

drop policy if exists "electricity_checks_select_staff" on public.electricity_checks;
create policy "electricity_checks_select_staff"
  on public.electricity_checks
  for select
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'moderator')
    )
  );
