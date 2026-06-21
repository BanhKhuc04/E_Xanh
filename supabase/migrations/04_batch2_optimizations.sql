-- MIGRATION: Batch 2 Optimizations and RLS Fixes
-- Ngày: 22/06/2026

-- 1. Tối ưu Analytics: Gộp N+1 query thành RPC
CREATE OR REPLACE FUNCTION public.get_activity_trend(days_count integer DEFAULT 30)
RETURNS TABLE (
    date text,
    label text,
    posts bigint,
    comments bigint,
    saves bigint,
    checks bigint
) AS $$
BEGIN
    RETURN QUERY
    WITH dates AS (
        SELECT generate_series(
            CURRENT_DATE - (days_count - 1) * interval '1 day',
            CURRENT_DATE,
            interval '1 day'
        )::date AS d
    )
    SELECT
        dates.d::text AS date,
        to_char(dates.d, 'DD/MM') AS label,
        (SELECT COUNT(*) FROM public.posts p WHERE DATE(p.created_at) = dates.d) AS posts,
        (SELECT COUNT(*) FROM public.comments c WHERE DATE(c.created_at) = dates.d) AS comments,
        (SELECT COUNT(*) FROM public.saved_posts sp WHERE DATE(sp.created_at) = dates.d) AS saves,
        (SELECT COUNT(*) FROM public.electricity_checks ec WHERE DATE(ec.checked_at) = dates.d) AS checks
    FROM dates;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Tối ưu Top Devices: Gom việc đếm dữ liệu xuống DB
CREATE OR REPLACE FUNCTION public.get_top_devices(limit_count integer DEFAULT 5)
RETURNS TABLE (
    name text,
    count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(device_name, 'Thiết bị khác') AS name,
        COUNT(*) AS count
    FROM public.electricity_check_items
    GROUP BY COALESCE(device_name, 'Thiết bị khác')
    ORDER BY count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Dọn dẹp và chuẩn hoá RLS cho bảng user_follows
-- Drop các policy cũ bị trùng lặp hoặc lỏng lẻo
DROP POLICY IF EXISTS "Cho phép user tự follow" ON public.user_follows;
DROP POLICY IF EXISTS "Cho phép user tự unfollow" ON public.user_follows;
DROP POLICY IF EXISTS "Cho phép xem danh sách follow" ON public.user_follows;
DROP POLICY IF EXISTS "User chỉ được insert với follower_id là chính mình" ON public.user_follows;
DROP POLICY IF EXISTS "User chỉ được xóa follow của chính mình" ON public.user_follows;
DROP POLICY IF EXISTS "user_follows_delete_own" ON public.user_follows;
DROP POLICY IF EXISTS "user_follows_insert_own" ON public.user_follows;
DROP POLICY IF EXISTS "user_follows_select_authenticated" ON public.user_follows;

-- Thêm 3 policy chuẩn mực
CREATE POLICY "user_follows_select_all" 
  ON public.user_follows FOR SELECT 
  USING (true);

CREATE POLICY "user_follows_insert_own" 
  ON public.user_follows FOR INSERT 
  WITH CHECK (auth.uid() = follower_id AND follower_id <> following_id);

CREATE POLICY "user_follows_delete_own" 
  ON public.user_follows FOR DELETE 
  USING (auth.uid() = follower_id);

-- 4. Siết RLS cho admin_login_history
-- Đảm bảo chỉ admin mới được xem (tránh lộ thông tin user)
DROP POLICY IF EXISTS "Admin có thể xem lịch sử của mình" ON public.admin_login_history;
CREATE POLICY "Admin có thể xem lịch sử của mình" 
  ON public.admin_login_history FOR SELECT 
  USING (auth.uid() = admin_id);
