import { Outlet, useOutletContext } from "@remix-run/react";
import { TOutletContext } from "~/root";

export default function CollectionIndex() {
  const context = useOutletContext<TOutletContext>();
  return (
    <main className="container mx-auto px-4 py-8 relative">
      <h2 className="text-3xl font-bold mb-6">내 컬렉션</h2>
      <Outlet context={context} />
    </main>
  );
}
