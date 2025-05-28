import { Outlet, useOutletContext } from "@remix-run/react";
import { TOutletContext } from "~/root";

export default function ArchiveLayout() {
  const context = useOutletContext<TOutletContext>();
  return (
    <main className="container mx-auto px-4 py-8">
      <Outlet context={context} />
    </main>
  );
}
