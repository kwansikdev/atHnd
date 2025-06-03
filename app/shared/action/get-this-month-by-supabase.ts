import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function getThisMonthBySupabase(
  supabase: SupabaseClient<Database>
) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0부터 시작 (6월은 5)

  const start = new Date(year, month, 1).toISOString();
  const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const { error, data, count } = await supabase
    .from("user_figure")
    .select(
      `
      total_price,
      paid_at
    `,
      {
        count: "exact",
      }
    )
    .not("paid_at", "is", null)
    .gte("paid_at", start)
    .lte("paid_at", end);

  if (error) throw error;

  const totalPaid = data?.reduce(
    (acc, cur) => (acc + (cur.total_price || 0)) as number,
    0
  );

  return { data, count, totalPaid };
}
