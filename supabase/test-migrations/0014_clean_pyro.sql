ALTER TABLE "store_orders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "Enable inserting store orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable updating store orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable reading store orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP POLICY "Enable deleting store orders for auth users only" ON "store_orders" CASCADE;--> statement-breakpoint
DROP TABLE "store_orders" CASCADE;--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "positive_total_qty";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "store_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "vendor_id" integer;--> statement-breakpoint
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
 ALTER TABLE "orders" ADD CONSTRAINT "orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
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
ALTER TABLE "orders" DROP COLUMN IF EXISTS "total_qty";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "stock" DROP COLUMN IF EXISTS "order_submitted";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "positive_qty" CHECK ("orders"."qty" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "positive_par" CHECK ("orders"."par" >= 0);