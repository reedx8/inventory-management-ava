CREATE TABLE IF NOT EXISTS "week_close" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"count" numeric(10, 2),
	"closed_count" numeric(10, 2),
	"sealed_count" numeric(10, 2),
	"open_items_weight" numeric(10, 2),
	"expired_count" numeric(10, 2),
	"unexpired_count" numeric(10, 2),
	"reused_count" numeric(10, 2),
	"submitted_at" timestamp (3) with time zone,
	CONSTRAINT "positive_count" CHECK ("week_close"."count" >= 0),
	CONSTRAINT "positive_closed_count" CHECK ("week_close"."closed_count" >= 0),
	CONSTRAINT "positive_sealed_count" CHECK ("week_close"."sealed_count" >= 0),
	CONSTRAINT "open_items_weight_check" CHECK ("week_close"."open_items_weight" >= 0),
	CONSTRAINT "expired_count_check" CHECK ("week_close"."expired_count" >= 0),
	CONSTRAINT "unexpired_count_check" CHECK ("week_close"."unexpired_count" >= 0),
	CONSTRAINT "reused_count_check" CHECK ("week_close"."reused_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "week_close" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "positive_qty_on_hand";--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "positive_qty_received";--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "positive_closed_count";--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "positive_sealed_count";--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "open_items_weight_check";--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "expired_count_check";--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "reused_count_check";--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN "count" numeric(10, 2) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "week_close" ADD CONSTRAINT "week_close_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "week_close" ADD CONSTRAINT "week_close_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "qty_on_hand";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "qty_received";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "is_waste_track";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "closed_count";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "sealed_count";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "open_items_weight";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "expired_count";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "reused_count";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "due_date";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "completed_at";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "positive_count" CHECK ("stock"."count" >= 0);--> statement-breakpoint
CREATE POLICY "Enable inserting records for auth users only" ON "week_close" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating records for auth users only" ON "week_close" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading records for auth users only" ON "week_close" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting records for auth users only" ON "week_close" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);