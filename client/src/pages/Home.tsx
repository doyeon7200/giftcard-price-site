/*
 * 티켓나라 스타필드수원 — 상품권 시세 안내 메인 페이지
 * Design: Deep Navy (#0a1628) + Gold (#c9a227) — 신뢰·안정·가치
 * Layout: 스티키 헤더 → 히어로 배너 → 안내문구 → 통합 시세표 (카테고리 탭 없음) → 네이버 지도 → 푸터
 */
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  loadData,
  saveData,
  getAdminPassword,
  setAdminPassword,
  resetToDefault,
  formatPrice,
  type GiftCardItem,
} from "@/lib/giftcardData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Clock,
  MapPin,
  Lock,
  Unlock,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Settings,
  AlertCircle,
  CheckCircle2,
  Edit3,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// ─── 관리자 로그인 다이얼로그 ───────────────────────────────────────────────
function AdminLoginDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const correctPassword = getAdminPassword();
    if (password === correctPassword) {
      setPassword("");
      setError("");
      onSuccess();
    } else {
      setError("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>관리자 로그인</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleLogin}>로그인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 비밀번호 변경 다이얼로그 ───────────────────────────────────────────────
function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = () => {
    if (oldPassword !== getAdminPassword()) {
      setError("기존 비밀번호가 틀렸습니다.");
      return;
    }
    if (newPassword.length < 4) {
      setError("새 비밀번호는 4자 이상이어야 합니다.");
      return;
    }
    setAdminPassword(newPassword);
    toast.success("비밀번호가 변경되었습니다.");
    setOldPassword("");
    setNewPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>비밀번호 변경</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="기존 비밀번호"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setError("");
            }}
          />
          <Input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleChange}>변경</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 항목 추가 다이얼로그 ────────────────────────────────────────────────────
function AddItemDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Omit<GiftCardItem, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("대형마트");
  const [sellPrice, setSellPrice] = useState("");
  const [sellDiscount, setSellDiscount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [buyDiscount, setBuyDiscount] = useState("");

  const handleAdd = () => {
    if (!name) {
      toast.error("상품권명을 입력하세요.");
      return;
    }
    onAdd({
      name,
      category,
      sellPrice: Number(sellPrice) || 0,
      sellDiscount: Number(sellDiscount) || 0,
      buyPrice: Number(buyPrice) || 0,
      buyDiscount: Number(buyDiscount) || 0,
      note: "",
      available: true,
    });
    setName("");
    setSellPrice("");
    setSellDiscount("");
    setBuyPrice("");
    setBuyDiscount("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>항목 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">상품권명</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-[oklch(0.88_0.01_255)] rounded-lg text-sm"
            >
              <option>대형마트</option>
              <option>모바일상품권</option>
              <option>백화점</option>
              <option>전자제품</option>
              <option>할인점</option>
              <option>주유소</option>
              <option>음식점</option>
              <option>문화</option>
              <option>기프트카드</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">파실때 가격</label>
              <Input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">할인율(%)</label>
              <Input type="number" step="0.1" value={sellDiscount} onChange={(e) => setSellDiscount(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">사실때 가격</label>
              <Input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">할인율(%)</label>
              <Input type="number" step="0.1" value={buyDiscount} onChange={(e) => setBuyDiscount(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleAdd}>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 시세표 행 (편집 가능) ────────────────────────────────────────────────
function PriceRow({
  item,
  isAdmin,
  onChange,
  onDelete,
  isEven,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  item: GiftCardItem;
  isAdmin: boolean;
  onChange: (updated: GiftCardItem) => void;
  onDelete: () => void;
  isEven: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}) {
  const [editing, setEditing] = useState<null | "name" | "sellPrice" | "sellDiscount" | "buyPrice" | "buyDiscount" | "note">(null);
  const [tempVal, setTempVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const startEdit = (field: typeof editing, val: string) => {
    if (!isAdmin) return;
    setEditing(field);
    setTempVal(val);
  };

  const commitEdit = () => {
    if (!editing) return;
    const updated = { ...item };
    if (editing === "name") {
      updated.name = tempVal;
    } else if (editing === "sellPrice") {
      updated.sellPrice = Number(tempVal) || item.sellPrice;
    } else if (editing === "sellDiscount") {
      updated.sellDiscount = Number(tempVal) || item.sellDiscount;
    } else if (editing === "buyPrice") {
      updated.buyPrice = Number(tempVal) || item.buyPrice;
    } else if (editing === "buyDiscount") {
      updated.buyDiscount = Number(tempVal) || item.buyDiscount;
    } else if (editing === "note") {
      updated.note = tempVal;
    }
    onChange(updated);
    setEditing(null);
  };

  const rowBg = isEven ? "bg-white" : "bg-[oklch(0.97_0.005_255)]";
  const unavailableStyle = !item.available ? "opacity-40" : "";
  const sellBg = isEven ? "bg-[oklch(0.96_0.01_200)]" : "bg-[oklch(0.93_0.02_200)]";
  const buyBg = isEven ? "bg-[oklch(0.96_0.01_10)]" : "bg-[oklch(0.93_0.02_10)]";

  return (
    <tr className={`${rowBg} ${unavailableStyle} transition-colors hover:bg-[oklch(0.93_0.01_255)/50]`}>
      {/* 상품권명 - 모바일에서 더 크게 */}
      <td className="px-2 md:px-3 py-3 text-sm md:text-base font-medium text-[oklch(0.18_0.04_255)] text-center">
        {isAdmin && editing === "name" ? (
          <input
            ref={inputRef}
            className="editable-cell w-full text-sm border-0 bg-transparent p-0"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
          />
        ) : (
          <span
            className={isAdmin ? "cursor-text hover:underline decoration-dotted" : ""}
            onClick={() => startEdit("name", item.name)}
          >
            {item.name}
          </span>
        )}
      </td>
      {/* 파실때(이체) 가격 */}
      <td className={`${sellBg} px-1.5 md:px-3 py-3 text-xs md:text-sm text-center font-semibold text-[oklch(0.3_0.08_200)]`}>
        {isAdmin && editing === "sellPrice" ? (
          <input
            ref={inputRef}
            type="number"
            className="editable-cell w-full text-xs md:text-sm border-0 bg-transparent p-0 text-center"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
          />
        ) : (
          <span
            className={isAdmin ? "cursor-text hover:underline decoration-dotted" : ""}
            onClick={() => startEdit("sellPrice", String(item.sellPrice))}
          >
            {formatPrice(item.sellPrice)}
          </span>
        )}
      </td>
      {/* 파실때 할인율 */}
      <td className={`${sellBg} px-1 md:px-3 py-3 text-xs font-bold text-[oklch(0.3_0.08_200)] text-center`}>
        {isAdmin && editing === "sellDiscount" ? (
          <input
            ref={inputRef}
            type="number"
            step="0.1"
            className="editable-cell w-full text-xs border-0 bg-transparent p-0 text-center"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
          />
        ) : (
          <span
            className={`inline-flex items-center gap-1 ${isAdmin ? "cursor-text hover:underline decoration-dotted" : ""}`}
            onClick={() => startEdit("sellDiscount", String(item.sellDiscount))}
          >
            <span className="font-bold text-[oklch(0.3_0.08_200)]">{item.sellDiscount.toFixed(1)}%</span>
          </span>
        )}
      </td>
      {/* 사실때(현금) 가격 */}
      <td className={`${buyBg} px-1.5 md:px-3 py-3 text-xs md:text-sm text-center font-semibold text-[oklch(0.3_0.08_10)]`}>
        {isAdmin && editing === "buyPrice" ? (
          <input
            ref={inputRef}
            type="number"
            className="editable-cell w-full text-xs md:text-sm border-0 bg-transparent p-0 text-center"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
          />
        ) : (
          <span
            className={isAdmin ? "cursor-text hover:underline decoration-dotted" : ""}
            onClick={() => startEdit("buyPrice", String(item.buyPrice))}
          >
            {formatPrice(item.buyPrice)}
          </span>
        )}
      </td>
      {/* 사실때 할인율 */}
      <td className={`${buyBg} px-1 md:px-3 py-3 text-xs font-bold text-[oklch(0.3_0.08_10)] text-center`}>
        {isAdmin && editing === "buyDiscount" ? (
          <input
            ref={inputRef}
            type="number"
            step="0.1"
            className="editable-cell w-full text-xs border-0 bg-transparent p-0 text-center"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
          />
        ) : (
          <span
            className={`inline-flex items-center gap-1 ${isAdmin ? "cursor-text hover:underline decoration-dotted" : ""}`}
            onClick={() => startEdit("buyDiscount", String(item.buyDiscount))}
          >
            <span className="font-bold text-[oklch(0.3_0.08_10)]">{item.buyDiscount.toFixed(1)}%</span>
          </span>
        )}
      </td>
      {/* 비고 - 모바일에서 숨김 */}
      <td className="px-1.5 md:px-3 py-3 text-xs md:text-sm text-center text-muted-foreground hidden md:table-cell">
        {isAdmin && editing === "note" ? (
          <input
            ref={inputRef}
            className="editable-cell w-full text-xs border-0 bg-transparent p-0 text-center"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
          />
        ) : (
          <span
            className={isAdmin ? "cursor-text hover:underline decoration-dotted" : ""}
            onClick={() => startEdit("note", item.note)}
          >
            {item.note || (isAdmin ? <span className="text-muted-foreground/40 text-xs">비고 입력</span> : "-")}
          </span>
        )}
      </td>
      {/* 관리자 액션 */}
      {isAdmin && (
        <td className="px-1.5 md:px-3 py-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => onChange({ ...item, available: !item.available })}
              className={`text-xs px-1.5 md:px-2 py-0.5 rounded-full border transition-colors hidden md:inline-block ${
                item.available
                  ? "border-green-300 text-green-700 hover:bg-green-50"
                  : "border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {item.available ? "취급" : "미취급"}
            </button>
            {onMoveUp && (
              <button
                onClick={() => onMoveUp()}
                disabled={!canMoveUp}
                className="text-[oklch(0.78_0.12_80)] hover:text-[oklch(0.65_0.13_78)] disabled:opacity-30 transition-colors"
                title="위로 이동"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={() => onMoveDown()}
                disabled={!canMoveDown}
                className="text-[oklch(0.78_0.12_80)] hover:text-[oklch(0.65_0.13_78)] disabled:opacity-30 transition-colors"
                title="아래로 이동"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────
export default function Home() {
  const [data, setData] = useState<GiftCardItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const d = loadData();
    setData(d);
  }, []);

  const updateItem = (itemId: string, updated: GiftCardItem) => {
    setData((prev) =>
      prev.map((it) => (it.id === itemId ? updated : it))
    );
    setHasChanges(true);
  };

  const deleteItem = (itemId: string) => {
    setData((prev) => prev.filter((it) => it.id !== itemId));
    setHasChanges(true);
  };

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    setData((prev) => {
      const idx = prev.findIndex((it) => it.id === itemId);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;
      
      const newData = [...prev];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      [newData[idx], newData[swapIdx]] = [newData[swapIdx], newData[idx]];
      return newData;
    });
    setHasChanges(true);
  };

  const addItem = (item: Omit<GiftCardItem, "id">) => {
    const id = `item_${Date.now()}`;
    setData((prev) => [...prev, { ...item, id }]);
    setHasChanges(true);
    toast.success("항목이 추가되었습니다.");
  };

  const handleLogout = () => {
    setIsAdmin(false);
    toast.success("로그아웃되었습니다.");
  };

  const handleSave = () => {
    saveData(data);
    setHasChanges(false);
    setLastSaved(new Date());
    toast.success("저장되었습니다.");
  };

  const handleReset = () => {
    if (confirm("정말 초기화하시겠습니까? 모든 변경사항이 삭제됩니다.")) {
      const defaultData = resetToDefault();
      setData(defaultData);
      setHasChanges(false);
      toast.success("초기화되었습니다.");
    }
  };

  const groupedByCategory: Record<string, GiftCardItem[]> = {};
  data.forEach((item) => {
    if (!groupedByCategory[item.category]) {
      groupedByCategory[item.category] = [];
    }
    groupedByCategory[item.category].push(item);
  });

  const categoryOrder = [
    "대형마트", "모바일상품권", "백화점", "전자제품", "할인점",
    "주유소", "음식점", "문화", "기프트카드"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[oklch(0.98_0.001_286)]">
      {/* 스티키 헤더 */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[oklch(0.18_0.04_255)] to-[oklch(0.25_0.04_255)] text-white shadow-md">
        <div className="container flex items-center justify-between py-3 md:py-4">
          <h1 className="text-lg md:text-xl font-bold">티켓나라 스타필드수원</h1>
          <div className="flex items-center gap-2 md:gap-3">
            {isAdmin && (
              <>
                <span className="text-xs text-white/70 hidden sm:inline">
                  {hasChanges ? "변경됨" : lastSaved ? `저장됨 ${lastSaved.toLocaleTimeString("ko-KR")}` : ""}
                </span>
                <Button size="sm" onClick={handleSave} disabled={!hasChanges} className="bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm">
                  <Save className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="hidden sm:inline">저장</span>
                </Button>
              </>
            )}
            <button
              onClick={() => (isAdmin ? handleLogout() : setLoginOpen(true))}
              className="text-white/80 hover:text-white transition-colors"
              title={isAdmin ? "로그아웃" : "관리자 로그인"}
            >
              {isAdmin ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 히어로 배너 */}
        <section className="bg-gradient-to-r from-[oklch(0.18_0.04_255)] to-[oklch(0.25_0.04_255)] text-white py-8 md:py-12">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[oklch(0.85_0.15_80)]">상품권 매입·판매</h2>
            <p className="text-lg md:text-xl text-white/80 mb-6 md:mb-8">최신 시세 안내</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-[oklch(0.78_0.12_80)] flex-shrink-0" />
                <div>
                  <p className="text-xs md:text-sm text-white/70">전화문의</p>
                  <p className="text-base md:text-lg font-semibold">010-9650-5566</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-[oklch(0.78_0.12_80)] flex-shrink-0" />
                <div>
                  <p className="text-xs md:text-sm text-white/70">영업시간</p>
                  <p className="text-base md:text-lg font-semibold">10:00 ~ 19:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[oklch(0.78_0.12_80)] flex-shrink-0" />
                <div>
                  <p className="text-xs md:text-sm text-white/70">위치</p>
                  <p className="text-sm md:text-base font-semibold">수원시 장안구 수성로 157번길60</p>
                </div>
              </div>
              <a href="https://pf.kakao.com/_xnxnxnxn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors">
                <div className="w-5 h-5 md:w-6 md:h-6 text-[oklch(0.78_0.12_80)] flex-shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 5.58 2 10c0 2.54 1.19 4.85 3.15 6.37V22l4.1-2.3c.85.2 1.75.3 2.75.3 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-white/70">카카오톡 상담</p>
                  <p className="text-base md:text-lg font-semibold">채널 추가</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* 골드 구분선 */}
        <div className="h-1 bg-[oklch(0.78_0.12_80)]" />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 py-6 md:py-10">
          <div className="container">
            {/* 관리자 편집 안내 */}
            {isAdmin && (
              <div className="mb-4 flex items-center gap-2 bg-[oklch(0.78_0.12_80)/15] border border-[oklch(0.78_0.12_80)/30] rounded-xl px-4 py-3">
                <Edit3 className="w-4 h-4 text-[oklch(0.65_0.13_78)] flex-shrink-0" />
                <p className="text-xs md:text-sm text-[oklch(0.4_0.1_78)] font-medium">
                  <strong>관리자 편집 모드</strong> — 셀을 클릭하여 직접 수정하세요. 수정 후 저장 버튼을 눌러주세요.
                </p>
                {lastSaved && (
                  <span className="ml-auto text-xs text-[oklch(0.5_0.08_78)] hidden sm:inline">
                    마지막 저장: {lastSaved.toLocaleTimeString("ko-KR")}
                  </span>
                )}
              </div>
            )}

            {/* 안내문구 - 중앙정렬 */}
            <div className="mb-6 bg-white rounded-2xl border border-[oklch(0.88_0.01_255)] p-4 md:p-6 shadow-sm">
              <h3 className="font-black text-[oklch(0.18_0.04_255)] mb-3 text-lg text-center">거래 안내사항</h3>
              <ul className="space-y-2 text-sm md:text-base text-muted-foreground text-center">
                <li>구매시 방문 현금결제만 가능합니다. (수표X, 카드X)</li>
                <li>상품권 거래시 시세표와 같이 거래합니다. (도착당시 시세 적용)</li>
                <li>상품권 판매시 현금지급 가능 시세변동 (문의바람)</li>
                <li>상품권 상태(훼손, 구권)에 따라 거래불가 / 가격인하 될 수 있습니다.</li>
              </ul>
            </div>

            {/* 시세표 */}
            <div className="bg-white rounded-2xl border border-[oklch(0.88_0.01_255)] overflow-hidden shadow-sm">
              <div className="bg-[oklch(0.18_0.04_255)] text-white px-4 md:px-6 py-4">
                <h3 className="text-xl md:text-2xl font-bold"></h3>
                <p className="text-xs md:text-sm text-white/60 mt-2">77개 카테고리 / 총 78개 항목</p>
              </div>

              {/* 관리 버튼 */}
              {isAdmin && (
                <div className="px-4 md:px-6 py-3 border-b border-[oklch(0.88_0.01_255)] flex flex-wrap gap-2">
                  <button
                    onClick={() => setChangePwOpen(true)}
                    className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[oklch(0.18_0.04_255)] border border-[oklch(0.88_0.01_255)] px-2 md:px-3 py-1.5 rounded-lg hover:bg-[oklch(0.93_0.01_255)] transition-colors"
                  >
                    <Settings className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">비밀번호 변경</span>
                  </button>
                  <button
                    onClick={() => setAddItemOpen(true)}
                    className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[oklch(0.18_0.04_255)] border border-[oklch(0.88_0.01_255)] px-2 md:px-3 py-1.5 rounded-lg hover:bg-[oklch(0.93_0.01_255)] transition-colors"
                  >
                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">항목 추가</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground border border-[oklch(0.88_0.01_255)] px-2 md:px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span className="hidden sm:inline">초기화</span>
                  </button>
                </div>
              )}

              {/* 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[oklch(0.18_0.04_255)]">
                      <th className="px-2 md:px-3 py-3 text-center text-xs md:text-sm font-bold text-white/80 uppercase tracking-wider">상품권명</th>
                      <th className="bg-[oklch(0.93_0.02_200)] px-1.5 md:px-3 py-3 text-center text-xs font-bold text-[oklch(0.3_0.08_200)] uppercase tracking-wider">파실때</th>
                      <th className="bg-[oklch(0.93_0.02_200)] px-1 md:px-3 py-3 text-center text-xs font-bold text-[oklch(0.3_0.08_200)] uppercase tracking-wider">할인율</th>
                      <th className="bg-[oklch(0.93_0.02_10)] px-1.5 md:px-3 py-3 text-center text-xs font-bold text-[oklch(0.3_0.08_10)] uppercase tracking-wider">사실때</th>
                      <th className="bg-[oklch(0.93_0.02_10)] px-1 md:px-3 py-3 text-center text-xs font-bold text-[oklch(0.3_0.08_10)] uppercase tracking-wider">할인율</th>
                      <th className="px-1.5 md:px-3 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider hidden md:table-cell">비고</th>
                      {isAdmin && <th className="px-1.5 md:px-3 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">관리</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[oklch(0.92_0.005_255)]">
                    {categoryOrder.map((cat) => {
                      const items = groupedByCategory[cat] || [];
                      if (items.length === 0) return null;
                      return (
                        <React.Fragment key={`cat-${cat}`}>
                          {/* 카테고리 구분 행 */}
                          <tr className="bg-[oklch(0.93_0.01_255)]">
                            <td colSpan={isAdmin ? 7 : 6} className="px-3 md:px-6 py-2 text-xs font-bold text-[oklch(0.18_0.04_255)] uppercase tracking-wider">
                              {cat}
                            </td>
                          </tr>
                          {/* 항목 행 */}
                          {items.map((item, idx) => {
                            const itemIndex = data.findIndex(it => it.id === item.id);
                            return (
                            <PriceRow
                              key={item.id}
                              item={item}
                              isAdmin={isAdmin}
                              isEven={idx % 2 === 0}
                              onChange={(updated) => updateItem(item.id, updated)}
                              onDelete={() => deleteItem(item.id)}
                              onMoveUp={() => moveItem(item.id, 'up')}
                              onMoveDown={() => moveItem(item.id, 'down')}
                              canMoveUp={itemIndex > 0}
                              canMoveDown={itemIndex < data.length - 1}
                            />
                          );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


      </main>

      {/* 다이얼로그들 */}
      <AdminLoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setLoginOpen(false);
        }}
      />
      <ChangePasswordDialog open={changePwOpen} onClose={() => setChangePwOpen(false)} />
      <AddItemDialog open={addItemOpen} onClose={() => setAddItemOpen(false)} onAdd={addItem} />
    </div>
  );
}
