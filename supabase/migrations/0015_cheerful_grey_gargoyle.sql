ALTER TABLE "store_items" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
-- DROP TABLE "store_items" CASCADE;--> statement-breakpoint
ALTER TABLE "order_stages" RENAME COLUMN "qty_sum" TO "order_qty";--> statement-breakpoint
ALTER TABLE "order_item_schedules" DROP CONSTRAINT IF EXISTS "order_item_schedules_item_id_store_items_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_item_id_store_items_id_fk";
--> statement-breakpoint
ALTER TABLE "pars" DROP CONSTRAINT "pars_item_id_store_items_id_fk";
--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "stock_item_id_store_items_id_fk";
--> statement-breakpoint
ALTER TABLE "stock_item_schedules" DROP CONSTRAINT "stock_item_schedules_item_id_store_items_id_fk";
--> statement-breakpoint
DROP TABLE "store_items" CASCADE;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "requires_inventory" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "requires_order" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "store_categ" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "store_id" integer;--> statement-breakpoint
ALTER TABLE "pars" ADD COLUMN "store_id" integer;--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN "store_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item_schedules" ADD CONSTRAINT "order_item_schedules_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pars" ADD CONSTRAINT "pars_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pars" ADD CONSTRAINT "pars_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock" ADD CONSTRAINT "stock_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock" ADD CONSTRAINT "stock_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_item_schedules" ADD CONSTRAINT "stock_item_schedules_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
