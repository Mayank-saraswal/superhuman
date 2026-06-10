import { router } from "../trpc";
import { healthRouter } from "./health.router";

import { mailRouter } from "./mail.router";
import { aiRouter } from "./ai.router";
import { calendarRouter } from "./calendar.router";
import { snippetsRouter } from "./snippets.router";
import { docsRouter } from "./docs.router";
import { settingsRouter } from "./settings.router";

export const appRouter = router({
  health: healthRouter,

  mail: mailRouter,
  ai: aiRouter,
  calendar: calendarRouter,
  snippets: snippetsRouter,
  docs: docsRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
