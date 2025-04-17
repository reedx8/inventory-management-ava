ALTER TABLE "pars" DROP CONSTRAINT "pars_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "monday" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "tuesday" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "wednesday" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "thursday" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "friday" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "saturday" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "sunday" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pars" ALTER COLUMN "weekly" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pars" ADD CONSTRAINT "pars_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
