ALTER TABLE "items" RENAME COLUMN "unit" TO "qty_per_order";--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "raw_cost" TO "list_price";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "vendor_price" TO "final_price";--> statement-breakpoint
ALTER TABLE "stores" RENAME COLUMN "budget" TO "weekly_budget";--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "item_code" SET DATA TYPE varchar(50);