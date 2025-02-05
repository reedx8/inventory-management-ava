ALTER TABLE "items" RENAME COLUMN "requires_inventory" TO "is_weekly_stock";--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "requires_order" TO "is_sunday_stock";--> statement-breakpoint
ALTER TABLE "stock" RENAME COLUMN "qty" TO "count";--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "positive_qty";--> statement-breakpoint
-- ALTER TABLE "store_orders" DROP CONSTRAINT "positive_par_submit";--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "positive_count" CHECK ("stock"."count" >= 0);