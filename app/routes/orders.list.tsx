import { data, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Package } from "lucide-react";
import { getSupabaseServerClient } from "supabase";
import { getOrderBySupabase } from "~/domains/orders/action";
import { FigureCard } from "~/domains/orders/ui";
import { cn } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = await getSupabaseServerClient(request);

  const orders = await getOrderBySupabase(supabase);

  return data({
    orders: {
      data: orders.data,
      count: orders.count,
    },
  });
}

export default function OrdersList() {
  const { orders } = useLoaderData<typeof loader>();

  if (orders.count === 0) {
    return (
      <div className="space-y-6 mt-6 animate-in fade-in-50 duration-500">
        <div className="text-center py-16">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
            <Package className="h-16 w-16 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
            예약/주문 목록이 비어있습니다
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto text-lg">
            아직 예약하거나 주문한 피규어가 없습니다.{" "}
            <br className="hidden sm:block" />
            지금 바로 원하는 피규어를 예약해보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      )}
    >
      {orders.data.map((order) => (
        <FigureCard key={order.id} {...order} />
      ))}
    </div>
  );
}
