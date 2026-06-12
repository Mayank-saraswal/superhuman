import { z } from "zod";
import { router } from "../trpc";
import { protectedProcedure } from "../procedures";
import { getTenant } from "../utils/tenant";
import { setOnboardingComplete, updateUser } from "@superhuman/services";
import { getConnectionStatus } from "@superhuman/corsair";


export const settingsRouter = router({
  getSettings: protectedProcedure
    .query(async ({ ctx }) => {
      // User is already attached to ctx via auth middleware
      return ctx.user;
    }),

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      imageUrl: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return updateUser(ctx.user.clerkId, input);
    }),

  getIntegrations: protectedProcedure
    .query(async ({ ctx }) => {
      // The tenant id is the Clerk user id (set during the OAuth connect flow).
      const tenantId = ctx.user.corsairTenantId || ctx.user.clerkId;

      try {
        return await getConnectionStatus(tenantId);
      } catch (err) {
        console.error("Failed to fetch integrations", err);
        return {
          hasGmail: false,
          hasGoogleCalendar: false,
          hasSlack: false,
          hasNotion: false,
          hasLinear: false,
          connected: [] as string[],
        };
      }
    }),

  getConnectLink: protectedProcedure
    .input(z.object({ provider: z.string() }))
    .query(async ({ input }) => {
      // Same-origin route that kicks off the Corsair OAuth flow.
      return { url: `/api/connect?plugin=${encodeURIComponent(input.provider)}` };
    }),

  completeOnboarding: protectedProcedure
    .mutation(async ({ ctx }) => {
      await setOnboardingComplete(ctx.user.clerkId);
      return { success: true };
    })
});
