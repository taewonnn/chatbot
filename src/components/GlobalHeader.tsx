import { FiMenu, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';

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
      <Link to="/">
        <h1 className="text-lg font-semibold text-gray-900">CHAT-gpt-3.5-turbo</h1>
      </Link>

      {/* 오른쪽: 새로고침 버튼 */}
      <div className="flex items-center">
        <button
          className="rounded-lg p-2 hover:bg-gray-100"
          onClick={() => window.location.reload()}
        >
          <FiRefreshCw className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </header>
  );
}
