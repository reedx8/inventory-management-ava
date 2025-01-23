ALTER TABLE "orders" RENAME COLUMN "is_replacement_order" TO "is_order_change";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "is_priority_delivery" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;