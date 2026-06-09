# Latest Changes

Here is a summary of the latest changes implemented in the **Superhuman** monorepo:

## 1. Corsair SDK Migration (Self-Hosted)
The entire `@superhuman/corsair` package has been successfully migrated from the hosted `@corsair-dev/app` SDK to the self-hosted core `corsair` SDK!
- **Database & Security**: Switched to a standard PostgreSQL `Pool` configured via `DATABASE_URL` using `createCorsairDatabase`, and enforced encryption with a `CORSAIR_KEK` (min 32-characters) securely validated with `zod`.
- **Modular Plugins**: Uninstalled `@corsair-dev/app` and individually installed the granular plugin packages (`@corsair-dev/gmail`, `@corsair-dev/googlecalendar`, `@corsair-dev/slack`, `@corsair-dev/notion`, `@corsair-dev/linear`) alongside the core `corsair` package.
- **Client Configuration**: Initialized `corsairClient` using `createCorsair({ ... })` with `multiTenancy: true` enabled for our multi-user SaaS.
- **Tenant API**: Created `src/tenant.ts` to export `getTenant(userId)`, seamlessly wrapping `corsairClient.withTenant(userId)` to ensure safe routing.
- **Native Webhooks**: Completely removed the custom routing and replaced it with `processWebhook()` in `src/webhooks.ts`. Webhook event bindings (`messageChanged` and `onEventChanged`) now exist natively inside the `gmail()` and `googlecalendar()` configurations using `before` and `after` hooks.

## 2. Git Repository Configuration
- **Repository Setup**: Initialized and pushed the entire workspace to the target remote: `https://github.com/Mayank-saraswal/superhuman.git`.
- **Branch Management**: Configured the tracking branch to be `main` and pushed the complete monorepo content.
- **Git Ignore**: Created `.gitignore` rules in the packages to untrack and ignore `node_modules`.

## 3. Shared TypeScript Configuration
- Removed the root `tsconfig.base.json`.
- Configured all three packages (`corsair`, `ai`, and `inngest`) to extend from the central `@repo/typescript-config/base.json` configuration package to enforce workspace-wide TypeScript standards.

## 4. AI & Inngest Integration
- **Events Layer**: Extracted all Inngest configuration and type maps into a new `@superhuman/events` package, completely eliminating the circular dependency between `corsair` and `inngest`.
- **AI SDK**: Validates `OPENAI_API_KEY` with Zod, and exports structured templates (`summarizeEmail`, `generateDraftReply`, `composeEmail`, `classifyEmail`, `rewriteInVoice`) running against `openai("gpt-4.1")` and the `generateText` helper from the Vercel AI SDK.
- **Inngest Background Jobs**: Handles `gmail/message.received` by generating an email summary and draft reply, and `calendar/event.changed` by triggering a Slack notification via the Corsair integration. Both perfectly hook into the new native Corsair webhooks!
