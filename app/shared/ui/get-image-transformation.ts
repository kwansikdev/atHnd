export function getImageTransformation(
  url: string,
  options?: {
    width?: number;
    height?: number;
    resize?: "cover" | "contain";
    quality?: number;
    format?: "webp" | "png" | "jpg";
  }
) {
  const params = new URLSearchParams();

  if (options?.width) params.set("width", options.width.toString());
  if (options?.height) params.set("height", options.height.toString());
  if (options?.resize) params.set("resize", options.resize);
  if (options?.quality) params.set("quality", options.quality.toString());
  if (options?.format) params.set("format", options.format);

  return url + `?${params.toString()}`;
}
