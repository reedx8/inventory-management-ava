ALTER TABLE "stock" ADD CONSTRAINT "positive_qty" CHECK ("stock"."qty" >= 0);--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "positive_closed_count" CHECK ("stock"."closed_count" >= 0);--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "positive_sealed_count" CHECK ("stock"."sealed_count" >= 0);--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "open_items_weight_check" CHECK ("stock"."open_items_weight" >= 0);--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "expired_count_check" CHECK ("stock"."expired_count" >= 0);--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "reused_count_check" CHECK ("stock"."reused_count" >= 0);