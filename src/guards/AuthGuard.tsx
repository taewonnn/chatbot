import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface IAuthGuard {
  mode: 'auth' | 'guest';
  children: React.ReactNode;
}

export default function AuthGuard({ mode, children }: IAuthGuard) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" color="blue" centered={true} text="로딩 중..." />
      </div>
    );
  }

  // 로그인 필요 페이지 -> 로그인 안 돼 있으면 → /signin
  if (mode === 'auth' && !user) {
    return <Navigate to="/signin" replace />;
  }

  // 비로그인 전용 페이지 -> 로그인 돼 있으면 → 홈 ("/")
  if (mode === 'guest' && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
