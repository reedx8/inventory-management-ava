CREATE TABLE IF NOT EXISTS "history" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" varchar(50) NOT NULL,
	"record_id" integer NOT NULL,
	"field_name" varchar(50) NOT NULL,
	"old_value" numeric(10, 2),
	"new_value" numeric(10, 2),
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"qty" numeric(10, 2) NOT NULL,
	"date_of_count" timestamp DEFAULT now() NOT NULL,
	"closed_count" numeric(10, 2),
	"sealed_count" numeric(10, 2),
	"open_items_weight" numeric(10, 2),
	"expired_count" numeric(10, 2),
	"reused_count" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"barcode" varchar(100),
	"name" varchar(100) NOT NULL,
	"store_id" integer NOT NULL,
	"cost" numeric(10, 2) NOT NULL,
	"unit" varchar(30) NOT NULL,
	"unit_qty" numeric(10, 2) DEFAULT '1.00' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"order_days" text[9],
	"own_brand" boolean NOT NULL,
	"category" varchar(100),
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "items_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"delivered" numeric(10, 2),
	"order_date" timestamp DEFAULT now() NOT NULL,
	"delivery_date" timestamp,
	"vendor_id" integer NOT NULL,
	"vendor_price" numeric(10, 2),
	"status" varchar(100) DEFAULT 'open' NOT NULL,
	"comments" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pars" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"value" numeric(10, 2),
	"day_of_week" varchar(9),
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"budget" numeric(10, 2),
	"logo" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100),
	"phone" varchar(100),
	"website" varchar(100),
	"logo" varchar(100)
);
