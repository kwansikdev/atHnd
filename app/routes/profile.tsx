import { data, LoaderFunctionArgs } from "@remix-run/node";
import { useNavigate, useOutletContext } from "@remix-run/react";
import { Camera, ChevronRight, Clock, Zap } from "lucide-react";
import { JSX } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { useMobile } from "~/hooks/use-mobile";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { TOutletContext } from "~/root";
import { getUserFromRequest } from "~/shared/action";

export async function loader({ request }: LoaderFunctionArgs) {
  const { headers } = await getUserFromRequest(request);

  return data({}, { headers });
}

export default function Profile(): JSX.Element {
  const { profile } = useRootLoaderData();
  const { supabase } = useOutletContext<TOutletContext>();
  const navigate = useNavigate();
  const isMobile = useMobile();

  const signOut = async () => {
    await supabase.client.auth.signOut();
    navigate("/auth/login");
  };

  return (
    <main className="container mx-auto px-4 py-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 왼쪽 사이드바 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 프로필 카드 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-500 to-violet-500"></div>
            <div className="px-6 pb-6 -mt-12">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage
                  src={profile?.avatar_url || ""}
                  alt={profile?.nickname || "사용자"}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white text-2xl font-bold">
                  {(profile?.nickname || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="mt-4">
                <h2 className="text-xl font-bold">
                  {profile?.nickname || "사용자"}
                </h2>
                <p className="text-gray-500">피규어 수집가</p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Zap className="h-3 w-3" />
                  레벨 1
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  365일 연속
                </Badge>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>경험치</span>
                  <span>0/100</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900">6</div>
                  <div className="text-xs text-gray-500">피규어</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-xs text-gray-500">팔로워</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-xs text-gray-500">리뷰</div>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white">
                  <Camera className="h-4 w-4 mr-2" />
                  프로필 사진 변경
                </Button>
              </div>
            </div>
          </div>

          {/* 배지 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">획득한 배지</h3>
              <Badge variant="secondary">0개</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg">
                🏆
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-lg">
                ⭐
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-lg">
                🎯
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-lg">
                📦
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-lg opacity-40">
                🔍
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-gray-500"
            >
              모든 배지 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* 최근 활동 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">최근 활동</h3>
            <div className="space-y-4">
              {/* {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "purchase"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "review"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))} */}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-gray-500"
            >
              모든 활동 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        {isMobile && (
          <div className="mt-6">
            <Button
              variant={"outline"}
              className="bg-transparent w-full"
              onClick={signOut}
            >
              LOGOUT
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
