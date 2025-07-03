import { useSearchParams } from 'react-router-dom';

export default function KakaoCallback() {
  const url = useSearchParams(window.location.href);
  console.log(url);
  return <>kakao callback</>;
}
