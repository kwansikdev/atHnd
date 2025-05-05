import { useForm } from "react-hook-form";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { AreaImages } from "./area-images";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { FigureManufacturerDto } from "../model";
import { AreaReleaseDate } from "./area-release-date";
import { AreaPrice } from "./area-price";
import { AreaScaleSize } from "./area-scale-size";
import { AreaNames } from "./area-names";
import { useEffect } from "react";

export function ArchiveFigureAdd({
  manufacturer,
  isSuccess,
}: {
  manufacturer: FigureManufacturerDto;
  isSuccess: boolean;
}) {
  const form = useForm({
    // resolver: zodResolver(figureFormSchema),
    defaultValues: {
      name: "",
      name_jp: "",
      name_en: "",
      manufacturer: "",
      series: "",
      character: "",
      sculptors: [],
      paint_work: [],
      category: "",
      scale: "",
      size: "",
      material: "",
      release_date: "",
      price: 0,
      price_jp: 0,
      limited: false,
      adult: false,
      description: "",
      specifications: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, form]);

  return (
    <Form {...form}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AreaNames />

            <FormField
              control={form.control}
              name="series"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>작품</FormLabel>
                  <FormControl>
                    <Input placeholder="작품" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="character"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>캐릭터</FormLabel>
                  <FormControl>
                    <Input placeholder="아스나" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제조사</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string | undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="제조사 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manufacturer.map((m) => (
                        <SelectItem key={m.id} value={m.name_ko as string}>
                          {m.name_ko} ({m.name_en})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string | undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="스케일">스케일</SelectItem>
                      <SelectItem value="넨도로이드">넨도로이드</SelectItem>
                      <SelectItem value="팝업 퍼레이드">
                        팝업 퍼레이드
                      </SelectItem>
                      <SelectItem value="피그마">피그마</SelectItem>
                      <SelectItem value="액션 피규어">액션 피규어</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AreaScaleSize />

            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>재질</FormLabel>
                  <FormControl>
                    <Input placeholder="PVC, ABS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AreaReleaseDate />

            <AreaPrice />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="limited"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>한정판</FormLabel>
                      <FormDescription>
                        한정 생산 피규어인 경우 체크
                      </FormDescription>
                    </div>
                    <input
                      className="hidden"
                      name="limited"
                      value={field.value ? "on" : ""}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adult"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>성인용</FormLabel>
                      <FormDescription>
                        성인용 피규어인 경우 체크
                      </FormDescription>
                    </div>
                    <input
                      className="hidden"
                      name="adult"
                      value={field.value ? "on" : ""}
                    />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={form.control}
              name="sculptors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>원형사</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="호시노 카츠미, 타나카 마사토"
                      {...field}
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
                    />
                  </FormControl>
                  <FormDescription>여러 명인 경우 쉼표로 구분</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        </div>

        <AreaImages />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="피규어에 대한 설명을 입력하세요."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사양</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="피규어의 상세 사양을 입력하세요."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            // onClick={() => router.push("/database")}
            // disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            // disabled={isSubmitting}
          >
            {/* {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {figure ? "수정 중..." : "등록 중..."}
              </>
            ) : figure ? (
              "수정"
            ) : (
              "등록"
            )} */}
            등록
          </Button>
        </div>
      </div>
    </Form>
  );
}
