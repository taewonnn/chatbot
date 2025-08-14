import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import GlobalHeader from './GlobalHeader';
import Modal from '../common/Modal';

export default function Layout() {
  // 초기값을 화면 크기에 따라 설정
  const [isOpen, setIsOpen] = useState(() => {
    return window.innerWidth >= 768; // PC에서는 true, 모바일에서는 false
  });

  // 반응형 처리
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  // 오버레이 클릭 시 사이드바 닫기
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="theme-bg-secondary flex h-screen">
      {/* 사이드바 */}
      <SideBar isOpen={isOpen} onClose={closeSidebar} />

      {/* 메인 컨텐츠 */}
      <div className="flex w-full flex-1 flex-col">
        {/* 헤더 */}
        <GlobalHeader onToggle={toggleSidebar} />

        {/* 본문 영역 */}
        <main className="theme-bg-primary flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* 모달 */}
      <Modal />
    </div>
  );
}
