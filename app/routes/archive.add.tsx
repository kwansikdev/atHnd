import { LoaderFunctionArgs } from "@remix-run/node";
import {
  data,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "@remix-run/react";
import { ArrowLeft, Upload } from "lucide-react";
import { getSupabaseServerClient } from "supabase";
import { Button } from "~/components/ui/button";
import {
  GetCategoryAction,
  GetCharacterAction,
  GetManufacturerAction,
  GetSeriesAction,
} from "~/domains/archive/action";
import { motion } from "framer-motion";
import { TOutletContext } from "~/root";
import {
  FigureCategoryDto,
  FigureCharacterDto,
  FigureManufacturerDto,
  FigureScaleDto,
  FigureSeriesDto,
} from "~/shared/model";
import { GetScaleAction } from "~/domains/archive/action/get-scale-action";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = await getSupabaseServerClient(request);

  const manufacturer = await GetManufacturerAction(supabase);
  const category = await GetCategoryAction(supabase);
  const series = await GetSeriesAction(supabase);
  const character = await GetCharacterAction(supabase);
  const scale = await GetScaleAction(supabase);

  return data({ manufacturer, category, series, character, scale });
}
export type TLoaderData = {
  manufacturer: FigureManufacturerDto;
  category: FigureCategoryDto;
  series: FigureSeriesDto;
  character: FigureCharacterDto;
  scale: FigureScaleDto;
};

export type TArchiveAddContext = TOutletContext & TLoaderData;

export default function ArchiveAdd() {
  const rootOutletContext = useOutletContext<TOutletContext>();
  const loaderData = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex justify-between items-center"
      >
        <Button variant="ghost" asChild className="group">
          <Link to="/archive" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="relative">
              피규어 데이터베이스로 돌아가기
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </span>
          </Link>
        </Button>

        <Button variant="outline" asChild className="group">
          {pathname.includes("bulk") ? (
            <Link to="/archive/add" className="inline-flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              개별 등록
            </Link>
          ) : (
            <Link to="/archive/add/bulk" className="inline-flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              일괄 등록
            </Link>
          )}
        </Button>
      </motion.div>

      <Outlet context={{ ...rootOutletContext, ...loaderData }} />
    </main>
  );
}
