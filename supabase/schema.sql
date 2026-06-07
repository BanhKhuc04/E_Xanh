-- ============================================================
-- E-XANH Database Schema
-- Chạy file này trong Supabase SQL Editor (theo thứ tự)
-- ============================================================

-- ============================================
-- 1. PROFILES — Hồ sơ người dùng
-- Mở rộng từ auth.users, tự tạo qua trigger
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'moderator', 'admin')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'locked', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Trigger: tự tạo profile khi user đăng ký qua Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 2. CATEGORIES — Danh mục bài viết
-- ============================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. POSTS — Bài viết
-- ============================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  type TEXT NOT NULL DEFAULT 'tip'
    CHECK (type IN ('tip', 'community', 'qa', 'review')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  likes_count INT NOT NULL DEFAULT 0,
  comments_count INT NOT NULL DEFAULT 0,
  saved_count INT NOT NULL DEFAULT 0,
  read_time TEXT,
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. COMMENTS — Bình luận
-- ============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible'
    CHECK (status IN ('visible', 'hidden', 'reported', 'spam')),
  reports_count INT NOT NULL DEFAULT 0,
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. POST_LIKES — Lượt thích bài viết
-- Composite PK: mỗi user chỉ thích 1 lần
-- ============================================
CREATE TABLE post_likes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. SAVED_POSTS — Bài viết đã lưu
-- Composite PK: mỗi user chỉ lưu 1 lần
-- ============================================
CREATE TABLE saved_posts (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. REPORTS — Báo cáo vi phạm
-- Phải có ít nhất post_id hoặc comment_id
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (post_id IS NOT NULL OR comment_id IS NOT NULL)
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. DEVICES — Danh mục thiết bị điện
-- ============================================
CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  default_power INT NOT NULL,
  category TEXT,
  icon TEXT,
  tips TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. ELECTRICITY_CHECKS — Lượt kiểm tra tiền điện
-- user_id nullable cho phép guest kiểm tra
-- ============================================
CREATE TABLE electricity_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  total_kwh NUMERIC(10,2) NOT NULL,
  estimated_cost INT NOT NULL,
  highest_device TEXT,
  saving_percent TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE electricity_checks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 10. ELECTRICITY_CHECK_ITEMS — Chi tiết thiết bị
-- ============================================
CREATE TABLE electricity_check_items (
  id SERIAL PRIMARY KEY,
  check_id UUID NOT NULL REFERENCES electricity_checks(id) ON DELETE CASCADE,
  device_id INT REFERENCES devices(id),
  device_name TEXT NOT NULL,
  power INT NOT NULL,
  hours_per_day NUMERIC(4,1) NOT NULL,
  days_per_month INT NOT NULL,
  kwh NUMERIC(10,2) NOT NULL
);

ALTER TABLE electricity_check_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 11. PLATFORM_SETTINGS — Cài đặt hệ thống (key-value)
-- ============================================
CREATE TABLE platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES profiles(id)
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
