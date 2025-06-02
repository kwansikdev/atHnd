import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import {
  Calendar,
  Clock,
  CreditCard,
  Filter,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AddToReservationButton } from "~/domains/reservations/ui";
import { TOutletContext } from "~/root";

export default function ReservationsIndex() {
  const rootOutletContext = useOutletContext<TOutletContext>();
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에서 탭 값 추측
  // 현재 URL에서 탭 상태 추출
  const activeTab = (() => {
    if (location.pathname === "/reservations") return "";
    if (location.pathname.includes("/orders")) return "orders";
    if (location.pathname.includes("/calendar")) return "calendar";
    if (location.pathname.includes("/budget")) return "budget";
    if (location.pathname.includes("/overview")) return "overview";
    return ""; // fallback
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  내 예약/구매
                </h1>
                <p className="text-blue-100 text-sm">
                  예약 현황과 구매 진행상황을 확인하세요
                </p>
              </div>
              <AddToReservationButton />
            </div>
          </div>
        </div>

        {/* 헤더 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in-50 duration-500">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">총 예약/주문</p>
                  <p className="text-2xl font-bold bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    4개
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">예약 중</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    2개
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">배송 중</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                    0개
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full">
                  <Truck className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card> */}

          <Card className="col-span-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">남은 잔금</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    ₩{Number(100000).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="py-6 space-y-4">
          <p className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-6 w-6 text-emerald-500" />
            예약/구매 관리
          </p>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              navigate(
                `/reservations${value === "/overview" ? "" : `/${value}`}`
              )
            }
          >
            <div className="flex justify-between items-center">
              <TabsList className="bg-slate-100 dark:bg-slate-700">
                <TabsTrigger
                  value=""
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                >
                  <TrendingUp className="h-4 w-4" />
                  개요
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                >
                  <Package className="h-4 w-4" />
                  목록
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                >
                  <Calendar className="h-4 w-4" />
                  캘린더
                </TabsTrigger>
                <TabsTrigger
                  value="budget"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                >
                  <CreditCard className="h-4 w-4" />
                  예산
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/50 hover:bg-white/80 transition-all duration-300"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  필터
                </Button>

                <AddToReservationButton />
              </div>
            </div>

            <Outlet context={{ ...rootOutletContext }} />
          </Tabs>
        </div>
      </div>
    </main>
  );
}
