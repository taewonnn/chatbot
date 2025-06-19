import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import GlobalHeader from './GlobalHeader';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* 사이드바 */}
      <SideBar isOpen={isOpen} onToggle={toggleSidebar} />

      {/* 헤더 + 컨텐츠 */}
      <div className="flex flex-1 flex-col">
        {/* 헤더에 닫혔을 때만 열기 버튼 위치 */}
        <GlobalHeader isOpen={isOpen} onToggle={toggleSidebar} />

        {/* 본문 영역 */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
