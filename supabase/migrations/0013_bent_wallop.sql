ALTER TABLE "inventory" RENAME TO "stock";--> statement-breakpoint
ALTER TABLE "stock" RENAME COLUMN "count" TO "qty";--> statement-breakpoint
ALTER TABLE "schedules" RENAME COLUMN "active" TO "is_active";--> statement-breakpoint
ALTER TABLE "store_items" RENAME COLUMN "active" TO "is_active";--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "inventory_item_id_store_items_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock" ADD CONSTRAINT "stock_item_id_store_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."store_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
