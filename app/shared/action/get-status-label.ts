import { Database } from "supabase/schema";

export function getStatusLabel(
  status: Database["public"]["Enums"]["user_figure_status"]
) {
  switch (status) {
    case "reserved":
      return "예약";
    case "ordered":
      return "구매";
    case "owned":
      return "소장";
    default:
      return "";
  }
}
