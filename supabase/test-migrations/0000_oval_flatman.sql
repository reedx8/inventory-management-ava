CREATE TABLE IF NOT EXISTS "bakery_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"temp_tot_order_qty" numeric(10, 2),
	"temp_tot_made" numeric(10, 2),
	"units" varchar,
	"is_checked_off" boolean DEFAULT false NOT NULL,
	"group_order_no" integer DEFAULT 0 NOT NULL,
	"bakery_comments" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp (3) with time zone,
	CONSTRAINT "positive_temp_tot_order_qty" CHECK ("bakery_orders"."temp_tot_order_qty" >= 0),
	CONSTRAINT "positive_temp_tot_made" CHECK ("bakery_orders"."temp_tot_made" >= 0),
	CONSTRAINT "positive_group_order_no" CHECK ("bakery_orders"."group_order_no" >= 0)
);
--> statement-breakpoint
ALTER TABLE "bakery_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "history" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" varchar NOT NULL,
	"record_id" integer NOT NULL,
	"field_name" varchar NOT NULL,
	"old_value" numeric(10, 2),
	"new_value" numeric(10, 2),
	"changed_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"vendor_id" integer NOT NULL,
	"units" varchar,
	"list_price" numeric(10, 2) DEFAULT 0.00 NOT NULL,
	"store_categ" varchar NOT NULL,
	"invoice_categ" varchar DEFAULT 'NONE' NOT NULL,
	"main_categ" varchar,
	"sub_categ" varchar,
	"cron_categ" varchar DEFAULT 'NONE',
	"is_waste_tracked" boolean DEFAULT false,
	"item_description" text,
	"vendor_description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"picture" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "items_name_unique" UNIQUE("name"),
	CONSTRAINT "invoice_categ_check" CHECK ("items"."invoice_categ" IN ('SANDWICH', 'PASTRY', 'FOOD', 'COOLER&EXTRAS', 'BEVERAGE', 'MISC/BATHROOM', 'CHOCOLATE&TEA', 'COFFEE', 'NONE')),
	CONSTRAINT "positive_list_price" CHECK ("items"."list_price" >= 0),
	CONSTRAINT "store_category_check" CHECK ("items"."store_categ" IN ('FRONT', 'STOCKROOM', 'FRIDGE', 'GENERAL', 'BEANS&TEA', 'PASTRY', 'NONE')),
	CONSTRAINT "cron_category_check" CHECK ("items"."cron_categ" IN ('PASTRY', 'MILK', 'BREAD', 'RETAILBEANS', 'MEATS', 'NONE'))
);
--> statement-breakpoint
ALTER TABLE "items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_item_schedules" (
	"item_id" integer NOT NULL,
	"schedule_id" integer NOT NULL,
	CONSTRAINT "order_item_schedules_item_id_schedule_id_pk" PRIMARY KEY("item_id","schedule_id")
);
--> statement-breakpoint
ALTER TABLE "order_item_schedules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"tot_qty_store" numeric(10, 2),
	"tot_qty_vendor" numeric(10, 2),
	"tot_qty_delivered" numeric(10, 2),
	"vendor_id" integer NOT NULL,
	"units" varchar,
	"due_date" timestamp (3) with time zone NOT NULL,
	"list_price" numeric(10, 2) NOT NULL,
	"final_price" numeric(10, 2) NOT NULL,
	"adj_price" numeric(10, 2),
	"group_order_no" integer,
	"ordered_via" varchar DEFAULT 'MANUALLY',
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone,
	CONSTRAINT "tot_qty_store_check" CHECK ("orders"."tot_qty_store" >= 0),
	CONSTRAINT "tot_qty_vendor_check" CHECK ("orders"."tot_qty_vendor" >= 0),
	CONSTRAINT "tot_qty_delivered_check" CHECK ("orders"."tot_qty_delivered" >= 0),
	CONSTRAINT "positive_list_price" CHECK ("orders"."list_price" >= 0),
	CONSTRAINT "positive_final_price" CHECK ("orders"."final_price" >= 0),
	CONSTRAINT "positive_adj_price" CHECK ("orders"."adj_price" >= 0),
	CONSTRAINT "check_ordered_via" CHECK ("orders"."ordered_via" IN ('MANUALLY', 'EMAIL', 'WEB', 'API')),
	CONSTRAINT "positive_group_order_no" CHECK ("orders"."group_order_no" >= 0)
);
--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pars" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"monday" numeric(10, 2) NOT NULL,
	"tuesday" numeric(10, 2) NOT NULL,
	"wednesday" numeric(10, 2) NOT NULL,
	"thursday" numeric(10, 2) NOT NULL,
	"friday" numeric(10, 2) NOT NULL,
	"saturday" numeric(10, 2) NOT NULL,
	"sunday" numeric(10, 2) NOT NULL,
	"weekly" numeric(10, 2) NOT NULL,
	"test" numeric(10, 2) NOT NULL,
	CONSTRAINT "positive_monday" CHECK ("pars"."monday" >= 0),
	CONSTRAINT "positive_tuesday" CHECK ("pars"."tuesday" >= 0),
	CONSTRAINT "positive_wednesday" CHECK ("pars"."wednesday" >= 0),
	CONSTRAINT "positive_thursday" CHECK ("pars"."thursday" >= 0),
	CONSTRAINT "positive_friday" CHECK ("pars"."friday" >= 0),
	CONSTRAINT "positive_saturday" CHECK ("pars"."saturday" >= 0),
	CONSTRAINT "positive_sunday" CHECK ("pars"."sunday" >= 0),
	CONSTRAINT "positive_weekly" CHECK ("pars"."weekly" >= 0)
);
--> statement-breakpoint
ALTER TABLE "pars" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"exec_time" timestamp (3) with time zone,
	"days_of_week" integer[] NOT NULL,
	"last_run" timestamp (3) with time zone,
	CONSTRAINT "schedules_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "schedules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"qty_on_hand" numeric(10, 2),
	"qty_received" numeric(10, 2),
	"units" varchar,
	"is_waste_track" boolean DEFAULT false NOT NULL,
	"closed_count" numeric(10, 2),
	"sealed_count" numeric(10, 2),
	"open_items_weight" numeric(10, 2),
	"expired_count" numeric(10, 2),
	"reused_count" numeric(10, 2),
	"due_date" timestamp (3) with time zone,
	"submitted_at" timestamp (3) with time zone,
	"completed_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "positive_qty_on_hand" CHECK ("stock"."qty_on_hand" >= 0),
	CONSTRAINT "positive_qty_received" CHECK ("stock"."qty_received" >= 0),
	CONSTRAINT "positive_closed_count" CHECK ("stock"."closed_count" >= 0),
	CONSTRAINT "positive_sealed_count" CHECK ("stock"."sealed_count" >= 0),
	CONSTRAINT "open_items_weight_check" CHECK ("stock"."open_items_weight" >= 0),
	CONSTRAINT "expired_count_check" CHECK ("stock"."expired_count" >= 0),
	CONSTRAINT "reused_count_check" CHECK ("stock"."reused_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "stock" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_item_schedules" (
	"item_id" integer NOT NULL,
	"schedule_id" integer NOT NULL,
	CONSTRAINT "stock_item_schedules_item_id_schedule_id_pk" PRIMARY KEY("item_id","schedule_id")
);
--> statement-breakpoint
ALTER TABLE "stock_item_schedules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store_bakery_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"order_qty" numeric(10, 2),
	"made_qty" numeric(10, 2),
	"is_par_submit" boolean DEFAULT false NOT NULL,
	"comments" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp (3) with time zone,
	"bakery_completed_at" timestamp (3) with time zone,
	CONSTRAINT "positive_order_qty" CHECK ("store_bakery_orders"."order_qty" >= 0)
);
--> statement-breakpoint
ALTER TABLE "store_bakery_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"qty" numeric(10, 2),
	"is_par_submit" boolean DEFAULT false NOT NULL,
	"is_priority_delivery" boolean DEFAULT false NOT NULL,
	"comments" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp (3) with time zone,
	"updated_at" timestamp (3) with time zone,
	CONSTRAINT "positive_qty" CHECK ("store_orders"."qty" >= 0)
);
--> statement-breakpoint
ALTER TABLE "store_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"weekly_budget" numeric(10, 2) DEFAULT 0.00,
	"logo" varchar,
	CONSTRAINT "stores_name_unique" UNIQUE("name"),
	CONSTRAINT "positive_weekly_budget" CHECK ("stores"."weekly_budget" >= 0)
);
--> statement-breakpoint
ALTER TABLE "stores" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"vendor_id" integer NOT NULL,
	"item_name" varchar,
	"item_code" varchar,
	"item_brand" varchar,
	"units" varchar,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"item_description" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vendor_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor_split" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"vendor_id" integer NOT NULL,
	"qty" numeric(10, 2),
	"units" varchar,
	"total_spent" numeric(10, 2),
	CONSTRAINT "positive_qty" CHECK ("vendor_split"."qty" >= 0),
	CONSTRAINT "positive_total_spent" CHECK ("vendor_split"."total_spent" >= 0)
);
--> statement-breakpoint
ALTER TABLE "vendor_split" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar,
	"phone" varchar,
	"contact_name" varchar,
	"website" text,
	"logo" varchar,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_exclusive_supplier" boolean DEFAULT false NOT NULL,
	"agreement_start_date" timestamp (3) with time zone,
	"agreement_end_date" timestamp (3) with time zone,
	"comments" text,
	CONSTRAINT "vendors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "vendors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bakery_orders" ADD CONSTRAINT "bakery_orders_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item_schedules" ADD CONSTRAINT "order_item_schedules_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item_schedules" ADD CONSTRAINT "order_item_schedules_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "orders" ADD CONSTRAINT "orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pars" ADD CONSTRAINT "pars_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_item_schedules" ADD CONSTRAINT "stock_item_schedules_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_bakery_orders" ADD CONSTRAINT "store_bakery_orders_order_id_bakery_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."bakery_orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_bakery_orders" ADD CONSTRAINT "store_bakery_orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_items" ADD CONSTRAINT "vendor_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_items" ADD CONSTRAINT "vendor_items_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_split" ADD CONSTRAINT "vendor_split_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_split" ADD CONSTRAINT "vendor_split_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vendor_item_unique_idx" ON "vendor_items" USING btree ("vendor_id","item_id","item_name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "single_primary_vendor_item" ON "vendor_items" USING btree ("vendor_id","item_id","is_primary");--> statement-breakpoint
