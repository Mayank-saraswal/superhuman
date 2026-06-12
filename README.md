# Chai Combinator: The Ultimate AI-Powered Email Client
**Comprehensive Architecture & Engineering Documentation**

---

## 1. Executive Summary
Chai Combinator is a cutting-edge, AI-native email client engineered specifically for modern teams, Indian founders, executives, and high-velocity sales professionals. Dubbed "Email at the speed of thought," it is fundamentally designed to minimize the time spent triaging, writing, and organizing emails, effectively saving users an estimated 4 hours every single week.

Unlike legacy email clients that simply display a chronological list of messages, Chai Combinator treats email as a deeply interactive, AI-assisted workspace. It features an integrated AI Composer that matches the user's unique tone, a Smart Inbox that automatically categorizes incoming mail into prioritized tabs (Important, Team, VIP), integrated Follow-up reminders to prevent dropped threads, and a collaborative Docs ecosystem that lives directly alongside email threads.

This document serves as the master engineering specification, detailing the entire frontend and backend architecture, database schema, design system, component hierarchy, and routing strategy.

---

## 2. Monorepo Architecture & Package Ecosystem
The project is built on **Turborepo**, providing a highly scalable, modular monorepo structure. This allows strict boundary enforcement between the frontend presentation, backend APIs, background workers, and shared utilities.

### 2.1. Applications (`apps/`)
- **`apps/web`**: The flagship frontend application. Built on **Next.js 16.1.0 (App Router)**, it handles everything from the public marketing site to the complex, deeply interactive email client interface. It heavily utilizes React Server Components for initial load performance and Client Components for rich interactivity (like the email composer and Command Palette).
- **`apps/api`**: A dedicated backend service. While Next.js handles many API routes natively via tRPC, a separate API application is available for handling heavy webhooks, dedicated processing, and interfacing with the background job queue (Inngest).

### 2.2. Internal Packages (`packages/`)
- **`@superhuman/database`**: The single source of truth for all data models. Built using **Drizzle ORM** targeting a PostgreSQL database. It exports strongly-typed schemas and relations used across the entire monorepo.
- **`@superhuman/trpc`**: Contains the end-to-end typesafe API routers. This package defines the contracts between the Next.js frontend and the database/services, ensuring that any change in the backend schema instantly triggers a TypeScript error in the frontend if not accounted for.
- **`@superhuman/ai`**: The core intelligence layer. It wraps the Vercel AI SDK and OpenAI to provide specialized functions like `generateDraftReply`, `summarizeThread`, and `classifyEmail`.
- **`@superhuman/corsair`**: The integration layer. Handles OAuth tokens, API limits, and webhook subscriptions for third-party services like Gmail, Slack, Google Calendar, and Notion.
- **`@superhuman/inngest` & `@superhuman/events`**: The background processing engine. Handles asynchronous, reliable job execution such as bulk email ingestion, syncing read receipts, and triggering scheduled follow-ups without blocking the main web threads.
- **`@superhuman/services`**: Shared business logic that doesn't strictly belong in a tRPC route. This includes user provisioning logic, Clerk webhooks, and billing management.
- **Tooling Packages**: `@superhuman/logger`, `@superhuman/eslint-config`, and `@superhuman/typescript-config` ensure consistent code quality and runtime observability across all workspaces.

---

## 3. Frontend Architecture (Next.js App Router)
The frontend is meticulously organized using Next.js Route Groups, creating logical boundaries between different user contexts without affecting the URL structure.

### 3.1. `(marketing)`
The public face of Chai Combinator. Optimized for maximum conversion and SEO performance.
- **`layout.tsx`**: Injects the global Navbar and Footer. Sets up OpenGraph metadata and SEO keywords.
- **`page.tsx`**: The main landing page. It orchestrates a narrative flow starting with the Hero section, validating with the LogoBar, explaining with the FeatureGrid and Deep Feature Sections, providing social proof via Testimonials, detailing costs in Pricing, answering doubts in FAQ, and capturing leads in the FinalCTA.

### 3.2. `(auth)`
Handles user authentication and session management.
- **`/login` & `/signup`**: Wraps Clerk's highly customizable authentication components within the dark, premium aesthetic of the application. Fallback redirects automatically route users to `/mail` or `/onboarding` depending on their state.

