import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import useAuth from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useModalStore } from '../store/useModalStore';

export default function DetailSettings() {
  const { user, userProfile } = useAuth();
  const { openAlertModal } = useModalStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      nickname: '',
      features: '',
    },
  });

  /** 초기값 셋팅 */
  useEffect(() => {
    if (userProfile?.aiSettings) {
      setValue('nickname', userProfile.aiSettings?.nickname);
      setValue('features', userProfile.aiSettings?.features);
    }
  }, [userProfile]);

  const onSubmit = async (data: any) => {
    if (isSubmitting) return; // 중복 제출 방지
    setIsSubmitting(true);

    // console
    console.log('data', data);

    try {
      const userDocRef = doc(db, 'users', user?.uid || '');
      await updateDoc(userDocRef, {
        aiSettings: {
          nickname: data.nickname,
          features: data.features,
        },
      });

      // 성공 알럿
      openAlertModal({
        title: '성공',
        message: '성공적으로 저장되었습니다.',
      });
    } catch (error) {
      console.log('error', error);

      // 실패 알럿
      openAlertModal({
        title: '실패',
        message: '저장에 실패했습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <form action="" className="flex flex-col gap-2">
        <label htmlFor="nickname" className="theme-text-secondary block text-sm font-medium">
          어떻게 불러드리면 좋을까요?
        </label>
        <input
          type="text"
          id="nickname"
          className="theme-border-secondary theme-bg-secondary theme-text-primary w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="닉네임을 적어주세요."
          {...register('nickname')}
        />
        <label htmlFor="features" className="theme-text-secondary block text-sm font-medium">
          어떤 특성을 지녔으면 하나요?
        </label>
        <textarea
          id="features"
          className="theme-border-secondary theme-bg-secondary theme-text-primary h-[10rem] w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="특성을 적어주세요."
          {...register('features')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="theme-bg-secondary theme-text-primary w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          저장하기
        </button>
      </form>
    </div>
  );
}
