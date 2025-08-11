import { useEffect, useState, useRef } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(true);
  const [authCompleted, setAuthCompleted] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // 이미 처리 중이면 중복 실행 방지
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleKakaoLogin = async () => {
      try {
        // 인가 코드를 먼저 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (!authCode) {
          console.log('인가 코드 없음 -> /signin으로 이동');
          navigate('/signin');
          return;
        }

        console.log('인가 코드 받음:', authCode);

        // 뒤로 가기 방지 (인가 코드 저장 후)
        window.history.replaceState(null, '', window.location.pathname);

        console.log('카카오 로그인 시작');

        // 하나의 함수 호출로 모든 처리
        const functions = getFunctions();
        const handleKakaoLoginFunction = httpsCallable(functions, 'handleKakaoLogin');
        const result = await handleKakaoLoginFunction({ authCode });

        const { customToken, isNewUser } = result.data as KakaoLoginResult;

        console.log('Firebase Auth 로그인 시작');
        // 커스텀 토큰으로 Firebase Auth 로그인
        await signInWithCustomToken(auth, customToken);
        console.log('Firebase Auth 로그인 완료');

        console.log('카카오 로그인 완료:', isNewUser ? '새로운 유저' : '기존 유저');
        setAuthCompleted(true);
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        navigate('/signin');
      } finally {
        setIsProcessing(false);
      }
    };

    handleKakaoLogin();
  }, [navigate]);

  // 인증 완료 후 채팅 페이지로 이동
  useEffect(() => {
    if (authCompleted && !isProcessing) {
      console.log('인증 완료 -> /chat으로 이동');
      navigate('/chat');
    }
  }, [authCompleted, isProcessing, navigate]);

  console.log('KakaoCallback 렌더링:', { isProcessing, authCompleted });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {(isProcessing || !authCompleted) && (
        <LoadingSpinner size="xl" color="blue" centered={true} text="로그인 처리 중..." />
      )}
    </div>
  );
}
