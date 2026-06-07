-- Policy cho devices
DROP POLICY IF EXISTS "Public can view visible devices" ON public.devices;
CREATE POLICY "Public can view visible devices"
ON public.devices FOR SELECT
USING (is_visible = true);

-- Policy cho electricity_checks
DROP POLICY IF EXISTS "Users can view their own checks" ON public.electricity_checks;
CREATE POLICY "Users can view their own checks"
ON public.electricity_checks FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own checks" ON public.electricity_checks;
CREATE POLICY "Users can insert their own checks"
ON public.electricity_checks FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own checks" ON public.electricity_checks;
CREATE POLICY "Users can delete their own checks"
ON public.electricity_checks FOR DELETE
USING (auth.uid() = user_id);

-- Policy cho electricity_check_items
DROP POLICY IF EXISTS "Users can view their own check items" ON public.electricity_check_items;
CREATE POLICY "Users can view their own check items"
ON public.electricity_check_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.electricity_checks
  WHERE id = electricity_check_items.check_id
  AND user_id = auth.uid()
));

DROP POLICY IF EXISTS "Users can insert their own check items" ON public.electricity_check_items;
CREATE POLICY "Users can insert their own check items"
ON public.electricity_check_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.electricity_checks
  WHERE id = electricity_check_items.check_id
  AND user_id = auth.uid()
));

DROP POLICY IF EXISTS "Users can delete their own check items" ON public.electricity_check_items;
CREATE POLICY "Users can delete their own check items"
ON public.electricity_check_items FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.electricity_checks
  WHERE id = electricity_check_items.check_id
  AND user_id = auth.uid()
));
