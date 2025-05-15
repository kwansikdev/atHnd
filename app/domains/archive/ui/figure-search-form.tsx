import type React from "react";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Search, X } from "lucide-react";
import { useNavigate } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
// import { manufacturers, series } from "@/lib/database-data";

interface ArchiveSearchFormProps {
  initialQuery?: string;
  showFilters?: boolean;
  className?: string;
}

export function FigureSearchForm({
  initialQuery = "",
  showFilters = false,
  className = "",
}: ArchiveSearchFormProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [manufacturer, setManufacturer] = useState<string>("");
  const [seriesName, setSeriesName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    }
    if (manufacturer) {
      params.set("manufacturer", manufacturer);
    }
    if (seriesName) {
      params.set("series", seriesName);
    }
    if (category) {
      params.set("category", category);
    }

    navigate(`/archive/search?${params.toString()}`);
  }

  function clearSearch() {
    setSearchTerm("");
    setManufacturer("");
    setSeriesName("");
    setCategory("");
    navigate("/archive/search");
  }

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.25,
          delay: 0.15,
        },
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.25,
        },
      },
    },
  };

  return (
    <form onSubmit={handleSearch} className={`space-y-4 ${className}`}>
      <div
        className={`flex gap-2 transition-all duration-300 ${
          isFocused ? "scale-[1.02]" : "scale-100"
        }`}
      >
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="피규어 이름, 캐릭터, 제조사 등 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pr-8 shadow-lg"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">검색어 지우기</span>
            </Button>
          )}
        </div>
        <Button type="submit" className="shadow-lg">
          <Search className="mr-2 h-4 w-4" />
          검색
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="manufacturer" className="text-sm font-medium">
                  제조사
                </label>
                <Select value={manufacturer} onValueChange={setManufacturer}>
                  <SelectTrigger id="manufacturer">
                    <SelectValue placeholder="제조사 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {manufacturers.map((m) => (
                      <SelectItem key={m.id} value={m.name}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="series" className="text-sm font-medium">
                  작품
                </label>
                <Select value={seriesName} onValueChange={setSeriesName}>
                  <SelectTrigger id="series">
                    <SelectValue placeholder="작품 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {series.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  카테고리
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="스케일">스케일</SelectItem>
                    <SelectItem value="넨드로이드">넨드로이드</SelectItem>
                    <SelectItem value="팝업 퍼레이드">팝업 퍼레이드</SelectItem>
                    <SelectItem value="피그마">피그마</SelectItem>
                    <SelectItem value="액션 피규어">액션 피규어</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(searchTerm || manufacturer || seriesName || category) &&
        showFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={clearSearch}
            className="group"
          >
            <X className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            필터 초기화
          </Button>
        )}
    </form>
  );
}

export interface Manufacturer {
  id: string;
  name: string;
  nameJp?: string;
  nameEn?: string;
  logo?: string;
  website?: string;
  description?: string;
  figureCount: number;
}

export interface Series {
  id: string;
  name: string;
  nameJp?: string;
  nameEn?: string;
  type:
    | "애니메이션"
    | "게임"
    | "만화"
    | "라이트노벨"
    | "영화"
    | "오리지널"
    | "기타";
  image?: string;
  description?: string;
  figureCount: number;
}

// 샘플 제조사 데이터
export const manufacturers: Manufacturer[] = [
  {
    id: "1",
    name: "굿스마일컴퍼니",
    nameJp: "グッドスマイルカンパニー",
    nameEn: "Good Smile Company",
    logo: "/placeholder.svg?height=100&width=200",
    website: "https://www.goodsmile.info/",
    description:
      "넨드로이드와 팝업 퍼레이드 시리즈로 유명한 일본의 피규어 제조사입니다.",
    figureCount: 12,
  },
  {
    id: "2",
    name: "알터",
    nameJp: "アルター",
    nameEn: "Alter",
    logo: "/placeholder.svg?height=100&width=200",
    website: "https://alter-web.jp/",
    description:
      "높은 퀄리티의 스케일 피규어로 유명한 일본의 피규어 제조사입니다.",
    figureCount: 8,
  },
  {
    id: "3",
    name: "맥스팩토리",
    nameJp: "マックスファクトリー",
    nameEn: "Max Factory",
    logo: "/placeholder.svg?height=100&width=200",
    website: "https://www.maxfactory.jp/",
    description:
      "피그마 시리즈와 고품질 스케일 피규어로 유명한 일본의 피규어 제조사입니다.",
    figureCount: 10,
  },
  {
    id: "4",
    name: "코토부키야",
    nameJp: "コトブキヤ",
    nameEn: "Kotobukiya",
    logo: "/placeholder.svg?height=100&width=200",
    website: "https://www.kotobukiya.co.jp/",
    description:
      "다양한 라이선스 피규어와 프라모델로 유명한 일본의 피규어 제조사입니다.",
    figureCount: 7,
  },
  {
    id: "5",
    name: "메가하우스",
    nameJp: "メガハウス",
    nameEn: "MegaHouse",
    logo: "/placeholder.svg?height=100&width=200",
    website: "https://www.megahouse.co.jp/",
    description:
      "다양한 애니메이션과 게임 캐릭터의 피규어를 제작하는 일본의 피규어 제조사입니다.",
    figureCount: 6,
  },
  {
    id: "6",
    name: "아미에이미",
    nameJp: "アミエイミ",
    nameEn: "AmiAmi",
    logo: "/placeholder.svg?height=100&width=200",
    website: "https://www.amiami.jp/",
    description:
      "다양한 피규어와 애니메이션 굿즈를 판매하는 일본의 쇼핑몰입니다.",
    figureCount: 5,
  },
];

// 샘플 시리즈 데이터
export const series: Series[] = [
  {
    id: "1",
    name: "소드 아트 온라인",
    nameJp: "ソードアート・オンライン",
    nameEn: "Sword Art Online",
    type: "애니메이션",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "가상현실 MMORPG 게임을 배경으로 한 일본의 라이트 노벨 및 애니메이션 시리즈입니다.",
    figureCount: 15,
  },
  {
    id: "2",
    name: "원신",
    nameJp: "原神",
    nameEn: "Genshin Impact",
    type: "게임",
    image: "/placeholder.svg?height=200&width=300",
    description: "miHoYo에서 개발한 오픈 월드 액션 롤플레잉 게임입니다.",
    figureCount: 12,
  },
  {
    id: "3",
    name: "Re:제로부터 시작하는 이세계 생활",
    nameJp: "Re:ゼロから始める異世界生活",
    nameEn: "Re:Zero -Starting Life in Another World-",
    type: "애니메이션",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "이세계로 소환된 주인공의 이야기를 다룬 일본의 라이트 노벨 및 애니메이션 시리즈입니다.",
    figureCount: 10,
  },
  {
    id: "4",
    name: "페이트/그랜드 오더",
    nameJp: "Fate/Grand Order",
    nameEn: "Fate/Grand Order",
    type: "게임",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "TYPE-MOON의 페이트 시리즈를 기반으로 한 모바일 RPG 게임입니다.",
    figureCount: 18,
  },
  {
    id: "5",
    name: "하츠네 미쿠",
    nameJp: "初音ミク",
    nameEn: "Hatsune Miku",
    type: "오리지널",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "크립톤 퓨처 미디어가 개발한 보컬로이드 소프트웨어의 캐릭터입니다.",
    figureCount: 20,
  },
];
