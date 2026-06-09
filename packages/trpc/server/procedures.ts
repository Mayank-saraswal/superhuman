import { publicProcedure } from "./trpc";
import { isAuthenticated, isOnboarded } from "./middleware/auth.middleware";

export { publicProcedure };

/**
 * A procedure that requires the user to be authenticated.
 */
export const protectedProcedure = publicProcedure.use(isAuthenticated);

/**
 * A procedure that requires the user to be authenticated AND have completed onboarding.
 */
export const onboardedProcedure = publicProcedure.use(isOnboarded);
