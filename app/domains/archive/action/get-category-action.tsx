import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function GetCategoryAction(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("figure_category").select("*");

  if (error) throw error;
  return data;
}
