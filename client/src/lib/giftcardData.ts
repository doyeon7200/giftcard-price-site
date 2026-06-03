// ============================================================
// 상품권 시세 데이터 — Deep Navy + Gold 디자인 시스템
// 관리자가 브라우저에서 직접 수정 후 localStorage에 저장됩니다.
// ============================================================

export type GiftCardItem = {
  id: string;
  name: string;           // 상품권 이름
  faceValue: string;      // 권면가 (예: "10만원")
  buyRate: number;        // 매입률 (%) — 예: 93 → 93%
  buyPrice: string;       // 매입가 (표시용) — 예: "93,000원"
  sellRate: number;       // 판매율 (%)
  sellPrice: string;      // 판매가 (표시용)
  note: string;           // 비고
  available: boolean;     // 취급 여부
};

export type GiftCardCategory = {
  id: string;
  label: string;
  icon: string;
  items: GiftCardItem[];
};

const DEFAULT_DATA: GiftCardCategory[] = [
  {
    id: "culture",
    label: "문화상품권",
    icon: "🎭",
    items: [
      { id: "c1", name: "문화상품권", faceValue: "1만원", buyRate: 92, buyPrice: "9,200원", sellRate: 97, sellPrice: "9,700원", note: "", available: true },
      { id: "c2", name: "문화상품권", faceValue: "3만원", buyRate: 92, buyPrice: "27,600원", sellRate: 97, sellPrice: "29,100원", note: "", available: true },
      { id: "c3", name: "문화상품권", faceValue: "5만원", buyRate: 92, buyPrice: "46,000원", sellRate: 97, sellPrice: "48,500원", note: "", available: true },
      { id: "c4", name: "문화상품권", faceValue: "10만원", buyRate: 92, buyPrice: "92,000원", sellRate: 97, sellPrice: "97,000원", note: "", available: true },
    ],
  },
  {
    id: "book",
    label: "도서문화상품권",
    icon: "📚",
    items: [
      { id: "b1", name: "도서문화상품권", faceValue: "1만원", buyRate: 91, buyPrice: "9,100원", sellRate: 96, sellPrice: "9,600원", note: "", available: true },
      { id: "b2", name: "도서문화상품권", faceValue: "3만원", buyRate: 91, buyPrice: "27,300원", sellRate: 96, sellPrice: "28,800원", note: "", available: true },
      { id: "b3", name: "도서문화상품권", faceValue: "5만원", buyRate: 91, buyPrice: "45,500원", sellRate: 96, sellPrice: "48,000원", note: "", available: true },
    ],
  },
  {
    id: "happy",
    label: "해피머니상품권",
    icon: "😊",
    items: [
      { id: "h1", name: "해피머니상품권", faceValue: "1만원", buyRate: 90, buyPrice: "9,000원", sellRate: 95, sellPrice: "9,500원", note: "", available: true },
      { id: "h2", name: "해피머니상품권", faceValue: "3만원", buyRate: 90, buyPrice: "27,000원", sellRate: 95, sellPrice: "28,500원", note: "", available: true },
      { id: "h3", name: "해피머니상품권", faceValue: "5만원", buyRate: 90, buyPrice: "45,000원", sellRate: 95, sellPrice: "47,500원", note: "", available: true },
    ],
  },
  {
    id: "google",
    label: "구글기프트카드",
    icon: "🎮",
    items: [
      { id: "g1", name: "구글기프트카드", faceValue: "1만원", buyRate: 88, buyPrice: "8,800원", sellRate: 94, sellPrice: "9,400원", note: "", available: true },
      { id: "g2", name: "구글기프트카드", faceValue: "3만원", buyRate: 88, buyPrice: "26,400원", sellRate: 94, sellPrice: "28,200원", note: "", available: true },
      { id: "g3", name: "구글기프트카드", faceValue: "5만원", buyRate: 88, buyPrice: "44,000원", sellRate: 94, sellPrice: "47,000원", note: "", available: true },
      { id: "g4", name: "구글기프트카드", faceValue: "10만원", buyRate: 88, buyPrice: "88,000원", sellRate: 94, sellPrice: "94,000원", note: "", available: true },
    ],
  },
  {
    id: "apple",
    label: "애플기프트카드",
    icon: "🍎",
    items: [
      { id: "a1", name: "애플기프트카드", faceValue: "1만원", buyRate: 87, buyPrice: "8,700원", sellRate: 93, sellPrice: "9,300원", note: "", available: true },
      { id: "a2", name: "애플기프트카드", faceValue: "3만원", buyRate: 87, buyPrice: "26,100원", sellRate: 93, sellPrice: "27,900원", note: "", available: true },
      { id: "a3", name: "애플기프트카드", faceValue: "5만원", buyRate: 87, buyPrice: "43,500원", sellRate: 93, sellPrice: "46,500원", note: "", available: true },
    ],
  },
  {
    id: "convenience",
    label: "편의점상품권",
    icon: "🏪",
    items: [
      { id: "cv1", name: "GS25상품권", faceValue: "1만원", buyRate: 93, buyPrice: "9,300원", sellRate: 97, sellPrice: "9,700원", note: "", available: true },
      { id: "cv2", name: "GS25상품권", faceValue: "3만원", buyRate: 93, buyPrice: "27,900원", sellRate: 97, sellPrice: "29,100원", note: "", available: true },
      { id: "cv3", name: "CU상품권", faceValue: "1만원", buyRate: 93, buyPrice: "9,300원", sellRate: 97, sellPrice: "9,700원", note: "", available: true },
      { id: "cv4", name: "CU상품권", faceValue: "3만원", buyRate: 93, buyPrice: "27,900원", sellRate: 97, sellPrice: "29,100원", note: "", available: true },
    ],
  },
];

const STORAGE_KEY = "giftcard_price_data_v1";
const ADMIN_PW_KEY = "giftcard_admin_pw_v1";
const DEFAULT_ADMIN_PW = "1234";

export function loadData(): GiftCardCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GiftCardCategory[];
  } catch {}
  return DEFAULT_DATA;
}

export function saveData(data: GiftCardCategory[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAdminPassword(): string {
  return localStorage.getItem(ADMIN_PW_KEY) ?? DEFAULT_ADMIN_PW;
}

export function setAdminPassword(pw: string): void {
  localStorage.setItem(ADMIN_PW_KEY, pw);
}

export function resetToDefault(): GiftCardCategory[] {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_DATA;
}

/** 숫자와 단위를 합쳐 가격 문자열 생성 */
export function formatPrice(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

/** 권면가 문자열에서 숫자 추출 (예: "10만원" → 100000) */
export function parseFaceValue(fv: string): number {
  const m = fv.match(/(\d+)(만원|천원|원)/);
  if (!m) return 0;
  const n = parseInt(m[1]);
  if (m[2] === "만원") return n * 10000;
  if (m[2] === "천원") return n * 1000;
  return n;
}

/** 매입가/판매가를 비율에서 자동 계산 */
export function calcPriceFromRate(faceValue: string, rate: number): string {
  const face = parseFaceValue(faceValue);
  if (!face) return "-";
  return formatPrice(Math.floor(face * rate / 100));
}
