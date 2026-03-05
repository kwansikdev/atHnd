import { createContext, useContext } from "react";
import type { SupabaseService } from "supabase";

const SupabaseContext = createContext<SupabaseService | null>(null);

export function SupabaseProvider({
  supabase,
  children,
}: {
  supabase: SupabaseService;
  children: React.ReactNode;
}) {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase(): SupabaseService {
  const supabase = useContext(SupabaseContext);
  if (!supabase) {
    throw new Error("useSupabase must be used within SupabaseProvider");
  }
  return supabase;
}
