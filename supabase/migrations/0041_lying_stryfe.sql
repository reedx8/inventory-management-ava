ALTER TABLE "items" ADD COLUMN "cron_category" varchar;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "is_weekly_stock";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "is_sunday_stock";