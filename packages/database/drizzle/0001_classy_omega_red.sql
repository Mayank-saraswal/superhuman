ALTER TABLE "databases" DROP CONSTRAINT "databases_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "docs" DROP CONSTRAINT "docs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "follow_ups" DROP CONSTRAINT "follow_ups_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "snippets" DROP CONSTRAINT "snippets_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "databases" ADD CONSTRAINT "databases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "docs" ADD CONSTRAINT "docs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;