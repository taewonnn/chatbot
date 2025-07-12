import { useMutation, useQuery } from 'react-query';
import axios from 'axios';

/** authCode로 토큰 받기 */
const getKakaoToken = async (authCode: string) => {
  const res = await axios.post('https://kauth.kakao.com/oauth/token', null, {
    params: {
      grant_type: 'authorization_code',
      client_id: import.meta.env.VITE_KAKAO_REST_API_KEY, // 카카오 개발자 REST API KEY
      redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI, // 인가 코드를 받은 리다이렉트 URI
      code: authCode, // 카카오 로그인 시 발급해주는 인가 코드
    },
  });

  return res?.data;
};

export const useGetKakaoToken = () => {
  return useMutation({ mutationFn: getKakaoToken });
};

/** 토큰으로 닉네임 받기 */
const getKakaoProfile = async (token: string) => {
  const res = await axios.get('https://kapi.kakao.com/user/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res?.data;
};

export const useGetKakaoProfile = (token: string) => {
  return useQuery({
    queryKey: ['kakaoProfile', token],
    queryFn: () => getKakaoProfile(token),
    enabled: !!token, // token이 있을 때만 실행
  });
};
