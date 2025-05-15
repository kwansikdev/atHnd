import { Link } from "@remix-run/react";
import { motion } from "framer-motion";

import { ArrowRight } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

// 임시 데이터
const popularFigures = [
  {
    id: "pop1",
    name: "넨드로이드 호시노 아이",
    character: "호시노 아이",
    manufacturer: "굿스마일컴퍼니",
    series: "블루 아카이브",
    category: "넨드로이드",
    price: 64000,
    releaseDate: "2023-12",
    limited: false,
    adult: false,
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "pop2",
    name: "팝업 퍼레이드 나히다",
    character: "나히다",
    manufacturer: "굿스마일컴퍼니",
    series: "원신",
    category: "팝업 퍼레이드",
    price: 49000,
    releaseDate: "2023-11",
    limited: false,
    adult: false,
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "pop3",
    name: "1/7 스케일 마키마",
    character: "마키마",
    manufacturer: "굿스마일컴퍼니",
    series: "체인소맨",
    category: "스케일",
    price: 198000,
    releaseDate: "2024-02",
    limited: true,
    adult: false,
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "pop4",
    name: "넨드로이드 아야카",
    character: "카미사토 아야카",
    manufacturer: "굿스마일컴퍼니",
    series: "원신",
    category: "넨드로이드",
    price: 64000,
    releaseDate: "2023-10",
    limited: false,
    adult: false,
    image: "/placeholder.svg?height=300&width=200",
  },
];

const newFigures = [
  {
    id: "new1",
    name: "1/7 스케일 미쿠 겨울 버전",
    character: "하츠네 미쿠",
    manufacturer: "굿스마일컴퍼니",
    series: "보컬로이드",
    category: "스케일",
    price: 178000,
    releaseDate: "2024-01",
    limited: true,
    adult: false,
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "new2",
    name: "피그마 아리스",
    character: "텐도 아리스",
    manufacturer: "맥스팩토리",
    series: "블루 아카이브",
    category: "피그마",
    price: 89000,
    releaseDate: "2024-01",
    limited: false,
    adult: false,
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "new3",
    name: "1/7 스케일 라이덴 쇼군",
    character: "라이덴 쇼군",
    manufacturer: "알터",
    series: "원신",
    category: "스케일",
    price: 248000,
    releaseDate: "2024-03",
    limited: false,
    adult: false,
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "new4",
    name: "넨드로이드 파워",
    character: "파워",
    manufacturer: "굿스마일컴퍼니",
    series: "체인소맨",
    category: "넨드로이드",
    price: 64000,
    releaseDate: "2024-02",
    limited: false,
    adult: false,
    image: "/placeholder.svg?height=300&width=200",
  },
];

interface AreaIndexFeaturedFiguresProps {
  type: "popular" | "new";
}

export function LatestFiguresSection({ type }: AreaIndexFeaturedFiguresProps) {
  const figures = type === "popular" ? popularFigures : newFigures;
  const title = type === "popular" ? "인기 피규어" : "신규 출시 피규어";
  const description =
    type === "popular"
      ? "사용자들이 가장 많이 찾는 피규어"
      : "최근에 출시된 신규 피규어";
  const linkText =
    type === "popular" ? "모든 인기 피규어 보기" : "모든 신규 출시 피규어 보기";
  const linkHref =
    type === "popular" ? "/archive/popular" : "/archive/new-releases";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Link to={linkHref}>
          <Button variant="ghost" className="group">
            {linkText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4"
      >
        {figures.map((figure) => (
          <motion.div key={figure.id} variants={itemVariants}>
            <Link to={`/archive/${figure.id}`}>
              <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={figure.image || "/placeholder.svg"}
                    alt={figure.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {figure.limited && (
                    <Badge className="absolute right-2 top-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                      한정판
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-base">
                    {figure.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {figure.character}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{figure.manufacturer}</span>
                    <Badge variant="outline">{figure.category}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {figure.releaseDate}
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                        maximumFractionDigits: 0,
                      }).format(figure.price)}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
