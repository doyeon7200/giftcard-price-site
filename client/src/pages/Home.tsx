/**
 * 티켓나라 스타필드수원 — 상품권 시세 안내 메인 페이지
 * Design: Deep Navy (#0a1628) + Gold (#c9a227) — 신뢰·안정·가치
 * Layout: 스티키 헤더 → 히어로 배너 → 안내문구 → 통합 시세표 (카테고리 탭 없음) → 푸터
 */
import { useState, useEffect, useRef } from "react";
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
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const handleSubmit = () => {
    if (pw === getAdminPassword()) {
      setErr(false);
      setPw("");
      onSuccess();
    } else {
      setErr(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setPw(""); setErr(false); onClose(); } }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[oklch(0.18_0.04_255)]">
            <Lock className="w-5 h-5 text-[oklch(0.78_0.12_80)]" />
            관리자 로그인
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-muted-foreground mb-3">비밀번호를 입력하세요.</p>
          <Input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className={err ? "border-red-500" : ""}
            autoFocus
          />
          {err && <p className="text-xs text-red-500 mt-1">비밀번호가 올바르지 않습니다.</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button
            onClick={handleSubmit}
            className="bg-[oklch(0.18_0.04_255)] text-[oklch(0.97_0.005_255)] hover:bg-[oklch(0.24_0.05_255)]"
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 비밀번호 변경 다이얼로그 ─────────────────────────────────────────────
function ChangePwDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSave = () => {
    if (cur !== getAdminPassword()) { toast.error("현재 비밀번호가 올바르지 않습니다."); return; }
    if (next.length < 4) { toast.error("새 비밀번호는 4자 이상이어야 합니다."); return; }
    if (next !== confirm) { toast.error("새 비밀번호가 일치하지 않습니다."); return; }
    setAdminPassword(next);
    toast.success("비밀번호가 변경되었습니다.");
    setCur(""); setNext(""); setConfirm("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[oklch(0.78_0.12_80)]" />
            비밀번호 변경
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input type="password" placeholder="현재 비밀번호" value={cur} onChange={(e) => setCur(e.target.value)} />
          <Input type="password" placeholder="새 비밀번호 (4자 이상)" value={next} onChange={(e) => setNext(e.target.value)} />
          <Input type="password" placeholder="새 비밀번호 확인" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={handleSave} className="bg-[oklch(0.18_0.04_255)] text-white hover:bg-[oklch(0.24_0.05_255)]">변경</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 항목 추가 다이얼로그 ─────────────────────────────────────────────────
function AddItemDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Omit<GiftCardItem, "id">) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    category: "대형마트",
    sellPrice: 95000,
    sellDiscount: 5.0,
    buyPrice: 97000,
    buyDiscount: 3.0,
    note: "",
    available: true,
  });

  const handleAdd = () => {
    if (!form.name.trim()) { toast.error("상품권명을 입력하세요."); return; }
    onAdd({
      name: form.name,
      category: form.category,
      sellPrice: form.sellPrice,
      sellDiscount: form.sellDiscount,
      buyPrice: form.buyPrice,
      buyDiscount: form.buyDiscount,
      note: form.note,
      available: form.available,
    });
    setForm({ name: "", category: "대형마트", sellPrice: 95000, sellDiscount: 5.0, buyPrice: 97000, buyDiscount: 3.0, note: "", available: true });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[oklch(0.78_0.12_80)]" />
            항목 추가
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">상품권명</label>
            <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="예: 롯데 500만원이상" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">카테고리</label>
            <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-2 py-1 border rounded text-sm">
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
              <label className="text-xs text-muted-foreground mb-1 block">파실때(이체) 가격</label>
              <Input type="number" value={form.sellPrice} onChange={(e) => setForm(f => ({ ...f, sellPrice: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">할인율 (%)</label>
              <Input type="number" step="0.1" value={form.sellDiscount} onChange={(e) => setForm(f => ({ ...f, sellDiscount: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">사실때(현금) 가격</label>
              <Input type="number" value={form.buyPrice} onChange={(e) => setForm(f => ({ ...f, buyPrice: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">할인율 (%)</label>
              <Input type="number" step="0.1" value={form.buyDiscount} onChange={(e) => setForm(f => ({ ...f, buyDiscount: Number(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">비고</label>
            <Input value={form.note} onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))} placeholder="선택사항" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={handleAdd} className="bg-[oklch(0.18_0.04_255)] text-white hover:bg-[oklch(0.24_0.05_255)]">추가</Button>
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
}: {
  item: GiftCardItem;
  isAdmin: boolean;
  onChange: (updated: GiftCardItem) => void;
  onDelete: () => void;
  isEven: boolean;
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

  return (
    <tr className={`${rowBg} ${unavailableStyle} transition-colors hover:bg-[oklch(0.93_0.01_255)/50]`}>
      {/* 상품권명 */}
      <td className="px-3 py-3 text-sm font-medium text-[oklch(0.18_0.04_255)]">
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
      <td className="px-3 py-3 text-sm text-center font-semibold text-[oklch(0.35_0.1_145)]">
        {isAdmin && editing === "sellPrice" ? (
          <input
            ref={inputRef}
            type="number"
            className="editable-cell w-24 text-sm border-0 bg-transparent p-0 text-center"
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
      <td className="px-3 py-3 text-sm text-center">
        {isAdmin && editing === "sellDiscount" ? (
          <input
            ref={inputRef}
            type="number"
            step="0.1"
            className="editable-cell w-16 text-sm border-0 bg-transparent p-0 text-center"
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
            <span className="font-bold text-[oklch(0.45_0.15_145)]">{item.sellDiscount.toFixed(1)}%</span>
          </span>
        )}
      </td>
      {/* 사실때(현금) 가격 */}
      <td className="px-3 py-3 text-sm text-center font-semibold text-[oklch(0.35_0.1_255)]">
        {isAdmin && editing === "buyPrice" ? (
          <input
            ref={inputRef}
            type="number"
            className="editable-cell w-24 text-sm border-0 bg-transparent p-0 text-center"
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
      <td className="px-3 py-3 text-sm text-center">
        {isAdmin && editing === "buyDiscount" ? (
          <input
            ref={inputRef}
            type="number"
            step="0.1"
            className="editable-cell w-16 text-sm border-0 bg-transparent p-0 text-center"
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
            <span className="font-bold text-[oklch(0.45_0.12_255)]">{item.buyDiscount.toFixed(1)}%</span>
          </span>
        )}
      </td>
      {/* 비고 */}
      <td className="px-3 py-3 text-sm text-center text-muted-foreground">
        {isAdmin && editing === "note" ? (
          <input
            ref={inputRef}
            className="editable-cell w-full text-sm border-0 bg-transparent p-0 text-center"
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
          <div className="flex items-center justify-center gap-2">
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

  const addItem = (item: Omit<GiftCardItem, "id">) => {
    const id = `item_${Date.now()}`;
    setData((prev) => [...prev, { ...item, id }]);
    setHasChanges(true);
    toast.success("항목이 추가되었습니다.");
  };

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

  const categoryOrder = ["대형마트", "모바일상품권", "백화점", "전자제품", "할인점", "주유소", "음식점", "문화", "기프트카드"];

  return (
    <div className="min-h-screen flex flex-col bg-[oklch(0.97_0.005_255)]">
      {/* ── 상단 헤더 ── */}
      <header className="sticky top-0 z-50 bg-[oklch(0.18_0.04_255)] shadow-lg">
        <div className="container">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* 로고 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[oklch(0.78_0.12_80)] flex items-center justify-center shadow-md">
                <span className="text-[oklch(0.18_0.04_255)] font-black text-base md:text-lg leading-none">티</span>
              </div>
              <div>
                <h1 className="text-white font-black text-base md:text-lg leading-tight tracking-tight">
                  티켓나라 스타필드수원
                </h1>
                <p className="text-[oklch(0.78_0.12_80)] text-[10px] md:text-xs font-medium leading-none mt-0.5">
                  상품권 매입·판매 시세 안내
                </p>
              </div>
            </div>

            {/* 우측 액션 */}
            <div className="flex items-center gap-2 md:gap-3">
              {isAdmin ? (
                <>
                  {hasChanges && (
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 bg-[oklch(0.78_0.12_80)] text-[oklch(0.15_0.04_255)] text-xs md:text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-[oklch(0.85_0.12_80)] transition-colors shadow"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">저장</span>
                    </button>
                  )}
                  <button
                    onClick={() => setChangePwOpen(true)}
                    className="text-white/60 hover:text-white transition-colors"
                    title="비밀번호 변경"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs md:text-sm transition-colors"
                  >
                    <Unlock className="w-4 h-4" />
                    <span className="hidden sm:inline">관리자 종료</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-xs transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">관리자</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── 공지 배너 ── */}
      <div className="bg-[oklch(0.78_0.12_80)] text-[oklch(0.15_0.04_255)]">
        <div className="container">
          <div className="flex items-center gap-2 py-2 text-xs md:text-sm font-medium overflow-hidden">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="whitespace-nowrap">시세는 수시로 변동될 수 있습니다.</span>
            <span className="mx-2 text-[oklch(0.15_0.04_255)/50]">|</span>
            <span className="whitespace-nowrap">최종 업데이트: {timeStr}</span>
          </div>
        </div>
      </div>

      {/* ── 히어로 섹션 ── */}
      <section className="bg-[oklch(0.18_0.04_255)] text-white py-8 md:py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-4xl font-black leading-tight mb-2">
                상품권 매입·판매
                <br />
                <span className="text-[oklch(0.78_0.12_80)]">최신 시세 안내</span>
              </h2>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                티켓나라 스타필드수원에서 투명하고 정직한 시세로 상품권을 매입·판매합니다.
                방문 전 시세를 확인하세요.
              </p>
            </div>
            {/* 연락처 카드 */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="flex items-center gap-3 bg-[oklch(0.24_0.05_255)] rounded-xl px-4 py-3 min-w-[180px]">
                <div className="w-9 h-9 rounded-lg bg-[oklch(0.78_0.12_80)/20] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[oklch(0.78_0.12_80)]" />
                </div>
                <div>
                  <p className="text-white/50 text-[10px] font-medium uppercase tracking-wide">전화문의</p>
                  <p className="text-white font-bold text-base leading-tight">010-9650-5566</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[oklch(0.24_0.05_255)] rounded-xl px-4 py-3 min-w-[180px]">
                <div className="w-9 h-9 rounded-lg bg-[oklch(0.78_0.12_80)/20] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[oklch(0.78_0.12_80)]" />
                </div>
                <div>
                  <p className="text-white/50 text-[10px] font-medium uppercase tracking-wide">영업시간</p>
                  <p className="text-white font-bold text-sm leading-tight">10:00 ~ 19:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[oklch(0.24_0.05_255)] rounded-xl px-4 py-3 min-w-[200px]">
                <div className="w-9 h-9 rounded-lg bg-[oklch(0.78_0.12_80)/20] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[oklch(0.78_0.12_80)]" />
                </div>
                <div>
                  <p className="text-white/50 text-[10px] font-medium uppercase tracking-wide">위치</p>
                  <p className="text-white font-bold text-xs leading-tight">수원시 장안구 수성로 157번길60</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 골드 구분선 ── */}
      <div className="gold-divider" />

      {/* ── 메인 콘텐츠 ── */}
      <main className="flex-1 py-6 md:py-10">
        <div className="container">
          {/* 관리자 편집 안내 */}
          {isAdmin && (
            <div className="mb-4 flex items-center gap-2 bg-[oklch(0.78_0.12_80)/15] border border-[oklch(0.78_0.12_80)/30] rounded-xl px-4 py-3">
              <Edit3 className="w-4 h-4 text-[oklch(0.65_0.13_78)]" />
              <p className="text-sm text-[oklch(0.4_0.1_78)] font-medium">
                <strong>관리자 편집 모드</strong> — 셀을 클릭하여 직접 수정하세요. 수정 후 저장 버튼을 눌러주세요.
              </p>
              {lastSaved && (
                <span className="ml-auto text-xs text-[oklch(0.5_0.08_78)]">
                  마지막 저장: {lastSaved.toLocaleTimeString("ko-KR")}
                </span>
              )}
            </div>
          )}

          {/* 안내문구 */}
          <div className="mb-6 bg-white rounded-2xl border border-[oklch(0.88_0.01_255)] p-4 md:p-6 shadow-sm">
            <h3 className="font-black text-[oklch(0.18_0.04_255)] mb-3 text-lg">거래 안내사항</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-[oklch(0.78_0.12_80)] font-bold flex-shrink-0">-</span>
                <span>구매시 방문 현금결제만 가능합니다. (수표X, 카드X)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[oklch(0.78_0.12_80)] font-bold flex-shrink-0">-</span>
                <span>상품권 거래시 시세표와 같이 거래합니다. (도착당시 시세 적용)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[oklch(0.78_0.12_80)] font-bold flex-shrink-0">-</span>
                <span>상품권 판매시 현금지급 가능 시세변동 (문의바람)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[oklch(0.78_0.12_80)] font-bold flex-shrink-0">-</span>
                <span>상품권 상태(훼손, 구권)에 따라 거래불가 / 가격변동 될 수 있습니다.</span>
              </li>
            </ul>
          </div>

          {/* 통합 시세표 */}
          <div className="bg-white rounded-2xl shadow-sm border border-[oklch(0.88_0.01_255)] overflow-hidden">
            {/* 섹션 헤더 */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[oklch(0.88_0.01_255)]">
              <div>
                <h3 className="font-black text-[oklch(0.18_0.04_255)] text-lg leading-tight">
                  상품권 시세표
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.filter(i => i.available).length}개 취급 중 / 총 {data.length}개 항목
                </p>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAddItemOpen(true)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[oklch(0.18_0.04_255)] border border-[oklch(0.88_0.01_255)] px-3 py-1.5 rounded-lg hover:bg-[oklch(0.93_0.01_255)] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    항목 추가
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground border border-[oklch(0.88_0.01_255)] px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">초기화</span>
                  </button>
                </div>
              )}
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[oklch(0.18_0.04_255)]">
                    <th className="px-3 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider">상품권명</th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-[oklch(0.78_0.12_80)] uppercase tracking-wider">파실때(이체)</th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-[oklch(0.78_0.12_80)] uppercase tracking-wider">할인율</th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-[oklch(0.7_0.1_255)] uppercase tracking-wider">사실때(현금)</th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-[oklch(0.7_0.1_255)] uppercase tracking-wider">할인율</th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">비고</th>
                    {isAdmin && <th className="px-3 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">관리</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[oklch(0.92_0.005_255)]">
                  {categoryOrder.map((cat) => {
                    const items = groupedByCategory[cat] || [];
                    if (items.length === 0) return null;
                    return (
                      <>
                        {/* 카테고리 구분 행 */}
                        <tr key={`cat-${cat}`} className="bg-[oklch(0.93_0.01_255)]">
                          <td colSpan={isAdmin ? 7 : 6} className="px-3 py-2 text-xs font-bold text-[oklch(0.18_0.04_255)] uppercase tracking-wider">
                            {cat}
                          </td>
                        </tr>
                        {/* 항목 행 */}
                        {items.map((item, idx) => (
                          <PriceRow
                            key={item.id}
                            item={item}
                            isAdmin={isAdmin}
                            isEven={idx % 2 === 0}
                            onChange={(updated) => updateItem(item.id, updated)}
                            onDelete={() => deleteItem(item.id)}
                          />
                        ))}
                      </>
                    );
                  })}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 6} className="text-center py-12 text-muted-foreground text-sm">
                        등록된 항목이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* ── 골드 구분선 ── */}
      <div className="gold-divider" />

      {/* ── 푸터 ── */}
      <footer className="bg-[oklch(0.18_0.04_255)] text-white/60 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-md bg-[oklch(0.78_0.12_80)] flex items-center justify-center">
                  <span className="text-[oklch(0.18_0.04_255)] font-black text-sm">티</span>
                </div>
                <span className="text-white font-bold text-base">티켓나라 스타필드수원</span>
              </div>
              <p className="text-xs">수원시 장안구 수성로 157번길60 [화서역푸르지오 브리시엘상가 133호]</p>
              <p className="text-xs mt-1">Tel: 010-9650-5566 | 평일 10:00 ~ 19:00</p>
            </div>
            <div className="text-xs">
              <p>© 2024 티켓나라 스타필드수원. All rights reserved.</p>
              <p className="mt-1 text-white/40">시세는 시장 상황에 따라 변동될 수 있습니다.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ── 다이얼로그 ── */}
      <AdminLoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => { setIsAdmin(true); setLoginOpen(false); toast.success("관리자 모드가 활성화되었습니다."); }}
      />
      <ChangePwDialog open={changePwOpen} onClose={() => setChangePwOpen(false)} />
      <AddItemDialog
        open={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        onAdd={addItem}
      />

      {/* ── 플로팅 저장 버튼 (모바일 관리자) ── */}
      {isAdmin && hasChanges && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[oklch(0.78_0.12_80)] text-[oklch(0.15_0.04_255)] font-bold px-4 py-3 rounded-2xl shadow-xl hover:bg-[oklch(0.85_0.12_80)] transition-all active:scale-95"
          >
            <Save className="w-5 h-5" />
            저장하기
          </button>
        </div>
      )}
    </div>
  );
}
