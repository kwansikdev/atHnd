import { data, LoaderFunctionArgs } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { getSupabaseServerClient } from "supabase/supabase-service";
import { GetCategoryAction, GetScaleAction } from "~/domains/admin/action";

import { TOutletContext } from "~/root";
import { FigureCategoryDto, FigureScaleDto } from "~/shared/model";

export type TLoaderData = {
  // manufacturer: FigureManufacturerDto;
  category: FigureCategoryDto;
  // series: FigureSeriesDto;
  // character: FigureCharacterDto;
  scale: FigureScaleDto;
};

export type TAddFigureContext = TOutletContext & TLoaderData;

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = await getSupabaseServerClient(request);
  const category = await GetCategoryAction(supabase);
  const scale = await GetScaleAction(supabase);

  return data({ category, scale });
}

export default function AdminFigureAdd() {
  const rootOutletContext = useOutletContext<TOutletContext>();
  const loaderData = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-15 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4 mx-auto">
          <button
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={goBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Add Figures to Database</h1>
            <p className="text-xs text-muted-foreground">
              Admin Panel
              {/* - {forms.length} figure(s) */}
            </p>
          </div>
          {/* <Button
            type="button"
            variant="outline"
            size="sm"
            // onClick={addForm}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Another
          </Button> */}
        </div>
      </header>

      <main className="container m-auto px-4 py-8">
        {loaderData && (
          <Outlet context={{ ...rootOutletContext, ...loaderData }} />
        )}
        {/* <AddFigureForm figures={fields} /> */}
      </main>
    </div>
  );
}
