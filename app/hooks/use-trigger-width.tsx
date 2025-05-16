import { useEffect, useRef, useState } from "react";

export function useTriggerWidth<T extends HTMLElement>() {
  const triggerRef = useRef<T>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const node = triggerRef.current;
    if (!node) return;

    const updateWidth = () => {
      setWidth(node.offsetWidth);
    };

    // 초기 측정
    updateWidth();

    // ResizeObserver로 너비 변화 감지
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(node);

    // cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { triggerRef, width };
}
