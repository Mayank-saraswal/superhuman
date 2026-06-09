import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Corsair Integrations Table
 */
export const corsairIntegrations = pgTable("corsair_integrations", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  name: text("name").notNull(),
  config: jsonb("config").notNull().default({}),
  dek: text("dek"),
});

export const corsairIntegrationsRelations = relations(corsairIntegrations, ({ many }) => ({
  accounts: many(corsairAccounts),
}));

/**
 * Corsair Accounts Table
 */
export const corsairAccounts = pgTable("corsair_accounts", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  tenantId: text("tenant_id").notNull(),
  integrationId: text("integration_id")
    .notNull()
    .references(() => corsairIntegrations.id),
  config: jsonb("config").notNull().default({}),
  dek: text("dek"),
});

export const corsairAccountsRelations = relations(corsairAccounts, ({ one, many }) => ({
  integration: one(corsairIntegrations, {
    fields: [corsairAccounts.integrationId],
    references: [corsairIntegrations.id],
  }),
  entities: many(corsairEntities),
  events: many(corsairEvents),
}));

/**
 * Corsair Entities Table
 */
export const corsairEntities = pgTable("corsair_entities", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  accountId: text("account_id")
    .notNull()
    .references(() => corsairAccounts.id),
  entityId: text("entity_id").notNull(),
  entityType: text("entity_type").notNull(),
  version: text("version").notNull(),
  data: jsonb("data").notNull().default({}),
});

export const corsairEntitiesRelations = relations(corsairEntities, ({ one }) => ({
  account: one(corsairAccounts, {
    fields: [corsairEntities.accountId],
    references: [corsairAccounts.id],
  }),
}));

/**
 * Corsair Events Table
 */
export const corsairEvents = pgTable("corsair_events", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  accountId: text("account_id")
    .notNull()
    .references(() => corsairAccounts.id),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull().default({}),
  status: text("status"),
});

export const corsairEventsRelations = relations(corsairEvents, ({ one }) => ({
  account: one(corsairAccounts, {
    fields: [corsairEvents.accountId],
    references: [corsairAccounts.id],
  }),
}));
