import { useMutation, useQuery } from 'react-query';
import { getFunctions, httpsCallable } from 'firebase/functions';

/** authCode로 토큰 받기 (Firebase Function 사용) */
const getKakaoToken = async (authCode: string) => {
  const functions = getFunctions();
  const getKakaoTokenFunction = httpsCallable(functions, 'getKakaoToken');

  const res = await getKakaoTokenFunction({ authCode });
  return res?.data;
};

export const useGetKakaoToken = () => {
  return useMutation({ mutationFn: getKakaoToken });
};

/** 토큰으로 닉네임 받기 */
const getKakaoProfile = async (token: string) => {
  const functions = getFunctions();
  const getKakaoProfileFunction = httpsCallable(functions, 'getKakaoProfile');

  const res = await getKakaoProfileFunction({ token });
  return res?.data as { id: number; [key: string]: any };
};

export const useGetKakaoProfile = (token: string) => {
  return useQuery({
    queryKey: ['kakaoProfile', token],
    queryFn: () => getKakaoProfile(token),
    enabled: !!token, // token이 있을 때만 실행
  });
};
