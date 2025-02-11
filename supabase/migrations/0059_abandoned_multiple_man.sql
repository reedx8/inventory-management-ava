ALTER TABLE "items" DROP CONSTRAINT "store_category_check";--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "cron_category_check";--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "store_category_check" CHECK ("items"."store_categ" IN ('FRONT', 'STOCKROOM', 'FRIDGE', 'GENERAL', 'BEANS&TEA', 'PASTRY', 'NONE'));--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "cron_category_check" CHECK ("items"."cron_categ" IN ('PASTRY', 'MILK', 'BREAD', 'RETAILBEANS', 'MEATS', 'NONE'));