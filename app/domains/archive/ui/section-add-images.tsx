import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  Upload,
  ChevronUp,
  ChevronDown,
  X,
  Camera,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useState } from "react";
import { Uploader } from "~/components/template/uploader";
import { useFormContext, useWatch } from "react-hook-form";
import { FigureAddFormValues } from "./archive-figure-form";

export default function SectionAddImages({
  goToPrevStep,
  goToNextStep,
}: {
  goToPrevStep: () => void;
  goToNextStep: () => void;
}) {
  const form = useFormContext<FigureAddFormValues>();

  const images = useWatch({
    control: form.control,
    name: "images",
  });
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);

  // 이미지 URL 제거
  const removeImageField = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    if (newImages.length === 0) {
      form.setValue("images", [{ name: "", url: "" }]);
    } else {
      form.setValue("images", newImages);
    }
  };

  // 이미지 URL 변경
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], url: value };
    form.setValue("images", newImages);
  };

  const handleFileChange = (
    value: {
      name: string;
      url: string;
    }[]
  ) => {
    const prevImages = form.getValues("images");
    form.setValue("images", [...prevImages, ...value]);
  };

  // 이미지 순서 변경
  const moveImage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1) ||
      images.length <= 1
    ) {
      return; // 첫 번째 이미지는 위로 이동 불가, 마지막 이미지는 아래로 이동 불가
    }

    const newImages = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    // 이미지 위치 교환
    [newImages[index], newImages[newIndex]] = [
      newImages[newIndex],
      newImages[index],
    ];

    // 썸네일 인덱스 조정
    if (thumbnailIndex === index) {
      setThumbnailIndex(newIndex);
    } else if (thumbnailIndex === newIndex) {
      setThumbnailIndex(index);
    }

    form.setValue(
      "images",
      newImages.map((img, idx) => ({ ...img, sort_order: idx }))
    );
  };

  return (
    <motion.div
      key="images"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="mr-2 h-5 w-5 text-primary" />
            이미지 업로드
          </CardTitle>
          <CardDescription>
            피규어의 이미지를 업로드해주세요. 최소 한 개 이상의 이미지가
            필요합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Uploader
            bucket="figures"
            accept="image/*"
            isMultiple
            onFileChange={handleFileChange}
            options={{
              enableDropzone: true,
            }}
            name="images"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <Upload className="h-10 w-10 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                이미지 파일을 드래그하여 업로드하세요
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                또는 아래 버튼을 클릭하여 파일을 선택하세요
              </p>
              <Button
                type="button"
                variant="outline"
                className="group cursor-pointer"
              >
                <Upload className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                이미지 선택
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                지원 형식: JPG, PNG, GIF (최대 10MB)
              </p>
            </div>
          </Uploader>

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {images.map(
                (image, index) =>
                  image.url && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`relative border rounded-md overflow-hidden group hover:shadow-md transition-all ${
                        thumbnailIndex === index
                          ? "ring-2 ring-primary shadow-lg"
                          : "hover:ring-1 hover:ring-primary/50"
                      }`}
                    >
                      <div className="absolute top-2 right-2 z-10 bg-black/60 rounded-md px-2 py-1">
                        {thumbnailIndex === index ? (
                          <span className="text-xs text-white flex items-center">
                            <Badge
                              variant="default"
                              className="bg-primary text-primary-foreground"
                            >
                              썸네일
                            </Badge>
                          </span>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-white hover:text-primary hover:bg-white/10"
                            onClick={() => setThumbnailIndex(index)}
                          >
                            썸네일로 설정
                          </Button>
                        )}
                      </div>
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 bg-black/60 text-white hover:text-primary hover:bg-white/10"
                          onClick={() => moveImage(index, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 bg-black/60 text-white hover:text-primary hover:bg-white/10"
                          onClick={() => moveImage(index, "down")}
                          disabled={
                            index === images.filter((img) => img.url).length - 1
                          }
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name || `이미지 ${index + 1}`}
                          // alt={image.file?.name || `이미지 ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => removeImageField(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-2 bg-muted/50 text-xs truncate flex justify-between items-center">
                        <span className="flex-1 truncate">
                          {image.name || "외부 이미지 URL"}
                        </span>
                        <Badge variant="outline" className="ml-2">
                          #{index + 1}
                        </Badge>
                      </div>
                      {!image.url && (
                        <div className="p-2">
                          <Input
                            placeholder="이미지 URL 입력"
                            value={image.url}
                            onChange={(e) =>
                              handleImageChange(index, e.target.value)
                            }
                            // size="sm"
                            className="text-xs transition-all focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      )}
                    </motion.div>
                  )
              )}

              {images.filter((img) => img.url).length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-muted-foreground"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mb-2 text-center">업로드된 이미지가 없습니다</p>
                  {/* <p className="text-sm text-muted-foreground mb-4 text-center">
                    JPG, PNG 또는 GIF 파일을 업로드하거나 이미지 URL을
                    입력하세요
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 group"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    이미지 추가하기
                  </Button> */}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
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
          <Button
            type="button"
            onClick={goToNextStep}
            className="group"
            disabled={images.filter((img) => img.url).length === 0}
          >
            다음 단계
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
