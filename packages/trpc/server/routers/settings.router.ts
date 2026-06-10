import { z } from "zod";
import { router } from "../trpc";
import { protectedProcedure } from "../procedures";
import { getTenant } from "../utils/tenant";
import { setOnboardingComplete, updateUser } from "@superhuman/services";
import { corsairClient } from "@superhuman/corsair";


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
      if (!ctx.user.corsairTenantId) {
        return {
          hasGmail: false,
          hasGoogleCalendar: false,
          hasSlack: false
        };
      }

      return {
        hasGmail: true,
        hasGoogleCalendar: true,
        hasSlack: true
      };
    }),

  getConnectLink: protectedProcedure
    .query(async ({ ctx }) => {
      const url = `https://corsair.dev/connect?tenantId=${ctx.user.corsairTenantId || ctx.user.clerkId}`;
      return { url };
    }),

  completeOnboarding: protectedProcedure
    .mutation(async ({ ctx }) => {
      await setOnboardingComplete(ctx.user.clerkId);
      return { success: true };
    })
});
