import {onCall} from "firebase-functions/v2/https";
import axios from "axios";
import * as admin from "firebase-admin";
import {getAuth} from "firebase-admin/auth";
import * as path from "path";
import OpenAI from "openai";
import {defineSecret} from "firebase-functions/params";

export const openaiApiKey = defineSecret("OPENAI_API_KEY");
export const kakaoRestApiKey = defineSecret("KAKAO_REST_API_KEY");
export const naverClientId = defineSecret("NAVER_CLIENT_ID");
export const naverClientSecret = defineSecret("NAVER_CLIENT_SECRET");

// Firebase Admin SDK 초기화
try {
  const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("서비스 계정 키로 Firebase Admin SDK 초기화 완료");
} catch (error) {
  admin.initializeApp();
  console.log("기본 설정으로 Firebase Admin SDK 초기화 완료");
}

// 공통 타입 정의
interface SnsProfile {
  id: string;
  name: string;
  email?: string;
  provider: string;
}

interface SnsConfig {
  tokenUrl: string;
  profileUrl: string;
  getTokenParams: (code: string, state?: string) => Record<string, string | undefined>;
  getProfileHeaders: (accessToken: string) => Record<string, string>;
  extractProfile: (response: Record<string, unknown>) => SnsProfile;
  getRedirectUri: (origin: string) => string;
}

// SNS별 설정
const SNS_CONFIGS: Record<string, SnsConfig> = {
  // 카카오
  kakao: {
    tokenUrl: "https://kauth.kakao.com/oauth/token",
    profileUrl: "https://kapi.kakao.com/v2/user/me",
    getTokenParams: (code: string, redirectUri?: string) => ({
      grant_type: "authorization_code",
      client_id: kakaoRestApiKey.value(),
      redirect_uri: redirectUri,
      code: code,
    }),
    getProfileHeaders: (accessToken: string) => ({
      Authorization: `Bearer ${accessToken}`,
    }),
    extractProfile: (response: Record<string, unknown>): SnsProfile => ({
      id: (response.id as number).toString(),
      name:
        (((response.kakao_account as Record<string, unknown>)?.profile as Record<string, unknown>)
          ?.name as string) ||
        (((response.kakao_account as Record<string, unknown>)?.profile as Record<string, unknown>)
          ?.nickname as string),
      email: (response.kakao_account as Record<string, unknown>)?.email as string,
      provider: "kakao",
    }),
    getRedirectUri: (origin: string) => {
      const isDevelopment = origin.includes("localhost") || origin.includes("127.0.0.1");
      let url = "";
      if (isDevelopment) {
        url = "http://localhost:3003/auth/kakao/callback";
      } else {
        url = "https://chatbot-seven-snowy.vercel.app/auth/kakao/callback";
      }

      return url;
    },
  },

  // 네이버
  naver: {
    tokenUrl: "https://nid.naver.com/oauth2.0/token",
    profileUrl: "https://openapi.naver.com/v1/nid/me",
    getTokenParams: (code: string, state?: string) => ({
      grant_type: "authorization_code",
      client_id: naverClientId.value(),
      client_secret: naverClientSecret.value(),
      code: code,
      state: state,
    }),
    getProfileHeaders: (accessToken: string) => ({
      Authorization: `Bearer ${accessToken}`,
    }),
    extractProfile: (response: Record<string, unknown>): SnsProfile => ({
      id: ((response.response as Record<string, unknown>)?.id as number).toString(),
      name: (response.response as Record<string, unknown>)?.name as string,
      email: (response.response as Record<string, unknown>)?.email as string,
      provider: "naver",
    }),
    getRedirectUri: (origin: string) => {
      const isDevelopment = origin.includes("localhost") || origin.includes("127.0.0.1");
      let url = "";
      if (isDevelopment) {
        url = "http://localhost:3003/auth/naver/callback";
      } else {
        url = "https://chatbot-seven-snowy.vercel.app/auth/naver/callback";
      }
      return url;
    },
  },
};

