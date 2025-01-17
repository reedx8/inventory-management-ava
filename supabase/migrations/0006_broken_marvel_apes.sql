ALTER TABLE "items" RENAME COLUMN "barcode" TO "item_code";--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "acc_category" TO "invoice_categ";--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "description" TO "item_description";--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_barcode_unique";--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "unit" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "main_categ" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "vendor_description" text;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "unit_qty";