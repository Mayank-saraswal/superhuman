import { z } from "zod";
import { router } from "../trpc";
import { protectedProcedure } from "../procedures";
import { getTenant } from "../utils/tenant";
import { TRPCError } from "@trpc/server";
import { db, followUps, emailSummaries, eq, and, inArray } from "@superhuman/database";

export const mailRouter = router({
  getInbox: protectedProcedure
    .input(z.object({
      page: z.number().default(0),
      tab: z.enum(["important", "team", "vip", "marketing", "social", "all"]).default("all")
    }))
    .query(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      // NOTE: tab filtering is mocked/approximated by search queries for now
      const query = input.tab === "all" ? "in:inbox" : `in:inbox category:${input.tab}`;
      const response = await tenant.gmail.api.messages.list({ q: query, maxResults: 50 });
      const messages = response.messages || [];
      
      const messageIds = messages.map((m: any) => m.id);
      let summaries: Record<string, typeof emailSummaries.$inferSelect> = {};
      
      if (messageIds.length > 0) {
        // Find summaries for these messages
        const dbSummaries = await db.select().from(emailSummaries).where(and(
          eq(emailSummaries.userId, ctx.user.id),
          inArray(emailSummaries.gmailMessageId, messageIds)
        ));
        
        dbSummaries.forEach(s => {
          summaries[s.gmailMessageId] = s;
        });
      }

      return {
        messages: messages.map((m: any) => ({
          ...m,
          aiSummary: m.id ? summaries[m.id]?.summary || null : null
        })),
        nextPage: messages.length === 50 ? input.page + 1 : null
      };
    }),

  getThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      // Fetch thread from DB or API
      const thread = await tenant.gmail.api.threads.get({ id: input.threadId });
      
      // Get AI draft reply from the latest message in thread
      let draftReply = null;
      if (thread.messages && thread.messages.length > 0) {
        const lastMessage = thread.messages[thread.messages.length - 1];
        if (lastMessage?.id) {
          const summaryRecord = await db.select().from(emailSummaries).where(and(
            eq(emailSummaries.userId, ctx.user.id),
            eq(emailSummaries.gmailMessageId, lastMessage.id)
          )).limit(1);
          if (summaryRecord.length > 0 && summaryRecord[0]) draftReply = summaryRecord[0].draftReply;
        }
      }

      return {
        thread,
        draftReply
      };
    }),

  sendEmail: protectedProcedure
    .input(z.object({
      to: z.string().email(),
      subject: z.string().min(1, "Subject is required").refine(val => !/[\r\n]/.test(val), "CRLF injection detected"),
      body: z.string(),
      cc: z.string().optional().refine(val => !val || !/[\r\n]/.test(val), "CRLF injection detected"),
      bcc: z.string().optional().refine(val => !val || !/[\r\n]/.test(val), "CRLF injection detected"),
      replyToMessageId: z.string().optional().refine(val => !val || !/[\r\n]/.test(val), "CRLF injection detected")
    }))
    .mutation(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      
      // Construct raw email
      const messageParts = [
        `To: ${input.to}`,
        `Subject: ${input.subject}`,
        "Content-Type: text/html; charset=utf-8",
      ];
      if (input.cc) messageParts.push(`Cc: ${input.cc}`);
      if (input.bcc) messageParts.push(`Bcc: ${input.bcc}`);
      if (input.replyToMessageId) messageParts.push(`In-Reply-To: ${input.replyToMessageId}`, `References: ${input.replyToMessageId}`);
      
      messageParts.push("", input.body);
      const raw = Buffer.from(messageParts.join("\r\n")).toString("base64url");

      await tenant.gmail.api.messages.send({ raw });
      return { success: true };
    }),

  archiveEmail: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      await tenant.gmail.api.messages.modify({ id: input.messageId, removeLabelIds: ["INBOX"] });
      return { success: true };
    }),

  starEmail: protectedProcedure
    .input(z.object({ messageId: z.string(), starred: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      const requestBody = input.starred 
        ? { addLabelIds: ["STARRED"] } 
        : { removeLabelIds: ["STARRED"] };
      await tenant.gmail.api.messages.modify({ id: input.messageId, ...requestBody });
      return { success: true };
    }),

  markRead: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      await tenant.gmail.api.messages.modify({ id: input.messageId, removeLabelIds: ["UNREAD"] });
      return { success: true };
    }),

  refreshInbox: protectedProcedure
    .mutation(async ({ ctx }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      // Trigger a light list call to force sync
      await tenant.gmail.api.messages.list({ labelIds: ["INBOX"], maxResults: 1 });
      return { success: true };
    }),

  setFollowUp: protectedProcedure
    .input(z.object({ 
      messageId: z.string(), 
      remindAt: z.string().refine(date => {
        const d = new Date(date);
        return !isNaN(d.getTime()) && d > new Date();
      }, "Must be a valid future date")
    }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(followUps).values({
        userId: ctx.user.id,
        gmailMessageId: input.messageId,
        remindAt: new Date(input.remindAt)
      });
      return { success: true };
    }),

  getFollowUps: protectedProcedure
    .query(async ({ ctx }) => {
      return db.select().from(followUps).where(and(
        eq(followUps.userId, ctx.user.id),
        eq(followUps.isSent, false)
      ));
    }),
});
