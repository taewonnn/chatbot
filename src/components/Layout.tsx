import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import GlobalHeader from './GlobalHeader';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false); // 모바일에서는 기본적으로 닫힌 상태

  const toggleSidebar = () => setIsOpen(prev => !prev);

  // 오버레이 클릭 시 사이드바 닫기
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <SideBar isOpen={isOpen} onClose={closeSidebar} />

      {/* 메인 컨텐츠 */}
      <div className="flex w-full flex-1 flex-col">
        {/* 헤더 */}
        <GlobalHeader onToggle={toggleSidebar} />

        {/* 본문 영역 */}
        <main className="flex-1 overflow-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
