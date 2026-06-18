ALTER TABLE "experiences" ADD COLUMN "type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "skills" jsonb DEFAULT '[]'::jsonb NOT NULL;