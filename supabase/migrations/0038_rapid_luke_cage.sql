ALTER TABLE "stock" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "closed_count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "sealed_count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "open_items_weight" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "expired_count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "reused_count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "date_of_count" DROP NOT NULL;