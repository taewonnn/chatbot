import { FirebaseError } from 'firebase/app';

export const handleLoginError = (error: unknown): string => {
  if (error instanceof Error) {
    // 커스텀 에러
    if (error.message === '존재하지 않는 이메일입니다.') {
      return '존재하지 않는 이메일입니다.';
    }
    if (error.message === 'SNS 계정입니다. SNS 로그인을 이용해주세요.') {
      return 'SNS 계정입니다. SNS 로그인을 이용해주세요.';
    }

    // Firebase 에러
    const firebaseError = error as FirebaseError;
    if (firebaseError.code === 'auth/user-not-found') {
      return '존재하지 않는 이메일입니다.';
    }
    if (firebaseError.code === 'auth/invalid-credential') {
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    }
  }

  return '로그인에 실패했습니다. 다시 시도해주세요.';
};
