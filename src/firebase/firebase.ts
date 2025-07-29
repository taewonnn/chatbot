import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase 구성 정보
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase 초기화 (에러 핸들링 추가)
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase 초기화 성공');
} catch (error) {
  console.error('Firebase 초기화 실패:', error);
  // 이미 초기화된 경우 기존 앱 사용
  app = initializeApp(firebaseConfig, 'default');
}

// Firebase 서비스 Export
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// 서비스 초기화 확인
export const isFirebaseInitialized = () => {
  return !!app && !!auth && !!db;
};
