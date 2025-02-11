ALTER TABLE "bakery_orders" RENAME COLUMN "tot_order_qty" TO "temp_tot_order_qty";--> statement-breakpoint
ALTER TABLE "bakery_orders" DROP CONSTRAINT "positive_tot_order_qty";--> statement-breakpoint
ALTER TABLE "bakery_orders" ADD COLUMN "group_order_no" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "bakery_orders" ADD COLUMN "bakery_comments" text;--> statement-breakpoint
ALTER TABLE "bakery_orders" ADD CONSTRAINT "positive_temp_tot_order_qty" CHECK ("bakery_orders"."temp_tot_order_qty" >= 0);--> statement-breakpoint
ALTER TABLE "bakery_orders" ADD CONSTRAINT "positive_group_order_no" CHECK ("bakery_orders"."group_order_no" >= 0);