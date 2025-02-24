CREATE TABLE IF NOT EXISTS "pars_day" (
	"id" serial PRIMARY KEY NOT NULL,
	"pars_id" integer NOT NULL,
	"dow" integer NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	CONSTRAINT "positive_value" CHECK ("pars_day"."value" >= 0),
	CONSTRAINT "valid_dow" CHECK ("pars_day"."dow" IN (0, 1, 2, 3, 4, 5, 6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pars" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"store_id" integer
);
--> statement-breakpoint
DROP TABLE "store_par_levels" CASCADE;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pars_day" ADD CONSTRAINT "pars_day_pars_id_pars_id_fk" FOREIGN KEY ("pars_id") REFERENCES "public"."pars"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pars" ADD CONSTRAINT "pars_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pars" ADD CONSTRAINT "pars_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
