import { FiX } from 'react-icons/fi';
import GeneralSettings from './GeneralSettings';

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
    content: (
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">AI 모델</label>
          <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
        </div>
        <div>
          <div className="mb-3">맞춤 설정</div>
          <form action="" className="flex flex-col gap-2">
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              어떻게 불러드리면 좋을까요?
            </label>
            <input
              type="text"
              id="nickname"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="닉네임을 적어주세요."
            />
            <label htmlFor="features" className="block text-sm font-medium text-gray-700">
              어떤 특성을 지녔으면 하나요?
            </label>
            <textarea
              id="features"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="특성을 적어주세요."
            />
          </form>
        </div>
      </div>
    ),
  },
  {
    id: 'privacy',
    label: '개인정보',
    content: (
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이름을 입력하세요"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-700">개인정보 수집 동의</span>
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-700">마케팅 정보 수신</span>
          </label>
        </div>
      </div>
    ),
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
    <div className="z-60 fixed inset-0 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* 모달 컨테이너 */}
      <div className="relative mx-4 w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
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
