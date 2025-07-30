import {onCall} from "firebase-functions/v2/https";
import axios from "axios";
import * as admin from "firebase-admin";
import {getAuth} from "firebase-admin/auth";
import * as path from "path";
import OpenAI from "openai";
import {defineSecret} from "firebase-functions/params";

export const openaiApiKey = defineSecret("OPENAI_API_KEY");
export const kakaoRestApiKey = defineSecret("KAKAO_REST_API_KEY");

// Firebase Admin SDK 초기화
try {
  // 서비스 계정 키 파일 경로
  const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("서비스 계정 키로 Firebase Admin SDK 초기화 완료");
} catch (error) {
  // 기본 초기화
  admin.initializeApp();
  console.log("기본 설정으로 Firebase Admin SDK 초기화 완료");
}

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
export const getKakaoProfile = onCall({secrets: [kakaoRestApiKey]}, async (request) => {
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

/** 카카오 토큰 교환 */
export const getKakaoToken = onCall({secrets: [kakaoRestApiKey]}, async (request) => {
  try {
    const {authCode} = request.data;

    if (!authCode) {
      throw new Error("인가 코드가 없습니다.");
    }

    // 환경에 따른 리다이렉트 URI 설정
    const origin = request.rawRequest.headers.origin || "";
    const isDevelopment = origin.includes("localhost") || origin.includes("127.0.0.1");
    let redirectUri;
    if (isDevelopment) {
      redirectUri = "http://localhost:3003/auth/kakao/callback";
    } else {
      redirectUri = "https://chatbot-seven-snowy.vercel.app/auth/kakao/callback";
    }

    const response = await axios.post("https://kauth.kakao.com/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id: kakaoRestApiKey.value(),
        redirect_uri: redirectUri,
        code: authCode,
      },
    });

    return response.data;
  } catch (error) {
    console.error("카카오 토큰 교환 에러:", error);
    throw new Error("카카오 토큰 교환 실패");
  }
});

/** 카카오 로그인 URL 생성 */
export const getKakaoLoginUrl = onCall({secrets: [kakaoRestApiKey]}, async (request) => {
  try {
    const clientId = kakaoRestApiKey.value();

    if (!clientId) {
      throw new Error("카카오 REST API 키가 설정되지 않았습니다.");
    }

    // 환경에 따른 리다이렉트 URI 설정
    const origin = request.rawRequest.headers.origin || "";
    const isDevelopment = origin.includes("localhost") || origin.includes("127.0.0.1");
    let redirectUri;
    if (isDevelopment) {
      redirectUri = "http://localhost:3003/auth/kakao/callback";
    } else {
      redirectUri = "https://chatbot-seven-snowy.vercel.app/auth/kakao/callback";
    }

    const loginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

    return {loginUrl};
  } catch (error) {
    console.error("카카오 로그인 URL 생성 에러:", error);
    throw new Error("카카오 로그인 URL 생성 실패");
  }
});

/** OpenAI 채팅 */
export const chatWithOpenAI = onCall({secrets: [openaiApiKey]}, async (request) => {
  try {
    const apiKey = openaiApiKey.value();

    if (!apiKey) {
      throw new Error("OpenAI API 키가 설정되지 않았습니다.");
    }

    const openai = new OpenAI({apiKey});

    const {messages} = request.data;
    if (!messages) throw new Error("메시지가 필요합니다.");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    return {
      result: completion.choices[0].message.content,
    };
  } catch (error) {
    console.error("OpenAI API 에러:", error);
    throw new Error("OpenAI 응답 생성 실패");
  }
});
