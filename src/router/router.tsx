import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AuthGuard from '../guards/AuthGuard';
import Chat from '../pages/Chat';
import KakaoCallback from '../pages/KakaoCallback';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFoundPage from '../components/NotFoundPage';

// 덜 사용되는 페이지들만 lazy loading
const SignIn = lazy(() => import('../pages/SignIn'));
const SignUp = lazy(() => import('../pages/SignUp'));
const Settings = lazy(() => import('../pages/Settings'));

export const router = createBrowserRouter([
  {
    path: '/signin',
    element: (
      <AuthGuard mode="guest">
        <Suspense
          fallback={
            <LoadingSpinner size="xl" color="blue" centered={true} text="페이지 로딩 중..." />
          }
        >
          <SignIn />
        </Suspense>
      </AuthGuard>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: '/signup',
    element: (
      <AuthGuard mode="guest">
        <Suspense
          fallback={
            <LoadingSpinner size="xl" color="blue" centered={true} text="페이지 로딩 중..." />
          }
        >
          <SignUp />
        </Suspense>
      </AuthGuard>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: '/auth/kakao/callback',
    element: (
      <AuthGuard mode="guest">
        <Suspense
          fallback={
            <LoadingSpinner size="xl" color="blue" centered={true} text="페이지 로딩 중..." />
          }
        >
          <KakaoCallback />
        </Suspense>
      </AuthGuard>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard mode="auth">
        <Layout />
      </AuthGuard>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
      {
        path: 'chat/:id',
        element: <Chat />,
      },
      {
        path: 'settings',
        element: (
          <Suspense
            fallback={
              <LoadingSpinner size="xl" color="blue" centered={true} text="페이지 로딩 중..." />
            }
          >
            <Settings />
          </Suspense>
        ),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
