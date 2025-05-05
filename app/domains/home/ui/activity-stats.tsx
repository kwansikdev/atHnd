"use client";

import { Link } from "@remix-run/react";
import {
  ArrowRight,
  Package,
  ShoppingCart,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { motion } from "framer-motion";

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  type: "collection" | "wishlist" | "purchase" | "reservation";
  status?: string;
}

const recentActivities: ActivityItem[] = [
  {
    id: "act1",
    title: "아스나 웨딩 드레스 Ver. 컬렉션에 추가",
    date: "2024-05-01",
    type: "collection",
  },
  {
    id: "act2",
    title: "렘 바니 Ver. 예약",
    date: "2024-04-28",
    type: "reservation",
    status: "예약중",
  },
  {
    id: "act3",
    title: "미쿠 매지컬 미라이 2023 Ver. 위시리스트에 추가",
    date: "2024-04-25",
    type: "wishlist",
  },
  {
    id: "act4",
    title: "제로투 드레스 Ver. 구매",
    date: "2024-04-20",
    type: "purchase",
    status: "배송중",
  },
];

const upcomingReleases = [
  {
    id: "rel1",
    title: "렘 바니 Ver.",
    date: "2024-06-15",
  },
  {
    id: "rel2",
    title: "미쿠 매지컬 미라이 2023 Ver.",
    date: "2024-06-30",
  },
  {
    id: "rel3",
    title: "아쿠아 고양이 Ver.",
    date: "2024-07-10",
  },
];

export function ActivityStats() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "collection":
        return <Package className="h-4 w-4" />;
      case "wishlist":
        return <Badge className="h-4 w-4" />;
      case "purchase":
        return <ShoppingCart className="h-4 w-4" />;
      case "reservation":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "collection":
        return "text-blue-500";
      case "wishlist":
        return "text-red-500";
      case "purchase":
        return "text-green-500";
      case "reservation":
        return "text-purple-500";
      default:
        return "";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "예약중":
        return "bg-yellow-500";
      case "결제완료":
        return "bg-blue-500";
      case "배송중":
        return "bg-purple-500";
      case "배송완료":
        return "bg-green-500";
      case "취소됨":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Card className="shadow-md border-primary/5 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />내 활동
        </CardTitle>
        <CardDescription>최근 활동 및 출시 예정 피규어</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity" className="mt-2">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="activity" className="rounded-full">
              최근 활동
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-full">
              출시 예정
            </TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="space-y-4">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={item}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/5"
                >
                  <div
                    className={`p-2 rounded-full ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  {activity.status && (
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  )}
                </motion.div>
              ))}
            </motion.div>
            <Button variant="ghost" size="sm" className="w-full group" asChild>
              <Link to="/profile/activity">
                모든 활동 보기
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </TabsContent>
          <TabsContent value="upcoming" className="space-y-4">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {upcomingReleases.map((release) => (
                <motion.div
                  key={release.id}
                  variants={item}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/5"
                >
                  <div className="p-2 rounded-full bg-orange-500/10 text-orange-500">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {release.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(release.date).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-background">
                    D-
                    {Math.ceil(
                      (new Date(release.date).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
            <Button variant="ghost" size="sm" className="w-full group" asChild>
              <Link to="/database/upcoming">
                모든 출시 예정 보기
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium mb-4 flex items-center">
            <TrendingUp className="mr-2 h-4 w-4 text-primary" />내 컬렉션 통계
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-3 rounded-lg shadow-sm">
              <p className="text-xs text-muted-foreground">총 피규어</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                24
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-3 rounded-lg shadow-sm">
              <p className="text-xs text-muted-foreground">총 가치</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₩4.8M
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 p-3 rounded-lg shadow-sm">
              <p className="text-xs text-muted-foreground">위시리스트</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                12
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-3 rounded-lg shadow-sm">
              <p className="text-xs text-muted-foreground">예약 중</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                3
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-4 group"
            asChild
          >
            <Link to="/statistics">
              상세 통계 보기
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
