import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getAllGiftcards, createGiftcard, updateGiftcard, deleteGiftcard } from "./db";
import type { GiftCard } from "../drizzle/schema";

describe("Giftcards Database Operations", () => {
  let testGiftcardId: number | null = null;

  describe("Create", () => {
    it("should create a new giftcard", async () => {
      const result = await createGiftcard({
        name: "Test Gift Card",
        category: "테스트",
        sellPrice: 10000,
        sellDiscount: 50,
        buyPrice: 9500,
        buyDiscount: 45,
        note: "Test note",
        available: 1,
        displayOrder: 0,
      });

      expect(result).toBeDefined();
      expect(result?.name).toBe("Test Gift Card");
      expect(result?.sellPrice).toBe(10000);
      expect(result?.sellDiscount).toBe(50);

      if (result) {
        testGiftcardId = result.id;
      }
    });
  });

  describe("Read", () => {
    it("should retrieve all giftcards", async () => {
      const result = await getAllGiftcards();

      expect(Array.isArray(result)).toBe(true);
      if (testGiftcardId) {
        const found = result.find((item) => item.id === testGiftcardId);
        expect(found).toBeDefined();
      }
    });
  });

  describe("Update", () => {
    it("should update an existing giftcard", async () => {
      if (!testGiftcardId) {
        throw new Error("Test giftcard not created");
      }

      const result = await updateGiftcard(testGiftcardId, {
        sellPrice: 11000,
        sellDiscount: 60,
      });

      expect(result).toBeDefined();
      expect(result?.sellPrice).toBe(11000);
      expect(result?.sellDiscount).toBe(60);
      expect(result?.name).toBe("Test Gift Card");
    });
  });

  describe("Delete", () => {
    it("should delete a giftcard", async () => {
      if (!testGiftcardId) {
        throw new Error("Test giftcard not created");
      }

      const result = await deleteGiftcard(testGiftcardId);
      expect(result).toBe(true);

      const allCards = await getAllGiftcards();
      const found = allCards.find((item) => item.id === testGiftcardId);
      expect(found).toBeUndefined();
    });
  });
});
