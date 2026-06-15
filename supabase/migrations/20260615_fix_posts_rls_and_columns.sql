-- Fix access control, add rejection count, and enforce RLS on posts

-- 1. Add rejection_count column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name='posts' AND column_name='rejection_count'
  ) THEN 
    ALTER TABLE public.posts ADD COLUMN rejection_count INT DEFAULT 0;
  END IF;
END $$;

-- 2. Enforce Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop all existing SELECT policies to ensure a clean slate
DROP POLICY IF EXISTS "Enable read access for all users" ON public.posts;
DROP POLICY IF EXISTS "Public can view approved posts" ON public.posts;
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Enable read access for all users on posts" ON public.posts;

-- 3. Recreate strict SELECT policies

-- Public (Anonymous & Authenticated) can only see approved posts
CREATE POLICY "Public can view approved posts" 
ON public.posts 
FOR SELECT 
USING (status = 'approved');

-- Owners can see all their own posts (including pending, rejected, archived)
CREATE POLICY "Users can view their own posts" 
ON public.posts 
FOR SELECT 
USING (author_id = auth.uid());

-- Admins and Moderators can see all posts
CREATE POLICY "Admins and Moderators can view all posts" 
ON public.posts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'moderator')
  )
);
