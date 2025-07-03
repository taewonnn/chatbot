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
    path: '/kakaoCallbck',
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
      { index: true, element: <Navigate to="chat" replace /> },
      { path: 'chat', element: <Chat /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <></> },
    ],
  },
]);

export default router;
