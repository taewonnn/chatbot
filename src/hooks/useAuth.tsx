import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { useUserStore } from '../store/userStore';
import { getUSerProfile } from './useUserProfile';

function useAuth() {
  const { authUser, setAuthUser, loading, setUserProfile, setLoading, clearUser } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setAuthUser(user); // 유저 정보 저장
      setLoading(false);

      if (user) {
        const profile = await getUSerProfile(user.uid);
        // console.log('프로필??', profile);
        setUserProfile(profile); // 프로필 저장
      }

      // 로그아웃시 유저 프로필도 클리어
      if (!user) {
        clearUser();
      }
    });

    return unsubscribe;
  }, [setAuthUser, setLoading, clearUser]);

  // 로그아웃
  const logout = async () => {
    try {
      await signOut(auth);
      clearUser(); // Zustand 스토어도 클리어
    } catch (e) {
      console.log('로그아웃 실패', e);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return { user: authUser, loading, logout };
}

export default useAuth;
