CREATE POLICY "Enable read for authenticated users only" ON "vendors" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);