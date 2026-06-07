import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  getAllGiftcards,
  createGiftcard,
  updateGiftcard,
  deleteGiftcard,
  reorderGiftcards,
} from "./db";

describe("Giftcards Integration Tests", () => {
  let testGiftcardId: number | null = null;
  let testGiftcardId2: number | null = null;

  describe("Full CRUD Workflow", () => {
    it("should create two giftcards", async () => {
      const result1 = await createGiftcard({
        name: "Integration Test Card 1",
        category: "테스트",
        sellPrice: 10000,
        sellDiscount: 50,
        buyPrice: 9500,
        buyDiscount: 45,
        note: "Test",
        available: 1,
        displayOrder: 0,
      });

      const result2 = await createGiftcard({
        name: "Integration Test Card 2",
        category: "테스트",
        sellPrice: 20000,
        sellDiscount: 60,
        buyPrice: 19000,
        buyDiscount: 55,
        note: "Test",
        available: 1,
        displayOrder: 1,
      });

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();

      testGiftcardId = result1?.id || null;
      testGiftcardId2 = result2?.id || null;
    });

    it("should retrieve all giftcards including created ones", async () => {
      const result = await getAllGiftcards();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      if (testGiftcardId) {
        const found = result.find((item) => item.id === testGiftcardId);
        expect(found).toBeDefined();
        expect(found?.name).toBe("Integration Test Card 1");
      }
    });

    it("should update giftcard properties", async () => {
      if (!testGiftcardId) throw new Error("Test giftcard not created");

      const result = await updateGiftcard(testGiftcardId, {
        sellPrice: 11000,
        sellDiscount: 55,
        note: "Updated test",
      });

      expect(result).toBeDefined();
      expect(result?.sellPrice).toBe(11000);
      expect(result?.sellDiscount).toBe(55);
      expect(result?.note).toBe("Updated test");
    });

    it("should reorder giftcards", async () => {
      if (!testGiftcardId || !testGiftcardId2) {
        throw new Error("Test giftcards not created");
      }

      const orders = [
        { id: testGiftcardId, displayOrder: 1 },
        { id: testGiftcardId2, displayOrder: 0 },
      ];

      const result = await reorderGiftcards(orders);
      expect(result).toBe(true);
    });

    it("should delete giftcard", async () => {
      if (!testGiftcardId) throw new Error("Test giftcard not created");

      const result = await deleteGiftcard(testGiftcardId);
      expect(result).toBe(true);

      const allCards = await getAllGiftcards();
      const found = allCards.find((item) => item.id === testGiftcardId);
      expect(found).toBeUndefined();
    });

    it("should clean up remaining test data", async () => {
      if (!testGiftcardId2) throw new Error("Test giftcard not created");

      const result = await deleteGiftcard(testGiftcardId2);
      expect(result).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle update of non-existent giftcard", async () => {
      const result = await updateGiftcard(99999, { sellPrice: 10000 });
      expect(result).toBeNull();
    });

    it("should handle delete of non-existent giftcard", async () => {
      const result = await deleteGiftcard(99999);
      expect(result).toBe(false);
    });
  });
});
