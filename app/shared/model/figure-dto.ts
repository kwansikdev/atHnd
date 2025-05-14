import { Database } from "supabase/schema";

export type FigureDto = Database["public"]["Tables"]["figure"]["Row"][];
