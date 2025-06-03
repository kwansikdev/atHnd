import type React from "react";

import {
  Package,
  Calendar,
  Tag,
  Users,
  Star,
  Clock,
  Bookmark,
  Heart,
  ShoppingCart,
  BadgeDollarSign,
} from "lucide-react";
import { Link } from "@remix-run/react";
import { Card, CardContent } from "~/components/ui/card";

interface CategoryItem {
  icon: React.ReactNode;
  name: string;
  description: string;
  to: string;
  color: string;
}

const categories: CategoryItem[] = [
  {
    icon: <Package className="h-6 w-6" />,
    name: "제조사별",
    description: "제조사별 피규어 보기",
    to: "/archive/manufacturers",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: <Tag className="h-6 w-6" />,
    name: "작품별",
    description: "작품별 피규어 보기",
    to: "/archive/series",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: <Users className="h-6 w-6" />,
    name: "캐릭터별",
    description: "캐릭터별 피규어 보기",
    to: "/archive/characters",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    name: "출시일별",
    description: "출시일별 피규어 보기",
    to: "/archive/release-dates",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: <Star className="h-6 w-6" />,
    name: "인기 피규어",
    description: "인기 있는 피규어",
    to: "/archive/popular",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    name: "신규 출시",
    description: "최근 출시된 피규어",
    to: "/archive/new-releases",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: <Bookmark className="h-6 w-6" />,
    name: "컬렉션",
    description: "내 컬렉션 관리",
    to: "/collection",
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    name: "위시리스트",
    description: "내 위시리스트",
    to: "/profile/wishlist",
    color: "bg-red-500/10 text-red-500",
  },
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    name: "예약/구매",
    description: "내 예약 및 구매 관리",
    to: "/orders",
    color: "bg-teal-500/10 text-teal-500",
  },
  {
    icon: <BadgeDollarSign className="h-6 w-6" />,
    name: "가격 추적",
    description: "피규어 가격 추적",
    to: "/archive/price-tracking",
    color: "bg-emerald-500/10 text-emerald-500",
  },
];

export function CategoryNavigation() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Link key={category.name} to={category.to}>
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardContent className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full ${category.color} mb-3`}>
                {category.icon}
              </div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-xs text-muted-foreground">
                {category.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
