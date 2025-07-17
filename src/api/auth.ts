import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { SignUpForm } from '../pages/SignUp';

/** 로그인 커스텀 훅 */
export const signInUser = async (email: string, password: string) => {
  try {
    // 1. 사용자 정보 확인
    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data();

      // 2. SNS 사용자 차단
      if (userData.isSnsUser) {
        alert('SNS 계정입니다. SNS 로그인을 이용해주세요.');
        throw new Error('SNS 계정입니다. SNS 로그인을 이용해주세요.');
      }

      // 3. 일반 로그인 진행
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    }
  } catch (error) {
    console.log(error);
  }
};

/** 일반 회원가입 커스텀 훅 */
export const signUpUser = async (userData: SignUpForm) => {
  try {
    // 1. Firebase Auth 저장
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password,
    );

    // 2. displayName 설정
    await updateProfile(userCredential.user, {
      displayName: userData.name,
    });

    // 3. Firestore에 저장
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      name: userData.name,
      gender: userData.gender,
      phone: userData.phone,
      email: userData.email,
      createdAt: new Date().toISOString(),
    });

    return userCredential.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export interface SnsUserData {
  provider: 'kakao' | 'naver' | 'google';
  id: string;
  name: string;
  email?: string;
}

/** SNS 회원가입 커스텀 훅 */
export const signInOrSignUpSnsUser = async (snsData: SnsUserData) => {
  const { provider, id, name, email } = snsData;

  try {
    // 1. 기존 사용자 확인
    const userRef = collection(db, 'users');
    const q = query(userRef, where('provider', '==', provider), where('snsId', '==', id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // 기존 유저인 경우 -> 로그인
      console.log('기존 유저 -> 로그인 처리');
      return snapshot.docs[0].data();
    }

    // 새로운 유저
    console.log('새로운 유저 -> 회원가입 처리');
    const tempEmail = email || `${provider}_${id}@${provider}.com`;
    const tempPassword = `${provider}_${id}_${Date.now()}`;

    // Firebase Auth 생성
    const userCredential = await createUserWithEmailAndPassword(auth, tempEmail, tempPassword);

    // displayName 설정
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    // Firestore에 저장
    const userData = {
      uid: userCredential.user.uid,
      name,
      email: tempEmail,
      provider,
      snsId: id,
      isSnsUser: true,
      createdAt: new Date().toISOString(),
      gender: null,
      phone: null,
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    return userCredential.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
