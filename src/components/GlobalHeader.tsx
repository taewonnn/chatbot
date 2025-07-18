import { FiMenu, FiRefreshCw } from 'react-icons/fi';

interface IGlobalHeader {
  onToggle: () => void;
}

export default function GlobalHeader({ onToggle }: IGlobalHeader) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      {/* 왼쪽: 메뉴 버튼 */}
      <div className="flex items-center">
        <button onClick={onToggle} className="rounded-lg p-2 hover:bg-gray-100">
          <FiMenu className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* 중앙: 제목 */}
      <h1 className="text-lg font-semibold text-gray-900">CHAT-4o</h1>

      {/* 오른쪽: 새로고침 버튼 */}
      <div className="flex items-center">
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <FiRefreshCw className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </header>
  );
}
