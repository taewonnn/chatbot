// import { onRequest } from 'firebase-functions/v2/https';
// import * as logger from 'firebase-functions/logger';
import { onCall } from 'firebase-functions/v2/https';
import axios from 'axios';

/** 카카오 프로필 받기 */
export const getKakaoProfile = onCall(async request => {
  const { token } = request.data;

  const response = await axios.get('https://kapi.kakao.com/user/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
});
