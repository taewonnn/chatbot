import { useEffect, useRef } from 'react';

export default function useAutoScroll(dependencies: any[]) {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const prevDepsRef = useRef(dependencies);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    // 실제로 값이 변경되었을 때만 스크롤
    const hasChanged = dependencies.some((dep, index) => dep !== prevDepsRef.current[index]);

    if (hasChanged) {
      scrollToBottom();
      prevDepsRef.current = [...dependencies];
    }
  }, dependencies);

  return { messageEndRef };
}
