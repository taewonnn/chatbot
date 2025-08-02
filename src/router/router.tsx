import { createBrowserRouter, Navigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import Layout from '../components/Layout';
import SignUp from '../pages/SignUp';
import AuthGuard from '../guards/AuthGuard';
import Chat from '../pages/Chat';
import Settings from '../pages/Settings';
import KakaoCallback from '../pages/KakaoCallback';

const router = createBrowserRouter([
  {
    path: '/signin',
    element: (
      <AuthGuard mode="guest">
        <SignIn />
      </AuthGuard>
    ),
  },
  {
    path: '/signup',
    element: (
      <AuthGuard mode="guest">
        <SignUp />
      </AuthGuard>
    ),
  },
  {
    path: '/auth/kakao/callback',
    element: (
      <AuthGuard mode="guest">
        <KakaoCallback />
      </AuthGuard>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard mode="auth">
        <Layout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Chat /> }, // 루트 경로에서 Chat 컴포넌트 표시
      { path: 'chat/:id', element: <Chat /> }, // 특정 채팅 ID로 접근
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/" replace /> }, // 존재하지 않는 경로는 루트로 리다이렉트
    ],
  },
]);

export default router;
