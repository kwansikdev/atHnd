import { type MetaFunction } from "@remix-run/node";
import { Suspense } from "react";
// import { useNavigate } from "@remix-run/react";
// import { SearchBar } from "~/components/search-bar";
import { Skeleton } from "~/components/ui/skeleton";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  // const navigate = useNavigate();

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
        {/* <HomeHero /> */}
        HomeHero
      </Suspense>

      <div className="mt-24 mb-12">
        <h2 className="text-2xl font-bold mb-6">카테고리</h2>
        {/* <CategoryNavigation /> */}
        <div>CategoryNavigation</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-12">
          <Suspense fallback={<Skeleton className="h-80 w-full" />}>
            {/* <FeaturedFigures
              title="신규 출시 피규어"
              description="최근에 출시된 피규어를 확인해보세요"
              figures={newReleases}
              viewAllLink="/database/new-releases"
            /> */}
            <div>신규 출시 피규어</div>
          </Suspense>

          <Suspense fallback={<Skeleton className="h-80 w-full" />}>
            {/* <FeaturedFigures
              title="인기 피규어"
              description="많은 사용자들이 관심을 가진 피규어"
              figures={popularFigures}
              viewAllLink="/database/popular"
              /> */}
            <div>인기 피규어</div>
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            {/* <ActivityStats /> */}
            <div>ActivityStats</div>
          </Suspense>
        </div>
      </div>

      {/* <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <SearchBar />
        <AddFigureButton />
      </div>
      <FigureList />
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">피규어 목록</h2>
      </div> */}
    </main>
  );
}
