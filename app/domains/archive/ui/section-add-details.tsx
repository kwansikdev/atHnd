import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "~/components/ui/input";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { SearchableSelect } from "~/shared/ui";
import { TArchiveAddContext } from "~/routes/archive.add";
import { useOutletContext } from "@remix-run/react";

export default function SectionAddDetails({
  goToPrevStep,
  goToNextStep,
}: {
  goToPrevStep: () => void;
  goToNextStep: () => void;
}) {
  const { scale } = useOutletContext<TArchiveAddContext>();
  console.log("🚀 ~ scale:", scale);
  const form = useFormContext();

  return (
    <motion.div
      key="details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            상세 정보
          </CardTitle>
          <CardDescription>
            피규어의 상세 정보를 입력해주세요. 이 단계의 모든 항목은 선택
            사항입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name_jp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>피규어 이름 (일본어)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="アスナ ウェディングドレスVer."
                      {...field}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>피규어 이름 (영어)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Asuna Wedding Dress Ver."
                      {...field}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sculptors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>원형사</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="호시노 카츠미, 타나카 마사토"
                      {...field}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormDescription>여러 명인 경우 쉼표로 구분</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paint_work"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>도색</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="타카하시 마사키, 스즈키 켄지"
                      {...field}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormDescription>여러 명인 경우 쉼표로 구분</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scale_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>스케일</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={scale.map((s) => ({
                        label: s.name,
                        value: s.id,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="스케일"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>크기</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="약 230mm"
                      {...field}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>재질</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="PVC, ABS"
                      {...field}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="limited"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>한정판</FormLabel>
                      <FormDescription>
                        한정 생산 피규어인 경우 체크
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adult"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>성인용</FormLabel>
                      <FormDescription>
                        성인용 피규어인 경우 체크
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goToPrevStep}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            이전 단계
          </Button>
          <Button type="button" onClick={goToNextStep} className="group">
            다음 단계
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
