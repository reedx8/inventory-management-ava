ALTER TABLE "bakery_orders" RENAME COLUMN "tot_made" TO "temp_tot_made";--> statement-breakpoint
ALTER TABLE "bakery_orders" DROP CONSTRAINT "positive_tot_made";--> statement-breakpoint
ALTER TABLE "bakery_orders" ADD CONSTRAINT "positive_temp_tot_made" CHECK ("bakery_orders"."temp_tot_made" >= 0);