import { useMutation } from 'react-query';
import axios from 'axios';

const getKakaoToken = async (authCode: string) => {
  const res = await axios.post('https://kauth.kakao.com/oauth/token', null, {
    params: {
      grant_type: 'authorization_code',
      client_id: import.meta.env.VITE_KAKAO_REST_API_KEY, // 카카오 개발자 REST API KEY
      redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI, // 인가 코드를 받은 리다이렉트 URI
      code: authCode, // 카카오 로그인 시 발급해주는 인가 코드
    },
  });

  // console
  // console.log('토큰 받음?',res?.data);

  return res?.data;
};

export const useGetKakaoToken = () => {
  return useMutation({ mutationFn: getKakaoToken });
};
