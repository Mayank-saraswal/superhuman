import { Inngest, EventSchemas } from "inngest";
import { SuperhumanEvents } from "./types";
import { env } from "./env";

export const inngestClient = new Inngest({
  id: "superhuman",
  schemas: new EventSchemas().fromRecord<SuperhumanEvents>(),
  eventKey: env.INNGEST_EVENT_KEY,
});
