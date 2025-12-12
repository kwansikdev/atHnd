import { ActionFunctionArgs } from "@remix-run/node";
import { BucketName } from "supabase";
import { getSupabaseServerClient } from "supabase/supabase-service";
import { shortId } from "~/utils";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    const bucket = formData.get("bucket") as BucketName;
    // const file = formData.get("file") as File;

    if (!bucket) {
      return Response.json({ error: "Bucket is required" }, { status: 400 });
    }

    // 모든 파일 추출
    const files: { key: string; file: File }[] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key.startsWith("file-")) {
        files.push({ key, file: value });
      }
    }

    if (files.length === 0) {
      return Response.json({ error: "No files provided" }, { status: 400 });
    }

    const { uploadFile } = await getSupabaseServerClient(request);

    // ✅ 병렬 업로드 (서버에서 제어)
    const uploadPromises = files.map(async ({ key, file }) => {
      try {
        const filePath = `${Date.now()}_${shortId()}.${
          file.type.split("/")[1]
        }`;
        const url = await uploadFile(bucket, filePath, file);
        return { key, url, success: true };
      } catch (error) {
        console.error(`Upload failed for ${key}:`, error);
        return {
          key,
          success: false,
          error: error instanceof Error ? error.message : "Upload failed",
        };
      }
    });

    // [url, url, url]
    const results = await Promise.allSettled(uploadPromises);

    // 결과 정리
    const uploads = results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      return {
        key: files[index].key,
        success: false,
        error: "Upload failed",
      };
    });

    const successCount = uploads.filter((u) => u.success).length;
    const failedCount = uploads.length - successCount;

    return Response.json({
      success: failedCount === 0,
      uploads,
      summary: {
        total: uploads.length,
        succeeded: successCount,
        failed: failedCount,
      },
    });
  } catch (error) {
    console.error("Batch upload error:", error);
    return Response.json(
      {
        error: "Batch upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
