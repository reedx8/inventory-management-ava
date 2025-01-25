ALTER TABLE "inv_item_schedules" RENAME TO "stock_item_schedules";--> statement-breakpoint
ALTER TABLE "stock_item_schedules" DROP CONSTRAINT "inv_item_schedules_item_id_store_items_id_fk";
--> statement-breakpoint
ALTER TABLE "stock_item_schedules" DROP CONSTRAINT "inv_item_schedules_schedule_id_schedules_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_item_schedules" ADD CONSTRAINT "stock_item_schedules_item_id_store_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."store_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_item_schedules" ADD CONSTRAINT "stock_item_schedules_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
