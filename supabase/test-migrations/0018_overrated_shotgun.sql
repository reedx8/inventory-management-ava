ALTER TABLE "bakery_orders" ALTER COLUMN "temp_tot_order_qty" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "bakery_orders" ALTER COLUMN "temp_tot_made" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "old_value" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "new_value" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "list_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "qty" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "list_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "final_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "adj_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "store_bakery_orders" ALTER COLUMN "order_qty" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "store_bakery_orders" ALTER COLUMN "made_qty" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "weekly_budget" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "vendor_price_history" ALTER COLUMN "list_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "vendor_split" ALTER COLUMN "qty" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "vendor_split" ALTER COLUMN "total_spent" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "open_items_weight" SET DATA TYPE numeric(20, 6);