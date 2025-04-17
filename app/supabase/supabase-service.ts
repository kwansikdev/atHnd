import { createClient } from "@supabase/supabase-js";
import { BucketName } from "./type";

class SupabaseService {
  private readonly supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  get client() {
    return this.supabase;
  }

  /**
   *
   * @param bucket 업로드할 파일의 경로를 입력합니다. (ex. "files", "images", "posts")
   * @param filePath bucket 내부 파일의 경로를 입력합니다.(= 파일명)
   * @param file 업로드할 파일
   * @returns 업로드된 파일의 URL을 반환합니다.
   */
  async uploadFile(bucket: BucketName, filePath: string, file: File) {
    const origin = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
    const { data } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: true,
      });
    if (data) {
      return origin + data.path;
    } else {
      return null;
    }
  }
}
export const supabaseService = new SupabaseService();
