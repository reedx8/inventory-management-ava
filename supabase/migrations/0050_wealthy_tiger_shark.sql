ALTER TABLE "schedules" DROP COLUMN "exec_time";
ALTER TABLE "schedules" ADD COLUMN "exec_time" timestamp (3) with time zone;--> statement-breakpoint
-- ALTER TABLE "schedules" ALTER COLUMN "exec_time" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
-- ALTER TABLE "schedules" ALTER COLUMN "exec_time" DROP DEFAULT;--> statement-breakpoint
-- ALTER TABLE "schedules" ALTER COLUMN "exec_time" DROP NOT NULL;