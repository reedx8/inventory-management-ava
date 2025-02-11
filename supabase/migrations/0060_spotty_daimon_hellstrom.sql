CREATE TABLE IF NOT EXISTS "bakery_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"tot_order_qty" numeric(10, 2),
	"tot_made" numeric(10, 2),
	"units" varchar,
	"is_complete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp (3) with time zone,
	CONSTRAINT "positive_tot_order_qty" CHECK ("bakery_orders"."tot_order_qty" >= 0),
	CONSTRAINT "positive_tot_made" CHECK ("bakery_orders"."tot_made" >= 0)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store_bakery_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"order_qty" numeric(10, 2),
	"is_par_submit" boolean DEFAULT false NOT NULL,
	"comments" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "positive_order_qty" CHECK ("store_bakery_orders"."order_qty" >= 0)
);
--> statement-breakpoint
DROP TABLE "inventory_schedule" CASCADE;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bakery_orders" ADD CONSTRAINT "bakery_orders_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
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
