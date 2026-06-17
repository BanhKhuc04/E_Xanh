-- 1. Create post_reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'love', 'useful', 'idea')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Bật RLS cho post_reactions
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

-- Các chính sách RLS cho post_reactions
CREATE POLICY "Cho phép ai cũng xem được reactions"
  ON post_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated có thể insert reaction"
  ON post_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated có thể update reaction của mình"
  ON post_reactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated có thể delete reaction của mình"
  ON post_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Update public_profiles view
-- Include display_name (if it exists in your schema later, but we use name or email prefix as fallback logic in application)
-- Extract profile_visibility from user_preferences JSONB
CREATE OR REPLACE VIEW public_profiles AS
SELECT
  id,
  COALESCE(NULLIF(name, ''), 'Thành viên E-XANH') AS name,
  avatar_url,
  bio,
  created_at,
  COALESCE(user_preferences->>'profile_visibility', 'public') as profile_visibility,
  COALESCE(user_preferences->>'show_public_posts', 'true') as show_public_posts
FROM profiles
WHERE COALESCE(status, '') NOT IN ('deleted', 'blocked');

GRANT SELECT ON public_profiles TO anon, authenticated;
