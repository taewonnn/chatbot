import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Chat from '../pages/Chat';
import AuthGuard from '../guards/AuthGuard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NotFoundPage from '../pages/NotFoundPage';

const SignIn = lazy(() => import('../pages/SignIn'));
const SignUp = lazy(() => import('../pages/SignUp'));
const KakaoCallback = lazy(() => import('../pages/KakaoCallback'));
const NaverCallback = lazy(() => import('../pages/NaverCallback'));

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
    path: '/auth/naver/callback',
    element: (
      <AuthGuard mode="guest">
        <Suspense
          fallback={
            <LoadingSpinner size="xl" color="blue" centered={true} text="페이지 로딩 중..." />
          }
        >
          <NaverCallback />
        </Suspense>
      </AuthGuard>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard mode="auth">
        <Suspense
          fallback={
            <LoadingSpinner size="xl" color="blue" centered={true} text="페이지 로딩 중..." />
          }
        >
          <Layout />
        </Suspense>
      </AuthGuard>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={
              <LoadingSpinner size="xl" color="blue" centered={true} text="채팅 로딩 중..." />
            }
          >
            <Chat />
          </Suspense>
        ),
      },
      {
        path: 'chat/:id',
        element: (
          <Suspense
            fallback={
              <LoadingSpinner size="xl" color="blue" centered={true} text="채팅 로딩 중..." />
            }
          >
            <Chat />
          </Suspense>
        ),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
