import { useEffect, useState } from 'react';

export default function KakaoCallback() {
  const [authCode, setAuthCode] = useState<string | null>(null);

  useEffect(() => {
    // 1. 인가코드 추출
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      setAuthCode(urlParams.get('code') || null);
    }
    console.log('인가코드', authCode);
  }, []);

  // 2. 받은 인가코드로 토큰 발급 받기

  return <>kakao callback</>;
}
