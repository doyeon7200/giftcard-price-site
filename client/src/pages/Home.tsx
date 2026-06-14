/*
 * 티켓나라 스타필드수원 — 상품권 시세 안내 메인 페이지
 * Design: Deep Navy (#0a1628) + Gold (#c9a227) — 신뢰·안정·가치
 * 풀스택 전환: tRPC + 데이터베이스 백엔드
 */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { EditableHeaderSection } from "@/components/EditableHeaderSection";
import { EditableTradingInfo } from "@/components/EditableTradingInfo";
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
  Edit3,
  ChevronUp,
  ChevronDown,
  Download,
} from "lucide-react";

type GiftCardItem = {
  id: number;
  name: string;
  category: string;
  sellPrice: number;
  sellDiscount: number;
  buyPrice: number;
  buyDiscount: number;
  note: string | null;
  available: boolean;
  displayOrder: number;
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    minimumFractionDigits: 0,
  }).format(price);
}

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
  const { user } = useAuth();

  const handleLogin = () => {
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }
    if (user.role !== "admin") {
      setError("관리자 권한이 없습니다.");
      return;
    }
    setPassword("");
    setError("");
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>관리자 확인</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            관리자 권한으로 로그인되었습니다. 편집 모드를 활성화하시겠습니까?
          </p>
          <div>
            <label className="text-sm font-medium">비밀번호</label>
            <Input
              type="password"
              placeholder="관리자 비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleLogin}>확인</Button>
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
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Omit<GiftCardItem, "id" | "displayOrder">) => void;
  isLoading: boolean;
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
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            취소
          </Button>
          <Button onClick={handleAdd} disabled={isLoading}>
            {isLoading ? "추가 중..." : "추가"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 시세표 행 (편집 가능) ────────────────────────────────────────────
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
  isLoading,
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
  isLoading?: boolean;
}) {
  const [editing, setEditing] = useState<null | "name" | "sellPrice" | "sellDiscount" | "buyPrice" | "buyDiscount" | "note">(null);
  const [tempVal, setTempVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const startEdit = (field: typeof editing, val: string) => {
    if (!isAdmin || isLoading) return;
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
      <td className="px-2 md:px-3 py-3 text-sm md:text-base font-medium text-[oklch(0.18_0.04_255)] text-center">
        {isAdmin && editing === "name" ? (
          <input
            ref={inputRef}
            className="editable-cell w-full text-sm border-0 bg-transparent p-0"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(null);
            }}
            disabled={isLoading}
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
      <td className={`${sellBg} px-1.5 md:px-3 py-3 text-xs md:text-sm text-center font-semibold text-[oklch(0.3_0.08_200)]`}>
        {isAdmin && editing === "sellPrice" ? (
          <input
            ref={inputRef}
            type="number"
            className="editable-cell w-full text-xs md:text-sm border-0 bg-transparent p-0 text-center"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(null);
            }}
            disabled={isLoading}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(null);
            }}
            disabled={isLoading}
          />
        ) : (
          <span
            className={`inline-flex items-center gap-1 ${isAdmin ? "cursor-text hover:underline decoration-dotted" : ""}`}
            onClick={() => startEdit("sellDiscount", String(item.sellDiscount))}
          >
            <span className="font-bold text-[oklch(0.3_0.08_200)]">{(item.sellDiscount / 100).toFixed(1)}%</span>
          </span>
        )}
      </td>
      <td className={`${buyBg} px-1.5 md:px-3 py-3 text-xs md:text-sm text-center font-semibold text-[oklch(0.3_0.08_10)]`}>
        {isAdmin && editing === "buyPrice" ? (
          <input
            ref={inputRef}
            type="number"
            className="editable-cell w-full text-xs md:text-sm border-0 bg-transparent p-0 text-center"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(null);
            }}
            disabled={isLoading}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(null);
            }}
            disabled={isLoading}
          />
        ) : (
          <span
            className={`inline-flex items-center gap-1 ${isAdmin ? "cursor-text hover:underline decoration-dotted" : ""}`}
            onClick={() => startEdit("buyDiscount", String(item.buyDiscount))}
          >
            <span className="font-bold text-[oklch(0.3_0.08_10)]">{(item.buyDiscount / 100).toFixed(1)}%</span>
          </span>
        )}
      </td>
      <td className="px-1.5 md:px-3 py-3 text-xs md:text-sm text-center text-muted-foreground hidden md:table-cell">
        {isAdmin && editing === "note" ? (
          <input
            ref={inputRef}
            className="editable-cell w-full text-xs border-0 bg-transparent p-0 text-center"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(null);
            }}
            disabled={isLoading}
          />
        ) : (
          <span
            className={isAdmin ? "cursor-text hover:underline decoration-dotted" : ""}
            onClick={() => startEdit("note", item.note || "")}
          >
            {item.note || (isAdmin ? <span className="text-muted-foreground/40 text-xs">비고 입력</span> : "-")}
          </span>
        )}
      </td>
      {isAdmin && (
        <td className="px-1.5 md:px-3 py-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => onChange({ ...item, available: !item.available })}
              disabled={isLoading}
              className={`text-xs px-1.5 md:px-2 py-0.5 rounded-full border transition-colors hidden md:inline-block ${
                item.available
                  ? "border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
                  : "border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              }`}
            >
              {item.available ? "취급" : "미취급"}
            </button>
            {onMoveUp && (
              <button
                onClick={() => onMoveUp()}
                disabled={!canMoveUp || isLoading}
                className="text-[oklch(0.78_0.12_80)] hover:text-[oklch(0.65_0.13_78)] disabled:opacity-30 transition-colors"
                title="위로 이동"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={() => onMoveDown()}
                disabled={!canMoveDown || isLoading}
                className="text-[oklch(0.78_0.12_80)] hover:text-[oklch(0.65_0.13_78)] disabled:opacity-30 transition-colors"
                title="아래로 이동"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onDelete}
              disabled={isLoading}
              className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
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
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [headerData, setHeaderData] = useState({
    title: "할인상품권 구입해서 알뜰쇼핑",
    subtitle: "국내최대 상품권할인 전문거래소 - 티켓나라",
    phone: "010-9650-5566",
    hours: "10:00 ~ 19:00",
    address: "수원시 장안구 수성로 157번길60 [브리시엘상가 133호]",
  });
  const [tradingInfo, setTradingInfo] = useState([
    {
      id: "info_1",
      text: "구매시 방문 현금결제만 가능합니다. (수표X, 카드X)",
      color: "#666666",
    },
    {
      id: "info_2",
      text: "상품권 거래시 시세표와 같이 거래합니다. (도착당시 시세 적용)",
      color: "#666666",
    },
    {
      id: "info_3",
      text: "상품권 판매시 현금지급 가능 시세변동 (문의바람)",
      color: "#666666",
    },
    {
      id: "info_4",
      text: "상품권 상태(훼손, 구권)에 따라 거래불가 / 할인율 변경 될 수 있습니다.",
      color: "#666666",
    },
  ]);

  // tRPC queries and mutations
  const { data: giftcards = [], isLoading: isLoadingGiftcards, refetch } = trpc.giftcards.list.useQuery();
  const createMutation = trpc.giftcards.create.useMutation();
  const updateMutation = trpc.giftcards.update.useMutation();
  const deleteMutation = trpc.giftcards.delete.useMutation();
  const reorderMutation = trpc.giftcards.reorder.useMutation();

  const isLoading = isLoadingGiftcards || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || reorderMutation.isPending;

  const handleLogout = () => {
    setIsAdmin(false);
    toast.success("편집 모드가 비활성화되었습니다.");
  };

  const handleAddItem = async (item: Omit<GiftCardItem, "id" | "displayOrder">) => {
    try {
      await createMutation.mutateAsync({
        ...item,
        note: item.note === null ? undefined : item.note,
      });
      await refetch();
      toast.success("항목이 추가되었습니다.");
    } catch (error) {
      toast.error("항목 추가에 실패했습니다.");
      console.error(error);
    }
  };

  const handleUpdateItem = async (item: GiftCardItem) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        name: item.name,
        category: item.category,
        sellPrice: item.sellPrice,
        sellDiscount: item.sellDiscount,
        buyPrice: item.buyPrice,
        buyDiscount: item.buyDiscount,
        note: item.note || undefined,
        available: item.available,
      });
      await refetch();
      toast.success("항목이 업데이트되었습니다.");
    } catch (error) {
      toast.error("항목 업데이트에 실패했습니다.");
      console.error(error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      await refetch();
      toast.success("항목이 삭제되었습니다.");
    } catch (error) {
      toast.error("항목 삭제에 실패했습니다.");
      console.error(error);
    }
  };

  const handleMoveItem = async (id: number, direction: "up" | "down") => {
    const currentIndex = giftcards.findIndex((item) => item.id === id);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === giftcards.length - 1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const orders = giftcards.map((item, idx) => ({
      id: item.id,
      displayOrder: idx === currentIndex ? newIndex : idx === newIndex ? currentIndex : idx,
    }));

    try {
      await reorderMutation.mutateAsync({ orders });
      await refetch();
    } catch (error) {
      toast.error("순서 변경에 실패했습니다.");
      console.error(error);
    }
  };

  const exportToCSV = () => {
    const headers = ["상품권명", "카테고리", "파실때 가격", "파실때 할인율(%)", "사실때 가격", "사실때 할인율(%)", "비고", "취급 여부"];
    const rows = giftcards.map((item) => [
      item.name,
      item.category,
      item.sellPrice,
      item.sellDiscount.toFixed(1),
      item.buyPrice,
      item.buyDiscount.toFixed(1),
      item.note || "",
      item.available ? "취급" : "미취급",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `giftcard-prices-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("CSV 파일이 다운로드되었습니다.");
  };

  const exportToJSON = () => {
    const json = JSON.stringify(giftcards, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `giftcard-prices-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("JSON 파일이 다운로드되었습니다.");
  };

  const groupedByCategory: Record<string, GiftCardItem[]> = useMemo(() => {
    const grouped: Record<string, GiftCardItem[]> = {};
    giftcards.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [giftcards]);

  const categoryOrder = [
    "기프트카드",
    "문화",
    "음식점",
    "주유소",
    "할인점",
    "전자제품",
    "백화점",
    "모바일상품권",
    "대형마트",
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.98_0.001_286)]">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[oklch(0.98_0.001_286)]">
      {/* 스티키 헤더 */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[oklch(0.18_0.04_255)] to-[oklch(0.25_0.04_255)] text-white shadow-md">
        <div className="container flex items-center justify-between py-3 md:py-4">
          <h1 className="text-lg md:text-xl font-bold" style={{ color: "#ffa200", fontSize: "32px", fontWeight: "800" }}>
            티켓나라 스타필드수원
          </h1>
          <div className="flex items-center gap-2 md:gap-3">
            {isAdmin && (
              <>
                <Button size="sm" onClick={exportToCSV} disabled={isLoading} className="bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm">
                  <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="hidden sm:inline">CSV</span>
                </Button>
                <Button size="sm" onClick={exportToJSON} disabled={isLoading} className="bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm">
                  <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="hidden sm:inline">JSON</span>
                </Button>
              </>
            )}
            <button
              onClick={() => (isAdmin ? handleLogout() : setLoginOpen(true))}
              className="text-white/80 hover:text-white transition-colors"
              title={isAdmin ? "편집 모드 종료" : "편집 모드 시작"}
            >
              {isAdmin ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 히어로 배너 */}
        <EditableHeaderSection
          isAdmin={isAdmin}
          data={headerData}
          onSave={(data) => setHeaderData(data)}
        />

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
                  <strong>관리자 편집 모드</strong> — 셀을 클릭하여 직접 수정하세요. 헤더와 거래 안내사항도 수정 가능합니다.
                </p>
              </div>
            )}

            {/* 안내문구 */}
            <EditableTradingInfo
              isAdmin={isAdmin}
              items={tradingInfo}
              onSave={(items) => setTradingInfo(items)}
            />

            {/* 시세표 */}
            <div className="bg-white rounded-2xl border border-[oklch(0.88_0.01_255)] overflow-hidden shadow-sm">
              <div className="bg-[oklch(0.18_0.04_255)] text-white px-4 md:px-6 py-4">
                <h3 className="text-xl md:text-2xl font-bold">시세표</h3>
                <p className="text-xs md:text-sm text-white/60 mt-2">{giftcards.length}개 상품권</p>
              </div>

              {/* 관리 버튼 */}
              {isAdmin && (
                <div className="px-4 md:px-6 py-3 border-b border-[oklch(0.88_0.01_255)] flex flex-wrap gap-2">
                  <button
                    onClick={() => setAddItemOpen(true)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[oklch(0.18_0.04_255)] border border-[oklch(0.88_0.01_255)] px-2 md:px-3 py-1.5 rounded-lg hover:bg-[oklch(0.93_0.01_255)] transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">항목 추가</span>
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
                          <tr className="bg-[oklch(0.93_0.01_255)]">
                            <td colSpan={isAdmin ? 7 : 6} className="px-3 md:px-6 py-2 text-xs font-bold text-[oklch(0.18_0.04_255)] uppercase tracking-wider">
                              {cat}
                            </td>
                          </tr>
                          {items.map((item, idx) => {
                            const itemIndex = giftcards.findIndex((it) => it.id === item.id);
                            return (
                              <PriceRow
                                key={item.id}
                                item={item}
                                isAdmin={isAdmin}
                                isEven={idx % 2 === 0}
                                onChange={(updated) => handleUpdateItem(updated)}
                                onDelete={() => handleDeleteItem(item.id)}
                                onMoveUp={() => handleMoveItem(item.id, "up")}
                                onMoveDown={() => handleMoveItem(item.id, "down")}
                                canMoveUp={itemIndex > 0}
                                canMoveDown={itemIndex < giftcards.length - 1}
                                isLoading={isLoading}
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

            {/* 지도 섹션 */}
            <div className="mt-8 md:mt-12">
              <div className="bg-white rounded-2xl border border-[oklch(0.88_0.01_255)] overflow-hidden shadow-sm">
                <div className="bg-[oklch(0.18_0.04_255)] text-white px-4 md:px-6 py-4">
                  <h3 className="text-xl md:text-2xl font-bold">오시는 길</h3>
                </div>
                <div className="p-4 md:p-6">
                  <img
                    src="/manus-storage/starfield-suwon-map_2785ec6d.jpg"
                    alt="티켓나라 스타필드수원 위치 지도"
                    className="w-full h-auto rounded-lg border-2 border-[oklch(0.78_0.12_80)]"
                  />
                </div>
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
      <AddItemDialog open={addItemOpen} onClose={() => setAddItemOpen(false)} onAdd={handleAddItem} isLoading={isLoading} />
    </div>
  );
}
