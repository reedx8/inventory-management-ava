ALTER TABLE "inventory" ALTER COLUMN "count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "count" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "date_of_count" DROP DEFAULT;