import { useEffect, useState } from "react";

/**
 * WebView 환경인지 여부를 반환합니다.
 * window.ReactNativeWebView를 직접 체크하여 더 빠르고 정확하게 감지합니다.
 * @returns WebView 환경이면 true, 아니면 false
 */
export function useIsWebView() {
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsWebView(false);
      return;
    }

    // window.__IS_WEBVIEW__가 설정되어 있으면 사용, 없으면 직접 체크
    const checkWebView = () => {
      if (window.__IS_WEBVIEW__ !== undefined) {
        return window.__IS_WEBVIEW__ === true;
      }
      // 직접 ReactNativeWebView를 체크 (스크립트가 실행되기 전에도 동작)
      return typeof window.ReactNativeWebView !== "undefined";
    };

    setIsWebView(checkWebView());
  }, []);

  return {
    isWebView,
  };
}
