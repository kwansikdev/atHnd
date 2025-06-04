"use client";

import type React from "react";
import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { Card, CardContent } from "~/components/ui/card";
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

interface CategoryItem {
  icon: React.ReactNode;
  name: string;
  description: string;
  href: string;
  color: string;
  gradient: string;
}

const categories: CategoryItem[] = [
  {
    icon: <Package className="h-6 w-6" />,
    name: "제조사별",
    description: "제조사별 피규어 보기",
    href: "/database/manufacturers",
    color: "text-blue-500",
    gradient:
      "from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30",
  },
  {
    icon: <Tag className="h-6 w-6" />,
    name: "작품별",
    description: "작품별 피규어 보기",
    href: "/database/series",
    color: "text-purple-500",
    gradient:
      "from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30",
  },
  {
    icon: <Users className="h-6 w-6" />,
    name: "캐릭터별",
    description: "캐릭터별 피규어 보기",
    href: "/database/characters",
    color: "text-pink-500",
    gradient:
      "from-pink-500/20 to-pink-600/20 hover:from-pink-500/30 hover:to-pink-600/30",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    name: "출시일별",
    description: "출시일별 피규어 보기",
    href: "/database/release-dates",
    color: "text-green-500",
    gradient:
      "from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30",
  },
  {
    icon: <Star className="h-6 w-6" />,
    name: "인기 피규어",
    description: "인기 있는 피규어",
    href: "/database/popular",
    color: "text-yellow-500",
    gradient:
      "from-yellow-500/20 to-yellow-600/20 hover:from-yellow-500/30 hover:to-yellow-600/30",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    name: "신규 출시",
    description: "최근 출시된 피규어",
    href: "/database/new-releases",
    color: "text-orange-500",
    gradient:
      "from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30",
  },
  {
    icon: <Bookmark className="h-6 w-6" />,
    name: "컬렉션",
    description: "내 컬렉션 관리",
    href: "/collection",
    color: "text-indigo-500",
    gradient:
      "from-indigo-500/20 to-indigo-600/20 hover:from-indigo-500/30 hover:to-indigo-600/30",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    name: "위시리스트",
    description: "내 위시리스트",
    href: "/wishlist",
    color: "text-red-500",
    gradient:
      "from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30",
  },
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    name: "예약/구매",
    description: "내 예약 및 구매 관리",
    href: "/orders",
    color: "text-teal-500",
    gradient:
      "from-teal-500/20 to-teal-600/20 hover:from-teal-500/30 hover:to-teal-600/30",
  },
  {
    icon: <BadgeDollarSign className="h-6 w-6" />,
    name: "가격 추적",
    description: "피규어 가격 추적",
    href: "/price-tracking",
    color: "text-emerald-500",
    gradient:
      "from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30",
  },
];

export function CategoryNavigation() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
    >
      {categories.map((category) => (
        <motion.div key={category.name} variants={itemVariants}>
          <Link to={category.href}>
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div
                  className={`mb-3 rounded-full bg-gradient-to-br ${category.gradient} p-3 transition-all duration-300 ${category.color}`}
                >
                  {category.icon}
                </div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
