import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import {
  Calendar,
  CreditCard,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TOutletContext } from "~/root";

export default function ReservationsIndex() {
  const rootOutletContext = useOutletContext<TOutletContext>();
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에서 탭 값 추측
  // 현재 URL에서 탭 상태 추출
  const activeTab = (() => {
    if (location.pathname === "/reservations") return "overview";
    if (location.pathname.includes("/orders")) return "orders";
    if (location.pathname.includes("/calendar")) return "calendar";
    if (location.pathname.includes("/budget")) return "budget";
    if (location.pathname.includes("/overview")) return "overview";
    return "overview"; // fallback
  })();

  return (
    <main className="container mx-auto px-4 py-8 relative">
      <div className="space-y-8">
        {/* 헤더 섹션 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  내 예약/구매
                </h1>
                <p className="text-blue-100 text-lg">
                  예약 현황과 구매 진행상황을 확인하세요
                </p>
              </div>
              <Button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm">
                <ShoppingCart className="h-4 w-4 mr-2" />새 예약하기
              </Button>
            </div>

            {/* 빠른 통계 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{2}</div>
                <div className="text-sm opacity-80">예약 중</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{2}</div>
                <div className="text-sm opacity-80">주문 중</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{1}</div>
                <div className="text-sm opacity-80">출시 임박</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">
                  {/* ₩{stats.totalRemaining.toLocaleString()} */}₩{100000}
                </div>
                <div className="text-sm opacity-80">남은 잔금</div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            navigate(`/reservations/${value === "overview" ? "" : value}`)
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">개요</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">주문목록</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">캘린더</span>
            </TabsTrigger>
            <TabsTrigger value="budget" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">예산관리</span>
            </TabsTrigger>
          </TabsList>

          <Outlet context={{ ...rootOutletContext }} />
        </Tabs>
      </div>
    </main>
  );
}
