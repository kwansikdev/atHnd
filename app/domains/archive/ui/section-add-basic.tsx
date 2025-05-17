import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { AreaAddPrice } from "./area-add-price";
import { AreaAddReleaseDate } from "./area-add-release-date";
import { Button } from "~/components/ui/button";
import { useOutletContext } from "@remix-run/react";
import { TArchiveAddContext } from "~/routes/archive.add";
import { SearchableSelect } from "~/shared/ui/searchable-select";
import { useMemo } from "react";
import { FigureAddFormValues } from "./archive-figure-form";

export default function SectionAddBasic({
  goToNextStep,
}: {
  goToNextStep: () => void;
}) {
  const { character, series, manufacturer, category } =
    useOutletContext<TArchiveAddContext>();
  const form = useFormContext<FigureAddFormValues>();

  const seriesIdFormValue = useWatch({
    control: form.control,
    name: "series_id",
  });

  const _character = useMemo(() => {
    if (!seriesIdFormValue) return [];
    return character
      .filter((c) => c.series_id === seriesIdFormValue)
      .map((c) => ({
        label: c.name_ko,
        value: c.id,
      }));
  }, [seriesIdFormValue, character]);

  return (
    <motion.div
      key="basic"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" />
            기본 정보
          </CardTitle>
          <CardDescription>
            피규어의 기본 정보를 입력해주세요. 별표(*)가 표시된 항목은 필수 입력
            사항입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      피규어 이름 (한글)
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="아스나 웨딩 드레스 Ver." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="series_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      작품<span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={series.map((s) => ({
                          label: s.name_ko,
                          value: s.id,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="작품"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="character_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      캐릭터
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={_character}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="캐릭터"
                        disabled={!seriesIdFormValue}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="manufacturer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      제조사
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={manufacturer.map((m) => ({
                          label: m.name_ko || "",
                          value: m.id,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="제조사"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      카테고리
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={category.map((c) => ({
                          label: c.name_ko || "",
                          value: c.id,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="카테고리"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AreaAddPrice />

              <AreaAddReleaseDate />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="button"
            onClick={goToNextStep}
            className="group"
            disabled={
              !form.getValues().name ||
              !form.getValues().manufacturer_id ||
              !form.getValues().series_id ||
              !form.getValues().character_id ||
              !form.getValues().category_id ||
              !form.getValues().release_text ||
              !form.getValues().price_kr
            }
          >
            다음 단계
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
