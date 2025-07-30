import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetKakaoProfile, useGetKakaoToken } from '../api/useKakao';
import { signInOrSignUpSnsUser } from '../api/auth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const [authCode, setAuthCode] = useState<string | null>(null); // 인가 코드 저장
  const [kakaoToken, setKakaoToken] = useState<string | null>(null); // 카카오 토큰 저장

  useEffect(() => {
    // 1. 카카오 로그인 하면 -> 인가코드 url에 줌 -> 인가코드 추출
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      setAuthCode(urlParams.get('code') || null);

      // 뒤로 가기 방지
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      // @todo -> test동안 주석 / 3초 간 대기 후 인가 코드 없으면 로그인 페이지로
      // setTimeout(() => {
      //   navigate('/signin');
      // }, 3000);
    }
    console.log('인가코드', authCode);
  }, []);

  // 2. 받은 인가코드로 토큰 발급 받기
  const { mutate: getKakaoToken } = useGetKakaoToken();

  useEffect(() => {
    if (authCode) {
      getKakaoToken(authCode, {
        onSuccess: (data: any) => {
          console.log('토큰 받기 성공?', data);
          setKakaoToken(data?.access_token || null); // 토큰 저장
        },
        onError: error => {
          console.log('토큰 받는 중 에러', error);
        },
      });
    }
  }, [authCode]);

  // 3. 토큰으로 닉네임 받기
  const { data: profileData } = useGetKakaoProfile(kakaoToken || '');

  useEffect(() => {
    if (kakaoToken && profileData) {
      const handleKakaoLogin = async () => {
        try {
          console.log('kakao 로그인 처리 시작');

          const user = await signInOrSignUpSnsUser({
            provider: 'kakao',
            id: profileData?.id + '' || '',
            name:
              profileData.kakao_account.profile.name || profileData.kakao_account.profile.nickname,
            email: profileData?.kakao_account?.email || undefined,
          });

          console.log('kakao 로그인 처리 완료', user);
          navigate('/chat');
        } catch (error) {
          console.log(error);
          navigate('/signin');
        }
      };

      handleKakaoLogin();
    }
  }, [kakaoToken, profileData]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoadingSpinner size="xl" color="blue" centered={true} text="로딩 중..." />
    </div>
  );
}