### 3.3. `(onboarding)`
The critical first-run experience for new users.
- **`/onboarding/welcome`**: A brief introductory screen establishing the brand tone.
- **`/onboarding/connect`**: The core integration step. Prompts users to authorize Gmail and Google Calendar via OAuth. This step triggers the background ingestion of their recent emails.
- **`/onboarding/complete`**: A satisfying success screen that transitions the user into their populated inbox.

### 3.4. `(app)`
The core, authenticated application workspace. 
- **`layout.tsx`**: The structural shell. It renders the global `Sidebar` for navigation and mounts the hidden `CommandPalette` (Cmd+K) which listens for keyboard shortcuts globally. It also enforces strict authentication checks, redirecting unauthenticated users to `/login`.
- **`/mail`**: The primary Inbox interface. It features a three-pane layout: Sidebar (navigation), Email List (triaged by tabs like Important, Team, VIP), and the Reading Pane (displaying the thread, AI summaries, and the quick-reply composer).
- **`/mail/compose`**: A dedicated, distraction-free writing environment utilizing TipTap for rich text editing, complete with AI compose actions.
- **`/calendar` & `/docs`**: Integrated productivity tools living alongside the inbox.
- **`/go`**: An experimental AI agent interface where users can issue natural language commands like "Summarize my inbox from today" or "Follow up with investors."
- **`/search`**: A global search interface for quickly finding emails, attachments, and docs.
- **`/settings`**: User configuration, billing, and integration management.

---

## 4. UI Design System & Theming
Chai Combinator is designed to feel instantly premium, fast, and sophisticated. It eschews standard corporate software aesthetics in favor of a "liquid glass," deeply immersive dark mode.

### 4.1. Tailwind CSS v4 Global Variables
The application exclusively uses Tailwind CSS v4, taking advantage of the new `@theme inline` syntax to define CSS variables natively without needing a bloated `tailwind.config.ts`.

The color palette is strictly enforced as a **permanent Dark Mode**. There is no light mode fallback, ensuring the brand identity remains consistent.
- **`--color-background: #0A0A0A`**: A very deep, true black used for the absolute base of the application.
- **`--color-surface: #141414`**: Used for cards, panels, and standard UI surfaces.
- **`--color-surface-elevated: #1F1F1F`**: Used for hover states, active selections, and floating menus.
- **`--color-border: #27272A`**: A subtle, low-contrast border color that separates elements without drawing attention.
- **`--color-text-primary: #FAFAFA`**: Off-white for maximum readability without the harshness of pure `#FFFFFF`.
- **`--color-text-secondary: #A1A1AA`**: Used for metadata, timestamps, and secondary descriptions.
- **`--color-text-muted: #71717A`**: Used for placeholder text and disabled states.
- **`--color-accent: #FAFAFA`**: The primary accent color for active states.
- **Brand Call-to-Action**: The vibrant orange (`#FB923C`) is used sparingly, primarily for the "Get early access" buttons, drawing the eye immediately.

### 4.2. Typography
The application uses **Aleo** (a contemporary slab serif) as the primary font for headings and reading panes. This evokes an editorial, high-quality reading experience similar to reading a premium newspaper, rather than a sterile software tool. It is paired with **Host Grotesk** or system sans-serifs for dense UI elements like timestamps and small labels.

### 4.3. Advanced Visual Effects
- **Liquid Glassmorphism**: Traditional glassmorphism just uses `backdrop-filter: blur()`. Chai Combinator goes further by utilizing a hidden SVG filter (`#liquid-glass-distortion`) mounted at the root layout. This filter uses `feTurbulence` and `feDisplacementMap` to create a physically accurate, refractive distortion effect behind elements like the Navbar and active buttons, mimicking real liquid glass.
- **Hexagon Pattern Background**: Instead of a flat black background, the entire application sits on top of a dynamic `<HexagonPattern>`. This is an SVG pattern masked by a CSS `radial-gradient`, ensuring it fades out smoothly toward the edges. Certain hexagons randomly highlight, creating a subtle "breathing" effect that makes the application feel alive.
- **Framer Motion**: Elements do not simply appear; they gracefully slide and fade into view. Scroll-triggered animations (`useInView`) reveal marketing sections sequentially, and layout animations ensure that shifting between inbox tabs feels instant and fluid.

---

## 5. Component Deep Dive: Marketing & UI

### 5.1. `Hero.tsx`
The entry point. It features a bold, massive serif headline ("Email at the speed of thought.") and utilizes Framer Motion to stagger the entrance of the eyebrow text, headline, subtext, and CTA buttons. Crucially, it embeds the `InboxMockup`, giving users an immediate visual understanding of the product.

