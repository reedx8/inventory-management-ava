ALTER TABLE "stores" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Enable inserting stores for auth users only" ON "stores" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating stores for auth users only" ON "stores" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading stores for auth users only" ON "stores" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);