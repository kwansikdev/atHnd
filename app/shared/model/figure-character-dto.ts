import { Database } from "supabase/schema";

export type FigureCharacterDto =
  Database["public"]["Tables"]["figure_character"]["Row"][];
