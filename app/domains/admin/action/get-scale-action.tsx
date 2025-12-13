import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function GetScaleAction(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("figure_scale")
    .select("*")
    .order("ratio", { ascending: true });

  if (error) throw error;
  return data;
}
