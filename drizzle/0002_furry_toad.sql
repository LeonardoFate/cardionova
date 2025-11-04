ALTER TABLE "user" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "speciality" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "license_number" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "department" text;