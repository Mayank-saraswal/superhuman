import { TRPCError } from "@trpc/server";
import { tRPCContext } from "../trpc";

export const isAuthenticated = tRPCContext.middleware(({ ctx, next }) => {
  if (!ctx.userId || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not signed in" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      userId: ctx.userId,
      clerkId: ctx.clerkId,
    },
  });
});

export const isOnboarded = tRPCContext.middleware(({ ctx, next }) => {
  if (!ctx.userId || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not signed in" });
  }

  if (ctx.user.onboardingComplete !== true) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Complete onboarding first" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      userId: ctx.userId,
      clerkId: ctx.clerkId,
    },
  });
});
