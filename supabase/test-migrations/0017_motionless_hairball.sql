ALTER TABLE "items" DROP CONSTRAINT "invoice_categ_check";--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "cron_category_check";--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "invoice_categ_check" CHECK ("items"."invoice_categ" IN ('PASTRY', 'COOLER&EXTRAS', 'BEVERAGE', 'MISC/BATHROOM', 'CTC', 'CCP&SYSCO', 'NONE'));--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "cron_category_check" CHECK ("items"."cron_categ" IN ('PASTRY', 'MILK', 'BREAD', 'CHOCOLATE', 'TEA', 'COFFEE', 'CCP&SYSCO', 'NONE'));