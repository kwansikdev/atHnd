import { useFetcher, useNavigate } from "@remix-run/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
  isSubmitting: boolean;
  isSuccess: boolean;
  isError?: boolean;
  error?: string;
  data?: T;
};

// 🔸 Context 생성
const FetcherActionContext = createContext<FetcherActionState<unknown> | null>(
  null
);

// 🔹 Provider 훅
export function FetcherActionProvider<T = unknown>({
  children,
  options = {},
}: {
  children: ReactNode;
  options?: FetcherActionOptions;
}) {
  const fetcher = useFetcher<ActionResult<T>>();
  const navigate = useNavigate();
  const toastShownRef = useRef(false);

  const result = fetcher.data;
  const isIdle = fetcher.state === "idle";
  const isLoading = fetcher.state !== "idle";
  const isSuccess = result?.success === true;
  const isSubmitting = fetcher.state === "submitting";
  const isError = !!result?.error;
  const error = result?.error;
  const data = result;

  // 리디렉션
  useEffect(() => {
    if (result?.redirectTo) {
      navigate(result.redirectTo);
    }
  }, [result?.redirectTo, navigate]);

  // 토스트
  useEffect(() => {
    if (options.showToast === false) return;
    if (fetcher.state === "idle" && !toastShownRef.current) {
      // 👈 수정
      if (isSuccess && options.successMessage) {
        toast.success(options.successMessage);
        toastShownRef.current = true; // 👈 표시했음을 기록
      }
      if (isError && (options.errorMessage || error)) {
        toast.error(options.errorMessage ?? error);
        toastShownRef.current = true; // 👈 표시했음을 기록
      }
    }

    // submitting 시작하면 리셋
    if (fetcher.state === "submitting") {
      toastShownRef.current = false;
    }
  }, [fetcher.state, isSuccess, isError, error, options]);

  const value = useMemo(
    () => ({
      Form: fetcher.Form,
      fetcher,
      isIdle,
      isLoading,
      isSubmitting,
      isSuccess,
      isError,
      error,
      data,
    }),
    [fetcher, isIdle, isLoading, isSubmitting, isSuccess, isError, error, data]
  );

  return (
    <FetcherActionContext.Provider value={value}>
      {children}
    </FetcherActionContext.Provider>
  );
}

// 🔹 하위에서 접근할 수 있는 훅
export function useFetcherActionContext<T = unknown>() {
  const ctx = useContext(FetcherActionContext);
  if (!ctx) {
    throw new Error(
      "useFetcherActionContext must be used within a <FetcherActionProvider>"
    );
  }
  return ctx as FetcherActionState<T>;
}

export function useFetcherActionState<T = unknown>(
  options: FetcherActionOptions = {}
): FetcherActionState<T> {
  const fetcher = useFetcher<T>();
  const navigate = useNavigate();
  const toastShownRef = useRef(false); // ✅ 추가
  const prevStateRef = useRef(fetcher.state); // ✅ 이전 상태 추적
  // ✅ 안전한 타입 단언
  const result = fetcher.data as ActionResult<T> | undefined;

  const isIdle = fetcher.state === "idle";
  const isLoading = fetcher.state !== "idle";
  const isSubmitting = fetcher.state === "submitting";
  const isSuccess = fetcher.state === "idle" && !!fetcher.data;
  const isError = !!result?.error;
  const error = result?.error;
  const data = result;

  // ✅ 자동 리디렉션
  useEffect(() => {
    if (result?.redirectTo) {
      navigate(result.redirectTo);
    }
  }, [result?.redirectTo, navigate]);

  // 토스트 처리 (수정됨)
  useEffect(() => {
    if (options.showToast === false) return;

    // submitting 시작하면 리셋
    if (fetcher.state === "submitting") {
      toastShownRef.current = false;
      prevStateRef.current = fetcher.state;
      return;
    }

    // submitting -> idle 전환 시에만 토스트 표시
    const justFinished =
      prevStateRef.current === "submitting" && fetcher.state === "idle";

    if (justFinished && !toastShownRef.current) {
      if (isSuccess && options.successMessage) {
        toast.success(options.successMessage);
        toastShownRef.current = true;
      } else if (isError && (options.errorMessage || error)) {
        toast.error(options.errorMessage ?? error);
        toastShownRef.current = true;
      }
    }

    prevStateRef.current = fetcher.state;
  }, [
    fetcher.state,
    isSuccess,
    isError,
    error,
    options.successMessage,
    options.errorMessage,
    options.showToast,
  ]);

  return {
    Form: fetcher.Form,
    fetcher,
    isIdle,
    isLoading,
    isSubmitting,
    isSuccess,
    isError,
    error,
    data: data as T | undefined,
  };
}
