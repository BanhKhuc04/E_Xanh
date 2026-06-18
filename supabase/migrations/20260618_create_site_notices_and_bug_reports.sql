create table if not exists public.site_notices (
  id uuid primary key default gen_random_uuid(),
  notice_key text not null unique,
  version text not null,
  title text not null,
  subtitle text,
  description text,
  guide_sections jsonb not null default '[]'::jsonb,
  contact_label text,
  contact_url text,
  is_active boolean not null default true,
  show_on_first_visit boolean not null default true,
  show_bug_button boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bug_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  page_url text,
  user_agent text,
  severity text not null default 'medium'
    check (severity in ('low', 'medium', 'critical')),
  status text not null default 'new'
    check (status in ('new', 'checking', 'fixed', 'ignored')),
  created_at timestamptz not null default now()
);

create index if not exists site_notices_updated_at_idx
  on public.site_notices (updated_at desc);

create index if not exists bug_reports_created_at_idx
  on public.bug_reports (created_at desc);

create index if not exists bug_reports_status_idx
  on public.bug_reports (status, severity, created_at desc);

alter table public.site_notices enable row level security;
alter table public.bug_reports enable row level security;

drop policy if exists "site_notices_public_select" on public.site_notices;
create policy "site_notices_public_select"
on public.site_notices
for select
using (is_active = true or show_bug_button = true);

drop policy if exists "site_notices_admin_select" on public.site_notices;
create policy "site_notices_admin_select"
on public.site_notices
for select
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'moderator')
  )
);

drop policy if exists "site_notices_admin_insert" on public.site_notices;
create policy "site_notices_admin_insert"
on public.site_notices
for insert
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'moderator')
  )
);

drop policy if exists "site_notices_admin_update" on public.site_notices;
create policy "site_notices_admin_update"
on public.site_notices
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

drop policy if exists "site_notices_admin_delete" on public.site_notices;
create policy "site_notices_admin_delete"
on public.site_notices
for delete
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'moderator')
  )
);

drop policy if exists "bug_reports_insert_public" on public.bug_reports;
create policy "bug_reports_insert_public"
on public.bug_reports
for insert
with check (
  user_id is null or auth.uid() = user_id
);

drop policy if exists "bug_reports_select_own" on public.bug_reports;
create policy "bug_reports_select_own"
on public.bug_reports
for select
using (
  auth.uid() is not null and auth.uid() = user_id
);

drop policy if exists "bug_reports_select_staff" on public.bug_reports;
create policy "bug_reports_select_staff"
on public.bug_reports
for select
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'moderator')
  )
);

drop policy if exists "bug_reports_update_staff" on public.bug_reports;
create policy "bug_reports_update_staff"
on public.bug_reports
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

insert into public.site_notices (
  notice_key,
  version,
  title,
  subtitle,
  description,
  guide_sections,
  contact_label,
  contact_url,
  is_active,
  show_on_first_visit,
  show_bug_button
)
values (
  'main',
  'v1.0',
  'Hướng dẫn test & báo lỗi E-XANH',
  'Vui lòng kiểm tra các vai trò, tính năng chính và nguồn dữ liệu trước khi đánh giá tổng thể website.',
  'Nếu gặp lỗi khi test, bạn có thể mở ngay bảng báo lỗi ở góc phải dưới để gửi về nhóm E-XANH.',
  '[
    {"title":"1. Test tài khoản người dùng","items":["Đăng ký tài khoản mới","Đăng nhập / đăng xuất","Cập nhật thông tin cá nhân","Kiểm tra bài đã lưu"]},
    {"title":"2. Test bài viết","items":["Tạo bài viết mới","Upload ảnh bài viết","Gửi bài chờ duyệt","Kiểm tra trạng thái pending / approved / rejected"]},
    {"title":"3. Test cộng đồng","items":["Đăng bài cộng đồng","Thả tim bài viết","Lưu bài viết","Copy link chia sẻ"]},
    {"title":"4. Test kiểm tra tiền điện","items":["Thêm thiết bị điện","Nhập số giờ sử dụng","Tính tiền điện","Lưu lịch sử kiểm tra"]},
    {"title":"5. Test nguồn dữ liệu","items":["Kiểm tra dữ liệu thật từ Supabase","Kiểm tra dữ liệu khi tài khoản guest","Kiểm tra dữ liệu khi đăng nhập user","Kiểm tra dữ liệu khi đăng nhập admin"]}
  ]'::jsonb,
  'Mở form hỗ trợ',
  '',
  true,
  true,
  true
)
on conflict (notice_key) do update
set
  version = excluded.version,
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  guide_sections = excluded.guide_sections,
  contact_label = excluded.contact_label,
  contact_url = excluded.contact_url,
  is_active = excluded.is_active,
  show_on_first_visit = excluded.show_on_first_visit,
  show_bug_button = excluded.show_bug_button,
  updated_at = now();
