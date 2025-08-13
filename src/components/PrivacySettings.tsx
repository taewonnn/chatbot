import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { updatePassword, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import useAuth from '../hooks/useAuth';
import { useModalStore } from '../store/useModalStore';
import { useUserStore } from '../store/useUserStore';

interface FormData {
  displayName: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PrivacySettings() {
  const { user, userProfile } = useAuth();
  const { setUserProfile } = useUserStore();

  console.log('userProfile:', userProfile);

  const [isLoading, setIsLoading] = useState(false);
  const { openAlertModal } = useModalStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      displayName: user?.displayName || '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: FormData) => {
    if (!user) {
      openAlertModal({
        title: '오류',
        message: '로그인이 필요합니다.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Firebase Auth의 displayName 업데이트
      if (data.displayName && data.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: data.displayName,
        });

        // 2. Firestore의 name 필드도 업데이트
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          name: data.displayName,
        });
      }

      // 3. zustand 업데이트
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          name: data.displayName,
        });
      }

      // 3. 비밀번호 업데이트
      if (data.newPassword) {
        await updatePassword(user, data.newPassword);
      }

      openAlertModal({
        title: '성공',
        message: '회원정보가 성공적으로 수정되었습니다.',
      });

      // 비밀번호 필드 초기화
      reset({
        displayName: data.displayName,
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('회원정보 수정 실패:', error);

      if (error.code === 'auth/requires-recent-login') {
        openAlertModal({
          title: '보안 알림',
          message: '보안을 위해 다시 로그인해주세요.',
        });
      } else if (error.code === 'auth/weak-password') {
        openAlertModal({
          title: '비밀번호 오류',
          message: '비밀번호는 최소 6자 이상이어야 합니다.',
        });
      } else {
        openAlertModal({
          title: '오류',
          message: '회원정보 수정에 실패했습니다. 다시 시도해주세요.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 이메일 */}
      <div>
        <label className="theme-text-secondary mb-2 block text-sm font-medium" htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          type="email"
          className="theme-border-secondary theme-bg-secondary theme-text-primary w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={user?.email || ''}
          disabled
        />
      </div>

      {/* 이름 */}
      <div>
        <label className="theme-text-secondary mb-2 block text-sm font-medium" htmlFor="name">
          이름
        </label>
        <input
          id="name"
          type="text"
          {...register('displayName', {
            required: '이름을 입력해주세요.',
            minLength: { value: 2, message: '이름은 2자 이상이어야 합니다.' },
          })}
          className="theme-border-secondary theme-bg-secondary theme-text-primary w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="이름을 입력해주세요"
        />
        {errors.displayName && (
          <p className="mt-1 text-sm text-red-500">{errors.displayName.message}</p>
        )}
      </div>

      {!userProfile?.isSnsUser && (
        <>
          {/* 새 비밀번호 */}
          <div>
            <label
              className="theme-text-secondary mb-2 block text-sm font-medium"
              htmlFor="newPassword"
            >
              새 비밀번호
            </label>
            <input
              id="newPassword"
              type="password"
              {...register('newPassword', {
                minLength: { value: 6, message: '비밀번호는 최소 6자 이상이어야 합니다.' },
              })}
              className="theme-border-secondary theme-bg-secondary theme-text-primary w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="새로운 비밀번호를 입력해주세요 (선택사항)"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label
              className="theme-text-secondary mb-2 block text-sm font-medium"
              htmlFor="passwordConfirm"
            >
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              {...register('confirmPassword', {
                validate: value => {
                  if (newPassword && value !== newPassword) {
                    return '비밀번호가 일치하지 않습니다.';
                  }
                  return true;
                },
              })}
              className="theme-border-secondary theme-bg-secondary theme-text-primary w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="새로운 비밀번호를 다시 입력해주세요"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="theme-bg-secondary theme-text-primary w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? '수정 중...' : '수정하기'}
      </button>
    </form>
  );
}
