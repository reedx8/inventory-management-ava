DELETE FROM "order_stages";--> statement-breakpoint
DELETE FROM "orders";--> statement-breakpoint
ALTER TABLE "order_stages" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "order_stages" CASCADE;--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "init_vendor_id" TO "vendor_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "processed_via" TO "ordered_via";--> statement-breakpoint
ALTER TABLE "vendor_split" RENAME COLUMN "total_price" TO "total_spent";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "check_processed_via";--> statement-breakpoint
ALTER TABLE "vendor_split" DROP CONSTRAINT "positive_total_price";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_init_vendor_id_vendors_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_final_vendor_id_vendors_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tot_qty_store" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tot_qty_vendor" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tot_qty_delivered" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "due_date" timestamp (3) with time zone NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "final_vendor_id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "is_priority_delivery";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "is_par_order";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "tot_qty_store_check" CHECK ("orders"."tot_qty_store" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "tot_qty_vendor_check" CHECK ("orders"."tot_qty_vendor" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "tot_qty_delivered_check" CHECK ("orders"."tot_qty_delivered" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "check_ordered_via" CHECK ("orders"."ordered_via" IN ('MANUALLY', 'EMAIL', 'WEB', 'API'));--> statement-breakpoint
ALTER TABLE "vendor_split" ADD CONSTRAINT "positive_total_spent" CHECK ("vendor_split"."total_spent" >= 0);--> statement-breakpoint
DROP TYPE "public"."stages";