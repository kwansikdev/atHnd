export function getRedirectToFromRequest(request: Request): string {
  const url = new URL(request.url);
  return url.pathname + url.search;
}
