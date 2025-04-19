ALTER TABLE "pars" DROP COLUMN IF EXISTS "id";
ALTER TABLE "pars" ADD CONSTRAINT "pars_item_id_store_id_pk" PRIMARY KEY("item_id","store_id");--> statement-breakpoint