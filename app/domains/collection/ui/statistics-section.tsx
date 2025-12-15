"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Heart, Package, BookmarkCheck, Wallet2, Calendar } from "lucide-react";
import { TStatisticsDto } from "../model/statistics-dto";
import { cn } from "~/utils";

interface StatisticsSectionProps {
  stats: TStatisticsDto;
}

export function StatisticsSection({ stats }: StatisticsSectionProps) {
  return (
    // <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
    //   <Card>
    //     <CardContent className="flex items-center flex-1">
    //       <Heart className="h-5 w-5 mr-6 text-red-500" />
    //       <div className="w-full">
    //         <p className="text-sm text-muted-foreground">위시리스트</p>
    //         <p className="text-2xl font-bold text-right">{stats.wishlist}</p>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <Card>
    //     <CardContent className="flex items-center flex-1">
    //       <ShoppingBag className="h-5 w-5 mr-6 text-blue-500" />
    //       <div className="w-full">
    //         <p className="text-sm text-muted-foreground">예약</p>
    //         <p className="text-2xl font-bold text-right">{stats.preordered}</p>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <Card>
    //     <CardContent className="flex items-center flex-1">
    //       <Package className="h-5 w-5 mr-6 text-amber-500" />
    //       <div className="w-full">
    //         <p className="text-sm text-muted-foreground">주문</p>
    //         <p className="text-2xl font-bold text-right">{stats.ordered}</p>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <Card>
    //     <CardContent className="flex items-center flex-1">
    //       <BookmarkCheck className="h-5 w-5 mr-6 text-green-500" />
    //       <div className="w-full">
    //         <p className="text-sm text-muted-foreground">소장</p>
    //         <p className="text-2xl font-bold text-right">{stats.owned}</p>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <Card>
    //     <CardContent className="flex items-center flex-1">
    //       <CreditCard className="h-5 w-5 mr-6 text-purple-500" />
    //       <div className="w-full">
    //         <p className="text-sm text-muted-foreground">총 가치</p>
    //         <p className="text-2xl font-bold text-right">
    //           ₩{new Intl.NumberFormat("ko-KR").format(stats.totalValue)}
    //         </p>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-8">
      {/* <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">예약</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                0
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">주문</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                0
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full">
              <Package className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">소장</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                0
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full">
              <BookmarkCheck className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">총 금액</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                0
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full">
              <Wallet2 className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card> */}
      {/* <StatCard
        icon={<Heart className="h-5 w-5 text-rose-500" />}
        title="위시리스트"
        count={0}
      />
      <StatCard
        icon={<Calendar className="h-5 w-5 text-blue-500" />}
        title="예약"
        // count={sampleFigures.filter((fig) => fig.status === "예약").length}
        count={0}
      />
      <StatCard
        icon={<Package className="h-5 w-5 text-amber-500" />}
        title="주문"
        // count={sampleFigures.filter((fig) => fig.status === "주문").length}
        count={0}
      />
      <StatCard
        icon={<BookmarkCheck className="h-5 w-5 text-emerald-500" />}
        title="소장"
        // count={sampleFigures.filter((fig) => fig.status === "소장").length}
        count={0}
      />
      <StatCard
        icon={<Wallet2 className="h-5 w-5 text-purple-500" />}
        title="총 금액"
        // count={`₩${sampleFigures
        //   .reduce(
        //     (sum, fig) => sum + Number(fig.price.replace(/[^\d]/g, "")),
        //     0
        //   )
        //   .toLocaleString()}`}
        count={0}
        className={cn("sm:col-span-2 md:col-span-1")}
      /> */}
      {/* <StatCard
        icon={<Heart className="h-5 w-5 text-white" />}
        title="위시리스트"
        count={0}
      /> */}
      <StatCard
        icon={<Calendar className="h-5 w-5 text-white" />}
        title="예약"
        // count={sampleFigures.filter((fig) => fig.status === "예약").length}
        count={0}
      />
      <StatCard
        icon={<Package className="h-5 w-5 text-white" />}
        title="주문"
        // count={sampleFigures.filter((fig) => fig.status === "주문").length}
        count={0}
      />
      <StatCard
        icon={<BookmarkCheck className="h-5 w-5 text-white" />}
        title="소장"
        // count={sampleFigures.filter((fig) => fig.status === "소장").length}
        count={0}
      />
      <StatCard
        icon={<Wallet2 className="h-5 w-5 text-white" />}
        title="총 금액"
        // count={`₩${sampleFigures
        //   .reduce(
        //     (sum, fig) => sum + Number(fig.price.replace(/[^\d]/g, "")),
        //     0
        //   )
        //   .toLocaleString()}`}
        count={0}
        className={cn("col-span-2")}
      />
    </div>
  );
}

function StatCard({
  icon,
  title,
  count,
  className,
  /**
   * from-red-500 to-pink-500
   */
  color = "from-red-500 to-pink-500",
}: {
  icon: React.ReactNode;
  title: string;
  count: number | string;
  className?: string;
  color?: string;
}) {
  return (
    <>
      {/* <Card
        className={cn(
          "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
          className
        )}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mb-2">{icon}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {count}
          </p>
        </CardContent>
      </Card> */}
      <Card
        className={cn(
          "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105",
          className
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p
                className={cn(
                  "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                  color
                )}
              >
                {count}
              </p>
            </div>
            <div className={cn("p-3 bg-gradient-to-r rounded-full", color)}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
