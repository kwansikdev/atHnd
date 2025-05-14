import { Database } from "supabase/schema";

export type FigureScaleDto =
  Database["public"]["Tables"]["figure_scale"]["Row"][];
