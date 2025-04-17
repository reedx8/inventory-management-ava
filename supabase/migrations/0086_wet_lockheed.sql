ALTER TABLE "order_item_schedules" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_item_schedules" ALTER COLUMN "schedule_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_item_schedules" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_item_schedules" ALTER COLUMN "schedule_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_split" ALTER COLUMN "order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" DROP COLUMN IF EXISTS "test";