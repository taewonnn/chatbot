import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useEffect, useRef, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../firebase/firebase';

interface NaverLoginResult {
  success: boolean;
  isNewUser: boolean;
  customToken: string;
  user: any;
  profile: any;
}

export default function NaverCallback() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [authCompleted, setAuthCompleted] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // 이미 처리 중이면 중복 실행 방지
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleNaverLogin = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');
        const state = new URLSearchParams(window.location.search).get('state');
        console.log(code, state);

        // 인가 코드 없으면 로그인 페이지로 이동
        if (!code) {
          navigate('/signin');
          return;
        }

        // 뒤로 가기 방지 (인가 코드 저장 후)
        window.history.replaceState(null, '', window.location.pathname);

        const functions = getFunctions();
        const handleNaverLoginFunction = httpsCallable(functions, 'handleNaverLogin');
        const result = await handleNaverLoginFunction({ code, state });

        const { customToken, isNewUser } = result.data as NaverLoginResult;

        // // Firebase Auth에 로그인
        await signInWithCustomToken(auth, customToken);
        setAuthCompleted(true);
        console.log('네이버 로그인 성공:', isNewUser ? '새 사용자' : '기존 사용자');
      } catch (error) {
        console.error('네이버 로그인 에러:', error);
        navigate('/signin');
      } finally {
        setIsProcessing(false);
      }
    };

    handleNaverLogin();
  }, [navigate]);

  // 인증 완료 후 채팅 페이지로 이동
  useEffect(() => {
    if (authCompleted && !isProcessing) {
      console.log('네이버 로그인 완료 -> /chat으로 이동');
      navigate('/chat');
    }
  }, [authCompleted, isProcessing, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoadingSpinner size="xl" color="blue" centered={true} text="로그인 처리 중..." />
    </div>
  );
}
