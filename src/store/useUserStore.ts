import { create } from 'zustand';
import { User } from 'firebase/auth';

// Firestore 유저 프로필 타입
export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  gender?: string;
  phone?: string;
  createdAt: Date | string;
  isSnsUser?: boolean;
  aiSettings?: {
    nickname: string;
    features: string;
  };
}

interface UserStore {
  authUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  // actions
  setAuthUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  // 초기 상태
  authUser: null,
  userProfile: null,
  loading: true,

  // actions
  setAuthUser: (user: User | null) => set({ authUser: user }),
  setUserProfile: (profile: UserProfile | null) => set({ userProfile: profile }),
  setLoading: (loading: boolean) => set({ loading }),
  clearUser: () =>
    set({
      authUser: null,
      userProfile: null,
      loading: false,
    }),
}));
