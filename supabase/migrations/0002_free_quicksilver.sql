CREATE TABLE IF NOT EXISTS "store_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"location" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inv_item_schedules" DROP CONSTRAINT "inv_item_schedules_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_store_id_stores_id_fk";
--> statement-breakpoint
ALTER TABLE "order_item_schedules" DROP CONSTRAINT "order_item_schedules_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "pars" DROP CONSTRAINT "pars_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "barcode" SET DATA TYPE varchar(200);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_items" ADD CONSTRAINT "store_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_items" ADD CONSTRAINT "store_items_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inv_item_schedules" ADD CONSTRAINT "inv_item_schedules_item_id_store_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."store_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_item_id_store_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."store_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item_schedules" ADD CONSTRAINT "order_item_schedules_item_id_store_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."store_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_item_id_store_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."store_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pars" ADD CONSTRAINT "pars_item_id_store_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."store_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "store_id";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "active";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "location_categ";--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_name_unique" UNIQUE("name");