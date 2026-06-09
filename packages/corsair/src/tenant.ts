import { corsairClient } from "./client";

/**
 * Retrieves a tenant helper configured for the specified user ID.
 * Every API call in the app to Corsair will go through this helper.
 * 
 * @param {string} userId - The unique identifier of the user (tenant).
 * @returns {object} The Corsair tenant client.
 */
export function getTenant(userId: string) {
  return corsairClient.withTenant(userId);
}