### 5.2. `InboxMockup.tsx`
A meticulously crafted SVG-based mockup of the actual application. Instead of using heavy PNG screenshots that degrade on retina displays, the mockup is rendered entirely in SVG. It highlights the smart inbox tabs (Important, Team, VIP), the AI Summary banner, and the AI Draft Reply functionality, providing a lightweight, infinitely scalable preview.

### 5.3. `FeatureSection.tsx`
A highly reusable component used to explain deep features like the "AI Composer" and "Smart Inbox." It alternates the image placement (left/right) based on props and uses Framer Motion to slide the text in from the bottom and the image in from the side as the user scrolls.

### 5.4. `ResizableNavbar.tsx` & `LiquidGlass.tsx`
The Navbar is sticky and dynamic. As the user scrolls down the marketing page, the Navbar smoothly shrinks in height and increases its border radius, settling into a "pill" shape at the top of the screen. It utilizes the `variant="glass"` button which references the SVG displacement filter for its background.

---

## 6. Backend & Database Architecture

### 6.1. Drizzle ORM Schema (`app.ts`)
The database is heavily normalized and strictly typed.
- **`users`**: The core table. Links the `clerkId` from the authentication provider to local data. Tracks `onboardingComplete` to ensure users don't access the inbox before connecting their Gmail.
- **`emailSummaries`**: The caching layer for AI. When an email is received, Inngest triggers an AI classification job. The resulting `summary`, `classification` (e.g., "Important", "Newsletter"), and `draftReply` are stored here, keyed by `gmailMessageId` and `userId`.
- **`followUps`**: Powers the "Remind me" feature. Stores the `remindAt` timestamp. A background cron job constantly sweeps this table; when `remindAt` passes and `isSent` is false, it pushes a notification to the user or bumps the thread in the UI.
- **`snippets`**: The text-expansion feature. Stores `shortcut` (e.g., `/intro`) and `content`.
- **`readReceipts`**: When sending an email, Chai Combinator injects a tracking pixel. This table records every time that pixel is requested, logging the `openedByEmail`, `device`, and `openedAt` timestamp.

### 6.2. The tRPC Layer
tRPC provides end-to-end type safety between the Next.js client and the backend.
- **`trpc.mail.getInbox`**: Fetches emails. It handles pagination and filtering based on the Smart Inbox tabs. It heavily utilizes Prisma/Drizzle joins to attach the `aiSummary` to the raw email metadata in a single query.
- **`trpc.mail.getThread`**: Fetches the full history of an email thread, including the raw HTML body (sanitized via DOMPurify on the client) and any pre-computed `draftReply`.
- **`trpc.mail.sendEmail`**: Takes the `to`, `subject`, and `body` from the TipTap editor, validates it via Zod, and dispatches it to the Gmail API via the Corsair integration layer.

### 6.3. Background Processing (Inngest)
Handling email is extremely asynchronous. If a user receives 50 emails while offline, generating AI summaries for all 50 synchronously would crash the server or hit timeout limits.
Instead, Chai Combinator uses **Inngest**. When the Gmail webhook fires, it pushes an event to Inngest. Inngest then manages a durable queue, spinning up serverless functions to fetch the email content, call OpenAI, and save the result to `emailSummaries`. If OpenAI rate-limits the request, Inngest automatically retries with exponential backoff.

---

## 7. User Flows & Interactions

### 7.1. The "Command+K" Global Palette
At any point, a user can press `Cmd+K` (or `Ctrl+K`) to open the `CommandPalette.tsx`. This component, built on top of `cmdk`, intercepts keystrokes and provides instant navigation. It allows users to jump between the Inbox, Calendar, Docs, or initiate a search without touching the mouse. This is the cornerstone of the "Keyboard-first" philosophy.

### 7.2. The Compose Flow
Clicking "Compose" opens `/mail/compose`. This uses the TipTap rich text editor. The interface is deliberately stripped back—no complex toolbars cluttering the view. A subtle bottom bar offers AI assistance ("AI Compose"). Users can type `/` to instantly open a dropdown of their saved `snippets`. When the user clicks "Send", a tRPC mutation fires, optimistic UI immediately closes the compose window, and a toast notification confirms success.

### 7.3. The Search Experience
The `/search` route provides a full-page search experience. Unlike Gmail's small search bar, Chai Combinator dedicates the entire screen to search, understanding that finding old information is a primary use case. It searches across email subjects, bodies, AI summaries, and integrated Docs simultaneously.

---

