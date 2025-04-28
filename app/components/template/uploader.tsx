"use client";

import { useOutletContext } from "@remix-run/react";
import { cloneElement, useRef } from "react";
import { TOutletContext } from "~/root";
import { BucketName } from "~/supabase";
import { cn, fileToBase64, shortId } from "~/utils";

interface UploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bucket: BucketName;
  children: React.ReactElement;
  onFileChange: (value: { name: string; url: string }) => void;
  accept?: string;
  options?: {
    base64?: boolean;
  };
}

/**
 * 파일 업로드를 위한 컴포넌트입니다. 원하는 컴포넌트를 이로 감싸주면 됩니다.
 * @param bucket 업로드할 파일이 저장될 버킷 이름
 * @param children 업로드 버튼으로 사용할 컴포넌트
 * @param onFileChange 파일이 업로드되었을 때 호출되는 콜백 함수
 * @param accept 업로드 가능한 파일의 확장자를 지정합니다. 기본값은 모든 파일입니다.
 * @param options 업로드 옵션
 * @param options.base64 파일을 base64로 변환하여 콜백 함수에 전달합니다. 기본값은 false입니다.
 * @example
 * ```tsx
 * <Uploader onFileChange={(v) => setImage(v)}>
 *   <Button>hello?</Button>
 * </Uploader>
 * ```
 */
export function Uploader({
  bucket,
  accept,
  children,
  onFileChange,
  options,
  className,
  ...props
}: UploaderProps) {
  const { supabase } = useOutletContext<TOutletContext>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clone = cloneElement(children, {
    onClick: () => {
      fileInputRef.current?.click();
    },
  });

  return (
    <div className={cn("inline-block cursor-pointer", className)} {...props}>
      {clone}
      <input
        id={props.id}
        ref={fileInputRef}
        type="file"
        hidden
        accept={accept || "*"}
        onClick={(e) => {
          e.currentTarget.value = "";
        }}
        onChange={async (e) => {
          if (!e.target.files) return;
          const file = e.target.files[0];
          if (!file) return;
          if (options?.base64) {
            fileToBase64(file, (result) => {
              onFileChange({
                name: file.name,
                url: result?.toString() || "",
              });
            });
          } else {
            const filePath = `${Date.now()}_${shortId()}.${
              file.type.split("/")[1]
            }`;
            const fileUrl = await supabase.uploadFile(bucket, filePath, file);
            onFileChange({
              name: file.name,
              url: fileUrl || "",
            });
          }
        }}
      />
    </div>
  );
}
Uploader.displayName = "Uploader";
