import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Gift card pricing table
 * Stores gift card information and current pricing
 */
export const giftcards = mysqlTable("giftcards", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  sellPrice: int("sellPrice").notNull().default(0),
  sellDiscount: int("sellDiscount").notNull().default(0), // stored as basis points (e.g., 350 = 3.5%)
  buyPrice: int("buyPrice").notNull().default(0),
  buyDiscount: int("buyDiscount").notNull().default(0), // stored as basis points
  note: text("note"),
  available: int("available").notNull().default(1), // 0 = false, 1 = true
  displayOrder: int("displayOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GiftCard = typeof giftcards.$inferSelect;
export type InsertGiftCard = typeof giftcards.$inferInsert;

/**
 * Price history table
 * Tracks changes to gift card pricing over time
 */
export const priceHistories = mysqlTable("priceHistories", {
  id: int("id").autoincrement().primaryKey(),
  giftcardId: int("giftcardId").notNull(),
  sellPrice: int("sellPrice").notNull(),
  sellDiscount: int("sellDiscount").notNull(),
  buyPrice: int("buyPrice").notNull(),
  buyDiscount: int("buyDiscount").notNull(),
  changedBy: varchar("changedBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PriceHistory = typeof priceHistories.$inferSelect;
export type InsertPriceHistory = typeof priceHistories.$inferInsert;