## 9. Exhaustive Frontend Deep Dive

### 9.1. Comprehensive Color Token Mapping
The Superhuman clone operates on an exclusive, permanent dark mode design system. This isn't a simple inverted light theme; it is a meticulously crafted palette engineered to reduce eye strain for power users staring at screens for 10+ hours a day.

**Core Backgrounds & Surfaces**
- **`--color-background` (`#0A0A0A`)**: The absolute base layer. Used for the global `<body>` and `<html>` tags. It provides the canvas upon which the Hexagon Pattern rests.
- **`--color-surface` (`#141414`)**: The primary component background. Used for individual email rows in the inbox, the settings panel backgrounds, and the interior of the compose window. It is specifically `#141414` because it provides exactly 1.5% lightness difference from the background, creating depth without harsh borders.
- **`--color-surface-elevated` (`#1F1F1F`)**: Used for the deepest states of interaction—hovering over an email row, the `Cmd+K` command palette background, and active dropdown menus.

**Typography Tokens**
- **`--color-text-primary` (`#FAFAFA`)**: Used for unread email senders, email subjects, and primary headings. It is 98% white, preventing the harsh blooming effect of pure `#FFFFFF` on OLED screens.
- **`--color-text-secondary` (`#A1A1AA`)**: A cool-toned gray used for email body previews, standard UI labels, and inactive navigation links.
- **`--color-text-muted` (`#71717A`)**: Used for extremely low-priority information like timestamps, read receipt metadata, and disabled states.

**Brand & Interactive Accents**
- **Brand Call-To-Action (`#FB923C`)**: A vibrant, energetic orange. It is used exclusively in the marketing funnel (e.g., "Get early access" buttons) and never inside the core inbox application, preserving the inbox as a calm, distraction-free zone.
- **Success (`#4ADE80`)**: Used when a third-party integration (like Gmail or Slack) connects successfully during onboarding.
- **Danger (`#F87171`)**: Used for destructive actions, like archiving an entire thread or deleting a snippet.

### 9.2. Typography System
The typography system relies on a dual-font strategy:
1. **Aleo (Serif)**: Sourced from Google Fonts, Aleo is a contemporary slab serif. It is used for all major headings (`<h1>` to `<h3>`), the main marketing copy, email subjects, and the actual reading pane of the email. This mimics the feeling of reading a high-quality editorial publication, establishing a premium brand identity.
2. **Geist Sans / Host Grotesk (Sans-Serif)**: Used for dense, data-heavy UI components. The sidebar navigation, unread badges, timestamps, and setting toggles use a highly legible sans-serif. This ensures that utility components remain scannable at small sizes (down to 10px).
3. **JetBrains Mono (Monospace)**: Used exclusively for keyboard shortcut indicators (e.g., `⌘K`, `G I`) to visually separate them from standard text.

### 9.3. Micro-Interactions & Animation (Framer Motion)
Every interaction in the frontend is softened by `framer-motion` to provide physical weight and responsiveness.
- **Staggered Entrances**: When navigating to the `(marketing)` page, the `Hero.tsx` components do not appear simultaneously. The eyebrow text appears first, followed by the headline 100ms later, the subtext 200ms later, and the buttons 300ms later. This guides the user's eye down the funnel.
- **Layout Transitions**: When switching between Smart Inbox tabs (e.g., Important to Team), the email list doesn't snap. It uses `layoutId` animations to gracefully slide the active indicator under the new tab, while the list fades via opacity and a 10px vertical translation.
- **Tooltip Snapping**: Hovering over utility icons (like Archive or Snooze) triggers custom Radix UI tooltips that bounce slightly upon appearance, utilizing a custom spring physics configuration (`type: "spring", bounce: 0.25`).

### 9.4. Page-by-Page Breakdown

**`(marketing)/page.tsx`**
- **Hero & Navbar**: Features a sticky, responsive navigation bar that morphs into a pill shape on scroll.
- **Feature Sections**: Utilizes alternating layout patterns. The text scrolls normally, but the SVG illustrations employ a subtle parallax effect.
- **LogoBar**: An infinite marquee animation powered by raw CSS `@keyframes`, ensuring 60fps performance without JavaScript overhead.

