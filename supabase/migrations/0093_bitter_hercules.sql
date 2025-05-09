ALTER TABLE "vendor_items" RENAME COLUMN "item_name" TO "alt_name";--> statement-breakpoint
DROP INDEX IF EXISTS "vendor_item_unique_idx";--> statement-breakpoint
ALTER TABLE "vendor_items" ADD COLUMN "list_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "vendor_items" ADD COLUMN "barcode" varchar;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vendor_item_unique_idx" ON "vendor_items" USING btree ("vendor_id","item_id","alt_name");--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "vendor_description";--> statement-breakpoint
ALTER TABLE "vendor_items" ADD CONSTRAINT "positive_list_price" CHECK ("vendor_items"."list_price" >= 0);