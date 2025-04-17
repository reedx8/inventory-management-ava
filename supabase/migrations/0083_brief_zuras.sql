ALTER TABLE "pars_day" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "Enable inserting for auth users only" ON "pars_day" CASCADE;--> statement-breakpoint
DROP POLICY "Enable updating for auth users only" ON "pars_day" CASCADE;--> statement-breakpoint
DROP POLICY "Enable reading for auth users only" ON "pars_day" CASCADE;--> statement-breakpoint
DROP TABLE "pars_day" CASCADE;--> statement-breakpoint
ALTER TABLE "pars" ADD COLUMN "monday" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ADD COLUMN "tuesday" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ADD COLUMN "wednesday" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ADD COLUMN "thursday" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ADD COLUMN "friday" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ADD COLUMN "saturday" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ADD COLUMN "sunday" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ADD COLUMN "weekly" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ADD CONSTRAINT "positive_monday" CHECK ("pars"."monday" >= 0);--> statement-breakpoint
ALTER TABLE "pars" ADD CONSTRAINT "positive_tuesday" CHECK ("pars"."tuesday" >= 0);--> statement-breakpoint
ALTER TABLE "pars" ADD CONSTRAINT "positive_wednesday" CHECK ("pars"."wednesday" >= 0);--> statement-breakpoint
ALTER TABLE "pars" ADD CONSTRAINT "positive_thursday" CHECK ("pars"."thursday" >= 0);--> statement-breakpoint
ALTER TABLE "pars" ADD CONSTRAINT "positive_friday" CHECK ("pars"."friday" >= 0);--> statement-breakpoint
ALTER TABLE "pars" ADD CONSTRAINT "positive_saturday" CHECK ("pars"."saturday" >= 0);--> statement-breakpoint
ALTER TABLE "pars" ADD CONSTRAINT "positive_sunday" CHECK ("pars"."sunday" >= 0);--> statement-breakpoint
ALTER TABLE "pars" ADD CONSTRAINT "positive_weekly" CHECK ("pars"."weekly" >= 0);