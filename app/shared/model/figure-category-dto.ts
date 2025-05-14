import { Database } from "supabase/schema";

export type FigureCategoryDto =
  Database["public"]["Tables"]["figure_category"]["Row"][];
