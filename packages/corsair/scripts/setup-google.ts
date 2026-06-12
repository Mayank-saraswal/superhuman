/**
 * Registers the Google OAuth client credentials (shared across all tenants)
 * for the Gmail and Google Calendar plugins in the Corsair database.
 *
 * Run with the root env loaded:
 *   npx dotenv -e ../../.env -- npx tsx scripts/setup-google.ts
 */
import { setupCorsair } from "corsair/setup";
import { corsairClient } from "../src/client";

async function main() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in the environment.");
  }

  const credentials = {
    gmail: { client_id: clientId, client_secret: clientSecret },
    googlecalendar: { client_id: clientId, client_secret: clientSecret },
  };

  const output = await setupCorsair(corsairClient as any, { credentials });
  console.log(output);
  console.log("\n✅ Google OAuth credentials registered for gmail + googlecalendar.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Setup failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
