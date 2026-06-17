drop view if exists public.community_active_members;
drop view if exists public.public_profiles;

create view public.public_profiles as
select
  p.id,
  coalesce(nullif(p.name, ''), 'Thành viên E-XANH') as name,
  p.avatar_url,
  p.cover_url,
  p.bio,
  to_jsonb(p) ->> 'area' as area,
  p.facebook_url,
  p.created_at,
  p.website_url,
  coalesce(p.user_preferences->>'profile_visibility', 'public') as profile_visibility,
  coalesce((p.user_preferences->>'show_facebook')::boolean, true) as show_facebook,
  coalesce((p.user_preferences->>'show_public_posts')::boolean, true) as show_public_posts,
  coalesce((p.user_preferences->>'allow_search_index')::boolean, true) as allow_search_index
from public.profiles as p
where coalesce(p.status, '') not in ('deleted', 'blocked');

grant select on public.public_profiles to anon, authenticated;

create view public.community_active_members as
select
  posts.author_id as id,
  coalesce(public_profiles.name, 'Thành viên E-XANH') as name,
  public_profiles.avatar_url,
  count(posts.id)::int as post_count,
  max(posts.created_at) as latest_post_at
from public.posts
left join public.public_profiles
  on public.public_profiles.id = posts.author_id
where posts.status = 'approved'
  and posts.type = 'community'
  and posts.author_id is not null
group by
  posts.author_id,
  public_profiles.name,
  public_profiles.avatar_url
order by
  count(posts.id) desc,
  max(posts.created_at) desc;

grant select on public.community_active_members to anon, authenticated;
