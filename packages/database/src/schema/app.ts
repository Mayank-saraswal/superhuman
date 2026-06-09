import { pgTable, text, timestamp, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Users Table
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").unique().notNull(),
  name: text("name"),
  plan: text("plan").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  emailSummaries: many(emailSummaries),
  followUps: many(followUps),
  snippets: many(snippets),
  docs: many(docs),
  databases: many(databases),
}));

/**
 * Email Summaries Table
 */
export const emailSummaries = pgTable("email_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  gmailMessageId: text("gmail_message_id").notNull(),
  summary: text("summary").notNull(),
  draftReply: text("draft_reply"),
  classification: text("classification"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emailSummariesRelations = relations(emailSummaries, ({ one }) => ({
  user: one(users, {
    fields: [emailSummaries.userId],
    references: [users.id],
  }),
}));

/**
 * Follow Ups Table
 */
export const followUps = pgTable("follow_ups", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  gmailMessageId: text("gmail_message_id").notNull(),
  remindAt: timestamp("remind_at").notNull(),
  isSent: boolean("is_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const followUpsRelations = relations(followUps, ({ one }) => ({
  user: one(users, {
    fields: [followUps.userId],
    references: [users.id],
  }),
}));

/**
 * Snippets Table
 */
export const snippets = pgTable("snippets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  shortcut: text("shortcut").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  isShared: boolean("is_shared").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const snippetsRelations = relations(snippets, ({ one }) => ({
  user: one(users, {
    fields: [snippets.userId],
    references: [users.id],
  }),
}));

/**
 * Read Receipts Table
 */
export const readReceipts = pgTable("read_receipts", {
  id: uuid("id").primaryKey().defaultRandom(),
  gmailMessageId: text("gmail_message_id").notNull(),
  openedByEmail: text("opened_by_email").notNull(),
  device: text("device"),
  openedAt: timestamp("opened_at").defaultNow(),
});

/**
 * Docs Table
 */
export const docs = pgTable("docs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").default("Untitled"),
  content: jsonb("content").default({}),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const docsRelations = relations(docs, ({ one }) => ({
  user: one(users, {
    fields: [docs.userId],
    references: [users.id],
  }),
}));

/**
 * Databases Table
 */
export const databases = pgTable("databases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  name: text("name").notNull(),
  schema: jsonb("schema").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const databasesRelations = relations(databases, ({ one }) => ({
  user: one(users, {
    fields: [databases.userId],
    references: [users.id],
  }),
}));
