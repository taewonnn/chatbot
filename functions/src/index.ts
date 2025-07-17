// import { onRequest } from 'firebase-functions/v2/https';
// import * as logger from 'firebase-functions/logger';
import {onCall} from "firebase-functions/v2/https";
import axios from "axios";
import {getAuth} from "firebase-admin/auth";

/** 테스트 함수 */
export const test = onCall(async () => {
  try {
    return {
      message: "테스트 함수 실행",
    };
  } catch (error) {
    console.error("테스트 함수 에러:", error);
    throw new Error("테스트 함수 실패");
  }
});

/** SNS custom 토큰 발급 */
export const createCustomToken = onCall(async (request) => {
  const {uid} = request.data;

  const auth = getAuth();
  const customToken = await auth.createCustomToken(uid);

  return {customToken};
});

/** 카카오 프로필 받기 */
export const getKakaoProfile = onCall(async (request) => {
  try {
    const {token} = request.data;

    if (!token) {
      throw new Error("토큰이 없습니다.");
    }

    const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("카카오 프로필 요청 에러:", error);
    throw new Error("카카오 프로필 요청 실패");
  }
});
