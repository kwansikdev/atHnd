"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export type ActionStatus = "idle" | "loading" | "success" | "error";

export type ActionState<T = unknown> = {
  status: ActionStatus;
  data?: T;
  error?: Error | string;
};

export type ActionOptions<T = unknown> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error | string) => void;
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
};

export function useActionState<TData = unknown, TParams = unknown>(
  actionFn: (params: TParams) => Promise<TData>,
  options: ActionOptions<TData> = {}
) {
  const [state, setState] = useState<ActionState<TData>>({
    status: "idle",
  });

  const execute = useCallback(
    async (params: TParams) => {
      setState({ status: "loading" });
      try {
        const data = await actionFn(params);
        setState({ status: "success", data });

        if (options.showToast !== false && options.successMessage) {
          toast.success(options.successMessage);
        }

        options.onSuccess?.(data);
        return { success: true, data };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setState({ status: "error", error: errorMessage });

        if (options.showToast !== false) {
          toast.error(options.errorMessage || errorMessage);
        }

        options.onError?.(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [actionFn, options]
  );

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return {
    execute,
    reset,
    ...state,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
  };
}
