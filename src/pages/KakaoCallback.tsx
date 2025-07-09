import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetKakaoToken } from '../api/useKakao';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const [authCode, setAuthCode] = useState<string | null>(null);

  useEffect(() => {
    // 1. 인가코드 추출
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
        onSuccess: data => {
          console.log('토큰 받음?', data);
        },
        onError: error => {
          console.log('토큰 받는 중 에러', error);
        },
      });
    }
  }, [authCode]);

  return <>kakao callback</>;
}