**`(app)/mail/page.tsx` (The Inbox)**
- **Left Pane (Navigation)**: A 220px fixed sidebar. Includes the user profile, search trigger, and folder navigation.
- **Middle Pane (Triaged List)**: A 380px scrollable column. It implements virtualized scrolling (or highly optimized DOM rendering) to ensure scrolling through 1,000+ emails remains buttery smooth. Unread emails feature a 2px solid white left border for instant visual parsing.
- **Right Pane (Reading Environment)**: Takes up the remaining flex space. It hides all controls until hovered. The AI summary sits pinned to the top of the thread in a visually distinct, slightly lighter surface (`#141414`), while the actual email bodies are sanitized using `DOMPurify` and injected securely.

**`(app)/go/page.tsx` (AI Agent Workspace)**
- Designed to look like a terminal mixed with a chat interface. It uses a massive, centered input field that auto-focuses on load. When the user types a command, the interface transitions smoothly into a conversational timeline.

**`(onboarding)/connect/page.tsx`**
- A highly polished, gamified setup flow. As users connect Gmail, Slack, and Notion, the UI cards transition their borders from `--color-border` to `--color-success/40`, and a bright green checkmark animates into view. A progress bar tracks their completion state.

---

## 10. Backend Architecture & System Design Deep Dive

### 10.1. Event-Driven Asynchronous Processing (Inngest)
The fundamental challenge of a modern AI email client is latency. Processing 50 incoming emails synchronously through an LLM to generate summaries and draft replies would result in extreme timeouts and UI freezes. Chai Combinator solves this by utilizing a strictly asynchronous, event-driven architecture powered by **Inngest**.

1. **Webhook Ingestion**: When a new email arrives in the user's Gmail, Google Pub/Sub fires a webhook to the `apps/api` endpoint.
2. **Event Publishing**: The API server immediately returns a `200 OK` to Google to prevent webhook timeouts. It then publishes an event (e.g., `email.received`) to the Inngest broker via the `@superhuman/events` package.
3. **Durable Execution**: The `@superhuman/inngest` worker picks up the job. If the OpenAI API rate-limits the summarization request, or if the database connection drops, Inngest automatically pauses the execution and retries with exponential backoff. This guarantees zero data loss during high-volume email spikes.

### 10.2. The Corsair Integration Engine
Instead of scattering integration logic (OAuth, Token Refreshing, API calls) throughout the app, Chai Combinator isolates all third-party communication inside the `@superhuman/corsair` package.
- **Tenant Management**: Every user has a `corsairTenantId`. This ID maps to an encrypted vault where OAuth refresh tokens for Gmail, Slack, Notion, and Google Calendar are securely stored.
- **Unified API Surface**: The frontend never directly talks to the Google APIs. It requests data from Corsair, which handles the complex pagination, thread threading logic, and base64 decoding required by the raw Gmail API, returning clean, sanitized JSON to the frontend.

### 10.3. End-to-End Type Safety (tRPC & Drizzle)
The platform ensures that a database change perfectly propagates to the UI without the need for manual Swagger generation or arbitrary REST types.
- **Drizzle ORM (`@superhuman/database`)**: Schemas are defined in TypeScript. Migrations are generated automatically. This ensures that every query run on the PostgreSQL database is type-checked at compile time.
- **tRPC (`@superhuman/trpc`)**: The backend exposes `query` and `mutation` procedures via a tRPC AppRouter. If the `emailSummaries` table drops the `draftReply` column, the TypeScript compiler will immediately fail the build on the frontend `(app)/mail/page.tsx` file wherever `draftReply` is referenced. This eliminates a massive category of runtime errors.

### 10.4. AI Processing Pipeline
The intelligence layer (`@superhuman/ai`) sits between the Corsair engine and the Database.
- **Classification Engine**: Every incoming email is passed through a lightweight LLM prompt optimized for speed. It returns a strict JSON object (enforced via Zod function calling) categorizing the email as `IMPORTANT`, `TEAM`, `VIP`, `MARKETING`, or `SOCIAL`. This bypasses traditional keyword filtering, allowing the system to understand nuance (e.g., a newsletter *about* your team vs an email *from* your team).
- **Draft Generation**: When the user clicks "AI Compose", the backend fetches the last 5 emails in the thread for context, along with user-defined constraints from the `snippets` table, and streams the drafted reply directly to the TipTap editor via Vercel AI SDK's `useCompletion` hook.

---

## 11. Conclusion
Chai Combinator is not merely a reskinned Gmail. It is a deeply integrated, high-performance productivity layer built on a robust, modern stack. From the strict TypeScript backend and durable Inngest job queues to the fluid, Framer Motion-powered liquid glass frontend, every technical decision serves the ultimate goal: providing an unparalleled, lightning-fast email experience.
