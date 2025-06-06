import { data, useLoaderData } from "@remix-run/react";
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  LayoutPanelLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { FigureCard } from "~/domains/orders/ui";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "supabase";
import {
  getPaymentOverviewBySupabase,
  getRecentOrderBySupabase,
} from "~/domains/orders/action";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = await getSupabaseServerClient(request);

  const paymentOverview = await getPaymentOverviewBySupabase(supabase);
  const recentOrders = await getRecentOrderBySupabase(supabase);

  return data({
    paymentOverview: {
      count: paymentOverview.count,
      totalPrice: paymentOverview.totalPrice,
      totalPaidPrice: paymentOverview.totalPaidPrice,
      totalBalancePrice: paymentOverview.totalBalancePrice,
    },
    recentOrders: {
      data: recentOrders.data,
      count: recentOrders.count,
    },
  });
}

export default function OrdersIndex() {
  const { paymentOverview, recentOrders } = useLoaderData<typeof loader>();

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
                  ₩{paymentOverview.totalPaidPrice.toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                <div className="text-sm text-muted-foreground">남은 잔금</div>
                <div className="text-xl font-bold text-red-600">
                  ₩{paymentOverview.totalBalancePrice.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>결제 진행률</span>
                <span className="font-medium">
                  {Math.round(
                    (paymentOverview.totalPaidPrice /
                      paymentOverview.totalPrice) *
                      100
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  (paymentOverview.totalPaidPrice /
                    paymentOverview.totalPrice) *
                  100
                }
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
            {/* {totalRemaining > 0 && (
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
            )} */}

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recentOrders.data.map((recent) => (
            <FigureCard key={recent.id} {...recent} />
          ))}
        </div>
      </div>
    </div>
  );
}
