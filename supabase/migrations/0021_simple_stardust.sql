ALTER TABLE "orders" ADD CONSTRAINT "positive_list_price" CHECK ("orders"."list_price" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "positive_final_price" CHECK ("orders"."final_price" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "positive_adj_price" CHECK ("orders"."adj_price" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "check_processed_via" CHECK ("orders"."processed_via" IN ('MANUALLY', 'EMAIL', 'WEB', 'API'));