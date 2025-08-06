import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import LoadingSpinner from '../components/LoadingSpinner';

interface KakaoLoginResult {
  success: boolean;
  isNewUser: boolean;
  customToken: string;
  user: any;
  profile: any;
}

export default function KakaoCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (!authCode) {
          navigate('/signin');
          return;
        }

        // 뒤로 가기 방지
        window.history.replaceState(null, '', window.location.pathname);

        console.log('카카오 로그인 시작');

        // 하나의 함수 호출로 모든 처리
        const functions = getFunctions();
        const handleKakaoLoginFunction = httpsCallable(functions, 'handleKakaoLogin');
        const result = await handleKakaoLoginFunction({ authCode });

        const { customToken, isNewUser } = result.data as KakaoLoginResult;

        // 커스텀 토큰으로 Firebase Auth 로그인
        await signInWithCustomToken(auth, customToken);

        console.log('카카오 로그인 완료:', isNewUser ? '새로운 유저' : '기존 유저');
        navigate('/chat');
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    handleKakaoLogin();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {loading && (
        <LoadingSpinner size="xl" color="blue" centered={true} text="로그인 처리 중..." />
      )}
    </div>
  );
}
