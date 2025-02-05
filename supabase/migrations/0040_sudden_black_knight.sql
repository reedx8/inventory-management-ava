ALTER TABLE "orders" RENAME COLUMN "qty_per_order" TO "units";--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN "units" varchar;