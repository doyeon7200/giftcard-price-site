import React, { useState, useEffect } from "react";
import { Edit3, Save, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TradingInfoItem {
  id: string;
  text: string;
  color: string;
}

interface EditableTradingInfoProps {
  isAdmin: boolean;
  items: TradingInfoItem[];
  onSave: (items: TradingInfoItem[]) => void;
}

export function EditableTradingInfo({ isAdmin, items, onSave }: EditableTradingInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState<TradingInfoItem[]>(items);

  useEffect(() => {
    setEditItems(items);
  }, [items]);

  const handleSave = () => {
    onSave(editItems);
    setIsEditing(false);
  };

  const handleAddItem = () => {
    setEditItems([
      ...editItems,
      {
        id: `item_${Date.now()}`,
        text: "새로운 안내사항",
        color: "#666666",
      },
    ]);
  };

  const handleDeleteItem = (id: string) => {
    setEditItems(editItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: "text" | "color", value: string) => {
    setEditItems(
      editItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  if (isEditing && isAdmin) {
    return (
      <div className="mb-6 bg-white rounded-2xl border border-[oklch(0.88_0.01_255)] p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-[oklch(0.18_0.04_255)] text-lg">거래 안내사항 (편집 모드)</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              추가
            </Button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {editItems.map((item) => (
            <div key={item.id} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <Input
                  value={item.text}
                  onChange={(e) => handleUpdateItem(item.id, "text", e.target.value)}
                  placeholder="안내사항 입력"
                  className="text-sm"
                />
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">글자색:</label>
                  <input
                    type="color"
                    value={item.color}
                    onChange={(e) => handleUpdateItem(item.id, "color", e.target.value)}
                    className="w-8 h-8 cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">{item.color}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteItem(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-end pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            <X className="w-4 h-4 mr-1" />
            취소
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            저장
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white rounded-2xl border border-[oklch(0.88_0.01_255)] p-4 md:p-6 shadow-sm relative group">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-[oklch(0.18_0.04_255)] text-lg">거래 안내사항</h3>
        {isAdmin && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
            title="거래 안내사항 수정"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="space-y-2 text-sm md:text-base text-center flex flex-col items-center justify-center">
        {items.map((item) => (
          <p key={item.id} style={{ color: item.color, fontWeight: "700" }} className="w-full">
            {item.text}
          </p>
        ))}
      </div>
    </div>
  );
}
