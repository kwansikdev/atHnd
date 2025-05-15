import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { PlusCircle, Search } from "lucide-react";
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

interface FigureGridProps {
  figures?: DatabaseFigure[];
}

export function FigureGrid({ figures = [] }: FigureGridProps) {
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

  if (figures.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 py-16 text-center dark:from-gray-800 dark:to-gray-900"
      >
        <div className="mb-4 rounded-full bg-gray-200 p-4 dark:bg-gray-700">
          <Search className="h-8 w-8 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-bold">검색 결과가 없습니다</h3>
        <p className="mb-6 max-w-md text-muted-foreground">
          다른 검색어를 시도하거나 필터를 조정해보세요. 원하는 피규어를 찾을 수
          있을 거예요.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            이전 페이지로 돌아가기
          </Button>
          <Link to="/database">
            <Button>모든 피규어 보기</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {figures.map((figure) => (
        <motion.div key={figure.id} variants={itemVariants}>
          <Link to={figure.id ? `/database/${figure.id}` : "#"}>
            <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <img
                  src={
                    figure.images[figure.thumbnailIndex || 0] ||
                    figure.images[0] ||
                    "/placeholder.svg"
                  }
                  alt={figure.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {figure.limited && (
                  <Badge className="absolute right-2 top-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                    한정판
                  </Badge>
                )}
                {figure.adult && (
                  <Badge className="absolute left-2 top-2 bg-gradient-to-r from-red-400 to-red-600 text-white">
                    성인용
                  </Badge>
                )}
                <div className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-center gap-2 bg-black/60 p-2 text-white transition-transform duration-300 group-hover:translate-y-0">
                  <PlusCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">자세히 보기</span>
                </div>
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
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                  >
                    {figure.category}
                  </Badge>
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
  );
}

// 피규어 데이터베이스 타입 정의
export type FigureCategory =
  | "스케일"
  | "넨드로이드"
  | "팝업 퍼레이드"
  | "피그마"
  | "액션 피규어"
  | "기타";

export interface DatabaseFigure {
  id: string;
  name: string;
  nameJp?: string;
  nameEn?: string;
  manufacturer: string;
  series: string;
  character: string;
  sculptors?: string[];
  paintWork?: string[];
  category: FigureCategory;
  scale?: string;
  size?: string;
  material?: string;
  releaseDate: string;
  price: number;
  limited: boolean;
  adult: boolean;
  images: string[];
  thumbnailIndex?: number; // 썸네일 이미지 인덱스 추가
  description?: string;
  specifications?: string;
  createdAt: string;
  updatedAt: string;
}
// 샘플 피규어 데이터베이스
export const databaseFigures: DatabaseFigure[] = [
  {
    id: "db1",
    name: "아스나 웨딩 드레스 Ver.",
    nameJp: "アスナ ウェディングドレスVer.",
    nameEn: "Asuna Wedding Dress Ver.",
    manufacturer: "알터",
    series: "소드 아트 온라인",
    character: "아스나",
    sculptors: ["호시노 카츠미"],
    paintWork: ["타카하시 마사키"],
    category: "스케일",
    scale: "1/7",
    size: "약 230mm",
    material: "PVC, ABS",
    releaseDate: "2023-12-15",
    price: 198000,
    limited: true,
    adult: false,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    thumbnailIndex: 0,
    description:
      "소드 아트 온라인의 여주인공 아스나의 웨딩 드레스 버전 피규어입니다. 10주년을 기념하여 제작된 한정판 피규어로, 섬세한 드레스 표현과 우아한 포즈가 특징입니다.",
    specifications: "높이: 약 230mm, 재질: PVC, ABS",
    createdAt: "2023-08-10T12:00:00Z",
    updatedAt: "2023-12-20T15:30:00Z",
  },
  {
    id: "db2",
    name: "렘 바니 Ver.",
    nameJp: "レム バニーVer.",
    nameEn: "Rem Bunny Ver.",
    manufacturer: "프리잉",
    series: "Re:제로부터 시작하는 이세계 생활",
    character: "렘",
    category: "스케일",
    scale: "1/4",
    size: "약 330mm",
    material: "PVC, ABS",
    releaseDate: "2024-03-20",
    price: 240000,
    limited: false,
    adult: true,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    thumbnailIndex: 0,
    description:
      "Re:제로부터 시작하는 이세계 생활의 인기 캐릭터 렘의 바니 버전 피규어입니다. 프리잉의 B-STYLE 시리즈로, 1/4 스케일의 대형 피규어입니다.",
    specifications: "높이: 약 330mm, 재질: PVC, ABS",
    createdAt: "2023-11-05T09:15:00Z",
    updatedAt: "2024-01-10T11:20:00Z",
  },
  {
    id: "db3",
    name: "미쿠 매지컬 미라이 2023 Ver.",
    nameJp: "初音ミク マジカルミライ 2023 Ver.",
    nameEn: "Hatsune Miku Magical Mirai 2023 Ver.",
    manufacturer: "굿스마일컴퍼니",
    series: "하츠네 미쿠",
    character: "하츠네 미쿠",
    sculptors: ["이와나가 사쿠야"],
    category: "스케일",
    scale: "1/8",
    size: "약 210mm",
    material: "PVC, ABS",
    releaseDate: "2024-06-15",
    price: 180000,
    limited: true,
    adult: false,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    thumbnailIndex: 0,
    description:
      "하츠네 미쿠의 매지컬 미라이 2023 공연 의상을 기반으로 한 피규어입니다. 화려한 의상과 동적인 포즈가 특징입니다.",
    specifications: "높이: 약 210mm, 재질: PVC, ABS",
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "db4",
    name: "아쿠아 고양이 Ver.",
    nameJp: "アクア ネコVer.",
    nameEn: "Aqua Cat Ver.",
    manufacturer: "맥스팩토리",
    series: "이 멋진 세계에 축복을!",
    character: "아쿠아",
    sculptors: ["무라카미 유이치"],
    category: "스케일",
    scale: "1/7",
    size: "약 240mm",
    material: "PVC, ABS",
    releaseDate: "2024-05-10",
    price: 165000,
    limited: false,
    adult: false,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    thumbnailIndex: 0,
    description:
      "이 멋진 세계에 축복을!의 여신 아쿠아가 고양이 의상을 입은 모습의 피규어입니다. 귀여운 표정과 포즈가 특징입니다.",
    specifications: "높이: 약 240mm, 재질: PVC, ABS",
    createdAt: "2023-12-01T10:45:00Z",
    updatedAt: "2024-02-05T16:20:00Z",
  },
  {
    id: "db5",
    name: "제로투 드레스 Ver.",
    nameJp: "ゼロツー ドレスVer.",
    nameEn: "Zero Two Dress Ver.",
    manufacturer: "코토부키야",
    series: "다링 인 더 프랑키스",
    character: "제로투",
    category: "스케일",
    scale: "1/7",
    size: "약 250mm",
    material: "PVC, ABS",
    releaseDate: "2024-04-25",
    price: 210000,
    limited: false,
    adult: false,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    thumbnailIndex: 0,
    description:
      "다링 인 더 프랑키스의 히로인 제로투의 우아한 드레스 버전 피규어입니다. 섬세한 의상 표현과 아름다운 포즈가 특징입니다.",
    specifications: "높이: 약 250mm, 재질: PVC, ABS",
    createdAt: "2023-10-20T08:00:00Z",
    updatedAt: "2024-01-25T13:10:00Z",
  },
  {
    id: "db6",
    name: "간유 신노스케 넨드로이드",
    nameJp: "間宮新之助 ねんどろいど",
    nameEn: "Shinnosuke Ganyu Nendoroid",
    manufacturer: "굿스마일컴퍼니",
    series: "원신",
    character: "간유",
    category: "넨드로이드",
    size: "약 100mm",
    material: "PVC, ABS",
    releaseDate: "2024-07-15",
    price: 65000,
    limited: false,
    adult: false,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    thumbnailIndex: 0,
    description:
      "원신의 인기 캐릭터 간유의 넨드로이드 피규어입니다. 교체 가능한 표정과 소품이 포함되어 있습니다.",
    specifications: "높이: 약 100mm, 재질: PVC, ABS",
    createdAt: "2024-02-10T11:30:00Z",
    updatedAt: "2024-02-10T11:30:00Z",
  },
  {
    id: "db7",
    name: "키리토 엘루시데이터 Ver.",
    nameJp: "キリト エリュシデータVer.",
    nameEn: "Kirito Elucidator Ver.",
    manufacturer: "알터",
    series: "소드 아트 온라인",
    character: "키리토",
    category: "스케일",
    scale: "1/8",
    size: "약 200mm",
    material: "PVC, ABS",
    releaseDate: "2024-08-20",
    price: 175000,
    limited: false,
    adult: false,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    thumbnailIndex: 0,
    description:
      "소드 아트 온라인의 주인공 키리토의 액션 포즈 피규어입니다. 그의 대표적인 검 엘루시데이터를 들고 있는 모습입니다.",
    specifications: "높이: 약 200mm, 재질: PVC, ABS",
    createdAt: "2024-01-05T09:45:00Z",
    updatedAt: "2024-01-05T09:45:00Z",
  },
  {
    id: "db8",
    name: "라이덴 쇼군 피그마",
    nameJp: "雷電将軍 figma",
    nameEn: "Raiden Shogun figma",
    manufacturer: "맥스팩토리",
    series: "원신",
    character: "라이덴 쇼군",
    category: "피그마",
    size: "약 150mm",
    material: "PVC, ABS",
    releaseDate: "2024-09-10",
    price: 95000,
    limited: false,
    adult: false,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    thumbnailIndex: 0,
    description:
      "원신의 인기 캐릭터 라이덴 쇼군의 피그마 액션 피규어입니다. 다양한 포즈를 취할 수 있는 관절 구조가 특징입니다.",
    specifications: "높이: 약 150mm, 재질: PVC, ABS",
    createdAt: "2024-02-15T14:20:00Z",
    updatedAt: "2024-02-15T14:20:00Z",
  },
];
