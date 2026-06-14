import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";

// Domain data - "롯데 500만원이상"부터 시작
const domainData = [
  // 대형마트
  { name: "롯데 500만원이상", category: "대형마트", sellPrice: 96400, sellDiscount: 3.6, buyPrice: 96800, buyDiscount: 3.2, note: "-", available: true },
  { name: "롯데 100만원이상", category: "대형마트", sellPrice: 96300, sellDiscount: 3.7, buyPrice: 96900, buyDiscount: 3.1, note: "-", available: true },
  { name: "롯데 소량거래시", category: "대형마트", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 97500, buyDiscount: 2.5, note: "-", available: true },
  { name: "롯데 1만원권", category: "대형마트", sellPrice: 9300, sellDiscount: 7.0, buyPrice: 10000, buyDiscount: 0.0, note: "동일", available: true },
  { name: "신세계 500만원이상", category: "대형마트", sellPrice: 96700, sellDiscount: 3.3, buyPrice: 97100, buyDiscount: 2.9, note: "-", available: true },
  { name: "신세계 100만원이상", category: "대형마트", sellPrice: 96600, sellDiscount: 3.4, buyPrice: 97200, buyDiscount: 2.8, note: "-", available: true },
  { name: "신세계 소량거래시", category: "대형마트", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 98000, buyDiscount: 2.0, note: "-", available: true },
  { name: "신세계 1만원권", category: "대형마트", sellPrice: 9300, sellDiscount: 7.0, buyPrice: 10000, buyDiscount: 0.0, note: "동일", available: true },
  { name: "신세계 1만권(100만원이상)", category: "대형마트", sellPrice: 9400, sellDiscount: 6.0, buyPrice: 10000, buyDiscount: 0.0, note: "-", available: true },
  { name: "갤러리아 500만원이상", category: "대형마트", sellPrice: 96300, sellDiscount: 3.7, buyPrice: 96700, buyDiscount: 3.3, note: "-", available: true },
  { name: "갤러리아 100만원이상", category: "대형마트", sellPrice: 96200, sellDiscount: 3.8, buyPrice: 96600, buyDiscount: 3.4, note: "-", available: true },
  { name: "갤러리아 소량거래시", category: "대형마트", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 98000, buyDiscount: 2.0, note: "-", available: true },
  { name: "갤러리아 1만원권", category: "대형마트", sellPrice: 9300, sellDiscount: 7.0, buyPrice: 10000, buyDiscount: 0.0, note: "동일", available: true },
  { name: "현대 500만원이상", category: "대형마트", sellPrice: 96400, sellDiscount: 3.6, buyPrice: 96800, buyDiscount: 3.2, note: "-", available: true },
  { name: "현대 100만원이상", category: "대형마트", sellPrice: 96300, sellDiscount: 3.7, buyPrice: 96700, buyDiscount: 3.3, note: "-", available: true },
  { name: "현대 소량거래시", category: "대형마트", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 97500, buyDiscount: 2.5, note: "-", available: true },
  { name: "현대 1만원권", category: "대형마트", sellPrice: 9400, sellDiscount: 6.0, buyPrice: 10000, buyDiscount: 0.0, note: "-", available: true },
  
  // 모바일상품권
  { name: "모바일 상품권 롯데", category: "모바일상품권", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 97000, buyDiscount: 3.0, note: "-", available: true },
  { name: "모바일 상품권 신세계(이마트겸용)", category: "모바일상품권", sellPrice: 93000, sellDiscount: 7.0, buyPrice: 96000, buyDiscount: 4.0, note: "-", available: true },
  { name: "모바일 상품권 갤러리아", category: "모바일상품권", sellPrice: 93000, sellDiscount: 7.0, buyPrice: 96000, buyDiscount: 4.0, note: "-", available: true },
  { name: "모바일 상품권 갤러리아G캐시", category: "모바일상품권", sellPrice: 90000, sellDiscount: 10.0, buyPrice: 95000, buyDiscount: 5.0, note: "-", available: true },
  { name: "모바일 상품권 쿠팡기프트", category: "모바일상품권", sellPrice: 90000, sellDiscount: 10.0, buyPrice: 95000, buyDiscount: 5.0, note: "-", available: true },
  
  // 백화점
  { name: "AK(애경) 500만원이상", category: "백화점", sellPrice: 95900, sellDiscount: 4.1, buyPrice: 96300, buyDiscount: 3.7, note: "-", available: true },
  { name: "AK(애경) 100만원이상", category: "백화점", sellPrice: 95700, sellDiscount: 4.3, buyPrice: 96100, buyDiscount: 3.9, note: "-", available: true },
  { name: "AK(애경) 1만원권", category: "백화점", sellPrice: 9000, sellDiscount: 10.0, buyPrice: 9500, buyDiscount: 5.0, note: "-", available: true },
  { name: "AK(애경) 소량거래시", category: "백화점", sellPrice: 9550, sellDiscount: 4.5, buyPrice: 10000, buyDiscount: 0.0, note: "-", available: true },
  { name: "국민관광 500만원이상", category: "백화점", sellPrice: 96500, sellDiscount: 3.5, buyPrice: 96900, buyDiscount: 3.1, note: "-", available: true },
  { name: "국민관광 100만원이상", category: "백화점", sellPrice: 96300, sellDiscount: 3.7, buyPrice: 96700, buyDiscount: 3.3, note: "-", available: true },
  { name: "국민관광 1만원권", category: "백화점", sellPrice: 9300, sellDiscount: 7.0, buyPrice: 10000, buyDiscount: 0.0, note: "-", available: true },
  { name: "국민관광 소량거래시", category: "백화점", sellPrice: 95000, sellDiscount: 5.0, buyPrice: 97000, buyDiscount: 3.0, note: "-", available: true },
];

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection, { schema, mode: "default" });
  
  console.log("Clearing existing giftcards...");
  await db.delete(schema.giftcards);
  
  console.log("Seeding domain data...");
  for (let i = 0; i < domainData.length; i++) {
    await db.insert(schema.giftcards).values({
      ...domainData[i],
      displayOrder: i,
    });
  }
  
  console.log(`✅ Seeded ${domainData.length} giftcards from domain data`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
