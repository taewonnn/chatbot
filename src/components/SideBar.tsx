import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiChevronDown, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { useUserStore } from '../store/useUserStore';
import useAuth from '../hooks/useAuth';
import { useGetList } from '../hooks/useChatData';
import { useResponsiveClick } from '../hooks/useResponsiveClick';
import { useModalStore } from '../store/useModalStore';
import TabModal, { SETTINGS_TABS } from './TabModal';

interface ISideBar {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideBar({ isOpen, onClose }: ISideBar) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isListOpen, setIsListOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리

  /** 모달 */
  const { openConfirmModal } = useModalStore();

  /** 프로필 정보 */
  const { userProfile } = useUserStore();

  /** 채팅 목록 */
  const { chatList, refetch } = useGetList(userProfile?.uid || '');

  /** 검색된 채팅 목록 */
  const filteredChatList = useMemo(() => {
    if (!searchQuery.trim()) {
      return chatList; // 검색어가 없으면 전체 목록 return
    }

    return chatList.filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chatList, searchQuery]);

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

  /** 로그아웃 확인 모달 */
  const handleLogoutClick = () => {
    openConfirmModal({
      title: '로그아웃',
      message: '정말로 로그아웃하시겠습니까?',
      onConfirm: handleLogout,
    });
  };

  // 모바일에서만 사이드바 닫기
  const handleMobileClose = useResponsiveClick(onClose);

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && <div className="theme-overlay fixed inset-0 z-40 md:hidden" onClick={onClose} />}

      {/* 사이드바 */}
      <aside
        className={`fixed z-50 h-screen flex-shrink-0 overflow-hidden bg-gray-900 transition-all duration-300 md:relative ${
          isOpen ? 'w-80 translate-x-0 md:w-64' : 'w-80 -translate-x-full md:w-0 md:translate-x-0'
        }`}
      >
        {isOpen && (
          <div className="flex h-full flex-col">
            {/* 새 채팅 버튼 */}
            <div className="p-4">
              <Link
                to="/"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
                onClick={handleMobileClose}
              >
                <FiPlus className="h-4 w-4" />새 채팅
              </Link>
            </div>

            {/* 검색 */}
            <div className="px-4 pb-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="채팅 검색..."
                  className="theme-bg-tertiary theme-text-primary theme-border-secondary w-full rounded-lg border px-3 py-2 pl-10 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {/* 검색어가 있을 때 클리어 버튼 */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                  >
                    <span className="text-sm">×</span>
                  </button>
                )}
              </div>
            </div>

            {/* 모델/기능 목록 */}
            <div className="flex-1 overflow-y-auto px-4">
              {/* 채팅 목록 */}
              <div className="mt-6">
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400">
                  채팅 {searchQuery && `(${filteredChatList.length}개)`}
                </h3>
                <div className="space-y-1">
                  {filteredChatList.length > 0 ? (
                    filteredChatList.map((chat, index) => (
                      <Link to={`/chat/${chat.id}`} key={index} onClick={handleMobileClose}>
                        <div
                          key={index}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800"
                        >
                          {chat.title}
                        </div>
                      </Link>
                    ))
                  ) : searchQuery ? (
                    <p className="mt-3 text-center text-gray-400">
                      "{searchQuery}"에 대한 검색 결과가 없습니다.
                    </p>
                  ) : (
                    <p className="mt-3 text-center text-white">새로운 채팅을 시작해보세요.</p>
                  )}
                </div>
              </div>
            </div>

            {/* 사용자 정보 및 드롭다운 */}
            <div className="border-t border-gray-700 p-4">
              {/* 드롭다운 메뉴 - 위쪽에 표시 */}
              {isListOpen && (
                <div className="mb-2 overflow-hidden rounded-lg bg-gray-800">
                  {/* 메뉴 옵션들 */}
                  <div className="p-2">
                    <div className="space-y-1">
                      <div
                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={() => setIsSettingsOpen(true)}
                      >
                        <FiSettings className="h-4 w-4" />
                        <span>설정</span>
                      </div>

                      <div
                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={handleLogoutClick}
                      >
                        <FiLogOut className="h-4 w-4" />
                        <span>로그아웃</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 사용자 정보 헤더 */}
              <div
                className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-800"
                onClick={() => setIsListOpen(!isListOpen)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                    <FiUser className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {userProfile?.name || '사용자'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {userProfile?.email || 'user@example.com'}
                    </span>
                  </div>
                </div>
                <FiChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${isListOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* 설정 모달 */}
      <TabModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="설정"
        tabs={SETTINGS_TABS}
        activeTab={activeSettingsTab}
        onTabChange={setActiveSettingsTab}
      />
    </>
  );
}
