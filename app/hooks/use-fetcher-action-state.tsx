import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

export type FetcherActionOptions = {
  showToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
};

// ✅ 서버에서 반환하는 표준 결과 타입
export type ActionResult<T = unknown> = {
  success?: boolean;
  error?: string;
  redirectTo?: string;
  data?: T;
};

export type FetcherActionState<T = unknown> = {
  Form: ReturnType<typeof useFetcher>["Form"];
  fetcher: ReturnType<typeof useFetcher>;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: string;
  data?: T;
};

export function useFetcherActionState<T = unknown>(
  options: FetcherActionOptions = {}
): FetcherActionState<T> {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  // ✅ 안전한 타입 단언
  const result = fetcher.data as ActionResult<T> | undefined;

  const isIdle = fetcher.state === "idle";
  const isLoading = fetcher.state !== "idle";
  const isSuccess = result?.success === true;
  const isError = !!result?.error;
  const error = result?.error;
  const data = result?.data;

  // ✅ 자동 리디렉션
  useEffect(() => {
    if (result?.redirectTo) {
      navigate(result.redirectTo);
    }
  }, [result?.redirectTo, navigate]);

  // ✅ 토스트 처리
  useEffect(() => {
    if (options.showToast === false) return;
    if (fetcher.state === "idle") {
      if (isSuccess && options.successMessage) {
        toast.success(options.successMessage);
      }
      if (isError && (options.errorMessage || error)) {
        toast.error(options.errorMessage ?? error);
      }
    }
  }, [fetcher.state, isSuccess, isError, error, options]);

  return useMemo(
    () => ({
      Form: fetcher.Form,
      fetcher,
      isIdle,
      isLoading,
      isSuccess,
      isError,
      error,
      data,
    }),
    [fetcher, isIdle, isLoading, isSuccess, isError, error, data]
  );
}