/**
 * 공통 SNS 로그인 처리 함수
 * @param {string} provider SNS 제공자 (kakao, naver)
 * @param {string} code 인가 코드
 * @param {string} [state] state 파라미터 (네이버용)
 * @return {Promise<Object>} 로그인 결과
 */
async function handleSnsLogin(provider: string, code: string, state?: string) {
  const config = SNS_CONFIGS[provider];
  if (!config) {
    throw new Error(`지원하지 않는 SNS 제공자: ${provider}`);
  }

  console.log(`${provider} 로그인 처리 시작`);

  // 1. 액세스 토큰 발급
  console.log("1. 액세스 토큰 발급 시작");
  const tokenParams = config.getTokenParams(code, state);
  const tokenResponse = await axios.post(config.tokenUrl, null, {params: tokenParams});
  const accessToken = tokenResponse.data.access_token;
  console.log("1. 액세스 토큰 발급 완료");

  // 2. 프로필 정보 조회
  console.log("2. 프로필 정보 조회 시작");
  const profileHeaders = config.getProfileHeaders(accessToken);
  const profileResponse = await axios.get(config.profileUrl, {headers: profileHeaders});
  const profile = config.extractProfile(profileResponse.data);
  console.log("2. 프로필 정보 조회 완료");

  // 3. 기존 사용자 확인
  console.log("3. 기존 사용자 확인 시작");
  const db = admin.firestore();
  const auth = getAuth();
  const userRef = db.collection("users");
  const snapshot = await userRef
    .where("provider", "==", provider)
    .where("snsId", "==", profile.id)
    .get();

  if (!snapshot.empty) {
    // 기존 유저인 경우 -> 로그인
    console.log("3. 기존 유저 로그인 처리");
    const userData = snapshot.docs[0].data();
    const customToken = await auth.createCustomToken(userData.uid);

    return {
      success: true,
      isNewUser: false,
      customToken: customToken,
      user: userData,
      profile: profileResponse.data,
    };
  }

  // 4. 새로운 유저인 경우 -> 회원가입
  console.log("4. 새로운 유저 회원가입 처리");
  const tempEmail = profile.email || `${provider}_${profile.id}@${provider}.com`;
  const tempPassword = `${provider}_${profile.id}_${Date.now()}`;

  const userRecord = await auth.createUser({
    email: tempEmail,
    password: tempPassword,
    displayName: profile.name,
  });

  const userData = {
    uid: userRecord.uid,
    name: profile.name,
    email: tempEmail,
    provider: provider,
    snsId: profile.id,
    isSnsUser: true,
    createdAt: new Date().toISOString(),
    gender: null,
    phone: null,
  };

  await db.collection("users").doc(userRecord.uid).set(userData);
  const customToken = await auth.createCustomToken(userRecord.uid);

  console.log("4. 회원가입 완료");

  return {
    success: true,
    isNewUser: true,
    customToken: customToken,
    user: userData,
    profile: profileResponse.data,
  };
}

/** 카카오 로그인 */
export const handleKakaoLogin = onCall({secrets: [kakaoRestApiKey]}, async (request) => {
  try {
    const {authCode} = request.data;
    if (!authCode) {
      throw new Error("인가 코드가 없습니다.");
    }

    const origin = request.rawRequest.headers.origin || "";
    const redirectUri = SNS_CONFIGS.kakao.getRedirectUri(origin);
    return await handleSnsLogin("kakao", authCode, redirectUri);
  } catch (error) {
    console.error("카카오 로그인 처리 에러:", error);
    throw new Error("카카오 로그인 처리 실패");
  }
});

/** 네이버 로그인 */
export const handleNaverLogin = onCall(
  {secrets: [naverClientId, naverClientSecret]},
  async (request) => {
    try {
      const {code, state} = request.data;
      if (!code) {
        throw new Error("인가 코드가 없습니다.");
      }

      return await handleSnsLogin("naver", code, state);
    } catch (error) {
      console.error("네이버 로그인 처리 에러:", error);
      throw new Error("네이버 로그인 처리 실패");
    }
  }
);

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
