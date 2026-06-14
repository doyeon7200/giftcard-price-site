import { getDb } from "./db";
import { giftcards } from "../drizzle/schema";

const completeData = [
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
  
  // 전자제품
  { name: "삼성 100만원이상", category: "전자제품", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 97000, buyDiscount: 3.0, note: "-", available: true },
  { name: "삼성 1만원권", category: "전자제품", sellPrice: 9300, sellDiscount: 7.0, buyPrice: 10000, buyDiscount: 0.0, note: "-", available: true },
  { name: "삼성 소량거래시", category: "전자제품", sellPrice: 95000, sellDiscount: 5.0, buyPrice: 96500, buyDiscount: 3.5, note: "-", available: true },
  { name: "농협 100만원이상", category: "전자제품", sellPrice: 93000, sellDiscount: 7.0, buyPrice: 96000, buyDiscount: 4.0, note: "-", available: true },
  { name: "농협 1만원권", category: "전자제품", sellPrice: 8000, sellDiscount: 20.0, buyPrice: 9000, buyDiscount: 10.0, note: "-", available: true },
  { name: "농협 소량거래시", category: "전자제품", sellPrice: 90000, sellDiscount: 10.0, buyPrice: 95000, buyDiscount: 5.0, note: "-", available: true },
  
  // 할인점
  { name: "홈플러스 10만원권", category: "할인점", sellPrice: 75000, sellDiscount: 25.0, buyPrice: 85000, buyDiscount: 15.0, note: "-", available: true },
  { name: "홈플러스 1만원권", category: "할인점", sellPrice: 0, sellDiscount: 0.0, buyPrice: 0, buyDiscount: 0.0, note: "매입안함", available: false },
  { name: "이랜드 100만원이상", category: "할인점", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 97000, buyDiscount: 3.0, note: "-", available: true },
  { name: "이랜드 10만원권", category: "할인점", sellPrice: 94500, sellDiscount: 5.5, buyPrice: 96500, buyDiscount: 3.5, note: "-", available: true },
  { name: "이랜드 1만원권", category: "할인점", sellPrice: 9000, sellDiscount: 10.0, buyPrice: 9500, buyDiscount: 5.0, note: "-", available: true },
  { name: "금강제화 100만원이상", category: "할인점", sellPrice: 67000, sellDiscount: 33.0, buyPrice: 75000, buyDiscount: 25.0, note: "-", available: true },
  { name: "금강제화 소액거래시", category: "할인점", sellPrice: 65000, sellDiscount: 35.0, buyPrice: 73000, buyDiscount: 27.0, note: "-", available: true },
  { name: "금강제화 1만원권", category: "할인점", sellPrice: 6000, sellDiscount: 40.0, buyPrice: 7000, buyDiscount: 30.0, note: "-", available: true },
  { name: "LG / LF 10만원권", category: "할인점", sellPrice: 85000, sellDiscount: 15.0, buyPrice: 92000, buyDiscount: 8.0, note: "-", available: true },
  { name: "코스트코 10만원권", category: "할인점", sellPrice: 97500, sellDiscount: 2.5, buyPrice: 99000, buyDiscount: 1.0, note: "-", available: true },
  
  // 주유소
  { name: "SK주유 100만원이상", category: "주유소", sellPrice: 49000, sellDiscount: 2.0, buyPrice: 49500, buyDiscount: 1.5, note: "-", available: true },
  { name: "SK주유 소량거래시", category: "주유소", sellPrice: 48000, sellDiscount: 4.0, buyPrice: 48800, buyDiscount: 3.2, note: "-", available: true },
  { name: "SK주유 1만원권", category: "주유소", sellPrice: 9500, sellDiscount: 5.0, buyPrice: 9800, buyDiscount: 2.0, note: "-", available: true },
  { name: "현대주유 100만원이상", category: "주유소", sellPrice: 48750, sellDiscount: 2.5, buyPrice: 49250, buyDiscount: 2.0, note: "-", available: true },
  { name: "현대주유 소량거래시", category: "주유소", sellPrice: 48000, sellDiscount: 4.0, buyPrice: 48800, buyDiscount: 3.2, note: "-", available: true },
  { name: "현대주유 1만원권", category: "주유소", sellPrice: 9500, sellDiscount: 5.0, buyPrice: 9800, buyDiscount: 2.0, note: "-", available: true },
  { name: "GS주유 10만원권(100만이상)", category: "주유소", sellPrice: 47900, sellDiscount: 4.2, buyPrice: 48500, buyDiscount: 3.5, note: "-", available: true },
  { name: "GS주유 5만원권(100만이상)", category: "주유소", sellPrice: 47900, sellDiscount: 4.2, buyPrice: 48500, buyDiscount: 3.5, note: "-", available: true },
  { name: "GS주유 소량거래시", category: "주유소", sellPrice: 47500, sellDiscount: 5.0, buyPrice: 48200, buyDiscount: 4.2, note: "-", available: true },
  { name: "GS주유 1만원권", category: "주유소", sellPrice: 9500, sellDiscount: 5.0, buyPrice: 9800, buyDiscount: 2.0, note: "-", available: true },
  { name: "S오일주유 100만원이상", category: "주유소", sellPrice: 48650, sellDiscount: 2.7, buyPrice: 49150, buyDiscount: 2.2, note: "-", available: true },
  { name: "S오일주유 소량거래시", category: "주유소", sellPrice: 48000, sellDiscount: 4.0, buyPrice: 48800, buyDiscount: 3.2, note: "-", available: true },
  { name: "S오일주유 1만원권", category: "주유소", sellPrice: 9600, sellDiscount: 4.0, buyPrice: 9900, buyDiscount: 1.0, note: "-", available: true },
  
  // 음식점
  { name: "스타벅스 5만원권", category: "음식점", sellPrice: 42500, sellDiscount: 15.0, buyPrice: 45000, buyDiscount: 10.0, note: "-", available: true },
  { name: "스타벅스 3만원권", category: "음식점", sellPrice: 24600, sellDiscount: 18.0, buyPrice: 27000, buyDiscount: 10.0, note: "-", available: true },
  { name: "스타벅스 1만원권", category: "음식점", sellPrice: 8200, sellDiscount: 18.0, buyPrice: 9000, buyDiscount: 10.0, note: "-", available: true },
  { name: "BBQ / BHC", category: "음식점", sellPrice: 7000, sellDiscount: 30.0, buyPrice: 8000, buyDiscount: 20.0, note: "-", available: true },
  { name: "아웃백", category: "음식점", sellPrice: 83000, sellDiscount: 17.0, buyPrice: 88000, buyDiscount: 12.0, note: "-", available: true },
  
  // 문화
  { name: "문화 5만원권", category: "문화", sellPrice: 45000, sellDiscount: 10.0, buyPrice: 48000, buyDiscount: 4.0, note: "-", available: true },
  { name: "문화 1만원권", category: "문화", sellPrice: 9000, sellDiscount: 10.0, buyPrice: 9500, buyDiscount: 5.0, note: "-", available: true },
  { name: "문화 5천원권", category: "문화", sellPrice: 4250, sellDiscount: 15.0, buyPrice: 4500, buyDiscount: 10.0, note: "-", available: true },
  { name: "도서문화 5만원권", category: "문화", sellPrice: 45000, sellDiscount: 10.0, buyPrice: 48000, buyDiscount: 4.0, note: "-", available: true },
  { name: "도서문화 1만원권", category: "문화", sellPrice: 9000, sellDiscount: 10.0, buyPrice: 9500, buyDiscount: 5.0, note: "-", available: true },
  { name: "도서문화 5천원권", category: "문화", sellPrice: 4250, sellDiscount: 15.0, buyPrice: 4500, buyDiscount: 10.0, note: "-", available: true },
  { name: "다이소기프트", category: "문화", sellPrice: 80000, sellDiscount: 20.0, buyPrice: 88000, buyDiscount: 12.0, note: "-", available: true },
  { name: "구글기프트", category: "문화", sellPrice: 80000, sellDiscount: 20.0, buyPrice: 88000, buyDiscount: 12.0, note: "-", available: true },
  
  // 기프트카드
  { name: "기프트카드 BC/국민/삼성/하나롯데/현대/우리/신한 50만원권", category: "기프트카드", sellPrice: 485500, sellDiscount: 2.9, buyPrice: 490000, buyDiscount: 2.0, note: "-", available: true },
  { name: "기프트카드 BC/국민/삼성/하나롯데/현대/우리/신한 30만원권", category: "기프트카드", sellPrice: 288000, sellDiscount: 4.0, buyPrice: 291000, buyDiscount: 3.0, note: "-", available: true },
  { name: "기프트카드 BC/국민/삼성/하나롯데/현대/우리/신한 10만원권", category: "기프트카드", sellPrice: 95000, sellDiscount: 5.0, buyPrice: 97000, buyDiscount: 3.0, note: "-", available: true },
  { name: "기프트카드 농협/기타등 50만원권", category: "기프트카드", sellPrice: 485000, sellDiscount: 3.0, buyPrice: 489500, buyDiscount: 2.1, note: "-", available: true },
  { name: "기프트카드 농협/기타등 30만원권", category: "기프트카드", sellPrice: 288000, sellDiscount: 4.0, buyPrice: 291000, buyDiscount: 3.0, note: "-", available: true },
  { name: "기프트카드 농협/기타등 10만원권", category: "기프트카드", sellPrice: 95000, sellDiscount: 5.0, buyPrice: 97000, buyDiscount: 3.0, note: "-", available: true },
];

async function seed() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("❌ Database connection failed");
      process.exit(1);
    }
    
    // Delete all existing records
    await db.delete(giftcards);
    
    // Insert all new data
    for (let i = 0; i < completeData.length; i++) {
      const item = completeData[i];
      await db.insert(giftcards).values({
        name: item.name,
        category: item.category,
        sellPrice: item.sellPrice,
        sellDiscount: Math.round(item.sellDiscount * 100),
        buyPrice: item.buyPrice,
        buyDiscount: Math.round(item.buyDiscount * 100),
        note: item.note,
        available: item.available ? 1 : 0,
        displayOrder: i,
      });
    }
    
    console.log(`✅ Successfully seeded ${completeData.length} giftcard items`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

seed().then(() => process.exit(0)).catch(() => process.exit(1));
