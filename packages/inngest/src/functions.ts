import { inngestClient as inngest } from "@superhuman/events";
import { summarizeEmail, generateDraftReply } from "@superhuman/ai";
import { getTenant } from "@superhuman/corsair";

/**
 * Handles incoming Gmail messages, summarizes them, and generates a draft reply.
 */
export const onMessageReceived = inngest.createFunction(
  { id: "process-gmail-message" },
  { event: "gmail/message.received" },
  async ({ event, step }) => {
    const { subject, from, tenantId, messageId, snippet } = event.data;

    // We pass `snippet` as `body` because Corsair's webhook payload
    // gives us `snippet` rather than the full body in this simplified architecture.
    const bodyText = snippet;

    const summary = await step.run("summarize-email", async () => {
      return await summarizeEmail(subject, bodyText, from);
    });

    const draft = await step.run("generate-draft-reply", async () => {
      // Hardcoded voice context for now, this would usually come from a DB
      const userVoiceContext = "Friendly, professional, and concise.";
      return await generateDraftReply(subject, bodyText, from, userVoiceContext);
    });

    await step.run("save-to-database", async () => {
      // Mock saving to DB since the database package is not fleshed out yet.
      console.log(`Saved email ${messageId} for tenant ${tenantId}`);
      console.log(`Summary: ${summary}`);
      console.log(`Draft: ${draft}`);
    });
  }
);

/**
 * Checks if a followup is needed for an email.
 * This could be triggered by another workflow after a delay.
 */
export const checkFollowUp = inngest.createFunction(
  { id: "check-gmail-followup" },
  { event: "gmail/followup.check" },
  async ({ event, step }) => {
    // In a real application, we'd check the DB. Mocking the check.
    const gotReply = await step.run("check-reply-status", async () => {
      // Mock logic: assume no reply
      return false;
    });

    if (!gotReply) {
      await step.run("send-reminder", async () => {
        console.log("Sending followup reminder to user...");
      });
    }
  }
);

/**
 * Reacts to calendar event changes and notifies the tenant via Slack.
 */
export const onCalendarEventChanged = inngest.createFunction(
  { id: "notify-calendar-change" },
  { event: "calendar/event.changed" },
  async ({ event, step }) => {
    const { tenantId, eventId } = event.data;

    await step.run("notify-slack", async () => {
      const tenant = getTenant(tenantId);
      // We assume Corsair provides a Slack integration method `postMessage`
      // or similar, but for now we just log since it's an abstract integration layer.
      console.log(`Notifying Slack for tenant ${tenantId} about event ${eventId}`);
    });
  }
);

/**
 * Runs every Monday at 9 AM to fetch open Linear issues and post a digest to Slack.
 */
export const linearDigestCron = inngest.createFunction(
  { id: "linear-weekly-digest" },
  { cron: "0 9 * * 1" }, // Every Monday at 9:00 AM
  async ({ step }) => {
    // In a multi-tenant app, we'd loop through all active tenants.
    // We'll mock processing for a single test tenant for now.
    const tenantId = "test-tenant-123";

    const issues = await step.run("fetch-linear-issues", async () => {
      const tenant = getTenant(tenantId);
      // Mock fetching issues
      return ["Issue 1: Fix bug", "Issue 2: Implement feature"];
    });

    await step.run("post-slack-digest", async () => {
      const tenant = getTenant(tenantId);
      // Mock posting digest to Slack
      console.log(`Posting digest of ${issues.length} issues to Slack for tenant ${tenantId}`);
    });
  }
);
