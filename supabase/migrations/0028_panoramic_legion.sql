ALTER TABLE "items" RENAME COLUMN "current_price" TO "list_price";--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "positive_current_price";--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "positive_list_price" CHECK ("items"."list_price" >= 0);