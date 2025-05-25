import { Outlet } from "@remix-run/react";

export default function ArchiveLayout() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Outlet />
    </main>
  );
}
