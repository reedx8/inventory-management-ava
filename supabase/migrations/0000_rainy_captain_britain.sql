CREATE TYPE "public"."status" AS ENUM('DUE', 'SUBMITTED', 'ORDERED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "history" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" varchar(50) NOT NULL,
	"record_id" integer NOT NULL,
	"field_name" varchar(50) NOT NULL,
	"old_value" numeric(10, 2),
	"new_value" numeric(10, 2),
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inv_item_schedules" (
	"item_id" integer,
	"schedule_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"count" numeric(10, 2) DEFAULT 0.00 NOT NULL,
	"date_of_count" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"closed_count" numeric(10, 2) DEFAULT 0.00,
	"sealed_count" numeric(10, 2) DEFAULT 0.00,
	"open_items_weight" numeric(10, 2) DEFAULT 0.00,
	"expired_count" numeric(10, 2) DEFAULT 0.00,
	"reused_count" numeric(10, 2) DEFAULT 0.00
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"barcode" varchar(100),
	"store_id" integer NOT NULL,
	"vendor_id" integer NOT NULL,
	"raw_cost" numeric(10, 2) DEFAULT 0.00 NOT NULL,
	"unit" varchar(30),
	"unit_qty" numeric(10, 2),
	"active" boolean DEFAULT true NOT NULL,
	"acc_category" varchar(10) DEFAULT 'NONE' NOT NULL,
	"main_categ" varchar(30) NOT NULL,
	"sub_categ" varchar(30),
	"location_categ" varchar(30) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "items_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_item_schedules" (
	"item_id" integer,
	"schedule_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"qty_submitted" numeric(10, 2),
	"qty_ordered" numeric(10, 2) NOT NULL,
	"qty_delivered" numeric(10, 2),
	"is_replacement_order" boolean DEFAULT false NOT NULL,
	"vendor_id" integer NOT NULL,
	"vendor_price" numeric(10, 2),
	"adj_price" numeric(10, 2),
	"status" "status" DEFAULT 'DUE' NOT NULL,
	"is_par_order" boolean DEFAULT false NOT NULL,
	"comments" text,
	"submitted_date" timestamp,
	"order_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pars" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"day_of_week" integer NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"exec_time" time DEFAULT '00:00:00' NOT NULL,
	"days_of_week" integer[] NOT NULL,
	"last_run" timestamp,
	CONSTRAINT "schedules_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"budget" numeric(10, 2) DEFAULT 0.00,
	"logo" varchar(200),
	CONSTRAINT "stores_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100),
	"phone" varchar(20),
	"website" varchar(200),
	"logo" varchar(200),
	CONSTRAINT "vendors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inv_item_schedules" ADD CONSTRAINT "inv_item_schedules_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inv_item_schedules" ADD CONSTRAINT "inv_item_schedules_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
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
