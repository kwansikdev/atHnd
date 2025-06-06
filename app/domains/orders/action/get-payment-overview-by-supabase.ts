import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function getPaymentOverviewBySupabase(
  supabase: SupabaseClient<Database>
) {
  const { error, data, count } = await supabase
    .from("user_figure")
    .select(
      `
      paid_at,
      total_price,
      deposit_price,
      balance_price`,
      { count: "exact" }
    )
    .neq("status", "owned");

  if (error) throw error;

  const totalPrice = data?.reduce(
    (acc, { total_price }) => acc + (total_price || 0),
    0
  );

  const totalPaidPrice = data?.reduce(
    (acc, { paid_at, total_price, deposit_price }) => {
      if (!paid_at) return acc + (deposit_price || 0);

      return acc + (total_price || 0);
    },
    0
  );

  const totalBalancePrice = data?.reduce((acc, { paid_at, balance_price }) => {
    if (paid_at) return acc;
    return acc + (balance_price || 0);
  }, 0);

  return {
    data,
    count,
    totalPrice,
    totalPaidPrice,
    totalBalancePrice,
  };
}
