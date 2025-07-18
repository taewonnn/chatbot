import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import GlobalHeader from './GlobalHeader';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <SideBar isOpen={isOpen} onToggle={toggleSidebar} />

      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 flex-col">
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
