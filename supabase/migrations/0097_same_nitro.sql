ALTER TABLE "items" DROP CONSTRAINT "invoice_categ_check";--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "cron_category_check";--> statement-breakpoint
ALTER TABLE "bakery_orders" ALTER COLUMN "temp_tot_order_qty" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "bakery_orders" ALTER COLUMN "temp_tot_made" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "old_value" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "new_value" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "list_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "qty" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "par" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "list_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "final_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "adj_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "monday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "tuesday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "wednesday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "thursday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "friday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "saturday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "sunday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "weekly" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "store_bakery_orders" ALTER COLUMN "order_qty" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "store_bakery_orders" ALTER COLUMN "made_qty" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "weekly_budget" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "vendor_items" ALTER COLUMN "list_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "vendor_price_history" ALTER COLUMN "list_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "vendor_split" ALTER COLUMN "qty" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "vendor_split" ALTER COLUMN "total_spent" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "closed_count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "sealed_count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "open_items_weight" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "expired_count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "unexpired_count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "reused_count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "bake_order" integer;--> statement-breakpoint
ALTER TABLE "store_bakery_orders" ADD COLUMN "par" numeric(20, 6);--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "invoice_categ_check" CHECK ("items"."invoice_categ" IN ('PASTRY', 'COOLER&EXTRAS', 'BEVERAGE', 'MISC/BATHROOM', 'CTC', 'CCP&SYSCO', 'NONE'));--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "cron_category_check" CHECK ("items"."cron_categ" IN ('PASTRY', 'MILK', 'BREAD', 'CHOCOLATE', 'TEA', 'COFFEE', 'CCP&SYSCO', 'NONE'));