ALTER TABLE "orders" DROP CONSTRAINT "tot_qty_store_check";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "tot_qty_vendor_check";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "tot_qty_delivered_check";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_vendor_id_vendors_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "final_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "store_orders" ALTER COLUMN "qty" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "total_qty" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "store_orders" ADD COLUMN "final_submit_at" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "tot_qty_store";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "tot_qty_vendor";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "tot_qty_delivered";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "vendor_id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "due_date";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "store_orders" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "positive_total_qty" CHECK ("orders"."total_qty" >= 0);--> statement-breakpoint
DROP POLICY "Enable inserting orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable updating orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable reading orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable deleting orders for auth users only" ON "store_orders" CASCADE;