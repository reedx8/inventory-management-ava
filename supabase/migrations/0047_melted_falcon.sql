ALTER TABLE "vendor_items" ADD COLUMN "units" varchar;--> statement-breakpoint
ALTER TABLE "vendor_items" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "single_primary_vendor_item" ON "vendor_items" USING btree ("vendor_id","item_id","is_primary");