CREATE POLICY "Enable inserting bakery orders for auth users only" ON "bakery_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating bakery orders for auth users only" ON "bakery_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading bakery orders for auth users only" ON "bakery_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting bakery orders for auth users only" ON "bakery_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting for auth users only" ON "history" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating for auth users only" ON "history" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading for auth users only" ON "history" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting for auth users only" ON "history" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable update for authenticated users only" ON "items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable Items read for authenticated users only" ON "items" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting items for auth users only" ON "items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable inserting for auth users only" ON "order_item_schedules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating for auth users only" ON "order_item_schedules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading for auth users only" ON "order_item_schedules" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting for auth users only" ON "order_item_schedules" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting orders for auth users only" ON "orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating orders for auth users only" ON "orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading orders for auth users only" ON "orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting orders for auth users only" ON "orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting for auth users only" ON "pars" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating for auth users only" ON "pars" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading for auth users only" ON "pars" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting for auth users only" ON "schedules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating for auth users only" ON "schedules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading for auth users only" ON "schedules" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting stock for auth users only" ON "stock" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating stock for auth users only" ON "stock" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading stock for auth users only" ON "stock" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting stock for auth users only" ON "stock" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting for auth users only" ON "stock_item_schedules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating for auth users only" ON "stock_item_schedules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading for auth users only" ON "stock_item_schedules" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting for auth users only" ON "stock_item_schedules" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting bakery orders for auth users only" ON "store_bakery_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating bakery orders for auth users only" ON "store_bakery_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading bakery orders for auth users only" ON "store_bakery_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting bakery orders for auth users only" ON "store_bakery_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting store orders for auth users only" ON "store_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating store orders for auth users only" ON "store_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading store orders for auth users only" ON "store_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting store orders for auth users only" ON "store_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting orders for auth users only" ON "store_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating orders for auth users only" ON "store_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading orders for auth users only" ON "store_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting orders for auth users only" ON "store_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting stores for auth users only" ON "stores" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating stores for auth users only" ON "stores" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading stores for auth users only" ON "stores" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting for auth users only" ON "vendor_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating for auth users only" ON "vendor_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading for auth users only" ON "vendor_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting for auth users only" ON "vendor_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting for auth users only" ON "vendor_split" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable updating for auth users only" ON "vendor_split" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable reading for auth users only" ON "vendor_split" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable deleting deleting for auth users only" ON "vendor_split" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable update for authenticated users only" ON "vendors" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable read for authenticated users only" ON "vendors" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable inserting vendors for auth users only" ON "vendors" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);