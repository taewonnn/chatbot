import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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

  return <>kakao callback</>;
}
