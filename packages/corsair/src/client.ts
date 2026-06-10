import { createCorsair } from "corsair";

import { pool } from "@superhuman/database";
import { env } from "./env";
import { inngestClient } from "@superhuman/events";

// Plugins
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";
import { slack } from "@corsair-dev/slack";
import { notion } from "@corsair-dev/notion";
import { linear } from "@corsair-dev/linear";

/**
 * Singleton Corsair instance configured for self-hosted usage.
 */
export const corsairClient = createCorsair({
  database: pool,
  kek: env.CORSAIR_KEK,
  multiTenancy: true,
  plugins: [
    gmail({
      webhookHooks: {
        messageChanged: {
          before: async (ctx: any, args: any) => {
            if (!ctx.tenantId) {
              // Skip processing if there is no tenant attached
              return { ctx, args, continue: false };
            }
            return { ctx, args, continue: true, passToAfter: JSON.stringify(args.payload) };
          },
          after: async (ctx: any, response: any, passToAfter?: string) => {
            if (!passToAfter) return;
            const payload = JSON.parse(passToAfter);
            // Fire the Inngest event
            await inngestClient.send({
              name: "gmail/message.received",
              data: {
                messageId: payload.messageId,
                tenantId: ctx.tenantId,
                subject: payload.subject,
                from: payload.from,
                snippet: payload.snippet,
              },
            });
          },
        },
      },
    }),
    googlecalendar({
      webhookHooks: {
        onEventChanged: {
          before: async (ctx: any, args: any) => {
            if (!ctx.tenantId) return { ctx, args, continue: false };
            return { ctx, args, continue: true, passToAfter: JSON.stringify(args.payload) };
          },
          after: async (ctx: any, response: any, passToAfter?: string) => {
            if (!passToAfter) return;
            const payload = JSON.parse(passToAfter);
            await inngestClient.send({
              name: "calendar/event.changed",
              data: {
                eventId: payload.eventId,
                tenantId: ctx.tenantId,
                summary: payload.summary,
                start: payload.start,
              },
            });
          },
        },
      },
    }),
    slack(),
    notion(),
    linear(),
  ],
});
