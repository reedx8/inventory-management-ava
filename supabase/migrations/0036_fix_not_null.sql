-- Custom SQL migration file, put your code below! --
ALTER TABLE "items" ALTER COLUMN "is_sunday_stock" SET NOT NULL, ALTER COLUMN "is_sunday_stock" SET DEFAULT false;
ALTER TABLE "items" ALTER COLUMN "is_weekly_stock" SET NOT NULL, ALTER COLUMN "is_weekly_stock" SET DEFAULT false;
