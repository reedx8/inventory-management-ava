CREATE TABLE IF NOT EXISTS "vendor_price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"list_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "positive_list_price" CHECK ("vendor_price_history"."list_price" >= 0)
);
--> statement-breakpoint
ALTER TABLE "vendor_price_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_price_history" ADD CONSTRAINT "vendor_price_history_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_price_history" ADD CONSTRAINT "vendor_price_history_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE POLICY "Enable inserting for auth users only" ON "vendor_price_history" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating for auth users only" ON "vendor_price_history" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading for auth users only" ON "vendor_price_history" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);