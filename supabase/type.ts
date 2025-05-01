export type FileBody =
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | Buffer
  | File
  | FormData
  | NodeJS.ReadableStream
  | ReadableStream<Uint8Array>
  | URLSearchParams
  | string;

/**
 * static하게 들어가는 bucket의 이름을 직접 지정하여 사용할 수 있는 타입
 * @example
 * export type BucketName = "images" | "videos" | "audios";
 */
export type BucketName = "profiles" | "figures";
