import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Calendar,
  Clock,
  Filter,
  Grid3X3,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { getSupabaseServerClient } from "supabase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getUserFigureListAction } from "~/domains/collection/action";
import { FigureGrid } from "~/domains/collection/ui/figure-grid";

// type
type ViewMode = "grid" | "monthly";

// 피규어 데이터 가져오기
export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = await getSupabaseServerClient(request);

  const url = new URL(request.url);
  const view = url.searchParams.get("view") ?? "all";

  const figures = await getUserFigureListAction(supabase, { view });

  return Response.json({ figures }, { headers });
}

export default function Collection() {
  const { figures } = useLoaderData<typeof loader>();

  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  // const [open, setOpen] = useState(false);

  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 필터링 및 정렬 (트랜지션 적용)
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.figureTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "price-high":
          return (b.purchasePrice || 0) - (a.purchasePrice || 0);
        case "price-low":
          return (a.purchasePrice || 0) - (b.purchasePrice || 0);
        case "name":
          return a.figureTitle.localeCompare(b.figureTitle);
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchTerm, statusFilter, sortBy]);

  const activeFilterCount =
    (searchTerm ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  // 검색 핸들러 (디바운스 효과)
  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  };

  // 필터 초기화
  const clearAllFilters = () => {
    startTransition(() => {
      setSearchTerm("");
      setStatusFilter("all");
    });
  };

  // 빠른 필터 버튼들
  const quickFilters = [
    { label: "최근 추가", value: "newest", icon: Clock },
    { label: "고가순", value: "price-high", icon: TrendingUp },
    { label: "예약 중", status: "preordered", icon: Calendar },
    { label: "소장 중", status: "owned", icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <Button
          className="absolute top-8 right-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          컬렉션 추가
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>컬렉션 추가</DialogTitle>
              <DialogDescription>
                컬렉션을 추가할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <AddToCollectionButton
          userId={userId}
          onItemAdded={(newItem) => {
            handleItemsChange([...items, newItem]);
          }}
        />
      </div> */}

      {/* <div className="text-end">
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as ViewMode)}
        >
          <TabsList className="grid w-full grid-cols-2 sm:w-auto">
            <TabsTrigger
              value="grid"
              className="flex items-center gap-2 transition-all duration-200"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">전체 보기</span>
              <span className="sm:hidden">전체</span>
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="flex items-center gap-2 transition-all duration-200"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">월별 보기</span>
              <span className="sm:hidden">월별</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div> */}
      <Card className="animate-in slide-in-from-top-5 duration-500 delay-100">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
              <Filter className="h-5 w-5" />
              필터 및 정렬
            </CardTitle>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger
                  value="grid"
                  className="flex items-center gap-2 transition-all duration-200"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:inline">전체 보기</span>
                  <span className="sm:hidden">전체</span>
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="flex items-center gap-2 transition-all duration-200"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">월별 보기</span>
                  <span className="sm:hidden">월별</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filters">
              <AccordionTrigger className="py-2">
                필터 옵션
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 animate-pulse dark:bg-gray-700 dark:text-gray-300"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                    <Input
                      placeholder="피규어 이름으로 검색..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                    {searchTerm && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 dark:text-gray-400 dark:hover:text-white"
                        onClick={() => handleSearchChange("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      startTransition(() => setStatusFilter(value))
                    }
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="상태 필터" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 상태</SelectItem>
                      <SelectItem value="owned">소장</SelectItem>
                      <SelectItem value="preordered">예약</SelectItem>
                      <SelectItem value="ordered">주문</SelectItem>
                      <SelectItem value="wishlist">위시리스트</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={sortBy}
                    onValueChange={(value) =>
                      startTransition(() => setSortBy(value))
                    }
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="정렬" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">최신순</SelectItem>
                      <SelectItem value="oldest">오래된순</SelectItem>
                      <SelectItem value="price-high">가격 높은순</SelectItem>
                      <SelectItem value="price-low">가격 낮은순</SelectItem>
                      <SelectItem value="name">이름순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {quickFilters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = filter.status
                      ? statusFilter === filter.status
                      : sortBy === filter.value;

                    return (
                      <Button
                        key={filter.label}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className="transition-all duration-200 hover:scale-105 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        onClick={() => {
                          startTransition(() => {
                            if (filter.status) {
                              setStatusFilter(filter.status);
                            } else if (filter.value) {
                              setSortBy(filter.value);
                            }
                          });
                        }}
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {filter.label}
                      </Button>
                    );
                  })}
                </div>
                {activeFilterCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors dark:text-gray-400 dark:hover:text-white"
                  >
                    모두 지우기
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 mb-4">
          <TabsList className="bg-gray-100 dark:bg-gray-900 p-0 h-10 sm:h-12 w-full overflow-x-auto">
            <TabsTrigger
              value="all"
              className="flex-1 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm"
            >
              전체 (0)
            </TabsTrigger>
            <TabsTrigger
              value="preorder"
              className="flex-1 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm"
            >
              예약 ( 0)
            </TabsTrigger>
            <TabsTrigger
              value="ordered"
              className="flex-1 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm"
            >
              주문 ( 0)
            </TabsTrigger>
            <TabsTrigger
              value="collection"
              className="flex-1 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm"
            >
              소장 ( 0)
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* 드롭다운 */}
          </div>

          <TabsContent value="all">
            <FigureGrid items={figures} />
          </TabsContent>
          <TabsContent value="preordered">
            <FigureGrid items={[]} />
          </TabsContent>
          <TabsContent value="ordered">
            <FigureGrid items={[]} />
          </TabsContent>
          <TabsContent value="owned">
            <FigureGrid items={[]} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
