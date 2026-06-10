-- ============================================
-- USER_FOLLOWS — Theo dõi tác giả
-- ============================================
CREATE TABLE user_follows (
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Policy (nếu có sử dụng RLS)
-- Cho phép mọi người xem danh sách follow
CREATE POLICY "Cho phép xem danh sách follow" ON user_follows
  FOR SELECT USING (true);

-- Cho phép user tự follow/unfollow người khác (nhưng không thể follow thay người khác)
CREATE POLICY "Cho phép user tự follow" ON user_follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Cho phép user tự unfollow" ON user_follows
  FOR DELETE USING (auth.uid() = follower_id);
