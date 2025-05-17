import { Database } from "supabase/schema";

export type ArchiveFigureAddDto =
  Database["public"]["Tables"]["figure"]["Insert"];
