import { db, users, eq } from "@superhuman/database";

/**
 * Retrieves a user by their Clerk ID.
 * @param clerkId - The unique Clerk ID.
 * @returns The user object or null if not found.
 */
export async function getUserByClerkId(clerkId: string) {
  const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  return result[0] || null;
}

/**
 * Retrieves a user by their Clerk ID or throws an error.
 * @param clerkId - The unique Clerk ID.
 * @returns The user object.
 * @throws Error if the user is not found.
 */
export async function getUserOrThrow(clerkId: string) {
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error(`User with Clerk ID ${clerkId} not found`);
  }
  return user;
}

/**
 * Creates a new user in the database.
 * @param data - The user data from Clerk.
 */
export async function createUser(data: { clerkId: string; email: string; name: string | null; imageUrl: string | null }) {
  const result = await db.insert(users).values({
    clerkId: data.clerkId,
    email: data.email,
    name: data.name,
    imageUrl: data.imageUrl,
  }).returning();
  return result[0] || null;
}

/**
 * Upserts a user in the database (creates if missing, updates if exists).
 * @param data - The user data from Clerk.
 */
export async function upsertUser(data: { clerkId: string; email: string; name: string | null; imageUrl: string | null }) {
  const result = await db.insert(users).values({
    clerkId: data.clerkId,
    email: data.email,
    name: data.name,
    imageUrl: data.imageUrl,
  }).onConflictDoUpdate({
    target: users.clerkId,
    set: {
      email: data.email,
      name: data.name,
      imageUrl: data.imageUrl,
      updatedAt: new Date(),
    }
  }).returning();
  return result[0] || null;
}

/**
 * Updates an existing user in the database.
 * @param clerkId - The unique Clerk ID.
 * @param data - Partial user data to update.
 */
export async function updateUser(clerkId: string, data: Partial<typeof users.$inferInsert>) {
  const result = await db.update(users).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(users.clerkId, clerkId)).returning();
  return result[0] || null;
}

/**
 * Marks a user's onboarding as complete.
 * @param clerkId - The unique Clerk ID.
 */
export async function setOnboardingComplete(clerkId: string) {
  return updateUser(clerkId, { onboardingComplete: true });
}

/**
 * Associates a Corsair Tenant ID with a user.
 * @param clerkId - The unique Clerk ID.
 * @param tenantId - The Corsair Tenant ID.
 */
export async function setCorsairTenantId(clerkId: string, tenantId: string) {
  return updateUser(clerkId, { corsairTenantId: tenantId });
}
