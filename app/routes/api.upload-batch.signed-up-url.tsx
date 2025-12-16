import { ActionFunctionArgs } from "@remix-run/node";
import { BucketName } from "supabase";
import { getSupabaseServerClient } from "supabase/supabase-service";
import { shortId } from "~/utils";

// 청크 크기 설정 (Supabase rate limit 고려)
const CHUNK_SIZE = 8; // 안전하게 8개씩 처리

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { bucket, files } = await request.json();

    if (!bucket) {
      return Response.json({ error: "Bucket is required" }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return Response.json({ error: "No files provided" }, { status: 400 });
    }

    const { supabase } = await getSupabaseServerClient(request);

    // ✅ 청크 단위로 나누기
    const chunks: Array<typeof files> = [];
    for (let i = 0; i < files.length; i += CHUNK_SIZE) {
      chunks.push(files.slice(i, i + CHUNK_SIZE));
    }

    const allSignedUrls: Array<{
      key: string;
      url?: string;
      success: boolean;
      error?: string;
    }> = [];

    // ✅ 청크별로 순차 처리 (각 청크 내부는 병렬)
    for (const chunk of chunks) {
      const signedUrlPromises = chunk.map(
        async (fileInfo: {
          key: string;
          fileName: string;
          contentType: string;
        }) => {
          try {
            const extension = fileInfo.contentType.split("/")[1] || "jpg";
            const filePath = `${Date.now()}_${shortId()}.${extension}`;

            const { data, error } = await supabase.storage
              .from(bucket as BucketName)
              .createSignedUploadUrl(filePath);

            if (error) throw error;

            return {
              key: fileInfo.key,
              signedUrl: data.signedUrl,
              path: data.path,
              token: data.token,
              success: true,
            };
          } catch (error) {
            console.error(
              `Failed to create signed URL for ${fileInfo.key}:`,
              error
            );
            return {
              key: fileInfo.key,
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create signed URL",
            };
          }
        }
      );

      const chunkResults = await Promise.allSettled(signedUrlPromises);

      const chunkSignedUrls = chunkResults.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        }
        return {
          key: chunk[index].key,
          success: false,
          error: "Failed to create signed URL",
        };
      });

      allSignedUrls.push(...chunkSignedUrls);

      // ✅ 다음 청크 처리 전 짧은 대기 (rate limit 방지)
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    const successCount = allSignedUrls.filter((u) => u.success).length;
    const failedCount = allSignedUrls.length - successCount;

    return Response.json({
      success: failedCount === 0,
      signedUrls: allSignedUrls,
      summary: {
        total: allSignedUrls.length,
        succeeded: successCount,
        failed: failedCount,
      },
    });
  } catch (error) {
    console.error("Signed URL generation error:", error);
    return Response.json(
      {
        error: "Failed to generate upload URLs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
