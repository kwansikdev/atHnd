// app/utils/device.ts

export interface DeviceInfo {
  isMobile: boolean;
  isWebView: boolean;
  platform: "ios" | "android" | "desktop" | null;
  webViewType: "wkwebview" | "uiwebview" | "android-webview" | null;
}

export function detectDevice(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();
  console.log("🚀 ~ detectDevice ~ userAgent:", userAgent);

  // iOS 웹뷰 감지
  const isIOSWebView =
    // WKWebView는 보통 앱 이름이 포함됨
    /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(userAgent) ||
    // 또는 명시적으로 앱 내 표시
    /; wv\)/.test(userAgent);

  // Android 웹뷰 감지
  const isAndroidWebView =
    /; wv\)/.test(userAgent) || // Android WebView 표준 패턴
    /android.*version\/[\d.]+.*chrome\/[\d.]+ mobile/i.test(userAgent);

  // iOS Safari vs 웹뷰 구분
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);

  const isWebView = isIOSWebView || isAndroidWebView;
  const isMobile = isIOS || isAndroid;

  let platform: DeviceInfo["platform"] = null;
  let webViewType: DeviceInfo["webViewType"] = null;

  if (isIOS) {
    platform = "ios";
    if (isIOSWebView) {
      webViewType = /applewebkit\/[\d.]+/.test(ua) ? "wkwebview" : "uiwebview";
    }
  } else if (isAndroid) {
    platform = "android";
    if (isAndroidWebView) {
      webViewType = "android-webview";
    }
  } else {
    platform = "desktop";
  }

  return {
    isMobile,
    isWebView,
    platform,
    webViewType,
  };
}
