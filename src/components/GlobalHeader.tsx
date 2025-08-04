import { FiMenu, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface IGlobalHeader {
  onToggle: () => void;
}

export default function GlobalHeader({ onToggle }: IGlobalHeader) {
  return (
    <header className="theme-bg-primary theme-border-primary flex h-16 items-center justify-between border-b px-4">
      {/* 왼쪽: 메뉴 버튼 */}
      <div className="flex items-center">
        <button
          onClick={onToggle}
          className="theme-text-secondary hover:theme-bg-secondary rounded-lg p-2"
        >
          <FiMenu className="h-5 w-5" />
        </button>
      </div>

      {/* 중앙: 제목 */}
      <Link to="/">
        <h1 className="theme-text-primary text-lg font-semibold">CHAT-gpt-3.5-turbo</h1>
      </Link>

      {/* 오른쪽: 새로고침 버튼 */}
      <div className="flex items-center">
        <button
          className="theme-text-secondary hover:theme-bg-secondary rounded-lg p-2"
          onClick={() => window.location.reload()}
        >
          <FiRefreshCw className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
