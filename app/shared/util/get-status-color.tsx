import { Database } from "supabase/schema";

// 상태별 색상 설정
export function getStatusColor(
  status: Database["public"]["Enums"]["user_figure_status"]
) {
  switch (status) {
    case "reserved":
      return "bg-sky-500 hover:bg-sky-600";
    case "ordered":
      return "bg-amber-400 hover:bg-amber-500";
    case "owned":
      return "bg-emerald-500 hover:bg-emerald-600";
    // case "wishlist":
    //   return "bg-rose-400 hover:bg-rose-500";
    default:
      return "bg-gray-400 hover:bg-gray-500";
  }
}
