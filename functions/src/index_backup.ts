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

/** 카카오 로그인 */
export const handleKakaoLogin = onCall({secrets: [kakaoRestApiKey]}, async (request) => {
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

    // 1. 인가 코드로 액세스 토큰 발급
    console.log("1. 액세스 토큰 발급 시작");
    const tokenResponse = await axios.post("https://kauth.kakao.com/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id: kakaoRestApiKey.value(),
        redirect_uri: redirectUri,
        code: authCode,
      },
    });

    const accessToken = tokenResponse.data.access_token;
    console.log("1. 액세스 토큰 발급 완료");

    // 2. 액세스 토큰으로 프로필 정보 조회
    console.log("2. 프로필 정보 조회 시작");
    const profileResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const profile = profileResponse.data;
    console.log("2. 프로필 정보 조회 완료");

    // 3. 기존 사용자 확인
    console.log("3. 기존 사용자 확인 시작");
    const db = admin.firestore();
    const userRef = db.collection("users");
    const snapshot = await userRef
      .where("provider", "==", "kakao")
      .where("snsId", "==", profile.id.toString())
      .get();

    if (!snapshot.empty) {
      // 기존 유저인 경우 -> 로그인
      console.log("3. 기존 유저 로그인 처리");
      const userData = snapshot.docs[0].data();

      // 커스텀 토큰 생성
      const auth = getAuth();
      const customToken = await auth.createCustomToken(userData.uid);

      return {
        success: true,
        isNewUser: false,
        customToken: customToken,
        user: userData,
        profile: profile,
      };
    }

    // 4. 새로운 유저인 경우 -> 회원가입
    console.log("3. 새로운 유저 회원가입 처리");
    const tempEmail = profile.kakao_account?.email || `kakao_${profile.id}@kakao.com`;
    const tempPassword = `kakao_${profile.id}_${Date.now()}`;

    // Firebase Auth 생성
    const auth = getAuth();
    const userRecord = await auth.createUser({
      email: tempEmail,
      password: tempPassword,
      displayName: profile.kakao_account.profile.name || profile.kakao_account.profile.nickname,
    });

    // Firestore에 저장
    const userData = {
      uid: userRecord.uid,
      name: profile.kakao_account.profile.name || profile.kakao_account.profile.nickname,
      email: tempEmail,
      provider: "kakao",
      snsId: profile.id.toString(),
      isSnsUser: true,
      createdAt: new Date().toISOString(),
      gender: null,
      phone: null,
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    // 커스텀 토큰 생성
    const customToken = await auth.createCustomToken(userRecord.uid);

    console.log("4. 회원가입 완료");

    return {
      success: true,
      isNewUser: true,
      customToken: customToken,
      user: userData,
      profile: profile,
    };
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

      console.log("네이버 로그인 처리 시작");

      // 1. 프론트에서 받아온 code로 accessToken 발급받기
      const tokenResponse = await axios.post("https://nid.naver.com/oauth2.0/token", null, {
        params: {
          grant_type: "authorization_code",
          client_id: naverClientId.value(),
          client_secret: naverClientSecret.value(),
          code: code,
          state: state,
        },
      });

      const accessToken = tokenResponse.data.access_token;

      console.log("1. 액세스 토큰 발급 완료", accessToken);

      // 2. accessToken으로 프로필 정보 조회
      const profileResponse = await axios.get("https://openapi.naver.com/v1/nid/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const profile = profileResponse.data;
      console.log("2. 프로필 정보 조회 완료", profile);

      // 3. 기존 사용자 확인
      const db = admin.firestore();
      const userRef = db.collection("users");
      const snapshot = await userRef
        .where("provider", "==", "naver")
        .where("snsId", "==", profile.response.id)
        .get();

      if (!snapshot.empty) {
        // 기존 유저인 경우 -> 로그인
        console.log("3. 기존 유저 로그인 처리");
        const userData = snapshot.docs[0].data();

        // 커스텀 토큰 생성
        const auth = getAuth();
        const customToken = await auth.createCustomToken(userData.uid);

        console.log("3. 기존 유저 로그인 완료");

        return {
          success: true,
          isNewUser: false,
          customToken: customToken,
          user: userData,
          profile: profile,
        };
      }

      // 4. 새로운 유저인 경우 -> 회원가입
      console.log("3. 새로운 유저 회원가입 처리");
      const tempEmail = profile.response.email || `naver_${profile.response.id}@naver.com`;
      const tempPassword = `naver_${profile.response.id}_${Date.now()}`;

      // Firebase Auth 생성
      const auth = getAuth();
      const userRecord = await auth.createUser({
        email: tempEmail,
        password: tempPassword,
        displayName: profile.response.name,
      });

      // Firestore에 저장
      const userData = {
        uid: userRecord.uid,
        name: profile.response.name,
        email: tempEmail,
        provider: "naver",
        snsId: profile.response.id.toString(),
        isSnsUser: true,
        createdAt: new Date().toISOString(),
        gender: null,
        phone: null,
      };

      await db.collection("users").doc(userRecord.uid).set(userData);

      // 커스텀 토큰 생성
      const customToken = await auth.createCustomToken(userRecord.uid);

      return {
        success: true,
        isNewUser: true,
        customToken: customToken,
        user: userData,
        profile: profile,
      };
    } catch (error) {
      console.log(error);
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
