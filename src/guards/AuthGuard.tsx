import { Navigate } from 'react-router-dom';

interface IAuthGuard {
  mode: 'auth' | 'guest';
  children: React.ReactNode;
}

function AuthGuard({ mode, children }: IAuthGuard) {
  const isLoggedIn = localStorage.getItem('token');

  // 로그인 필요 페이지 -> 로그인 안 돼 있으면 → /signin
  if (mode === 'auth' && !isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  // 비로그인 전용 페이지 -> 로그인 돼 있으면 → 홈 ("/")
  if (mode === 'guest' && isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default AuthGuard;
