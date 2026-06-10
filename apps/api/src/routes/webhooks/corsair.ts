import { webhookHandler } from "@superhuman/corsair";
import type { Request, Response } from "express";

/**
 * Handles incoming webhooks from Corsair.
 * Important: This route MUST receive the raw body (or a Buffer) to verify signatures correctly in production if Corsair uses signatures.
 * Note: express.raw({ type: "application/json" }) is already configured in server.ts specifically for this route
 * to ensure signature verification works.
 * Since Corsair's `webhookHandler` handles signature verifications, we pass req.headers and req.body.
 */
export async function handleCorsairWebhook(req: Request, res: Response) {
  try {
    const tenantId = req.query.tenant as string;
    if (!tenantId) {
      return res.status(400).json({ error: "Missing tenant query parameter" });
    }

    // Safely parse headers to Record<string, string>
    const safeHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") {
        safeHeaders[key] = value;
      } else if (Array.isArray(value)) {
        safeHeaders[key] = value.join(",");
      }
    }

    // Call the Corsair SDK's webhook handler
    const response = await webhookHandler({
      headers: safeHeaders,
      body: req.body, // express.raw() ensures this is a Buffer
      tenantId
    });

    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error("Error handling Corsair webhook:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
