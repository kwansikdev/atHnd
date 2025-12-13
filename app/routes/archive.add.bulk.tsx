import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ArchiveFigureAddBulk } from "~/domains/archive/ui/archive-figure-add-bulk";

// export async function loader({ request }: LoaderFunctionArgs) {
//   const { supabase } = await getSupabaseServerClient(request);

//   const manufacturer = await GetManufacturerAction(supabase);

//   return data({ manufacturer });
// }

// export async function action({ request }: ActionFunctionArgs) {
//   const body = await request.formData();

//   const adult = body.get("adult") as string;
//   const category = body.get("category") as string;
//   const character = body.get("character") as string;
//   const description = body.get("description") as string;
//   const limited = body.get("limited") as string;
//   const manufacturer = body.get("manufacturer") as string;
//   const material = body.get("material") as string;
//   const name = body.get("name") as string;
//   const name_jp = body.get("name_jp") as string;
//   const name_en = body.get("name_en") as string;
//   // const paint_work = body.get("paint_work") as string;
//   const price = body.get("price") as string;
//   const price_jp = body.get("price_jp") as string;
//   const release_date = body.get("release_date") as string;
//   const scale = body.get("scale") as string;
//   // const sculptors = body.get("sculptors") as string;
//   const series = body.get("series") as string;
//   const size = body.get("size") as string;
//   const specifications = body.get("specifications") as string;

//   const [year, month, day] = release_date.split("-");

//   const { supabase } = await getSupabaseServerClient(request);

//   const response = await supabase
//     .from("figure")
//     .insert([
//       {
//         adult: adult === "on" ? true : false,
//         category,
//         character,
//         description,
//         limited: limited === "on" ? true : false,
//         manufacturer,
//         material,
//         name,
//         name_jp,
//         name_en,
//         paint_work: null,
//         price: parseInt(price),
//         price_jp: parseInt(price_jp),
//         release_year: parseInt(year),
//         release_month: parseInt(month),
//         release_text: `${year}년 ${month}월` + (day ? ` ${day}일` : ""),
//         scale: scale || null,
//         sculptors: null,
//         series,
//         size,
//         specifications,
//       },
//     ])
//     .select();

//   if (response.error) {
//     return data({ error: true });
//   }

//   if (response.data.length !== 0) {
//     const images = body.getAll("images") as string[];
//     const imagesDbData = images.map((url, idx) => ({
//       figure_id: response.data[0].id,
//       image_url: url,
//       sort_order: idx,
//     }));

//     const updateImages = await supabase
//       .from("figure_image")
//       .insert(imagesDbData)
//       .select();

//     if (updateImages.error) {
//       return data({ error: true });
//     }
//   }

//   return data({
//     success: true,
//   });
// }

export default function DatabaseAdd() {
  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        <div className="relative">
          <h1 className="text-3xl font-bold">피규어 일괄 등록</h1>
          <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/10 to-transparent blur-xl opacity-50 rounded-full"></div>
        </div>
        <p className="text-muted-foreground">
          CSV 또는 JSON 형식으로 여러 피규어를 한 번에 등록할 수 있습니다.
          템플릿을 다운로드하여 시작하세요.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ArchiveFigureAddBulk />
      </motion.div>
    </div>
  );
}
