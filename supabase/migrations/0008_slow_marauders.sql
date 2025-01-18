CREATE TABLE IF NOT EXISTS "vendor_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"vendor_id" integer NOT NULL,
	"item_name" varchar(100),
	"item_code" varchar(50),
	"item_brand" varchar(100),
	"item_description" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "qty_ordered" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "final_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "qty_per_order" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "list_price" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "is_exclusive_supplier" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "agreement_start_date" timestamp;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "agreement_end_date" timestamp;--> statement-breakpoint
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
ALTER TABLE "items" DROP COLUMN IF EXISTS "item_code";