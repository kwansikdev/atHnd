import { SupabaseClient } from "@supabase/supabase-js";
import { BucketName } from "./type";
import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { Database } from "./schema";

export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private readonly SUPABASE_URL: string;

  constructor(url: string, key: string) {
    this.supabase = createBrowserClient<Database>(url, key);
    this.SUPABASE_URL = url;
  }

  get client() {
    return this.supabase;
  }

  get url() {
    return this.SUPABASE_URL;
  }

  /**
   * 브라우저에서 로그아웃합니다. 클라이언트 컴포넌트에서 사용하세요.
   */
  async signOut() {
    await this.supabase.auth.signOut();
  }

  /**
   *
   * @param bucket 업로드할 파일의 경로를 입력합니다. (ex. "files", "images", "posts")
   * @param filePath bucket 내부 파일의 경로를 입력합니다.(= 파일명)
   * @param file 업로드할 파일
   * @returns 업로드된 파일의 URL을 반환합니다.
   */
  async uploadFile(bucket: BucketName, filePath: string, file: File) {
    const origin = `${this.SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
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

export async function getSupabaseServerClient(request: Request) {
  const response = new Response();
  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "") as {
            name: string;
            value: string;
          }[];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            );
          });
        },
      },
    }
  );

  async function uploadFile(bucket: BucketName, filePath: string, file: File) {
    const origin = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
    const { data } = await supabase.storage
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

  async function uploadSignedUploadUrl(bucket: BucketName, filePath: string) {
    const origin = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);
    if (data) {
      return origin + data.path;
    } else {
      return null;
    }
  }

  return {
    supabase,
    headers: response.headers,
    uploadFile,
    uploadSignedUploadUrl,
  };
}

/**
 * 브라우저 클라이언트로 로그아웃합니다.
 * header 등 클라이언트 컴포넌트에서 env만 있으면 signOut만 쓰고 싶을 때 사용하세요.
 */
export async function signOutWithSupabase(url: string, anonKey: string) {
  const client = createBrowserClient<Database>(url, anonKey);
  await client.auth.signOut();
}
