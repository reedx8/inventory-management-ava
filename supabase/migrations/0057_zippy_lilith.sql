ALTER TABLE "pars" RENAME TO "store_par_levels";--> statement-breakpoint
ALTER TABLE "store_par_levels" RENAME COLUMN "value" TO "min_qty";--> statement-breakpoint
ALTER TABLE "stock" RENAME COLUMN "count" TO "qty_on_hand";--> statement-breakpoint
ALTER TABLE "store_par_levels" DROP CONSTRAINT "positive_value";--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "positive_count";--> statement-breakpoint
ALTER TABLE "store_par_levels" DROP CONSTRAINT "pars_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "store_par_levels" DROP CONSTRAINT "pars_store_id_stores_id_fk";
--> statement-breakpoint
ALTER TABLE "store_par_levels" ADD COLUMN "max_qty" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "store_par_levels" ADD COLUMN "reorder_point" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN "qty_received" numeric(10, 2);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_par_levels" ADD CONSTRAINT "store_par_levels_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_par_levels" ADD CONSTRAINT "store_par_levels_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "store_par_levels" ADD CONSTRAINT "positive_min_qty" CHECK ("store_par_levels"."min_qty" >= 0);--> statement-breakpoint
ALTER TABLE "store_par_levels" ADD CONSTRAINT "positive_max_qty" CHECK ("store_par_levels"."max_qty" >= 0);--> statement-breakpoint
ALTER TABLE "store_par_levels" ADD CONSTRAINT "positive_reorder_point" CHECK ("store_par_levels"."reorder_point" >= 0);--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "positive_qty_on_hand" CHECK ("stock"."qty_on_hand" >= 0);--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "positive_qty_received" CHECK ("stock"."qty_received" >= 0);