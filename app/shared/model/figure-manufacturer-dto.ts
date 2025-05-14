import { Database } from "supabase/schema";

export type FigureManufacturerDto =
  Database["public"]["Tables"]["figure_manufacturer"]["Row"][];
