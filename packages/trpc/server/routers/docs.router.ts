import { z } from "zod";
import { router } from "../trpc";
import { onboardedProcedure } from "../procedures";
import { TRPCError } from "@trpc/server";
import { db, docs, eq, and } from "@superhuman/database";

export const docsRouter = router({
  getDocs: onboardedProcedure
    .query(async ({ ctx }) => {
      return db.select({
        id: docs.id,
        title: docs.title,
        updatedAt: docs.updatedAt
      }).from(docs).where(eq(docs.userId, ctx.user.id));
    }),

  getDoc: onboardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const doc = await db.select().from(docs).where(and(
        eq(docs.id, input.id),
        eq(docs.userId, ctx.user.id)
      )).limit(1);

      if (doc.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Doc not found" });
      }

      return doc[0];
    }),

  createDoc: onboardedProcedure
    .input(z.object({ title: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      // Default empty Tiptap JSON content
      const emptyContent = { type: "doc", content: [{ type: "paragraph" }] };
      
      const result = await db.insert(docs).values({
        userId: ctx.user.id,
        title: input.title,
        content: emptyContent
      }).returning();

      return result[0];
    }),

  updateDoc: onboardedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.any().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.select().from(docs).where(and(
        eq(docs.id, input.id),
        eq(docs.userId, ctx.user.id)
      )).limit(1);

      const existingDoc = existing[0];
      if (!existingDoc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Doc not found or unauthorized" });
      }

      const result = await db.update(docs).set({
        title: input.title !== undefined ? input.title : existingDoc.title,
        content: input.content !== undefined ? input.content : existingDoc.content,
        updatedAt: new Date()
      }).where(eq(docs.id, input.id)).returning();

      return result[0];
    }),

  deleteDoc: onboardedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.select().from(docs).where(and(
        eq(docs.id, input.id),
        eq(docs.userId, ctx.user.id)
      )).limit(1);

      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Doc not found or unauthorized" });
      }

      await db.delete(docs).where(eq(docs.id, input.id));
      return { success: true };
    })
});
