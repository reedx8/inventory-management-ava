ALTER TABLE "orders" ALTER COLUMN "par" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "monday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "tuesday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "wednesday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "thursday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "friday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "saturday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "sunday" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "weekly" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "vendor_items" ALTER COLUMN "list_price" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "closed_count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "sealed_count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "expired_count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "unexpired_count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "reused_count" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "store_bakery_orders" ADD COLUMN "par" numeric(20, 6);