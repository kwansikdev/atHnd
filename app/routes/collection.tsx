/* eslint-disable jsx-a11y/label-has-associated-control */
import { LoaderFunctionArgs } from "@remix-run/node";
import { data, Outlet, useOutletContext } from "@remix-run/react";
import {
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Filter,
  Grid3X3,
  Home,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  AddToCollectionButton,
  StatisticsSection,
} from "~/domains/collection/ui";
import { TOutletContext } from "~/root";
import { getUserFromRequest } from "~/shared/action";

type ViewMode =
  | "grid"
  | "monthly"
  | "stats"
  | "display"
  | "maintenance"
  | "value";

export async function loader({ request }: LoaderFunctionArgs) {
  await getUserFromRequest(request);

  return data({});
}

export default function CollectionIndex() {
  const context = useOutletContext<TOutletContext>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("owned");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 필터링 및 정렬
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
        case "release-date":
          // eslint-disable-next-line no-case-declarations
          const aDate = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
          // eslint-disable-next-line no-case-declarations
          const bDate = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
          return bDate - aDate;
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchTerm, statusFilter, sortBy]);

  const activeFilterCount =
    (searchTerm ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  // 검색 핸들러
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
    { label: "소장품", status: "owned", icon: Sparkles },
    { label: "위시리스트", status: "wishlist", icon: Calendar },
  ];

  return (
    <main className="container mx-auto px-4 py-8 relative">
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  내 컬렉션
                </h2>
                <p className="text-blue-100 text-lg">
                  소중한 피규어들을 한눈에 관리하세요
                </p>
              </div>
              <AddToCollectionButton />
            </div>
          </div>
        </div>

        <StatisticsSection
          stats={{
            total: 0,
            wishlist: 0,
            preordered: 0,
            ordered: 0,
            owned: 0,
            totalValue: 0,
          }}
        />

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-purple-500" />
              컬렉션 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 보기 모드 및 검색 */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 보기 모드 */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  보기:
                </span>
                <Tabs
                  value={viewMode}
                  onValueChange={(value) => setViewMode(value as ViewMode)}
                >
                  <TabsList className="grid w-full grid-cols-6 bg-slate-100 dark:bg-slate-700">
                    <TabsTrigger
                      value="grid"
                      className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                    >
                      <Grid3X3 className="h-4 w-4" />
                      <span className="hidden sm:inline">그리드</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="monthly"
                      className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">월별</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="display"
                      className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                    >
                      <Home className="h-4 w-4" />
                      <span className="hidden sm:inline">진열</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="maintenance"
                      className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden sm:inline">관리</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="value"
                      className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                    >
                      <DollarSign className="h-4 w-4" />
                      <span className="hidden sm:inline">가치</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="stats"
                      className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">통계</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* 검색 */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="피규어 이름으로 검색..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 bg-white/50 border-slate-200 focus:bg-white dark:bg-slate-700/50 dark:border-slate-600 dark:focus:bg-slate-700"
                />
                {searchTerm && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => handleSearchChange("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* 모바일 필터 버튼 */}
              <div className="lg:hidden">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      필터
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh]">
                    <SheetHeader>
                      <SheetTitle>필터 및 정렬</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* 모바일 필터 내용 */}
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="" className="text-sm font-medium">
                            상태
                          </label>
                          <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                              startTransition(() => setStatusFilter(value))
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="상태 필터" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">모든 상태</SelectItem>
                              <SelectItem value="owned">소장</SelectItem>
                              <SelectItem value="preordered">예약</SelectItem>
                              <SelectItem value="ordered">주문</SelectItem>
                              <SelectItem value="wishlist">
                                위시리스트
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">정렬</label>
                          <Select
                            value={sortBy}
                            onValueChange={(value) =>
                              startTransition(() => setSortBy(value))
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="정렬" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">최신순</SelectItem>
                              <SelectItem value="oldest">오래된순</SelectItem>
                              <SelectItem value="price-high">
                                가격 높은순
                              </SelectItem>
                              <SelectItem value="price-low">
                                가격 낮은순
                              </SelectItem>
                              <SelectItem value="name">이름순</SelectItem>
                              <SelectItem value="release-date">
                                발매일순
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* 데스크톱 필터 */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  상태:
                </span>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    startTransition(() => setStatusFilter(value))
                  }
                >
                  <SelectTrigger className="w-40 bg-white/50 dark:bg-slate-700/50">
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
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  정렬:
                </span>
                <Select
                  value={sortBy}
                  onValueChange={(value) =>
                    startTransition(() => setSortBy(value))
                  }
                >
                  <SelectTrigger className="w-40 bg-white/50 dark:bg-slate-700/50">
                    <SelectValue placeholder="정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">최신순</SelectItem>
                    <SelectItem value="oldest">오래된순</SelectItem>
                    <SelectItem value="price-high">가격 높은순</SelectItem>
                    <SelectItem value="price-low">가격 낮은순</SelectItem>
                    <SelectItem value="name">이름순</SelectItem>
                    <SelectItem value="release-date">발매일순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                {filteredAndSortedItems.length}개 아이템
              </div>
            </div>

            {/* 빠른 필터 */}
            <div className="flex flex-wrap gap-2">
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
                    className="gap-2 transition-all hover:scale-105"
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
                    <Icon className="h-3 w-3" />
                    {filter.label}
                  </Button>
                );
              })}
            </div>

            {/* 활성 필터 표시 */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge
                    variant="secondary"
                    className="gap-1 animate-in fade-in-50"
                  >
                    검색: {searchTerm}
                    <button
                      onClick={() => handleSearchChange("")}
                      className="ml-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 animate-in fade-in-50"
                  >
                    상태:{" "}
                    {statusFilter === "owned"
                      ? "소장"
                      : statusFilter === "preordered"
                      ? "예약"
                      : statusFilter === "ordered"
                      ? "주문"
                      : "위시리스트"}
                    <button
                      onClick={() =>
                        startTransition(() => setStatusFilter("all"))
                      }
                      className="ml-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  모두 지우기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Outlet context={context} />
      </div>
    </main>
  );
}
