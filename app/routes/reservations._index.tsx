import { data, useLoaderData } from "@remix-run/react";
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  LayoutPanelLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { FigureCard } from "~/domains/reservations/ui";

export function loader() {
  return data({
    totalPaid: 453000,
    totalRemaining: 120000,
    totalBudget: 573000,
  });
}

export default function Reservations() {
  const { totalPaid, totalRemaining, totalBudget } =
    useLoaderData<typeof loader>();

  return (
    <div className="space-y-10 mt-6 animate-in fade-in-50 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              결제 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg">
                <div className="text-sm text-muted-foreground">결제 완료</div>
                <div className="text-xl font-bold text-emerald-600">
                  ₩{totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                <div className="text-sm text-muted-foreground">남은 잔금</div>
                <div className="text-xl font-bold text-red-600">
                  ₩{totalRemaining.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>결제 진행률</span>
                <span className="font-medium">
                  {Math.round((totalPaid / totalBudget) * 100)}%
                </span>
              </div>
              <Progress
                value={(totalPaid / totalBudget) * 100}
                className="h-3 transition-all duration-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* 알림 */}
        <Card className="border-0 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              알림
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalRemaining > 0 && (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200/50">
                <CreditCard className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-medium text-amber-800 dark:text-amber-200">
                    결제 대기
                  </div>
                  <div className="text-sm text-amber-600 dark:text-amber-300">
                    ₩{totalRemaining.toLocaleString()} 잔금이 남았습니다
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200/50">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <div>
                <div className="font-medium text-emerald-800 dark:text-emerald-200">
                  순조히 진행
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-300">
                  모든 예약이 정상적으로 진행 중입니다
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <p className="flex items-center gap-2 font-semibold">
          <LayoutPanelLeft className="h-6 w-6 text-emerald-500" />
          최근 예약/주문
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialOrders.slice(0, 6).map((order) => (
            <FigureCard key={order.id} {...order} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 임시 데이터
const initialOrders = [
  {
    id: "1",
    name: "아스나 웨딩 드레스 Ver.",
    manufacturer: "알터",
    series: "소드 아트 온라인",
    price: 198000,
    releaseDate: "2023-12-15",
    status: "예약완료",
    paymentStatus: "예약금완납",
    remainingPayment: 148500,
    shop: "애니플렉스 플러스",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "2",
    name: "렘 바니 Ver.",
    manufacturer: "프리잉",
    series: "Re:제로부터 시작하는 이세계 생활",
    price: 240000,
    releaseDate: "2024-01-20",
    status: "배송중",
    paymentStatus: "완납",
    remainingPayment: 0,
    shop: "아미아미",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "3",
    name: "에밀리아 고양이 Ver.",
    manufacturer: "굿스마일컴퍼니",
    series: "Re:제로부터 시작하는 이세계 생활",
    price: 168000,
    releaseDate: "2024-03-10",
    status: "예약중",
    paymentStatus: "미결제",
    remainingPayment: 168000,
    shop: "굿스마일 글로벌",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "4",
    name: "호리 쿠키 유카타 Ver.",
    manufacturer: "알터",
    series: "호리씨와 미야무라군",
    price: 178000,
    releaseDate: "2024-02-15",
    status: "예약완료",
    paymentStatus: "부분결제",
    remainingPayment: 89000,
    shop: "애니플렉스 플러스",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
];
