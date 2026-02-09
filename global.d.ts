export {};

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    __SUPABASE_SESSION__?: {
      access_token: string;
      refresh_token: string;
    };
    __IS_WEBVIEW__?: boolean;
  }
}
