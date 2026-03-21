import { format } from "date-fns";

export function formatDate(date: string | null) {
  return date ? format(new Date(date), "yyyy-MM-dd") : "-";
}
