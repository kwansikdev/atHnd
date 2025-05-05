import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Uploader } from "~/components/template/uploader";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// 이미지
export function AreaImages() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<
    Array<{ name: string; url: string; sort_order?: number }>
  >([]);
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);

  // 이미지 URL 추가
  const addImageField = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 URL 제거
  const removeImageField = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    if (newImages.length === 0) {
      setImages([{ name: "", url: "" }]);
    } else {
      setImages(newImages);
    }
  };

  // 이미지 URL 변경
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], url: value };
    setImages(newImages);
  };

  const handleFileChange = (
    value: {
      name: string;
      url: string;
    }[]
  ) => {
    setImages(value);
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

    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">이미지</h3>
        <Uploader
          bucket="figures"
          accept="image/*"
          isMultiple
          onFileChange={handleFileChange}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addImageField}
          >
            <Plus className="mr-2 h-4 w-4" />
            이미지 추가
          </Button>
        </Uploader>
        {images.map((image, index) => (
          <input
            key={index}
            type="text"
            name={"images"}
            value={image.url}
            className="hidden"
            readOnly
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map(
          (image, index) =>
            image.url && (
              <div
                key={index}
                className={`relative border rounded-md overflow-hidden group ${
                  thumbnailIndex === index ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="absolute top-2 right-2 z-10 bg-black/60 rounded-md px-2 py-1">
                  {thumbnailIndex === index ? (
                    <span className="text-xs text-white">썸네일</span>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-white hover:text-primary"
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
                    className="h-6 w-6 bg-black/60 text-white hover:text-primary"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-black/60 text-white hover:text-primary"
                    onClick={() => moveImage(index, "down")}
                    disabled={
                      index === images.filter((img) => img.url).length - 1
                    }
                  >
                    ↓
                  </Button>
                </div>
                <div className="aspect-square relative">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.name || `이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
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
                  <span className="text-muted-foreground">#{index + 1}</span>
                </div>
                {!image.name && (
                  <div className="p-2">
                    <Input
                      placeholder="이미지 URL 입력"
                      value={image.url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="text-xs"
                    />
                  </div>
                )}
              </div>
            )
        )}

        {images.filter((img) => img.url).length === 0 && (
          <div className="col-span-full border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-muted-foreground">
            <p>업로드된 이미지가 없습니다</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={addImageField}
            >
              이미지 추가하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
