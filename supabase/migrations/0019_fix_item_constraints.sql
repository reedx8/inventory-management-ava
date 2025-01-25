-- Custom SQL migration file, put your code below! --
ALTER TABLE "public"."items" 
DROP CONSTRAINT IF EXISTS "store_categ_check",
DROP CONSTRAINT IF EXISTS "invoice_categ_check",
DROP CONSTRAINT IF EXISTS "positive_current_price";
UPDATE "items" SET "invoice_categ" = 'SANDWICH' WHERE "invoice_categ" = 'sandwich';
ALTER TABLE "public"."items" ADD CONSTRAINT "store_categ_check" CHECK ("store_categ" IN ('FRONT', 'STOCKROOM', 'FRIDGE', 'GENERAL', 'BEANS&TEA'));
ALTER TABLE "public"."items" ADD CONSTRAINT "invoice_categ_check" CHECK ("invoice_categ" IN ('SANDWICH', 'PASTRY', 'FOOD', 'COOLER&EXTRAS', 'BEVERAGE', 'MISC/BATHROOM', 'CHOCOLATE&TEA', 'COFFEE', 'NONE'));
ALTER TABLE "public"."items" ADD CONSTRAINT "positive_current_price" CHECK ("current_price" >= 0);