import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface ISideBar {
  isOpen: boolean;
  onToggle: () => void;
}

const qs = ['react 상태관리 추천', 'vite vs pmpn', 'jQuery 버전 이슈'];

export default function SideBar({ isOpen, onToggle }: ISideBar) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (e) {
      alert('로그아웃 중 오류 발생 - 다시 시도해주세요');
      console.log(e);
    }
  };
  return (
    <aside
      className={`relative h-screen flex-shrink-0 overflow-hidden bg-blue-500 transition-all duration-300 ${isOpen ? 'w-60' : 'w-0'} `}
    >
      {/* 열려 있을 때만 메뉴 렌더링 */}
      {isOpen && (
        <nav className="mt-12 flex flex-col space-y-2 p-4 text-white">
          <Link className="mb-12 font-bold" to="#">
            New Chat
          </Link>

          <p className="mt-5 flex flex-col">
            <span className="text-lg font-bold">Recent</span>
            {qs.map((q, i) => (
              <Link to={'#'} key={i}>
                {q}
              </Link>
            ))}
          </p>

          <a href="#">질문내역</a>
        </nav>
      )}

      {/* 사이드바 닫기 버튼(열려 있을 때만) */}
      {isOpen && (
        <button
          onClick={onToggle}
          className="absolute right-[1.5rem] top-4 rounded-full bg-white p-1 shadow-md"
        >
          <TbLayoutSidebarRightCollapseFilled className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* 로그아웃 */}
      <button onClick={handleLogout} className="mt-auto p-4 text-white hover:bg-blue-600">
        로그아웃
      </button>
    </aside>
  );
}
