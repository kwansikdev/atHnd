import { Outlet } from "@remix-run/react";

export default function AdminFigures() {
  return (
    <div className="container mx-auto min-h-full flex flex-1">
      <Outlet />
    </div>
  );
}
