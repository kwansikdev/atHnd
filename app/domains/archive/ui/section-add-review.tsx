"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Clock,
  FileText,
  ImageIcon,
  Camera,
  AlertCircle,
  Save,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Badge } from "~/components/ui/badge";
import { useEffect, useState } from "react";

import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { FigureAddFormValues } from "./archive-figure-form";

import { useFetcherActionContext } from "~/hooks/use-fetcher-action-state";
import { useOutletContext } from "@remix-run/react";
import { TArchiveAddContext } from "~/routes/archive.add";
import { toast } from "sonner";

export default function SectionAddReview({
  goToPrevStep,
  goToStartStep,
}: {
  goToPrevStep: () => void;
  goToStartStep: () => void;
}) {
  const { character, series, manufacturer, category, scale } =
    useOutletContext<TArchiveAddContext>();
  const { fetcher, isLoading, isSuccess } = useFetcherActionContext();
  const [previewMode, setPreviewMode] = useState(false);
  const form = useFormContext<FigureAddFormValues>();

  const [formData, setFormData] = useState({} as FigureAddFormValues);

  useEffect(() => {
    setFormData(form.getValues());
  }, [form]);

  // 이미지
  const images = formData.images || [];
  const thumbnailIndex = images.findIndex((img) => img.sort_order === 0) || 0; // -1, 0

  // 성공 시 초기화
  useEffect(() => {
    if (isSuccess) goToStartStep();
  }, [isSuccess, goToStartStep]);

  const isFormValid =
    !form.getValues("name") ||
    !form.getValues("manufacturer_id") ||
    !form.getValues("series_id") ||
    !form.getValues("character_id") ||
    !form.getValues("category_id") ||
    !form.getValues("release_text");

  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bookmark className="mr-2 h-5 w-5 text-primary" />
            최종 검토
          </CardTitle>
          <CardDescription>
            입력한 정보를 최종 검토해주세요. 모든 내용이 정확한지 확인한 후 등록
            버튼을 클릭하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-end mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="group"
            >
              {previewMode ? (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  상세 보기
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  미리 보기
                </>
              )}
            </Button>
          </div>

          {previewMode ? (
            <div className="space-y-6">
              {/* 미리보기 모드 */}
              <div className="rounded-lg overflow-hidden border">
                <div className="aspect-[16/9] relative bg-muted">
                  {images.length > 0 ? (
                    images.filter((img) => img.url).length > 0 ? (
                      <img
                        src={images[thumbnailIndex]?.url || images[0]?.url}
                        alt={formData.name || "피규어 이미지"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Camera className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )
                  ) : null}
                  {formData.limited && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500">
                      한정판
                    </Badge>
                  )}
                  {formData.adult && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      성인용
                    </Badge>
                  )}
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {formData.name || "피규어 이름"}
                    </h3>
                    <p className="text-muted-foreground">
                      {character.find((c) => c.id === formData.character_id)
                        ?.name_ko || "캐릭터 이름"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {manufacturer.find(
                        (m) => m.id === formData.manufacturer_id
                      )?.name_ko || "제조사"}
                    </Badge>
                    <Badge variant="outline">
                      {series.find((s) => s.id === formData.series_id)
                        ?.name_ko || "작품"}
                    </Badge>
                    <Badge variant="outline">
                      {category.find((c) => c.id === formData.category_id)
                        ?.name_ko || "카테고리"}
                    </Badge>
                    {scale.find((s) => s.id === formData.scale_id)?.name && (
                      <Badge variant="outline">
                        {scale.find((s) => s.id === formData.scale_id)?.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {/* {formData.release_text
                          ? format(
                              new Date(formData.release_date),
                              "yyyy년 MM월",
                              { locale: ko }
                            )
                          : "출시일"} */}
                        {formData.release_text ?? "출시일"}
                      </span>
                    </div>
                    <div className="font-bold text-lg">
                      {formData.price_kr
                        ? `${formData.price_kr.toLocaleString()}원`
                        : "가격"}
                    </div>
                  </div>
                  {formData.description && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">설명</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 상세 보기 모드 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">기본 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">피규어 이름 (한글)</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.name || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">캐릭터</p>
                    <p className="text-sm text-muted-foreground">
                      {character.find((c) => c.id === formData.character_id)
                        ?.name_ko || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">제조사</p>
                    <p className="text-sm text-muted-foreground">
                      {manufacturer.find(
                        (m) => m.id === formData.manufacturer_id
                      )?.name_ko || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">작품</p>
                    <p className="text-sm text-muted-foreground">
                      {series.find((s) => s.id === formData.series_id)
                        ?.name_ko || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">카테고리</p>
                    <p className="text-sm text-muted-foreground">
                      {category.find((c) => c.id === formData.category_id)
                        ?.name_ko || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">출시일</p>
                    <p className="text-sm text-muted-foreground">
                      {
                        formData.release_text ?? "-"
                        // ? format(
                        //     new Date(formData.release_date),
                        //     "yyyy년 MM월",
                        //     { locale: ko }
                        //   )
                        // : "-"
                      }
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">가격</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.price_kr
                        ? `${Number(formData.price_kr).toLocaleString()}원`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">상세 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">피규어 이름 (일본어)</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.name_jp || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">피규어 이름 (영어)</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.name_en || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">원형사</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.sculptors || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">도색</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.paint_work || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">스케일</p>
                    <p className="text-sm text-muted-foreground">
                      {scale.find((s) => s.id === formData.scale_id)?.name ||
                        "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">크기</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.size || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">재질</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.material || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">특성</p>
                    <div className="flex gap-2">
                      {formData.limited && <Badge>한정판</Badge>}
                      {formData.adult && (
                        <Badge variant="destructive">성인용</Badge>
                      )}
                      {!formData.limited && !formData.adult && (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">이미지</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {images.filter((img) => img.url).length > 0 ? (
                    images
                      .filter((img) => img.url)
                      .map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-md overflow-hidden border"
                        >
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={`이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {thumbnailIndex === index && (
                            <div className="absolute top-1 right-1">
                              <Badge className="bg-primary text-white text-xs">
                                썸네일
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                      이미지가 없습니다
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">설명 및 사양</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">설명</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {formData.description || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">사양</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {formData.specifications || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 유효성 검사 결과 */}
          {!form.formState.isValid && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>필수 정보 누락</AlertTitle>
              <AlertDescription>
                다음 필수 정보가 누락되었습니다:
                <ul className="list-disc pl-5 mt-2">
                  {!form.getValues().name && <li>피규어 이름 (한글)</li>}
                  {!form.getValues().manufacturer_id && <li>제조사</li>}
                  {!form.getValues().series_id && <li>작품</li>}
                  {!form.getValues().character_id && <li>캐릭터</li>}
                  {!form.getValues().category_id && <li>카테고리</li>}
                  {!form.getValues().release_text && <li>출시일</li>}
                  {images.filter((img) => img.url !== "").length === 0 && (
                    <li>이미지 (최소 1개)</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}
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
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // 임시 저장
                // localStorage.setItem(
                //   "figureDraftData",
                //   JSON.stringify({
                //     formData: form.getValues(),
                //     images,
                //     thumbnailIndex,
                //     timestamp: new Date().toISOString(),
                //   })
                // );
                // setLastSaved(new Date());
                toast.info("임시 저장 완료", {
                  description: "작성 중인 내용이 임시 저장되었습니다.",
                });
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              임시 저장
            </Button>
            <Button
              disabled={
                isFormValid ||
                isLoading ||
                images.filter((img) => img.url).length === 0
              }
              className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all"
              onClick={() => {
                const data = new FormData();

                for (const key in formData) {
                  const value = formData[key as keyof typeof formData];

                  // 배열이면 각 항목별로 append
                  if (Array.isArray(value)) {
                    data.append(key, JSON.stringify(value));
                  } else if (value !== undefined && value !== null) {
                    data.append(key, String(value));
                  }
                }

                fetcher.submit(data, {
                  method: "post",
                  encType: "multipart/form-data",
                });
              }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  등록 중...
                </>
              ) : (
                "등록"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
