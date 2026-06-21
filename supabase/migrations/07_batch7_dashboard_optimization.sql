-- MIGRATION: Batch 7 Dashboard Optimization
-- Cải thiện hiệu năng Admin Dashboard bằng cách gộp N+1 Query thành RPC

-- 1. Index cho bảng comments
CREATE INDEX IF NOT EXISTS comments_status_created_idx ON public.comments(status, created_at DESC);

-- 2. Index cho bảng posts (dự phòng)
CREATE INDEX IF NOT EXISTS posts_status_created_idx ON public.posts(status, created_at DESC);

-- 3. RPC Function để lấy toàn bộ dữ liệu thống kê trong 1 lần truy vấn
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats(start_date text DEFAULT '2000-01-01')
RETURNS json AS $$
DECLARE
    res json;
BEGIN
    SELECT json_build_object(
        'totalPosts', (SELECT COUNT(*) FROM public.posts WHERE created_at >= start_date::timestamp),
        'approvedPosts', (SELECT COUNT(*) FROM public.posts WHERE status = 'approved' AND created_at >= start_date::timestamp),
        'pendingPosts', (SELECT COUNT(*) FROM public.posts WHERE status = 'pending' AND created_at >= start_date::timestamp),
        'rejectedHiddenPosts', (SELECT COUNT(*) FROM public.posts WHERE status IN ('rejected', 'hidden', 'blocked') AND created_at >= start_date::timestamp),
        'totalUsers', (SELECT COUNT(*) FROM public.profiles WHERE created_at >= start_date::timestamp),
        'activeUsers', (SELECT COUNT(*) FROM public.profiles WHERE status = 'active' AND created_at >= start_date::timestamp),
        'lockedUsers', (SELECT COUNT(*) FROM public.profiles WHERE status IN ('locked', 'blocked') AND created_at >= start_date::timestamp),
        'deletedUsers', (SELECT COUNT(*) FROM public.profiles WHERE status = 'deleted' AND created_at >= start_date::timestamp),
        'totalSavedPosts', (SELECT COUNT(*) FROM public.saved_posts WHERE created_at >= start_date::timestamp),
        'totalComments', (SELECT COUNT(*) FROM public.comments WHERE created_at >= start_date::timestamp),
        'hiddenSpamComments', (SELECT COUNT(*) FROM public.comments WHERE status IN ('hidden', 'spam', 'deleted') AND created_at >= start_date::timestamp),
        'totalDevices', (SELECT COUNT(*) FROM public.devices),
        'totalElectricityChecks', (SELECT COUNT(*) FROM public.electricity_checks WHERE checked_at >= start_date::timestamp)
    ) INTO res;
    
    RETURN res;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
