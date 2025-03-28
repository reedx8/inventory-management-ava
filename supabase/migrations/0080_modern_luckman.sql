ALTER TABLE "bakery_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "store_bakery_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Enable inserting bakery orders for auth users only" ON "bakery_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating bakery orders for auth users only" ON "bakery_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading bakery orders for auth users only" ON "bakery_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting bakery orders for auth users only" ON "bakery_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting bakery orders for auth users only" ON "store_bakery_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating bakery orders for auth users only" ON "store_bakery_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading bakery orders for auth users only" ON "store_bakery_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting bakery orders for auth users only" ON "store_bakery_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);