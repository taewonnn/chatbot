import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface IAuthGuard {
  mode: 'auth' | 'guest';
  children: React.ReactNode;
}

function AuthGuard({ mode, children }: IAuthGuard) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

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

export default AuthGuard;
