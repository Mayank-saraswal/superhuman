import { corsairClient } from "@superhuman/corsair";
import { getUserOrThrow } from "@superhuman/services";
import { TRPCError } from "@trpc/server";

/**
 * Retrieves the Corsair tenant instance for a given user.
 * Throws TRPCError if the user is not found or has no tenant ID.
 */
export async function getTenant(clerkId: string) {
  try {
    const user = await getUserOrThrow(clerkId);
    if (!user.corsairTenantId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Corsair tenant not connected" });
    }
    return corsairClient.withTenant(user.corsairTenantId);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Failed to fetch user: ${message}` });
  }
}
