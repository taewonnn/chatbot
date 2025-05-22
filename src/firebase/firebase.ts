import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase 구성 정보
const firebaseConfig = {
  apiKey: 'AIzaSyAfLz3komuiDQmi2gtmDseCN7w7DxmfAV0',
  authDomain: 'chatbot-d80d3.firebaseapp.com',
  projectId: 'chatbot-d80d3',
  storageBucket: 'chatbot-d80d3.firebasestorage.app',
  messagingSenderId: '979699218971',
  appId: '1:979699218971:web:09e0863f12c436d51796be',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 Export
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
