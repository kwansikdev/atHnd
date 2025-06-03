import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function getTotalPreorderBySupabase(
  supabase: SupabaseClient<Database>
) {
  const { error, ...totalPreorder } = await supabase
    .from("user_figure")
    .select("*", {
      count: "exact",
    })
    .eq("status", "reserved");

  if (error) {
    throw error;
  }

  return totalPreorder;
}
