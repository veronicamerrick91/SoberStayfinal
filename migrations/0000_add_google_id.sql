CREATE TABLE "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"property_name" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"monthly_price" integer NOT NULL,
	"total_beds" integer NOT NULL,
	"gender" text NOT NULL,
	"room_type" text NOT NULL,
	"description" text NOT NULL,
	"amenities" jsonb NOT NULL,
	"inclusions" jsonb NOT NULL,
	"photos" jsonb NOT NULL,
	"supervision_type" text NOT NULL,
	"is_mat_friendly" boolean DEFAULT false NOT NULL,
	"is_pet_friendly" boolean DEFAULT false NOT NULL,
	"is_lgbtq_friendly" boolean DEFAULT false NOT NULL,
	"is_faith_based" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"status" text NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"payment_method" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'tenant' NOT NULL,
	"google_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;