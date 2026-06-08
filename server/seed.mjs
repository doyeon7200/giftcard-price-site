import { db } from "./db.ts";
import { giftcards } from "../drizzle/schema.ts";

const seedData = [
  {
    name: "GS25",
    category: "대형마트",
    sellPrice: 10000,
    sellDiscount: 30,
    buyPrice: 9500,
    buyDiscount: 25,
    note: "편의점 상품권",
    available: 1,
    displayOrder: 0,
  },
  {
    name: "CU",
    category: "대형마트",
    sellPrice: 10000,
    sellDiscount: 30,
    buyPrice: 9500,
    buyDiscount: 25,
    note: "편의점 상품권",
    available: 1,
    displayOrder: 1,
  },
  {
    name: "이마트",
    category: "대형마트",
    sellPrice: 50000,
    sellDiscount: 35,
    buyPrice: 47500,
    buyDiscount: 30,
    note: "대형마트 상품권",
    available: 1,
    displayOrder: 2,
  },
  {
    name: "카카오톡 선물하기",
    category: "모바일상품권",
    sellPrice: 10000,
    sellDiscount: 25,
    buyPrice: 9500,
    buyDiscount: 20,
    note: "모바일 상품권",
    available: 1,
    displayOrder: 3,
  },
  {
    name: "현대백화점",
    category: "백화점",
    sellPrice: 100000,
    sellDiscount: 40,
    buyPrice: 95000,
    buyDiscount: 35,
    note: "백화점 상품권",
    available: 1,
    displayOrder: 4,
  },
  {
    name: "애플 기프트카드",
    category: "전자제품",
    sellPrice: 100000,
    sellDiscount: 35,
    buyPrice: 95000,
    buyDiscount: 30,
    note: "애플 상품권",
    available: 1,
    displayOrder: 5,
  },
  {
    name: "롯데마트",
    category: "할인점",
    sellPrice: 50000,
    sellDiscount: 35,
    buyPrice: 47500,
    buyDiscount: 30,
    note: "할인점 상품권",
    available: 1,
    displayOrder: 6,
  },
  {
    name: "SK 주유소",
    category: "주유소",
    sellPrice: 50000,
    sellDiscount: 30,
    buyPrice: 48000,
    buyDiscount: 25,
    note: "주유소 상품권",
    available: 1,
    displayOrder: 7,
  },
  {
    name: "맥도날드",
    category: "음식점",
    sellPrice: 10000,
    sellDiscount: 20,
    buyPrice: 9500,
    buyDiscount: 15,
    note: "음식점 상품권",
    available: 1,
    displayOrder: 8,
  },
  {
    name: "CGV",
    category: "문화",
    sellPrice: 10000,
    sellDiscount: 25,
    buyPrice: 9500,
    buyDiscount: 20,
    note: "영화관 상품권",
    available: 1,
    displayOrder: 9,
  },
];

async function seed() {
  try {
    console.log("Seeding database with initial giftcard data...");
    
    for (const item of seedData) {
      await db.insert(giftcards).values(item);
    }
    
    console.log("✓ Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
