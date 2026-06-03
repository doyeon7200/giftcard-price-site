// ============================================================
// 상품권 시세 데이터 — 참조 사이트 구조 (카테고리 제거, 할인율 표시)
// 관리자가 브라우저에서 직접 수정 후 localStorage에 저장됩니다.
// ============================================================

export type GiftCardItem = {
  id: string;
  name: string;           // 상품권 이름 (예: "롯데 500만원이상")
  category: string;       // 카테고리 (그룹핑용, 표시 안 함)
  sellPrice: number;      // 파실때(이체) 가격
  sellDiscount: number;   // 파실때 할인율 (%)
  buyPrice: number;       // 사실때(현금) 가격
  buyDiscount: number;    // 사실때 할인율 (%)
  note: string;           // 비고
  available: boolean;     // 취급 여부
};

const DEFAULT_DATA: GiftCardItem[] = [
  // ─── 대형마트 ───────────────────────────────────────────
  { id: "lotte1", name: "롯데 500만원이상", category: "대형마트", sellPrice: 96400, sellDiscount: 3.6, buyPrice: 96800, buyDiscount: 3.2, note: "", available: true },
  { id: "lotte2", name: "롯데 100만원이상", category: "대형마트", sellPrice: 96300, sellDiscount: 3.7, buyPrice: 96900, buyDiscount: 3.1, note: "", available: true },
  { id: "lotte3", name: "롯데 소량거래시", category: "대형마트", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 97500, buyDiscount: 2.5, note: "", available: true },
  { id: "lotte4", name: "롯데 1만원권", category: "대형마트", sellPrice: 9300, sellDiscount: 7.0, buyPrice: 10000, buyDiscount: 0, note: "동일", available: true },

  { id: "shinsegae1", name: "신세계 500만원이상", category: "대형마트", sellPrice: 96700, sellDiscount: 3.3, buyPrice: 97100, buyDiscount: 2.9, note: "", available: true },
  { id: "shinsegae2", name: "신세계 100만원이상", category: "대형마트", sellPrice: 96600, sellDiscount: 3.4, buyPrice: 97200, buyDiscount: 2.8, note: "", available: true },
  { id: "shinsegae3", name: "신세계 소량거래시", category: "대형마트", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 98000, buyDiscount: 2.0, note: "", available: true },
  { id: "shinsegae4", name: "신세계 1만원권", category: "대형마트", sellPrice: 9300, sellDiscount: 7.0, buyPrice: 10000, buyDiscount: 0, note: "동일", available: true },
  { id: "shinsegae5", name: "신세계 1만권(100만원이상)", category: "대형마트", sellPrice: 9400, sellDiscount: 6.0, buyPrice: 10000, buyDiscount: 0, note: "", available: true },

  { id: "galleria1", name: "갤러리아 500만원이상", category: "대형마트", sellPrice: 96300, sellDiscount: 3.7, buyPrice: 96700, buyDiscount: 3.3, note: "", available: true },
  { id: "galleria2", name: "갤러리아 100만원이상", category: "대형마트", sellPrice: 96200, sellDiscount: 3.8, buyPrice: 96600, buyDiscount: 3.4, note: "", available: true },
  { id: "galleria3", name: "갤러리아 소량거래시", category: "대형마트", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 98000, buyDiscount: 2.0, note: "", available: true },
  { id: "galleria4", name: "갤러리아 1만원권", category: "대형마트", sellPrice: 9300, sellDiscount: 7.0, buyPrice: 10000, buyDiscount: 0, note: "동일", available: true },

  { id: "hyundai1", name: "현대 500만원이상", category: "대형마트", sellPrice: 96400, sellDiscount: 3.6, buyPrice: 96800, buyDiscount: 3.2, note: "", available: true },
  { id: "hyundai2", name: "현대 100만원이상", category: "대형마트", sellPrice: 96300, sellDiscount: 3.7, buyPrice: 96700, buyDiscount: 3.3, note: "", available: true },
  { id: "hyundai3", name: "현대 소량거래시", category: "대형마트", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 97500, buyDiscount: 2.5, note: "", available: true },
  { id: "hyundai4", name: "현대 1만원권", category: "대형마트", sellPrice: 9400, sellDiscount: 6.0, buyPrice: 10000, buyDiscount: 0, note: "", available: true },

  // ─── 모바일 상품권 ───────────────────────────────────────
  { id: "mobile1", name: "모바일 상품권 롯데", category: "모바일상품권", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 97000, buyDiscount: 3.0, note: "", available: true },
  { id: "mobile2", name: "모바일 상품권 신세계(이마트겸용)", category: "모바일상품권", sellPrice: 93000, sellDiscount: 7.0, buyPrice: 96000, buyDiscount: 4.0, note: "", available: true },
  { id: "mobile3", name: "모바일 상품권 갤러리아", category: "모바일상품권", sellPrice: 93000, sellDiscount: 7.0, buyPrice: 96000, buyDiscount: 4.0, note: "", available: true },
  { id: "mobile4", name: "모바일 상품권 갤러리아G캐시", category: "모바일상품권", sellPrice: 90000, sellDiscount: 10.0, buyPrice: 95000, buyDiscount: 5.0, note: "", available: true },
  { id: "mobile5", name: "모바일 상품권 쿠팡기프트", category: "모바일상품권", sellPrice: 90000, sellDiscount: 10.0, buyPrice: 95000, buyDiscount: 5.0, note: "", available: true },

  // ─── 백화점 ───────────────────────────────────────────
  { id: "ak1", name: "AK(애경) 500만원이상", category: "백화점", sellPrice: 95900, sellDiscount: 4.1, buyPrice: 96300, buyDiscount: 3.7, note: "", available: true },
  { id: "ak2", name: "AK(애경) 100만원이상", category: "백화점", sellPrice: 95700, sellDiscount: 4.3, buyPrice: 96100, buyDiscount: 3.9, note: "", available: true },
  { id: "ak3", name: "AK(애경) 1만원권", category: "백화점", sellPrice: 9000, sellDiscount: 10.0, buyPrice: 9500, buyDiscount: 5.0, note: "", available: true },
  { id: "ak4", name: "AK(애경) 소량거래시", category: "백화점", sellPrice: 9550, sellDiscount: 4.5, buyPrice: 10000, buyDiscount: 0, note: "", available: true },

  { id: "tourism1", name: "국민관광 500만원이상", category: "백화점", sellPrice: 96500, sellDiscount: 3.5, buyPrice: 96900, buyDiscount: 3.1, note: "", available: true },
  { id: "tourism2", name: "국민관광 100만원이상", category: "백화점", sellPrice: 96300, sellDiscount: 3.7, buyPrice: 96700, buyDiscount: 3.3, note: "", available: true },
  { id: "tourism3", name: "국민관광 1만원권", category: "백화점", sellPrice: 9300, sellDiscount: 7.0, buyPrice: 10000, buyDiscount: 0, note: "", available: true },
  { id: "tourism4", name: "국민관광 소량거래시", category: "백화점", sellPrice: 95000, sellDiscount: 5.0, buyPrice: 97000, buyDiscount: 3.0, note: "", available: true },

  // ─── 전자제품 ───────────────────────────────────────────
  { id: "samsung1", name: "삼성 100만원이상", category: "전자제품", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 97000, buyDiscount: 3.0, note: "", available: true },
  { id: "samsung2", name: "삼성 1만원권", category: "전자제품", sellPrice: 9300, sellDiscount: 7.0, buyPrice: 10000, buyDiscount: 0, note: "", available: true },
  { id: "samsung3", name: "삼성 소량거래시", category: "전자제품", sellPrice: 95000, sellDiscount: 5.0, buyPrice: 96500, buyDiscount: 3.5, note: "", available: true },

  { id: "nonghyup1", name: "농협 100만원이상", category: "전자제품", sellPrice: 93000, sellDiscount: 7.0, buyPrice: 96000, buyDiscount: 4.0, note: "", available: true },
  { id: "nonghyup2", name: "농협 1만원권", category: "전자제품", sellPrice: 8000, sellDiscount: 20.0, buyPrice: 9000, buyDiscount: 10.0, note: "", available: true },
  { id: "nonghyup3", name: "농협 소량거래시", category: "전자제품", sellPrice: 90000, sellDiscount: 10.0, buyPrice: 95000, buyDiscount: 5.0, note: "", available: true },

  // ─── 할인점 ───────────────────────────────────────────
  { id: "homeplus1", name: "홈플러스 10만원권", category: "할인점", sellPrice: 75000, sellDiscount: 25.0, buyPrice: 85000, buyDiscount: 15.0, note: "", available: true },
  { id: "homeplus2", name: "홈플러스 1만원권", category: "할인점", sellPrice: 0, sellDiscount: 0, buyPrice: 0, buyDiscount: 0, note: "매입안함", available: false },

  { id: "eland1", name: "이랜드 100만원이상", category: "할인점", sellPrice: 95500, sellDiscount: 4.5, buyPrice: 97000, buyDiscount: 3.0, note: "", available: true },
  { id: "eland2", name: "이랜드 10만원권", category: "할인점", sellPrice: 94500, sellDiscount: 5.5, buyPrice: 96500, buyDiscount: 3.5, note: "", available: true },
  { id: "eland3", name: "이랜드 1만원권", category: "할인점", sellPrice: 9000, sellDiscount: 10.0, buyPrice: 9500, buyDiscount: 5.0, note: "", available: true },

  { id: "kanggang1", name: "금강제화 100만원이상", category: "할인점", sellPrice: 67000, sellDiscount: 33.0, buyPrice: 75000, buyDiscount: 25.0, note: "", available: true },
  { id: "kanggang2", name: "금강제화 소액거래시", category: "할인점", sellPrice: 65000, sellDiscount: 35.0, buyPrice: 73000, buyDiscount: 27.0, note: "", available: true },
  { id: "kanggang3", name: "금강제화 1만원권", category: "할인점", sellPrice: 6000, sellDiscount: 40.0, buyPrice: 7000, buyDiscount: 30.0, note: "", available: true },

  { id: "lglf1", name: "LG / LF 10만원권", category: "할인점", sellPrice: 85000, sellDiscount: 15.0, buyPrice: 92000, buyDiscount: 8.0, note: "", available: true },

  { id: "costco1", name: "코스트코 10만원권", category: "할인점", sellPrice: 97500, sellDiscount: 2.5, buyPrice: 99000, buyDiscount: 1.0, note: "", available: true },

  // ─── 주유소 ───────────────────────────────────────────
  { id: "sk1", name: "SK주유 100만원이상", category: "주유소", sellPrice: 49000, sellDiscount: 2.0, buyPrice: 49500, buyDiscount: 1.5, note: "", available: true },
  { id: "sk2", name: "SK주유 소량거래시", category: "주유소", sellPrice: 48000, sellDiscount: 4.0, buyPrice: 48800, buyDiscount: 3.2, note: "", available: true },
  { id: "sk3", name: "SK주유 1만원권", category: "주유소", sellPrice: 9500, sellDiscount: 5.0, buyPrice: 9800, buyDiscount: 2.0, note: "", available: true },

  { id: "hyundaigas1", name: "현대주유 100만원이상", category: "주유소", sellPrice: 48750, sellDiscount: 2.5, buyPrice: 49250, buyDiscount: 2.0, note: "", available: true },
  { id: "hyundaigas2", name: "현대주유 소량거래시", category: "주유소", sellPrice: 48000, sellDiscount: 4.0, buyPrice: 48800, buyDiscount: 3.2, note: "", available: true },
  { id: "hyundaigas3", name: "현대주유 1만원권", category: "주유소", sellPrice: 9500, sellDiscount: 5.0, buyPrice: 9800, buyDiscount: 2.0, note: "", available: true },

  { id: "gs1", name: "GS주유 10만원권(100만이상)", category: "주유소", sellPrice: 47900, sellDiscount: 4.2, buyPrice: 48500, buyDiscount: 3.5, note: "", available: true },
  { id: "gs2", name: "GS주유 5만원권(100만이상)", category: "주유소", sellPrice: 47900, sellDiscount: 4.2, buyPrice: 48500, buyDiscount: 3.5, note: "", available: true },
  { id: "gs3", name: "GS주유 소량거래시", category: "주유소", sellPrice: 47500, sellDiscount: 5.0, buyPrice: 48200, buyDiscount: 4.2, note: "", available: true },
  { id: "gs4", name: "GS주유 1만원권", category: "주유소", sellPrice: 9500, sellDiscount: 5.0, buyPrice: 9800, buyDiscount: 2.0, note: "", available: true },

  { id: "soil1", name: "S오일주유 100만원이상", category: "주유소", sellPrice: 48650, sellDiscount: 2.7, buyPrice: 49150, buyDiscount: 2.2, note: "", available: true },
  { id: "soil2", name: "S오일주유 소량거래시", category: "주유소", sellPrice: 48000, sellDiscount: 4.0, buyPrice: 48800, buyDiscount: 3.2, note: "", available: true },
  { id: "soil3", name: "S오일주유 1만원권", category: "주유소", sellPrice: 9600, sellDiscount: 4.0, buyPrice: 9900, buyDiscount: 1.0, note: "", available: true },

  // ─── 음식점/카페 ───────────────────────────────────────
  { id: "starbucks1", name: "스타벅스 5만원권", category: "음식점", sellPrice: 42500, sellDiscount: 15.0, buyPrice: 45000, buyDiscount: 10.0, note: "", available: true },
  { id: "starbucks2", name: "스타벅스 3만원권", category: "음식점", sellPrice: 24600, sellDiscount: 18.0, buyPrice: 27000, buyDiscount: 10.0, note: "", available: true },
  { id: "starbucks3", name: "스타벅스 1만원권", category: "음식점", sellPrice: 8200, sellDiscount: 18.0, buyPrice: 9000, buyDiscount: 10.0, note: "", available: true },

  { id: "bbq1", name: "BBQ / BHC", category: "음식점", sellPrice: 7000, sellDiscount: 30.0, buyPrice: 8000, buyDiscount: 20.0, note: "", available: true },
  { id: "outback1", name: "아웃백", category: "음식점", sellPrice: 83000, sellDiscount: 17.0, buyPrice: 88000, buyDiscount: 12.0, note: "", available: true },

  // ─── 문화/도서 ───────────────────────────────────────────
  { id: "culture1", name: "문화 5만원권", category: "문화", sellPrice: 45000, sellDiscount: 10.0, buyPrice: 48000, buyDiscount: 4.0, note: "", available: true },
  { id: "culture2", name: "문화 1만원권", category: "문화", sellPrice: 9000, sellDiscount: 10.0, buyPrice: 9500, buyDiscount: 5.0, note: "", available: true },
  { id: "culture3", name: "문화 5천원권", category: "문화", sellPrice: 4250, sellDiscount: 15.0, buyPrice: 4500, buyDiscount: 10.0, note: "", available: true },

  { id: "book1", name: "도서문화 5만원권", category: "문화", sellPrice: 45000, sellDiscount: 10.0, buyPrice: 48000, buyDiscount: 4.0, note: "", available: true },
  { id: "book2", name: "도서문화 1만원권", category: "문화", sellPrice: 9000, sellDiscount: 10.0, buyPrice: 9500, buyDiscount: 5.0, note: "", available: true },
  { id: "book3", name: "도서문화 5천원권", category: "문화", sellPrice: 4250, sellDiscount: 15.0, buyPrice: 4500, buyDiscount: 10.0, note: "", available: true },

  { id: "daiso1", name: "다이소기프트", category: "문화", sellPrice: 80000, sellDiscount: 20.0, buyPrice: 88000, buyDiscount: 12.0, note: "", available: true },
  { id: "google1", name: "구글기프트", category: "문화", sellPrice: 80000, sellDiscount: 20.0, buyPrice: 88000, buyDiscount: 12.0, note: "", available: true },

  // ─── 신용카드 기프트카드 ───────────────────────────────────
  { id: "giftcard1", name: "기프트카드 BC/국민/삼성/하나롯데/현대/우리/신한 50만원권", category: "기프트카드", sellPrice: 485500, sellDiscount: 2.9, buyPrice: 490000, buyDiscount: 2.0, note: "", available: true },
  { id: "giftcard2", name: "기프트카드 BC/국민/삼성/하나롯데/현대/우리/신한 30만원권", category: "기프트카드", sellPrice: 288000, sellDiscount: 4.0, buyPrice: 291000, buyDiscount: 3.0, note: "", available: true },
  { id: "giftcard3", name: "기프트카드 BC/국민/삼성/하나롯데/현대/우리/신한 10만원권", category: "기프트카드", sellPrice: 95000, sellDiscount: 5.0, buyPrice: 97000, buyDiscount: 3.0, note: "", available: true },

  { id: "giftcard4", name: "기프트카드 농협/기타등 50만원권", category: "기프트카드", sellPrice: 485000, sellDiscount: 3.0, buyPrice: 489500, buyDiscount: 2.1, note: "", available: true },
  { id: "giftcard5", name: "기프트카드 농협/기타등 30만원권", category: "기프트카드", sellPrice: 288000, sellDiscount: 4.0, buyPrice: 291000, buyDiscount: 3.0, note: "", available: true },
  { id: "giftcard6", name: "기프트카드 농협/기타등 10만원권", category: "기프트카드", sellPrice: 95000, sellDiscount: 5.0, buyPrice: 97000, buyDiscount: 3.0, note: "", available: true },
];

const STORAGE_KEY = "giftcard_price_data_v2";
const ADMIN_PW_KEY = "giftcard_admin_pw_v2";
const DEFAULT_ADMIN_PW = "1234";

export function loadData(): GiftCardItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GiftCardItem[];
  } catch {}
  return DEFAULT_DATA;
}

export function saveData(data: GiftCardItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAdminPassword(): string {
  return localStorage.getItem(ADMIN_PW_KEY) ?? DEFAULT_ADMIN_PW;
}

export function setAdminPassword(pw: string): void {
  localStorage.setItem(ADMIN_PW_KEY, pw);
}

export function resetToDefault(): GiftCardItem[] {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_DATA;
}

/** 숫자를 가격 형식으로 포맷 */
export function formatPrice(amount: number): string {
  return amount.toLocaleString("ko-KR");
}
