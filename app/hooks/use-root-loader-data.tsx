// app/hooks/useRootLoaderData.ts
import { useRouteLoaderData } from "@remix-run/react";
import type { loader } from "~/root";

export function useRootLoaderData() {
  const data = useRouteLoaderData<typeof loader>("root");

  if (!data) {
    throw new Error("Root loader data is missing.");
  }

  return data;
}
