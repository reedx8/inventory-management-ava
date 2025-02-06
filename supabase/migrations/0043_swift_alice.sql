CREATE TABLE IF NOT EXISTS "inventory_schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer,
	"is_order_sched" boolean NOT NULL,
	"is_stock_sched" boolean NOT NULL,
	"frequency" varchar NOT NULL,
	"weekly_freq" integer NOT NULL,
	"start_day" integer[] NOT NULL,
	"end_day" integer[] NOT NULL,
	CONSTRAINT "positive_weekly_freq" CHECK ("inventory_schedule"."weekly_freq" >= 1 AND "inventory_schedule"."weekly_freq" <= 7),
	CONSTRAINT "exclusive_schedule_type" CHECK (("inventory_schedule"."is_order_sched" AND NOT "inventory_schedule"."is_stock_sched") OR 
                    ("inventory_schedule"."is_stock_sched" AND NOT "inventory_schedule"."is_order_sched")),
	CONSTRAINT "check_frequency" CHECK ("inventory_schedule"."frequency" IN ('WEEKLY', 'DAILY'))
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory_schedule" ADD CONSTRAINT "inventory_schedule_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
