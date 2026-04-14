// context/ui-scope-context.tsx
import { createContext, useContext } from "react";
import { useUIStore } from "../store/ui";

type UIScopeContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const UIScopeContext = createContext<UIScopeContextValue | null>(null);

export function UIScopeProvider({
  scopeId,
  children,
}: {
  scopeId: string;
  children: React.ReactNode;
}) {
  const { openMap, open, close, toggle } = useUIStore();

  return (
    <UIScopeContext.Provider
      value={{
        isOpen: openMap[scopeId] ?? false,
        open: () => open(scopeId),
        close: () => close(scopeId),
        toggle: () => toggle(scopeId),
      }}
    >
      {children}
    </UIScopeContext.Provider>
  );
}

export function useUIScope() {
  const ctx = useContext(UIScopeContext);
  if (!ctx) throw new Error("useUIScope must be used within UIScopeProvider");
  return ctx;
}
