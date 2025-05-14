import { Database } from "supabase/schema";

export type FigureSeriesDto =
  Database["public"]["Tables"]["figure_series"]["Row"][];
