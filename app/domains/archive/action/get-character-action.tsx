import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function GetCharacterAction(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("figure_character").select("*");

  if (error) throw error;
  return data;
}
