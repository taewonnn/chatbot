import Img from './Img';
import { v4 as uuid } from 'uuid';

interface SnsLoginButtonProps {
  provider: 'kakao' | 'naver';
  className?: string;
}

const SNS_BUTTON_STYLES = {
  kakao: {
    bgColor: 'bg-[#FFE500]',
    textColor: 'text-black',
    icon: 'kakao_icon.svg',
    text: '카카오 로그인',
  },
  naver: {
    bgColor: 'bg-[#03C75A]',
    textColor: 'text-white',
    icon: 'naver_icon.svg',
    text: '네이버 로그인',
  },
};

export default function SnsLoginButton({ provider, className = '' }: SnsLoginButtonProps) {
  const handleSnsLogin = async () => {
    try {
      if (provider === 'kakao') {
        const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;
        if (!clientId) {
          throw new Error('카카오 API 키가 설정되지 않았습니다.');
        }

        const redirectUri = window.location.origin + '/auth/kakao/callback';
        const loginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

        window.location.href = loginUrl;
      } else if (provider === 'naver') {
        const state = uuid();
        const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
        if (!clientId) {
          throw new Error('네이버 API 키가 설정되지 않았습니다.');
        }

        const redirectUri = window.location.origin + '/auth/naver/callback';
        const loginUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`;

        console.log('네이버 로그인 URL:', loginUrl);
        window.location.href = loginUrl;
      }
    } catch (error) {
      console.error(`${provider} 로그인 URL 생성 실패:`, error);
      alert(
        `${provider === 'kakao' ? '카카오' : '네이버'} 로그인을 준비하는 중 오류가 발생했습니다.`,
      );
    }
  };

  const style = SNS_BUTTON_STYLES[provider];

  return (
    <button
      onClick={handleSnsLogin}
      className={`flex w-full items-center justify-center gap-2 rounded-[12px] ${style.bgColor} px-5 py-3 transition-all duration-200 hover:scale-105 focus:outline-none ${className}`}
    >
      <Img src={style.icon} className="h-[20px] w-[20px]" alt={`${style.text}`} />
      <span className={`text-base ${style.textColor}`}>{style.text}</span>
    </button>
  );
}
