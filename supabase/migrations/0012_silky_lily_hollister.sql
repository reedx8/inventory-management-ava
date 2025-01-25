ALTER TYPE "public"."status" RENAME TO "stages";--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"stage_name" "stages" DEFAULT 'DUE' NOT NULL,
	"qty_sum" numeric(10, 2),
	"username" varchar(50) DEFAULT 'SYSTEM' NOT NULL,
	"comments" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor_split" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"vendor_id" integer NOT NULL,
	"qty" numeric(10, 2),
	"qty_per_order" varchar(50),
	"total_price" numeric(10, 2)
);
--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "vendor_id" TO "init_vendor_id";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_vendor_id_vendors_id_fk";
--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "changed_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "date_of_count" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "changed_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "last_run" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "store_items" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "vendor_items" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "website" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "agreement_start_date" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "agreement_end_date" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "final_vendor_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "processed_via" varchar(15) DEFAULT 'MANUALLY';--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "contact_name" varchar(50);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_stages" ADD CONSTRAINT "order_stages_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
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
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_init_vendor_id_vendors_id_fk" FOREIGN KEY ("init_vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_final_vendor_id_vendors_id_fk" FOREIGN KEY ("final_vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "qty_submitted";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "qty_ordered";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "qty_delivered";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "is_order_change";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "comments";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "submitted_date";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "order_date";--> statement-breakpoint
ALTER TABLE "public"."order_stages" ALTER COLUMN "stage_name" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."stages" CASCADE;--> statement-breakpoint
CREATE TYPE "public"."stages" AS ENUM('DUE', 'SOURCING', 'PROCURING', 'PROCESSED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
ALTER TABLE "public"."order_stages" ALTER COLUMN "stage_name" SET DATA TYPE "public"."stages" USING "stage_name"::"public"."stages";