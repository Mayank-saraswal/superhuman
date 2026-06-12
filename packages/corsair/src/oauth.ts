import { generateOAuthUrl, processOAuthCallback } from "corsair/oauth";
import { db, corsairAccounts, corsairIntegrations, eq } from "@superhuman/database";
import { corsairClient } from "./client";

/**
 * Plugins that use OAuth 2.0 (and therefore support the connect-link flow).
 * Plugins like Slack and Linear authenticate with API keys instead.
 */
export const OAUTH_PLUGINS = ["gmail", "googlecalendar", "notion"] as const;
export type OAuthPlugin = (typeof OAUTH_PLUGINS)[number];

export function isOAuthPlugin(plugin: string): plugin is OAuthPlugin {
  return (OAUTH_PLUGINS as readonly string[]).includes(plugin);
}

/**
 * Builds a provider authorization URL for a tenant to connect a plugin account.
 *
 * @param plugin     - The plugin id (e.g. "gmail", "googlecalendar").
 * @param tenantId   - The stable tenant identifier (we use the Clerk user id).
 * @param redirectUri - The callback URL Corsair redirects to after approval.
 * @returns The authorization `url` and the HMAC-signed `state` token.
 */
export async function createConnectUrl(plugin: string, tenantId: string, redirectUri: string) {
  return generateOAuthUrl(corsairClient, plugin, { tenantId, redirectUri });
}

/**
 * Completes the OAuth flow: exchanges the authorization code for tokens and
 * persists them (encrypted) for the tenant.
 *
 * @returns The `plugin` that was connected and the `tenantId` it was stored under.
 */
export async function completeConnect(options: { code: string; state: string; redirectUri: string }) {
  return processOAuthCallback(corsairClient, options);
}

/**
 * Reads the real connection status for a tenant straight from the Corsair
 * account tables. A plugin is "connected" when at least one account row exists
 * for that tenant + integration.
 */
export async function getConnectionStatus(tenantId: string) {
  const rows = await db
    .select({ name: corsairIntegrations.name })
    .from(corsairAccounts)
    .innerJoin(corsairIntegrations, eq(corsairAccounts.integrationId, corsairIntegrations.id))
    .where(eq(corsairAccounts.tenantId, tenantId));

  const connected = new Set(rows.map((r) => r.name));

  return {
    hasGmail: connected.has("gmail"),
    hasGoogleCalendar: connected.has("googlecalendar"),
    hasSlack: connected.has("slack"),
    hasNotion: connected.has("notion"),
    hasLinear: connected.has("linear"),
    connected: Array.from(connected),
  };
}
