-- Script to safely remove all demo/mock data from interaction tables
-- This will NOT delete any profiles (users), devices, or settings.

-- 1. Delete all notifications (as they might refer to deleted posts/comments)
TRUNCATE TABLE public.notifications CASCADE;

-- 2. Delete all comments and replies
TRUNCATE TABLE public.comments CASCADE;

-- 3. Delete all post likes
TRUNCATE TABLE public.post_likes CASCADE;

-- 4. Delete all saved posts records
TRUNCATE TABLE public.saved_posts CASCADE;

-- 5. Reset counts on posts table
UPDATE public.posts 
SET 
  likes_count = 0,
  comments_count = 0,
  saved_count = 0;

-- 6. Reset counts on profiles table
UPDATE public.profiles
SET
  followers_count = 0,
  following_count = 0;

-- Done!
