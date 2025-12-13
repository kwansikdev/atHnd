import { uploadBatch, UploadProgress } from "~/utils/upload-batch";

/**
 * Figure 구조의 이미지들을 일괄 업로드
 */
export async function uploadFigureImages<
  TFigure extends { images: TImage[] },
  TImage extends { file?: File; url?: string }
>(
  figures: TFigure[],
  bucket: string,
  setUploadProgress: React.Dispatch<React.SetStateAction<UploadProgress>>
): Promise<TFigure[]> {
  // 1. 업로드할 파일 수집
  const filesToUpload: Array<{
    key: string;
    file: File;
    figureIndex: number;
    imageIndex: number;
  }> = [];

  figures.forEach((figure, figureIndex) => {
    figure.images.forEach((image, imageIndex) => {
      if (image.file) {
        const key = `file-${figureIndex}-${imageIndex}`;
        filesToUpload.push({ key, file: image.file, figureIndex, imageIndex });
      }
    });
  });

  if (filesToUpload.length === 0) {
    return figures; // 업로드할 파일이 없음
  }

  // 2. 일괄 업로드
  const result = await uploadBatch(
    filesToUpload.map(({ key, file }) => ({ key, file })),
    bucket,
    (key, status) => {
      setUploadProgress((prev) => ({ ...prev, [key]: status }));
    }
  );

  // 3. 결과를 원본 구조에 매핑
  const uploadMap = new Map(
    result.uploads.filter((u) => u.success && u.url).map((u) => [u.key, u.url!])
  );

  const updatedFigures = figures.map((figure, figureIndex) => ({
    ...figure,
    images: figure.images.map((image, imageIndex) => {
      const key = `file-${figureIndex}-${imageIndex}`;
      const url = uploadMap.get(key);

      if (url) {
        return { ...image, url, file: undefined };
      }
      return image;
    }),
  }));

  return updatedFigures;
}
