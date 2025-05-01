"use client";
//
// import { Form } from "@remix-run/react";
import { Plus, X } from "lucide-react";
// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
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
import { Textarea } from "~/components/ui/textarea";
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Loader2, Plus, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { useRouter } from "next/navigation"
// import { manufacturers, series } from "@/lib/database-data"
// import type { DatabaseFigure } from "@/lib/database-data"

// 폼 스키마 정의
// const figureFormSchema = z.object({
//   name: z.string().min(1, "피규어 이름을 입력해주세요"),
//   nameJp: z.string().optional(),
//   nameEn: z.string().optional(),
//   manufacturer: z.string().min(1, "제조사를 선택해주세요"),
//   series: z.string().min(1, "작품을 선택해주세요"),
//   character: z.string().min(1, "캐릭터 이름을 입력해주세요"),
//   sculptors: z.string().optional(),
//   paintWork: z.string().optional(),
//   category: z.string().min(1, "카테고리를 선택해주세요"),
//   scale: z.string().optional(),
//   size: z.string().optional(),
//   material: z.string().optional(),
//   releaseDate: z.string().min(1, "출시일을 입력해주세요"),
//   price: z.coerce.number().min(0, "가격은 0 이상이어야 합니다"),
//   limited: z.boolean().default(false),
//   adult: z.boolean().default(false),
//   description: z.string().optional(),
//   specifications: z.string().optional(),
// })

// type FigureFormValues = z.infer<typeof figureFormSchema>

interface AdminFigureFormProps {
  figure?: any;
  onSuccess?: () => void;
}

export function DatabaseFigureForm({
  figure,
  onSuccess,
}: AdminFigureFormProps) {
  // const { toast } = useToast()
  // const router = useRouter()
  // const [images, setImages] = useState<string[]>(figure?.images || [""])
  // const [isSubmitting, setIsSubmitting] = useState(false)

  // 기본값 설정
  // const defaultValues: Partial<FigureFormValues> = {
  //   name: figure?.name || "",
  //   nameJp: figure?.nameJp || "",
  //   nameEn: figure?.nameEn || "",
  //   manufacturer: figure?.manufacturer || "",
  //   series: figure?.series || "",
  //   character: figure?.character || "",
  //   sculptors: figure?.sculptors?.join(", ") || "",
  //   paintWork: figure?.paintWork?.join(", ") || "",
  //   category: figure?.category || "",
  //   scale: figure?.scale || "",
  //   size: figure?.size || "",
  //   material: figure?.material || "",
  //   releaseDate: figure?.releaseDate || new Date().toISOString().split("T")[0],
  //   price: figure?.price || 0,
  //   limited: figure?.limited || false,
  //   adult: figure?.adult || false,
  //   description: figure?.description || "",
  //   specifications: figure?.specifications || "",
  // }

  const form = useForm({
    // resolver: zodResolver(figureFormSchema),
    // defaultValues,
  });

  // 이미지 URL 추가
  const addImageField = () => {
    // setImages([...images, ""])
  };

  // 이미지 URL 제거
  const removeImageField = (index: number) => {
    // const newImages = [...images]
    // newImages.splice(index, 1)
    // setImages(newImages)
  };

  // 이미지 URL 변경
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    // setImages(newImages)
  };

  // 폼 제출 처리
  async function onSubmit(values: any) {
    // setIsSubmitting(true)
    // try {
    //   // 이미지 URL 필터링 (빈 문자열 제거)
    //   const filteredImages = images.filter((img) => img.trim() !== "")
    //   if (filteredImages.length === 0) {
    //     toast({
    //       title: "오류",
    //       description: "최소 한 개 이상의 이미지 URL을 입력해주세요.",
    //       variant: "destructive",
    //     })
    //     setIsSubmitting(false)
    //     return
    //   }
    //   // 폼 데이터 가공
    //   const figureData = {
    //     ...values,
    //     sculptors: values.sculptors ? values.sculptors.split(",").map((s) => s.trim()) : undefined,
    //     paintWork: values.paintWork ? values.paintWork.split(",").map((p) => p.trim()) : undefined,
    //     images: filteredImages,
    //   }
    //   // 실제 구현에서는 API 호출로 데이터 저장
    //   console.log("저장할 피규어 데이터:", figureData)
    //   // 성공 메시지 표시
    //   toast({
    //     title: "성공",
    //     description: figure ? "피규어 정보가 수정되었습니다." : "새 피규어가 등록되었습니다.",
    //   })
    //   // 성공 콜백 호출 또는 리다이렉트
    //   if (onSuccess) {
    //     onSuccess()
    //   } else {
    //     router.push("/database")
    //   }
    // } catch (error) {
    //   console.error("피규어 저장 중 오류:", error)
    //   toast({
    //     title: "오류",
    //     description: "피규어 정보 저장 중 오류가 발생했습니다.",
    //     variant: "destructive",
    //   })
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>피규어 이름 (한글)</FormLabel>
                  <FormControl>
                    <Input placeholder="아스나 웨딩 드레스 Ver." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameJp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>피규어 이름 (일본어)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="アスナ ウェディングドレスVer."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>피규어 이름 (영어)</FormLabel>
                  <FormControl>
                    <Input placeholder="Asuna Wedding Dress Ver." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제조사</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="제조사 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* {manufacturers.map((m) => (
                        <SelectItem key={m.id} value={m.name}>
                          {m.name}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="series"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>작품</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="작품 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* {series.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
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

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="스케일">스케일</SelectItem>
                      <SelectItem value="넨드로이드">넨드로이드</SelectItem>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스케일</FormLabel>
                    <FormControl>
                      <Input placeholder="1/7" {...field} />
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
                      <Input placeholder="약 230mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>출시일</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>가격 (원)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  </FormItem>
                )}
              />
            </div>

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
                    />
                  </FormControl>
                  <FormDescription>여러 명인 경우 쉼표로 구분</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paintWork"
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
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">이미지 URL</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addImageField}
            >
              <Plus className="mr-2 h-4 w-4" />
              이미지 추가
            </Button>
          </div>

          <div className="space-y-2">
            {/* {images.map((image, index) => ( */}
            <div key={"index"} className="flex gap-2">
              <Input
                placeholder="이미지 URL 입력"
                // value={image}
                // onChange={(e) => handleImageChange(index, e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                // onClick={() => removeImageField(index)}
                // disabled={images.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* ))} */}
          </div>
        </div>

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
      </form>
    </Form>
  );
}
