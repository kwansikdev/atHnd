import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function getTotalOrderBySupabase(
  supabase: SupabaseClient<Database>
) {
  const { error, data, count } = await supabase
    .from("user_figure")
    .select("*", {
      count: "exact",
    })
    .neq("status", "owned");

  if (error) {
    throw error;
  }

  return { data, count };
}
