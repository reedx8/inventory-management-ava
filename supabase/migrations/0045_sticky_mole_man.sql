ALTER TABLE "items" ALTER COLUMN "cron_categ" SET DEFAULT 'NONE';--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "cron_category_check" CHECK ("items"."cron_categ" IN ('PASTRIES', 'MILK', 'BREAD', 'RETAILBEANS', 'MEATS', 'NONE'));