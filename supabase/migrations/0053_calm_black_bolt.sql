ALTER TABLE "stock" RENAME COLUMN "date_of_count" TO "submitted_at";--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN "is_complete" boolean DEFAULT false NOT NULL;