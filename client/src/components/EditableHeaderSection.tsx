import React, { useState, useRef, useEffect } from "react";
import { Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderData {
  title: string;
  subtitle: string;
  phone: string;
  hours: string;
  address: string;
}

interface EditableHeaderSectionProps {
  isAdmin: boolean;
  data: HeaderData;
  onSave: (data: HeaderData) => void;
}

export function EditableHeaderSection({ isAdmin, data, onSave }: EditableHeaderSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<HeaderData>(data);
  const [titleColor, setTitleColor] = useState("#ffa200");
  const [subtitleColor, setSubtitleColor] = useState("#ffa200");

  useEffect(() => {
    setEditData(data);
  }, [data]);

  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
  };

  if (isEditing && isAdmin) {
    return (
      <section className="bg-gradient-to-r from-[oklch(0.18_0.04_255)] to-[oklch(0.25_0.04_255)] text-white py-8 md:py-12">
        <div className="container">
          <div className="space-y-4 bg-white/10 rounded-lg p-4 md:p-6">
            <div>
              <label className="text-xs text-white/70 font-semibold">제목</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="text-black"
                  placeholder="제목 입력"
                />
                <input
                  type="color"
                  value={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                  className="w-10 h-10 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/70 font-semibold">부제목</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={editData.subtitle}
                  onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
                  className="text-black"
                  placeholder="부제목 입력"
                />
                <input
                  type="color"
                  value={subtitleColor}
                  onChange={(e) => setSubtitleColor(e.target.value)}
                  className="w-10 h-10 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/70 font-semibold">전화번호</label>
              <Input
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="text-black mt-1"
                placeholder="전화번호"
              />
            </div>

            <div>
              <label className="text-xs text-white/70 font-semibold">영업시간</label>
              <Input
                value={editData.hours}
                onChange={(e) => setEditData({ ...editData, hours: e.target.value })}
                className="text-black mt-1"
                placeholder="영업시간"
              />
            </div>

            <div>
              <label className="text-xs text-white/70 font-semibold">주소</label>
              <Input
                value={editData.address}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                className="text-black mt-1"
                placeholder="주소"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <X className="w-4 h-4 mr-1" />
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-white/30 text-white hover:bg-white/40"
              >
                <Save className="w-4 h-4 mr-1" />
                저장
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-[oklch(0.18_0.04_255)] to-[oklch(0.25_0.04_255)] text-white py-8 md:py-12 relative group">
      <div className="container">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: titleColor, fontSize: "31px" }}
            >
              {data.title}
            </h2>
            <p
              className="text-lg md:text-xl mb-6 md:mb-8"
              style={{ color: subtitleColor, fontWeight: "700" }}
            >
              {data.subtitle}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-white/60 hover:text-white transition-colors ml-2"
              title="헤더 수정"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
            <div className="w-5 h-5 md:w-6 md:h-6 text-[oklch(0.78_0.12_80)] flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-white/70">전화문의</p>
              <p className="text-base md:text-lg font-semibold" style={{ color: "#ffae00", fontSize: "24px" }}>
                {data.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
            <div className="w-5 h-5 md:w-6 md:h-6 text-[oklch(0.78_0.12_80)] flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-white/70">영업시간</p>
              <p className="text-base md:text-lg font-semibold" style={{ fontSize: "24px", color: "#ffa200" }}>
                {data.hours}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
            <div className="w-5 h-5 md:w-6 md:h-6 text-[oklch(0.78_0.12_80)] flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-white/70">위치</p>
              <p className="text-sm md:text-base font-semibold">{data.address}</p>
            </div>
          </div>

          <a
            href="https://pf.kakao.com/_RCxmGX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <div className="w-5 h-5 md:w-6 md:h-6 text-[oklch(0.78_0.12_80)] flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 5.58 2 10c0 2.54 1.19 4.85 3.15 6.37V22l4.1-2.3c.85.2 1.75.3 2.75.3 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
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
  );
}
