import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function getTotalBalanceBySupabase(
  supabase: SupabaseClient<Database>
) {
  const { error, data, count } = await supabase
    .from("user_figure")
    .select("balance_price", {
      count: "exact",
    })
    .eq("status", "reserved")
    .is("balance_paid_at", null)
    .gt("balance_price", 0);

  if (error) throw error;

  const totalBalance = data?.reduce(
    (acc, { balance_price }) => acc + (balance_price || 0),
    0
  );

  return { data, count, totalBalance };
}
