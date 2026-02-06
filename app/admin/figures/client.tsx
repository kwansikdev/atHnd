"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import Image from "next/image"

type Figure = {
  id: string
  name: string
  series: string
  character: string
  manufacturer: string
  scale: string
  category: string
  price: number
  releaseDate: string
  edition: string
  imageUrl: string
}

// Mock data - 나중에 Supabase에서 가져오도록 변경
const mockFigures: Figure[] = [
  {
    id: "1",
    name: "승리의 여신: 니케 트라나 (일반판)",
    series: "승리의 여신: 니케",
    character: "트라나",
    manufacturer: "하비비",
    scale: "스케일 피규어",
    category: "1/7",
    price: 183000,
    releaseDate: "2024-12",
    edition: "unknown",
    imageUrl: "/anime-figure-hatsune-miku.jpg",
  },
  {
    id: "2",
    name: "승리의 여신: 니케 트라나 (디럭스판)",
    series: "승리의 여신: 니케",
    character: "트라나",
    manufacturer: "하비비",
    scale: "스케일 피규어",
    category: "1/7",
    price: 205000,
    releaseDate: "2024-12",
    edition: "unknown",
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
  },
  {
    id: "3",
    name: "승리의 여신: 니케 헬름 - 성탄절의 라이트",
    series: "승리의 여신: 니케",
    character: "헬름",
    manufacturer: "맥스 팩토리",
    scale: "스케일 피규어",
    category: "1/7",
    price: 257300,
    releaseDate: "2025-02",
    edition: "unknown",
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
  },
  {
    id: "4",
    name: "승리의 여신: 니케 신데렐라 - 유리 공주",
    series: "승리의 여신: 니케",
    character: "신데렐라",
    manufacturer: "굿스마일 아츠 상하이",
    scale: "스케일 피규어",
    category: "1/7",
    price: 283000,
    releaseDate: "2025-03",
    edition: "unknown",
    imageUrl: "/anime-figure-sakura-miku-cherry-blossom.jpg",
  },
  {
    id: "5",
    name: "승리의 여신: 니케 바이퍼",
    series: "승리의 여신: 니케",
    character: "바이퍼",
    manufacturer: "디자인코코",
    scale: "스케일 피규어",
    category: "1/7",
    price: 364000,
    releaseDate: "2025-04",
    edition: "unknown",
    imageUrl: "/anime-figure-zero-two-wedding-dress.jpg",
  },
  {
    id: "6",
    name: "승리의 여신: 니케 마스트 : 윤망의 메이드 (디럭스판)",
    series: "승리의 여신: 니케",
    character: "마스트",
    manufacturer: "하비사쿠라",
    scale: "스케일 피규어",
    category: "1/7",
    price: 427998,
    releaseDate: "2025-05",
    edition: "unknown",
    imageUrl: "/anime-figure-hatsune-miku.jpg",
  },
]

const categories = [
  { id: "all", label: "전체", count: 100 },
  { id: "series", label: "작품/시리즈", count: 20 },
  { id: "manufacturer", label: "제조사", count: 15 },
  { id: "category", label: "카테고리", count: 8 },
  { id: "scale", label: "스케일", count: 6 },
  { id: "edition", label: "에디션", count: 3 },
  { id: "recent", label: "별개", count: 0 },
  { id: "wishlist", label: "출고완료", count: 45 },
]

export default function AdminFiguresClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const filteredFigures = mockFigures.filter(
    (figure) =>
      figure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      figure.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      figure.character.toLowerCase().includes(searchQuery.toLowerCase()) ||
      figure.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFigureClick = (figure: Figure) => {
    setSelectedFigure(figure)
    setIsDrawerOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("정말 이 피규어를 삭제하시겠습니까?")) {
      // TODO: Supabase에서 삭제
      console.log("[v0] Deleting figure:", id)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 border-r min-h-screen bg-muted/20 p-4">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="size-4 mr-2" />
                뒤로
              </Link>
            </Button>
            <h2 className="text-lg font-bold px-3">필터</h2>
          </div>

          <nav className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <span>{cat.label}</span>
                {cat.count > 0 && (
                  <Badge variant={selectedCategory === cat.id ? "secondary" : "outline"} className="text-xs">
                    {cat.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Figures</h1>
                <Badge variant="secondary" className="text-sm">
                  {filteredFigures.length}
                </Badge>
              </div>
              <Button asChild>
                <Link href="/admin/figures/add">
                  <Plus className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="피규어 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFigures.length === 0 ? (
                <div className="col-span-2 p-12 text-center text-muted-foreground border rounded-lg">
                  {searchQuery ? `"${searchQuery}"에 해당하는 피규어가 없습니다` : "등록된 피규어가 없습니다"}
                </div>
              ) : (
                filteredFigures.map((figure) => (
                  <div
                    key={figure.id}
                    onClick={() => handleFigureClick(figure)}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="relative size-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                      <Image
                        src={figure.imageUrl || "/placeholder.svg"}
                        alt={figure.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="font-medium text-sm leading-tight">{figure.name}</h3>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {figure.edition}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        [{figure.series}] {figure.character}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {figure.manufacturer} · {figure.category} · {figure.price.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>피규어 상세 정보</SheetTitle>
          </SheetHeader>
          {selectedFigure && (
            <div className="space-y-6 py-6">
              {/* Image Section */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={selectedFigure.imageUrl || "/placeholder.svg"}
                  alt={selectedFigure.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Name & Edition */}
              <div>
                <Label className="text-xs text-muted-foreground">피규어 이름</Label>
                <div className="flex items-start gap-2 mt-1">
                  <h2 className="font-semibold text-lg flex-1">{selectedFigure.name}</h2>
                  <Badge variant="secondary">{selectedFigure.edition}</Badge>
                </div>
              </div>

              {/* Series & Character */}
              <div className="grid gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">시리즈</Label>
                  <p className="text-sm mt-1">{selectedFigure.series}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">캐릭터</Label>
                  <p className="text-sm mt-1">{selectedFigure.character}</p>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">제조사</Label>
                    <p className="text-sm mt-1">{selectedFigure.manufacturer}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">카테고리</Label>
                    <p className="text-sm mt-1">{selectedFigure.scale}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">스케일</Label>
                    <p className="text-sm mt-1">{selectedFigure.category}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">출시일</Label>
                    <p className="text-sm mt-1">{selectedFigure.releaseDate}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">가격</Label>
                  <p className="text-xl font-bold mt-1">{selectedFigure.price.toLocaleString()}원</p>
                </div>
              </div>
            </div>
          )}
          <SheetFooter className="gap-2 flex-col sm:flex-row">
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={() => {
                if (selectedFigure) handleDelete(selectedFigure.id)
                setIsDrawerOpen(false)
              }}
            >
              <Trash2 className="size-4 mr-2" />
              삭제
            </Button>
            <div className="flex gap-2 flex-1">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsDrawerOpen(false)}>
                닫기
              </Button>
              <Button className="flex-1">
                <Pencil className="size-4 mr-2" />
                수정
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
