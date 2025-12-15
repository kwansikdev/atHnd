export type UploadProgress = Record<
  string,
  "pending" | "uploading" | "done" | "failed"
>;

export interface BatchUploadResult {
  key: string;
  url?: string;
  success: boolean;
  error?: string;
}

export interface BatchUploadResponse {
  success: boolean;
  uploads: BatchUploadResult[];
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

/**
 * 여러 파일을 한 번에 업로드 (진행률 포함)
 */
export async function uploadBatch(
  files: Array<{ key: string; file: File }>,
  bucket: string,
  onProgress?: (key: string, status: UploadProgress[string]) => void
): Promise<BatchUploadResponse> {
  // FormData 준비
  const formData = new FormData();
  formData.append("bucket", bucket);

  files.forEach(({ key, file }) => {
    formData.append(key, file);
    onProgress?.(key, "pending");
  });

  // 업로드 시작
  files.forEach(({ key }) => onProgress?.(key, "uploading"));

  try {
    const response = await fetch("/api/upload-batch", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: BatchUploadResponse = await response.json();

    // 진행률 업데이트
    result.uploads.forEach(({ key, success }) => {
      onProgress?.(key, success ? "done" : "failed");
    });

    return result;
  } catch (error) {
    // 전체 실패 시 모두 failed로 표시
    files.forEach(({ key }) => onProgress?.(key, "failed"));
    throw error;
  }
}
