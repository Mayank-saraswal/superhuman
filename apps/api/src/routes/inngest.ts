import { serve } from "inngest/express";
import { inngestClient } from "@superhuman/events";
import { inngestFunctions } from "@superhuman/inngest";

export const inngestHandler = serve({
  client: inngestClient,
  functions: inngestFunctions
});
