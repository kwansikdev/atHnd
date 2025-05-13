// contexts/LoaderDataContext.js
import { createContext, useContext } from "react";

type LoaderDataContextType<T> = T;

const LoaderDataContext = createContext<LoaderDataContextType<unknown> | null>(
  null
);

export function LoaderDataProvider<T>({
  children,
  value,
}: {
  children: React.ReactNode;
  value: T;
}) {
  return (
    <LoaderDataContext.Provider value={value}>
      {children}
    </LoaderDataContext.Provider>
  );
}

export function useLoaderDataContext<T>() {
  const context = useContext(LoaderDataContext);

  if (!context) {
    throw new Error(
      "useLoaderDataContext must be used within a LoaderDataProvider"
    );
  }

  return context as LoaderDataContextType<T>;
}
