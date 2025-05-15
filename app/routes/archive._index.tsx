import { LoaderFunctionArgs } from "@remix-run/node";
import { data, Link, useLoaderData } from "@remix-run/react";
import { Plus, Database } from "lucide-react";
import { getSupabaseServerClient } from "supabase";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { motion } from "framer-motion";
import { StatisticsSection } from "~/domains/archive/ui/statistics-section";
import { LatestFiguresSection } from "~/domains/archive/ui/latest-figures-section";
import { useState } from "react";
import { FigureSearchForm } from "~/domains/archive/ui/figure-search-form";
import { FigureGrid } from "~/domains/archive/ui/figure-grid";
import { CategoryNavigation } from "~/domains/common/category-navigation";

// 피규어 데이터 가져오기
export async function loader({ request }: LoaderFunctionArgs) {
  const { headers } = await getSupabaseServerClient(request);

  return data({ figures: [] }, { headers });
}

export default function Archive() {
  const { profile } = useRootLoaderData();
  const { figures } = useLoaderData<typeof loader>();

  const [activeTab, setActiveTab] = useState("all");
  const isAdmin = profile?.is_admin;
  const [loading] = useState(false);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* 헤더 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl blur-xl -z-10"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Database className="mr-2 h-6 w-6 text-primary" />
                피규어 데이터베이스
              </h1>
              <p className="text-muted-foreground mt-1">
                다양한 피규어 정보를 검색하고 찾아보세요
              </p>
            </div>

            {/* 관리자용 추가 버튼 */}
            {profile?.is_admin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Button
                  asChild
                  className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                >
                  <Link to="/archive/add" className="flex items-center">
                    <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                    <span>새 피규어 등록</span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* 통계 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatisticsSection />
        </motion.div>

        {/* 신규 피규어 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LatestFiguresSection type="new" />
        </motion.div>

        {/* 탭 인터페이스 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger
                  value="all"
                  className="relative data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  전체
                  {activeTab === "all" && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTabIndicator"
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="category"
                  className="relative data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  카테고리
                  {activeTab === "category" && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTabIndicator"
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="search"
                  className="relative data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  검색
                  {activeTab === "search" && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTabIndicator"
                    />
                  )}
                </TabsTrigger>
              </TabsList>

              {/* 모바일용 추가 버튼 */}
              {isAdmin && (
                <div className="md:hidden">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Link to="/admin/database/add">
                      <Plus className="h-4 w-4 mr-1" />
                      추가
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="space-y-6">
                <FigureSearchForm />
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <FigureGrid figures={figures} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="category" className="mt-0">
              <div className="space-y-6">
                <CategoryNavigation />
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <FigureGrid figures={figures} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="search" className="mt-0">
              <div className="space-y-6">
                <FigureSearchForm />
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <FigureGrid figures={figures} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </main>
  );
}
