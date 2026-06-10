import { z } from "zod";
import { router } from "../trpc";
import { protectedProcedure } from "../procedures";
import { getTenant } from "../utils/tenant";
import { composeEmailStream, rewriteInVoiceStream, generateDraftReply } from "@superhuman/ai";
import { db, emailSummaries, eq, and } from "@superhuman/database";

export const aiRouter = router({
  composeEmail: protectedProcedure
    .input(z.object({
      bullets: z.array(z.string()),
      tone: z.enum(["professional", "casual", "friendly", "formal"]).default("professional")
    }))
    .query(async function* ({ ctx, input }) {
      const tenant = await getTenant(ctx.user.clerkId);
      
      // Fetch voice context (last 5 sent emails)
      const sentEmails = await tenant.gmail.api.messages.list({ q: "in:sent", maxResults: 5 });
      const voiceContext = sentEmails.messages ? sentEmails.messages.map((m: any) => m.snippet || "").join("\n") : "";

      const result = await composeEmailStream(input.bullets, input.tone, voiceContext);
      
      for await (const chunk of result.textStream) {
        yield chunk;
      }
    }),

  rewriteEmail: protectedProcedure
    .input(z.object({
      email: z.string()
    }))
    .query(async function* ({ ctx, input }) {
      const tenant = await getTenant(ctx.user.clerkId);
      
      // Fetch voice context (last 5 sent emails)
      const sentEmails = await tenant.gmail.api.messages.list({ q: "in:sent", maxResults: 5 });
      const voiceContext = sentEmails.messages ? sentEmails.messages.map((m: any) => m.snippet || "").join("\n") : "";

      const result = await rewriteInVoiceStream(input.email, voiceContext);
      
      for await (const chunk of result.textStream) {
        yield chunk;
      }
    }),

  searchEmails: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      // Basic implementation for now - in reality, AI would convert NL to query
      const response = await tenant.gmail.api.messages.list({ q: input.query, maxResults: 20 });
      return { messages: response.messages || [] };
    }),

  getDraftReply: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.select().from(emailSummaries).where(and(
        eq(emailSummaries.userId, ctx.user.id),
        eq(emailSummaries.gmailMessageId, input.messageId)
      )).limit(1);

      const existingRecord = existing[0];
      if (existingRecord?.draftReply) {
        return { draftReply: existingRecord.draftReply };
      }

      const tenant = await getTenant(ctx.user.clerkId);
      const msg = await tenant.gmail.api.messages.get({ id: input.messageId });
      
      // Simple parse to get body string and headers
      const body = msg.snippet || ""; 
      const subject = msg.payload?.headers?.find((h: { name?: string; value?: string }) => h.name === "Subject")?.value || "No Subject";
      const from = msg.payload?.headers?.find((h: { name?: string; value?: string }) => h.name === "From")?.value || "Unknown";

      // Fetch voice context
      const sentEmails = await tenant.gmail.api.messages.list({ q: "in:sent", maxResults: 5 });
      const voiceContext = sentEmails.messages ? sentEmails.messages.map((m: any) => m.snippet || "").join("\n") : "";

      const draftReply = await generateDraftReply(subject, body, from, voiceContext);

      // Save to db using upsert
      await db.insert(emailSummaries).values({
        userId: ctx.user.id,
        gmailMessageId: input.messageId,
        summary: "Auto-generated summary missing",
        draftReply
      }).onConflictDoUpdate({
        target: [emailSummaries.userId, emailSummaries.gmailMessageId],
        set: { draftReply }
      });

      return { draftReply };
    })
});
