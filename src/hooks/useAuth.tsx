import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';

function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 로그아웃
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log('로그아웃 실패', e);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return { user, loading, logout };
}

export default useAuth;
