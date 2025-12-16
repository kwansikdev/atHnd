export interface BatchUploadResponse {
  success: boolean;
  uploads: Array<{
    key: string;
    url?: string;
    success: boolean;
    error?: string;
  }>;
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

export type UploadProgress = Record<
  string,
  "pending" | "uploading" | "done" | "failed"
>;

// 클라이언트 업로드 청크 크기
const UPLOAD_CHUNK_SIZE = 5; // 동시에 5개씩 업로드

export async function uploadBatch(
  files: Array<{ key: string; file: File }>,
  supabaseUrl: string,
  bucket: string,
  onProgress?: (key: string, status: UploadProgress[string]) => void
): Promise<BatchUploadResponse> {
  files.forEach(({ key }) => onProgress?.(key, "pending"));

  try {
    // ========================================
    // 1단계: 서버에서 Signed URL 받기
    // ========================================
    const fileInfos = files.map(({ key, file }) => ({
      key,
      fileName: file.name,
      contentType: file.type,
    }));

    const signedUrlResponse = await fetch("/api/upload-batch/signed-up-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, files: fileInfos }),
    });

    if (!signedUrlResponse.ok) {
      throw new Error(
        `HTTP ${signedUrlResponse.status}: ${signedUrlResponse.statusText}`
      );
    }

    const { signedUrls } = await signedUrlResponse.json();

    if (!signedUrls || signedUrls.length === 0) {
      throw new Error("No signed URLs received");
    }

    // ========================================
    // 2단계: 브라우저에서 Supabase로 청크 단위 업로드
    // ========================================
    const uploadFile = async (urlInfo: any, index: number) => {
      const { key } = files[index];

      if (!urlInfo.success) {
        onProgress?.(key, "failed");
        return {
          key,
          success: false,
          error: urlInfo.error || "Failed to get signed URL",
        };
      }

      try {
        onProgress?.(key, "uploading");

        const file = files[index].file;

        const uploadResponse = await fetch(urlInfo.signedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${urlInfo.path}`;

        onProgress?.(key, "done");

        return {
          key,
          url: publicUrl,
          success: true,
        };
      } catch (error) {
        console.error(`Upload failed for ${key}:`, error);
        onProgress?.(key, "failed");

        return {
          key,
          success: false,
          error: error instanceof Error ? error.message : "Upload failed",
        };
      }
    };

    // ✅ 청크 단위로 순차 업로드 (각 청크 내부는 병렬)
    const allResults: any[] = [];

    for (let i = 0; i < signedUrls.length; i += UPLOAD_CHUNK_SIZE) {
      const chunk = signedUrls.slice(i, i + UPLOAD_CHUNK_SIZE);
      const chunkPromises = chunk.map(
        (
          urlInfo: {
            key: string;
            path: string;
            signedUrl: string;
            success: boolean;
            token: string;
            error?: string;
          },
          chunkIndex: number
        ) => uploadFile(urlInfo, i + chunkIndex)
      );

      const chunkResults = await Promise.all(chunkPromises);
      console.log("🚀 ~ uploadBatch ~ chunkResults:", chunkResults);
      allResults.push(...chunkResults);

      // 다음 청크 전 짧은 대기 (브라우저 부하 방지)
      if (i + UPLOAD_CHUNK_SIZE < signedUrls.length) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    const successCount = allResults.filter((r) => r.success).length;
    const failedCount = allResults.length - successCount;

    return {
      success: failedCount === 0,
      uploads: allResults,
      summary: {
        total: allResults.length,
        succeeded: successCount,
        failed: failedCount,
      },
    };
  } catch (error) {
    files.forEach(({ key }) => onProgress?.(key, "failed"));
    throw error;
  }
}
