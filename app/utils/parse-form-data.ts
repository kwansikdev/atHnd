/* eslint-disable @typescript-eslint/no-explicit-any */

export function parseIndexedFormData<T extends Record<string, any>>(
  formData: FormData,
  rootKey: string
): T {
  const result: any = {};

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith(rootKey)) continue;

    // ex: "figures[0][images][1][file]"
    const path = key
      .replace(`${rootKey}`, "")
      .replace(/\]/g, "")
      .slice(1) // 시작 '[' 제거
      .split("["); // → ["0", "images", "1", "file"]

    setDeepValue(result, path, value);
  }

  return result as T;
}

function setDeepValue(obj: any, path: string[], value: any) {
  let current = obj;

  path.forEach((key, idx) => {
    const isLast = idx === path.length - 1;
    const nextKey = path[idx + 1];

    const isArrayIndex = !isNaN(Number(nextKey));

    if (isLast) {
      current[key] = value;
    } else {
      // 배열인지 객체인지 결정해서 구조 자동 생성
      if (!current[key]) {
        current[key] = isArrayIndex ? [] : {};
      }
      current = current[key];
    }
  });
}
