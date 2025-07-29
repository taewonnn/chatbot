import { useCallback } from 'react';

/**
 * 반응형 클릭 훅
 * 모바일에서만 실행되는 클릭 핸들러를 생성
 */
export const useResponsiveClick = (callback: () => void, breakpoint: number = 768) => {
  const handleClick = useCallback(() => {
    // 모바일에서만 실행 (breakpoint 미만)
    if (window.innerWidth < breakpoint) {
      callback();
    }
  }, [callback, breakpoint]);

  return handleClick;
};
