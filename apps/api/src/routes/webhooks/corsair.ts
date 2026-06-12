import { webhookHandler } from "@superhuman/corsair";
import type { Request, Response } from "express";

/**
 * Handles incoming webhooks from Corsair.
 *
 * The route is mounted with `express.raw({ type: "application/json" })` in
 * server.ts so `req.body` arrives as a Buffer — this preserves the exact bytes
 * needed for any signature verification Corsair performs internally.
 *
 * Multi-tenant routing relies on the `?tenantId=<id>` query param that we
 * include when registering webhooks with each provider.
 */
export async function handleCorsairWebhook(req: Request, res: Response) {
  try {
    // Normalize headers to a plain string map.
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") {
        headers[key] = value;
      } else if (Array.isArray(value)) {
        headers[key] = value.join(",");
      }
    }

    // Normalize query params (Corsair reads `tenantId` from here).
    const query: Record<string, string | undefined> = {};
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === "string") {
        query[key] = value;
      } else if (Array.isArray(value) && typeof value[0] === "string") {
        query[key] = value[0] as string;
      }
    }

    const result = await webhookHandler({
      headers,
      body: req.body, // Buffer thanks to express.raw()
      query,
    });

    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value);
      }
    }

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Error handling Corsair webhook:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
