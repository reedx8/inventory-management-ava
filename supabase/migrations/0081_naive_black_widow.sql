ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "store_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Enable inserting orders for auth users only" ON "orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating orders for auth users only" ON "orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading orders for auth users only" ON "orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting orders for auth users only" ON "orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting store orders for auth users only" ON "store_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating store orders for auth users only" ON "store_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading store orders for auth users only" ON "store_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting store orders for auth users only" ON "store_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);