import { Database } from "supabase/schema";

export interface UserFigureInsertDto extends Omit<
  Database["public"]["Tables"]["user_figure"]["Insert"],
  "user_id"
> {}
