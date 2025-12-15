import { type MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { getSupabaseServerClient } from "supabase/supabase-service";
import { getUserFigureListAction } from "~/domains/home/action/get-user-figure-list-action";
import CalendarTimeline from "~/domains/home/ui/calendar-timeline";
import { TOutletContext } from "~/root";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: { request: Request }) {
  const { supabase } = await getSupabaseServerClient(request);
  const url = new URL(request.url);
  const year = new Date().getFullYear().toString();
  const y = url.searchParams.get("y") ?? year;
  const figures = await getUserFigureListAction(supabase, { year: y });

  return Response.json({ figures });
}

export default function Index() {
  const rootOutletContext = useOutletContext<TOutletContext>();
  const { figures } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Figure Collection</h1>
          <p className="text-muted-foreground mt-1">
            Manage your reservations and purchases
          </p>
        </div>
      </div>

      <CalendarTimeline figures={figures} />
      <Outlet context={{ ...rootOutletContext }} />
    </main>
  );
}
