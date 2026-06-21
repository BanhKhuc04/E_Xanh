-- Migration: Add RPC function to fetch activity stats for users in bulk (Fix N+1 Query)
-- Ngày: 21/06/2026

CREATE OR REPLACE FUNCTION public.get_users_activity_stats(uid_array uuid[])
RETURNS TABLE (
  user_id uuid,
  post_count bigint,
  comment_count bigint,
  saved_post_count bigint,
  electricity_check_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id AS user_id,
    (SELECT COUNT(*) FROM public.posts p WHERE p.author_id = u.id) AS post_count,
    (SELECT COUNT(*) FROM public.comments c WHERE c.user_id = u.id) AS comment_count,
    (SELECT COUNT(*) FROM public.saved_posts sp WHERE sp.user_id = u.id) AS saved_post_count,
    (SELECT COUNT(*) FROM public.electricity_checks ec WHERE ec.user_id = u.id) AS electricity_check_count
  FROM unnest(uid_array) AS u(id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
