// kakao
export const VITE_KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
export const VITE_KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

// openai
export const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const SNS_CONFIG = {
  kakao: {
    authUrl: 'https://kauth.kakao.com/oauth/authorize',
    clientId: import.meta.env.VITE_KAKAO_REST_API_KEY,
    redirectPath: '/auth/kakao/callback',
  },
  naver: {
    authUrl: 'https://nid.naver.com/oauth2.0/authorize',
    clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
    redirectPath: '/auth/naver/callback',
  },
} as const;

export type SnsProvider = keyof typeof SNS_CONFIG;
