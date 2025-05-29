ALTER TABLE "store_orders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "Enable inserting store orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable updating store orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable reading store orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable deleting store orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable inserting orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable updating orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable reading orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable deleting orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP TABLE "store_orders" CASCADE;--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "tot_qty_store_check";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "tot_qty_vendor_check";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "tot_qty_delivered_check";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "vendor_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "list_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "final_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "store_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "stock_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "qty" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "par" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "is_par_submit" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "store_submit_at" timestamp (3) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "order_submit_at" timestamp (3) with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_stock_id_stock_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stock"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "tot_qty_store";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "tot_qty_vendor";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "tot_qty_delivered";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "due_date";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "positive_qty" CHECK ("orders"."qty" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "positive_par" CHECK ("orders"."par" >= 0);