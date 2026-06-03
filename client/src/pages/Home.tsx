/**
 * 티켓나라 스타필드수원 — 상품권 시세 안내 메인 페이지
 * Design: Deep Navy (#0a1628) + Gold (#FFA500) — 신뢰·안정·가치
 * Layout: 스티키 헤더 → 히어로 배너 → 안내문구 → 통합 시세표 (카테고리 탭 없음) → 푸터
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

  const handleSubmit = () => {
    if (password === getAdminPassword()) {
      onSuccess();
      setPassword("");
    } else {
      toast.error("비밀번호가 틀렸습니다.");
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
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit}>로그인</Button>
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
  const [newPassword, setNewPassword] = useState("");

  const handleChange = () => {
    if (!newPassword.trim()) {
      toast.error("새 비밀번호를 입력하세요.");
      return;
    }
    setAdminPassword(newPassword);
    toast.success("비밀번호가 변경되었습니다.");
    setNewPassword("");
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
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChange()}
            autoFocus
          />
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

// ─── 항목 추가 다이얼로그 ───────────────────────────────────────────────────
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
  const [sellPrice, setSellPrice] = useState("100000");
  const [sellDiscount, setSellDiscount] = useState("3.0");
  const [buyPrice, setBuyPrice] = useState("100000");
  const [buyDiscount, setBuyDiscount] = useState("3.0");

  const handleAdd = () => {
    if (!name.trim()) {
      toast.error("상품권명을 입력하세요.");
      return;
    }
    onAdd({
      name: name.trim(),
      category,
      sellPrice: Number(sellPrice) || 100000,
      sellDiscount: Number(sellDiscount) || 0,
      buyPrice: Number(buyPrice) || 100000,
      buyDiscount: Number(buyDiscount) || 0,
      note: "",
      available: true,
    });
    setName("");
    setSellPrice("100000");
    setSellDiscount("3.0");
    setBuyPrice("100000");
    setBuyDiscount("3.0");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>항목 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold mb-1">상품권명</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
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
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1">파실때(이체)</label>
              <Input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">할인율(%)</label>
              <Input type="number" step="0.1" value={sellDiscount} onChange={(e) => setSellDiscount(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1">사실때(현금)</label>
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
  // 열별 배경색
  const sellBg = isEven ? "bg-[oklch(0.96_0.01_200)]" : "bg-[oklch(0.93_0.02_200)]";
  const buyBg = isEven ? "bg-[oklch(0.96_0.01_10)]" : "bg-[oklch(0.93_0.02_10)]";

  return (
    <tr className={`${rowBg} ${unavailableStyle} transition-colors hover:bg-[oklch(0.93_0.01_255)/50]`}>
      {/* 상품권명 */}
      <td className="px-3 py-3 text-base font-medium text-[oklch(0.18_0.04_255)] text-center">
        {isAdmin && editing === "name" ? (
          <input
            ref={inputRef}
            className="editable-cell w-full text-base border-0 bg-transparent p-0"
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
      <td className={`${sellBg} px-3 py-3 text-base text-center font-semibold text-[oklch(0.3_0.08_200)]`}>
        {isAdmin && editing === "sellPrice" ? (
          <input
            ref={inputRef}
            type="number"
            className="editable-cell w-full text-base border-0 bg-transparent p-0 text-center"
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
      <td className={`${sellBg} px-3 py-3 text-base text-center`}>
        {isAdmin && editing === "sellDiscount" ? (
          <input
            ref={inputRef}
            type="number"
            step="0.1"
            className="editable-cell w-16 text-base border-0 bg-transparent p-0 text-center"
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
      <td className={`${buyBg} px-3 py-3 text-base text-center font-semibold text-[oklch(0.3_0.08_10)]`}>
        {isAdmin && editing === "buyPrice" ? (
          <input
            ref={inputRef}
            type="number"
            className="editable-cell w-full text-base border-0 bg-transparent p-0 text-center"
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
      <td className={`${buyBg} px-3 py-3 text-base text-center`}>
        {isAdmin && editing === "buyDiscount" ? (
          <input
            ref={inputRef}
            type="number"
            step="0.1"
            className="editable-cell w-16 text-base border-0 bg-transparent p-0 text-center"
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
      {/* 비고 */}
      <td className="px-3 py-3 text-base text-center text-muted-foreground bg-white">
        {isAdmin && editing === "note" ? (
          <input
            ref={inputRef}
            className="editable-cell w-full text-base border-0 bg-transparent p-0 text-center"
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
        <td className="px-3 py-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => onChange({ ...item, available: !item.available })}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                item.available
                  ? "border-green-300 text-green-700 hover:bg-green-50"
                  : "border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {item.available ? "취급중" : "미취급"}
            </button>
            {onMoveUp && (
              <button
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className="text-blue-400 hover:text-blue-600 disabled:text-gray-300 transition-colors text-lg"
                title="위로 이동"
              >
                ↑
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className="text-blue-400 hover:text-blue-600 disabled:text-gray-300 transition-colors text-lg"
                title="아래로 이동"
              >
                ↓
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

// ─── 메인 페이지 ────────────────────────────────────────────────────────────
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

  const getItemIndex = (itemId: string) => data.findIndex((it) => it.id === itemId);

  const handleSave = () => {
    saveData(data);
    setHasChanges(false);
    setLastSaved(new Date());
    toast.success("저장되었습니다.", { icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> });
  };

  const handleReset = () => {
    if (!confirm("모든 시세를 초기값으로 되돌리겠습니까?")) return;
    const d = resetToDefault();
    setData(d);
    setHasChanges(false);
    toast.info("초기값으로 복원되었습니다.");
  };

  const handleLogout = () => {
    setIsAdmin(false);
    if (hasChanges) {
      saveData(data);
      toast.success("변경사항이 자동 저장되었습니다.");
    }
  };

  const now = new Date();
  const timeStr = now.toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });

  // 카테고리별로 그룹화 (표시용)
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
      <header className="sticky top-0 z-50 bg-white border-b border-[oklch(0.92_0.004_286)]">
        <div className="container flex items-center justify-between py-3">
          <h1 className="text-lg font-bold text-[oklch(0.18_0.04_255)]">티켓나라 스타필드수원</h1>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <>
                <span className="text-xs text-muted-foreground">
                  {hasChanges ? "변경됨" : lastSaved ? `저장됨 ${lastSaved.toLocaleTimeString("ko-KR")}` : ""}
                </span>
                <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
                  <Save className="w-4 h-4 mr-1" />
                  저장
                </Button>
              </>
            )}
            <button
              onClick={() => (isAdmin ? handleLogout() : setLoginOpen(true))}
              className="text-[oklch(0.78_0.12_80)] hover:text-[oklch(0.6_0.15_80)] transition-colors"
              title={isAdmin ? "로그아웃" : "관리자 로그인"}
            >
              {isAdmin ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 히어로 배너 */}
        <section className="bg-gradient-to-r from-[oklch(0.18_0.04_255)] to-[oklch(0.25_0.04_255)] text-white py-12">
          <div className="container">
            <h2 className="text-4xl font-bold mb-2">상품권 매입·판매</h2>
            <p className="text-xl text-white/80 mb-8">최신 시세 안내</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <Phone className="w-6 h-6 text-[oklch(0.78_0.12_80)]" />
                <div>
                  <p className="text-sm text-white/70">전화문의</p>
                  <p className="text-lg font-semibold">010-9650-5566</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <Clock className="w-6 h-6 text-[oklch(0.78_0.12_80)]" />
                <div>
                  <p className="text-sm text-white/70">영업시간</p>
                  <p className="text-lg font-semibold">10:00 ~ 19:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <MapPin className="w-6 h-6 text-[oklch(0.78_0.12_80)]" />
                <div>
                  <p className="text-sm text-white/70">위치</p>
                  <p className="text-lg font-semibold">수원시 장안구 수성로 157번길60</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 거래 안내사항 */}
        <section className="py-8 bg-white border-b border-[oklch(0.92_0.004_286)]">
          <div className="container">
            <div className="bg-[oklch(0.97_0.005_255)] rounded-lg p-6 border border-[oklch(0.92_0.004_286)]">
              <h3 className="text-lg font-bold text-[oklch(0.18_0.04_255)] mb-4 text-center">거래 안내사항</h3>
              <ul className="space-y-2 text-center text-sm text-[oklch(0.35_0.05_65)]">
                <li>- 구매시 방문 현금결제만 가능합니다. (수표, 카드X)</li>
                <li>- 상품권 거래시 시세표와 길이 거래합니다. (도착담시 시세 적용)</li>
                <li>- 상품권 판매시 원칙적으로 가능 시세번호 (문의바람)</li>
                <li>- 상품권 상태(훼손, 구권)에 따라 거래불가 / 가격인하 될 수 있습니다.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 시세표 */}
        <section className="py-8">
          <div className="container">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* 제목 */}
              <div className="bg-black px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">상품권 시세표</h3>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setAddItemOpen(true)} className="text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        추가
                      </Button>
                      <button
                        onClick={() => setChangePwOpen(true)}
                        className="text-white/60 hover:text-white transition-colors"
                        title="설정"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleReset}
                        className="text-white/60 hover:text-white transition-colors"
                        title="초기화"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/60 mt-2">77개 카테고리 / 총 78개 항목</p>
              </div>

              {/* 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[oklch(0.18_0.04_255)]">
                      <th className="px-3 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">상품권명</th>
                      <th className="bg-[oklch(0.93_0.02_200)] px-3 py-3 text-center text-xs font-bold text-[oklch(0.3_0.08_200)] uppercase tracking-wider">파실때(이체)</th>
                      <th className="bg-[oklch(0.93_0.02_200)] px-3 py-3 text-center text-xs font-bold text-[oklch(0.3_0.08_200)] uppercase tracking-wider">할인율</th>
                      <th className="bg-[oklch(0.93_0.02_10)] px-3 py-3 text-center text-xs font-bold text-[oklch(0.3_0.08_10)] uppercase tracking-wider">사실때(현금)</th>
                      <th className="bg-[oklch(0.93_0.02_10)] px-3 py-3 text-center text-xs font-bold text-[oklch(0.3_0.08_10)] uppercase tracking-wider">할인율</th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">비고</th>
                      {isAdmin && <th className="px-3 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">관리</th>}
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
                            <td colSpan={isAdmin ? 7 : 6} className="px-3 py-2 text-xs font-bold text-[oklch(0.18_0.04_255)] uppercase tracking-wider">
                              {cat}
                            </td>
                          </tr>
                          {/* 항목 행 */}
                          {items.map((item, idx) => {
                            const itemIndex = getItemIndex(item.id);
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
                    {data.length === 0 && (
                      <tr>
                        <td colSpan={isAdmin ? 7 : 6} className="text-center py-12 text-muted-foreground text-base">
                          등록된 항목이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
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
