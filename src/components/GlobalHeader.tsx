import { TbLayoutSidebarRightExpandFilled } from 'react-icons/tb';

interface IGlobalHeader {
  isOpen: boolean;
  onToggle: () => void;
}

export default function GlobalHeader({ isOpen, onToggle }: IGlobalHeader) {
  return (
    <header className="flex h-16 items-center border-b bg-white px-4">
      {/* 사이드바가 닫혔을 때만 열기 버튼 보여주기 */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="mr-4 rounded p-1 hover:bg-gray-100 focus:outline-none"
        >
          <TbLayoutSidebarRightExpandFilled className="h-6 w-6 text-gray-700" />
        </button>
      )}

      <h1 className="text-xl font-semibold">Chat Page</h1>
      {/* 오른쪽에 태마 토글, 프로필 등 추가 */}
    </header>
  );
}
