"use client";

import { useOutletContext } from "@remix-run/react";
import { cloneElement, useCallback } from "react";
import { TOutletContext } from "~/root";
import { BucketName } from "supabase";
import { cn, fileToBase64, shortId } from "~/utils";
import { Accept, useDropzone } from "react-dropzone";

interface UploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bucket: BucketName;
  children: React.ReactElement;
  onFileChange: (value: { name: string; url: string }[]) => void;
  accept?: string;
  isMultiple?: boolean;
  name?: string;
  options?: {
    base64?: boolean;
    enableDropzone?: boolean;
    onUploadingChange?: (isUploading: boolean) => void;
    onUploadSuccess?: (files: { name: string; url: string }[]) => void;
    onUploadFail?: (files: File[]) => void;
  };
}

/**
 * 파일 업로드를 위한 컴포넌트입니다. 원하는 컴포넌트를 이로 감싸주면 됩니다.
 * @param bucket 업로드할 파일이 저장될 버킷 이름
 * @param children 업로드 버튼으로 사용할 컴포넌트
 * @param onFileChange 파일이 업로드되었을 때 호출되는 콜백 함수 (배열 전달)
 * @param accept 업로드 가능한 파일의 확장자를 지정합니다. 기본값은 모든 파일입니다.
 * @param isMulti 파일을 여러개 업로드할 수 있는지 여부
 * @param options 업로드 옵션
 * @param options.base64 파일을 base64로 변환하여 콜백 함수에 전달합니다. 기본값은 false입니다.
 * @param options.onUploadingChange 업로드 중일 때 호출되는 콜백 함수
 * @param options.onUploadSuccess 업로드 성공했을 때 호출되는 콜백 함수
 * @param options.onUploadFail 업로드 실패했을 때 호출되는 콜백 함수
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
  isMultiple = false,
  className,
  name,
  ...props
}: UploaderProps) {
  const { supabase } = useOutletContext<TOutletContext>();

  const handleFiles = useCallback(
    async (fileArray: File[]) => {
      if (!fileArray.length) return;

      options?.onUploadingChange?.(true);

      const uploaded: { name: string; url: string }[] = [];
      const failed: File[] = [];

      await Promise.all(
        fileArray.map(async (file) => {
          try {
            if (options?.base64) {
              const result = await new Promise<{ name: string; url: string }>(
                (resolve) => {
                  fileToBase64(file, (result) => {
                    resolve({
                      name: file.name,
                      url: result?.toString() || "",
                    });
                  });
                }
              );
              uploaded.push(result);
            } else {
              const filePath = `${Date.now()}_${shortId()}.${
                file.type.split("/")[1]
              }`;
              const fileUrl = await supabase.uploadFile(bucket, filePath, file);
              if (fileUrl) {
                uploaded.push({ name: file.name, url: fileUrl });
              } else {
                failed.push(file);
              }
            }
          } catch (err) {
            failed.push(file);
          }
        })
      );

      if (uploaded.length > 0) {
        onFileChange(uploaded);
        options?.onUploadSuccess?.(uploaded);
      }

      if (failed.length > 0) {
        options?.onUploadFail?.(failed);
      }

      options?.onUploadingChange?.(false);
    },
    [bucket, onFileChange, options, supabase]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(Array.from(e.target.files));
      }
    },
    [handleFiles]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleFiles(acceptedFiles);
    },
    [handleFiles]
  );

  const dropzoneAccept: Accept | undefined = accept
    ? { [accept]: [] }
    : undefined;

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop,
    accept: dropzoneAccept,
    multiple: isMultiple,
    disabled: !options?.enableDropzone,
  });

  const clone = cloneElement(children, {
    onClick: () => {
      if (!options?.enableDropzone) {
        inputRef.current?.click();
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "inline-block cursor-pointer w-full",
        options?.enableDropzone ? "" : "",
        isDragActive ? "" : "",
        className
      )}
      {...props}
    >
      <div
        // ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-8 transition-all ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        {clone}
        <input
          {...getInputProps({
            id: props.id,
            accept: accept || "*",
            multiple: isMultiple,
            hidden: true,
          })}
          name={name}
          onClick={(e) => {
            e.currentTarget.value = "";
          }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
Uploader.displayName = "Uploader";
