ALTER TABLE "bakery_orders" RENAME COLUMN "is_complete" TO "is_checked_off";--> statement-breakpoint
ALTER TABLE "store_bakery_orders" ADD COLUMN "completed_at" timestamp (3) with time zone;