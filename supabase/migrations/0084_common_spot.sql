-- ALTER TABLE "pars" DROP CONSTRAINT "pars_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "item_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pars" ADD CONSTRAINT "pars_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
