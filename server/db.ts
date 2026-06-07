import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, giftcards, priceHistories, GiftCard, InsertGiftCard, PriceHistory, InsertPriceHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Gift Card Queries ───────────────────────────────────────────

export async function getAllGiftcards(): Promise<GiftCard[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get giftcards: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(giftcards)
      .orderBy(desc(giftcards.displayOrder), desc(giftcards.id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get giftcards:", error);
    return [];
  }
}

export async function createGiftcard(data: InsertGiftCard): Promise<GiftCard | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create giftcard: database not available");
    return null;
  }

  try {
    const result = await db.insert(giftcards).values(data);
    const id = result[0].insertId as number;
    const created = await db.select().from(giftcards).where(eq(giftcards.id, id)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create giftcard:", error);
    return null;
  }
}

export async function updateGiftcard(id: number, data: Partial<InsertGiftCard>): Promise<GiftCard | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update giftcard: database not available");
    return null;
  }

  try {
    await db.update(giftcards).set(data).where(eq(giftcards.id, id));
    const updated = await db.select().from(giftcards).where(eq(giftcards.id, id)).limit(1);
    return updated.length > 0 ? updated[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update giftcard:", error);
    return null;
  }
}

export async function deleteGiftcard(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete giftcard: database not available");
    return false;
  }

  try {
    const result = await db.delete(giftcards).where(eq(giftcards.id, id));
    // Check if any rows were affected
    return result[0].affectedRows > 0;
  } catch (error) {
    console.error("[Database] Failed to delete giftcard:", error);
    return false;
  }
}

export async function reorderGiftcards(orders: Array<{ id: number; displayOrder: number }>): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot reorder giftcards: database not available");
    return false;
  }

  try {
    for (const { id, displayOrder } of orders) {
      await db.update(giftcards).set({ displayOrder }).where(eq(giftcards.id, id));
    }
    return true;
  } catch (error) {
    console.error("[Database] Failed to reorder giftcards:", error);
    return false;
  }
}

// ─── Price History Queries ───────────────────────────────────────

export async function recordPriceChange(
  giftcardId: number,
  data: Omit<InsertPriceHistory, 'giftcardId'>
): Promise<PriceHistory | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record price change: database not available");
    return null;
  }

  try {
    const result = await db.insert(priceHistories).values({ giftcardId, ...data });
    const id = result[0].insertId as number;
    const created = await db.select().from(priceHistories).where(eq(priceHistories.id, id)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to record price change:", error);
    return null;
  }
}

export async function getPriceHistory(giftcardId: number, limit: number = 10): Promise<PriceHistory[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get price history: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(priceHistories)
      .where(eq(priceHistories.giftcardId, giftcardId))
      .orderBy(desc(priceHistories.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get price history:", error);
    return [];
  }
}
