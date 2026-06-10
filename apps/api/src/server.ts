import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { appRouter, createContext } from "@superhuman/trpc/server";
import { inngestHandler } from "./routes/inngest";
import { handleCorsairWebhook } from "./routes/webhooks/corsair";

import { env } from "./env";

export const app = express();

const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Superhuman OpenAPI",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

// Configure CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Mount webhooks and inngest BEFORE express.json()
app.post("/api/webhooks/corsair", express.raw({ type: "application/json" }), handleCorsairWebhook);
app.use("/api/inngest", express.json(), inngestHandler);

// Global JSON middleware
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Superhuman API is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ status: "ok", timestamp: Date.now() });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
