ALTER TABLE "week_close" ALTER COLUMN "submitted_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "week_close" ALTER COLUMN "submitted_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "week_close" ADD COLUMN "updated_at" timestamp (3) with time zone;