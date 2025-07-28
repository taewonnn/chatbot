import { FiPlus, FiSearch } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useUserStore } from '../store/userStore';
import { useGetList } from '../hooks/useChatData';
import { useEffect } from 'react';

interface ISideBar {
  isOpen: boolean;
}

export default function SideBar({ isOpen }: ISideBar) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  /** 프로필 정보 */
  const { userProfile } = useUserStore();

  /** 채팅 목록 */
  const { chatList, refetch } = useGetList(userProfile?.uid || '');
  console.log('chatList', chatList);

  /** 새 채팅 생성 시 목록 새로고침 */
  useEffect(() => {
    const handleChatCreated = () => {
      console.log('새 채팅 생성됨 - 목록 새로고침');
      refetch();
    };

    window.addEventListener('chatCreated', handleChatCreated);
    return () => window.removeEventListener('chatCreated', handleChatCreated);
  }, [refetch]);

  /** 로그아웃 */
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
      className={`relative h-screen flex-shrink-0 overflow-hidden bg-gray-900 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0'
      }`}
    >
      {isOpen && (
        <div className="flex h-full flex-col">
          {/* 새 채팅 버튼 */}
          <div className="p-4">
            <Link
              to="/"
              className="flex w-full items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
            >
              <FiPlus className="h-4 w-4" />새 채팅
            </Link>
          </div>

          {/* 검색 */}
          <div className="px-4 pb-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800">
              <FiSearch className="h-4 w-4" />
              채팅 검색
            </button>
          </div>

          {/* 모델/기능 목록 */}
          <div className="flex-1 overflow-y-auto px-4">
            {/* 채팅 목록 */}
            <div className="mt-6">
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400">채팅</h3>
              <div className="space-y-1">
                {chatList.length > 0 ? (
                  chatList.map((chat, index) => (
                    <Link to={`/chat/${chat.id}`} key={index}>
                      <div
                        key={index}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800"
                      >
                        {chat.title}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="mt-3 text-center text-white">새로운 채팅을 시작해보세요.</p>
                )}
              </div>
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {userProfile?.name || '사용자'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 text-yellow-400">◆</div>
                <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
