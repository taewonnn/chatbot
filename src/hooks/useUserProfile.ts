import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { UserProfile as CustomUserProfile } from '../store/useUserStore';

export const getUSerProfile = async (uid: string) => {
  // console.log('uid', uid);
  try {
    const userDoc = doc(db, 'users', uid);
    const snapshot = await getDoc(userDoc);

    if (snapshot.exists()) {
      return snapshot.data() as CustomUserProfile;
    }

    return null;
  } catch (e) {
    console.log('유저 정보 조회 실패', e);
    return null;
  }
};
