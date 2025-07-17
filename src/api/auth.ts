import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { SignUpForm } from '../pages/SignUp';

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
