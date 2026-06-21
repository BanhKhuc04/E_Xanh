-- MIGRATION: Batch 3 Database Indexes and Performance Optimization
-- Ngày: 22/06/2026

-- 1. Indexes cho bảng posts
-- Tối ưu cho query .eq('status', '...').order('created_at', ...)
CREATE INDEX IF NOT EXISTS posts_status_created_idx ON public.posts(status, created_at DESC);

-- Tối ưu cho query .eq('type', '...').eq('status', '...').order('created_at', ...)
CREATE INDEX IF NOT EXISTS posts_type_status_idx ON public.posts(type, status, created_at DESC);

-- Tối ưu cho query lọc theo author
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts(author_id);

-- 2. Indexes cho bảng profiles
-- Tối ưu lọc user đang active hoặc theo role (ở Admin)
CREATE INDEX IF NOT EXISTS profiles_status_idx ON public.profiles(status);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- 3. Indexes cho bảng comments
-- Rất quan trọng khi query comment của 1 bài viết
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments(post_id);
-- Tối ưu query comment của chính user
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON public.comments(user_id);

-- 4. Indexes cho bảng saved_posts
-- Tối ưu danh sách bài viết đã lưu của user
CREATE INDEX IF NOT EXISTS saved_posts_user_created_idx ON public.saved_posts(user_id, created_at DESC);
-- Cải thiện Full table scan khi đếm saved_count theo post_id
CREATE INDEX IF NOT EXISTS saved_posts_post_id_idx ON public.saved_posts(post_id);

-- 5. Indexes cho bảng post_likes
-- Cải thiện đếm likes_count theo post_id
CREATE INDEX IF NOT EXISTS post_likes_post_id_idx ON public.post_likes(post_id);

-- 6. Indexes cho bảng electricity_checks
-- Tối ưu fetch lịch sử tra cứu của user
CREATE INDEX IF NOT EXISTS electricity_checks_user_checked_idx ON public.electricity_checks(user_id, checked_at DESC);
