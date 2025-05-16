import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function GetSeriesAction(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("figure_series").select("*");

  if (error) throw error;
  return data;
}
