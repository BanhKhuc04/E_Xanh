-- SAVED POSTS
DROP POLICY IF EXISTS "Users can manage their own saved posts" ON public.saved_posts;
CREATE POLICY "Users can manage their own saved posts"
ON public.saved_posts FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- COMMENTS
DROP POLICY IF EXISTS "Public can view visible comments" ON public.comments;
CREATE POLICY "Public can view visible comments"
ON public.comments FOR SELECT
USING (status = 'visible');

DROP POLICY IF EXISTS "Users can insert own comments" ON public.comments;
CREATE POLICY "Users can insert own comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments"
ON public.comments FOR DELETE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin moderator can manage all comments" ON public.comments;
CREATE POLICY "Admin moderator can manage all comments"
ON public.comments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'moderator')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'moderator')
  )
);
