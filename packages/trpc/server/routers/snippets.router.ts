import { z } from "zod";
import { router } from "../trpc";
import { protectedProcedure } from "../procedures";
import { TRPCError } from "@trpc/server";
import { db, snippets, eq, and, ilike, or } from "@superhuman/database";

export const snippetsRouter = router({
  getSnippets: protectedProcedure
    .query(async ({ ctx }) => {
      return db.select().from(snippets).where(eq(snippets.userId, ctx.user.id));
    }),

  createSnippet: protectedProcedure
    .input(z.object({
      shortcut: z.string().startsWith("/"),
      title: z.string().optional(),
      content: z.string(),
      isShared: z.boolean().optional().default(false)
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(snippets).values({
        userId: ctx.user.id,
        shortcut: input.shortcut,
        title: input.title,
        content: input.content,
        isShared: input.isShared
      }).returning();
      return result[0];
    }),

  updateSnippet: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      shortcut: z.string().startsWith("/").optional(),
      isShared: z.boolean().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.select().from(snippets).where(and(
        eq(snippets.id, input.id),
        eq(snippets.userId, ctx.user.id)
      )).limit(1);

      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Snippet not found or unauthorized" });
      }

      const result = await db.update(snippets).set({
        ...input,
      }).where(eq(snippets.id, input.id)).returning();

      return result[0];
    }),

  deleteSnippet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.select().from(snippets).where(and(
        eq(snippets.id, input.id),
        eq(snippets.userId, ctx.user.id)
      )).limit(1);

      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Snippet not found or unauthorized" });
      }

      await db.delete(snippets).where(eq(snippets.id, input.id));
      return { success: true };
    }),

  searchSnippet: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      const q = `%${input.query}%`;
      return db.select().from(snippets).where(and(
        eq(snippets.userId, ctx.user.id),
        or(
          ilike(snippets.shortcut, q),
          ilike(snippets.title, q)
        )
      ));
    })
});
