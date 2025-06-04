import { Database } from "supabase/schema";

export type FigureImageDto =
  Database["public"]["Tables"]["figure_image"]["Row"];
