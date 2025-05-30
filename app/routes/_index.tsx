import { type MetaFunction } from "@remix-run/node";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { ActivityStats } from "~/domains/home/ui/activity-stats";
import { CategoryNavigation } from "~/domains/home/ui/category-navigation";
import { FeaturedFigures } from "~/domains/home/ui/featured-figures";
import { HomeHero } from "~/domains/home/ui/home-hero";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
        <HomeHero />
      </Suspense>

      <div className="mt-24 mb-12">
        <h2 className="text-2xl font-bold mb-6">카테고리</h2>
        <CategoryNavigation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-12">
          <Suspense fallback={<Skeleton className="h-80 w-full" />}>
            <FeaturedFigures
              title="신규 출시 피규어"
              description="최근에 출시된 피규어를 확인해보세요"
              figures={newReleases}
              viewAllLink="/archive"
            />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-80 w-full" />}>
            <FeaturedFigures
              title="인기 피규어"
              description="많은 사용자들이 관심을 가진 피규어"
              figures={popularFigures}
              viewAllLink="/archive"
            />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <ActivityStats />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

// 샘플 데이터
const newReleases = [
  {
    id: "db1",
    name: "아스나 웨딩 드레스 Ver.",
    image: "/placeholder.svg?height=400&width=400",
    manufacturer: "알터",
    series: "소드 아트 온라인",
    price: 198000,
    releaseDate: "2023-12-15",
    limited: true,
  },
  {
    id: "db2",
    name: "렘 바니 Ver.",
    image: "/placeholder.svg?height=400&width=400",
    manufacturer: "프리잉",
    series: "Re:제로부터 시작하는 이세계 생활",
    price: 240000,
    releaseDate: "2024-03-20",
  },
  {
    id: "db3",
    name: "미쿠 매지컬 미라이 2023 Ver.",
    image: "/placeholder.svg?height=400&width=400",
    manufacturer: "굿스마일컴퍼니",
    series: "하츠네 미쿠",
    price: 180000,
    releaseDate: "2024-06-15",
    limited: true,
  },
  {
    id: "db4",
    name: "아쿠아 고양이 Ver.",
    image: "/placeholder.svg?height=400&width=400",
    manufacturer: "맥스팩토리",
    series: "이 멋진 세계에 축복을!",
    price: 165000,
    releaseDate: "2024-05-10",
  },
  {
    id: "db5",
    name: "제로투 드레스 Ver.",
    image: "/placeholder.svg?height=400&width=400",
    manufacturer: "코토부키야",
    series: "다링 인 더 프랑키스",
    price: 210000,
    releaseDate: "2024-04-25",
  },
];

const popularFigures = [
  {
    id: "db6",
    name: "간유 신노스케 넨드로이드",
    image: "/placeholder.svg?height=400&width=400",
    manufacturer: "굿스마일컴퍼니",
    series: "원신",
    price: 65000,
    releaseDate: "2024-07-15",
  },
  {
    id: "db7",
    name: "키리토 엘루시데이터 Ver.",
    image: "/placeholder.svg?height=400&width=400",
    manufacturer: "알터",
    series: "소드 아트 온라인",
    price: 175000,
    releaseDate: "2024-08-20",
  },
  {
    id: "db8",
    name: "라이덴 쇼군 피그마",
    image: "/placeholder.svg?height=400&width=400",
    manufacturer: "맥스팩토리",
    series: "원신",
    price: 95000,
    releaseDate: "2024-09-10",
  },
  {
    id: "db2",
    name: "렘 바니 Ver.",
    image: "/placeholder.svg?height=400&width=400",
    manufacturer: "프리잉",
    series: "Re:제로부터 시작하는 이세계 생활",
    price: 240000,
    releaseDate: "2024-03-20",
  },
  {
    id: "db5",
    name: "제로투 드레스 Ver.",
    image: "/placeholder.svg?height=400&width=400",
    manufacturer: "코토부키야",
    series: "다링 인 더 프랑키스",
    price: 210000,
    releaseDate: "2024-04-25",
  },
];
