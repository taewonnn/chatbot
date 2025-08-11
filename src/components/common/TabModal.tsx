import { FiX } from 'react-icons/fi';
import GeneralSettings from '../settings/GeneralSettings';
import DetailSettings from '../settings/DetailSettings';
import PrivacySettings from '../settings/PrivacySettings';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ITabModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// 설정 탭 정의
export const SETTINGS_TABS: Tab[] = [
  {
    id: 'general',
    label: '일반',
    content: <GeneralSettings />,
  },
  {
    id: 'chat',
    label: '채팅 설정',
    content: <DetailSettings />,
  },
  {
    id: 'privacy',
    label: '회원정보',
    content: <PrivacySettings />,
  },
];

export default function TabModal({
  isOpen,
  onClose,
  title,
  tabs,
  activeTab,
  onTabChange,
}: ITabModal) {
  if (!isOpen) return null;

  /** 배경 클릭 시 모달 닫기 */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /** 현재 탭 컨텐츠 */
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="theme-overlay absolute inset-0 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* 모달 컨테이너 */}
      <div className="theme-bg-primary relative h-[65%] w-full max-w-2xl rounded-lg shadow-xl">
        {/* 헤더 */}
        <div className="theme-border-primary flex items-center justify-between border-b p-6">
          <h2 className="theme-text-primary text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="theme-text-tertiary hover:theme-text-secondary transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="theme-border-primary border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'theme-text-tertiary hover:theme-text-secondary border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-6">{activeTabContent}</div>
      </div>
    </div>
  );
}
