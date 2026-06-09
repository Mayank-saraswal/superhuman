import { processWebhook } from "corsair";
import { corsairClient } from "./client";

/**
 * Handles incoming webhooks from Corsair plugins and routes them.
 * The internal routing and hooks are configured in the corsairClient.
 * 
 * @param {Request} request - The incoming standard web Request object.
 * @returns {Promise<Response>} The HTTP Response.
 */
export async function webhookHandler(request: Request): Promise<Response> {
  const headers = Object.fromEntries(request.headers.entries());
  
  // Try parsing the body, but fallback to raw text if it's not JSON
  let body: any;
  let rawText = "";
  try {
    rawText = await request.text();
    body = JSON.parse(rawText);
  } catch {
    body = rawText;
  }

  // Get the URL search params if any
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());

  // Use the corsair processWebhook helper to handle the routing
  const result = await processWebhook(corsairClient, headers, body, query);

  if (!result.plugin) {
    // If no plugin matched, just return 200 OK to acknowledge the webhook safely
    return new Response("OK", { status: 200 });
  }

  return new Response(JSON.stringify(result.response?.returnToSender || {}), { 
    status: result.response?.statusCode || (result.response?.success === false ? 500 : 200),
    headers: result.responseHeaders
  });
}
