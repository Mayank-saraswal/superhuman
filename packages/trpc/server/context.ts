import { verifyToken } from "@clerk/backend";
import { getUserByClerkId } from "@superhuman/services";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * Creates the tRPC context.
 * We parse the Clerk session manually from the Authorization header 
 * so it works consistently across Express and Next.js environments.
 */
export async function createContext(opts: any) {
  let clerkId: string | null = null;
  let user = null;

  try {
    // Attempt to get token from standard Authorization header
    const authHeader = opts?.req?.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      clerkId = decoded.sub;
    } else if (opts?.req?.auth?.userId) {
      // Fallback if Clerk Express middleware is used
      clerkId = opts.req.auth.userId;
    }

    if (clerkId) {
      user = await getUserByClerkId(clerkId);
    }
  } catch (error) {
    // Invalid token, treat as unauthenticated
  }

  return {
    clerkId,
    user,
    userId: user?.id || null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
