import { processWebhook } from "corsair";
import { corsairClient } from "./client";

export interface WebhookRequest {
  /** Incoming HTTP headers, normalized to a string map. */
  headers: Record<string, string>;
  /** Raw or parsed request body. Strings/Buffers are JSON-parsed when possible. */
  body: unknown;
  /** Query string params. `tenantId` is used by Corsair for multi-tenant routing. */
  query?: Record<string, string | undefined>;
}

export interface WebhookHandlerResult {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
}

/**
 * Framework-agnostic webhook handler for incoming Corsair plugin events.
 *
 * Pass the request's headers, body, and query (including `?tenantId=...` for
 * multi-tenant routing). Internal routing and the messageChanged / onEventChanged
 * hooks are configured on the corsairClient.
 */
export async function webhookHandler(req: WebhookRequest): Promise<WebhookHandlerResult> {
  // Normalize the body: Corsair's processWebhook accepts a string or object.
  let body: unknown = req.body;
  if (Buffer.isBuffer(body)) {
    body = body.toString("utf8");
  }
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      // leave as raw string; processWebhook can still match by headers
    }
  }

  const query = req.query ?? {};

  const result = await processWebhook(
    corsairClient as any,
    req.headers,
    body as any,
    query as any
  );

  if (!result.plugin) {
    // No plugin matched — acknowledge so the provider doesn't retry forever.
    return { status: 200, body: { ok: true } };
  }

  const response = result.response;
  return {
    status: response?.statusCode ?? (response?.success === false ? 500 : 200),
    body: response?.returnToSender ?? { ok: true },
    headers: result.responseHeaders,
  };
}
