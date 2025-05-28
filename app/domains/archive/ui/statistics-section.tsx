import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  Package,
  Tag,
  Star,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function StatisticsSection() {
  const stats = [
    {
      title: "총 피규어 수",
      value: "1,245",
      description: "데이터베이스에 등록된 피규어",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "인기 제조사",
      value: "굿스마일컴퍼니",
      description: "가장 많은 피규어를 보유한 제조사",
      icon: <Package className="h-5 w-5" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "인기 작품",
      value: "원신",
      description: "가장 많은 피규어가 있는 작품",
      icon: <Tag className="h-5 w-5" />,
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "인기 캐릭터",
      value: "호시노 아이",
      description: "가장 많은 피규어가 있는 캐릭터",
      icon: <Users className="h-5 w-5" />,
      color: "from-green-500 to-green-600",
    },
    {
      title: "이번 달 출시",
      value: "37",
      description: "이번 달에 출시되는 피규어",
      icon: <Calendar className="h-5 w-5" />,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "인기 상승 중",
      value: "블루 아카이브",
      description: "최근 인기가 급상승한 작품",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "평균 평점",
      value: "4.7",
      description: "사용자 평점 평균",
      icon: <Star className="h-5 w-5" />,
      color: "from-red-500 to-red-600",
    },
    {
      title: "최근 업데이트",
      value: "오늘",
      description: "마지막 데이터베이스 업데이트",
      icon: <Clock className="h-5 w-5" />,
      color: "from-teal-500 to-teal-600",
    },
  ];

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
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.title} variants={itemVariants}>
          <Card className="h-full overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{stat.title}</CardTitle>
                <div
                  className={`rounded-full bg-gradient-to-r ${stat.color} p-2 text-white`}
                >
                  {stat.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <CardDescription>{stat.description}</CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
