import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';

interface SignInForm {
  email: string;
  password: string;
}

function SignIn() {
  const navigate = useNavigate();

  /**
   * form 상태 관리
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>();

  /**
   * 제출함수
   */
  const onSubmit = async (data: SignInForm) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log('로그인 성공:', userCredential.user);
      navigate('/'); // 홈으로 이동
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        if (e.message.includes('user-not-found')) {
          alert('존재하지 않는 이메일입니다.');
        } else if (e.message.includes('wrong-password')) {
          alert('비밀번호가 일치하지 않습니다.');
        } else {
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">로그인</h1>
          <p className="text-gray-600">계정에 로그인하세요</p>
        </div>

        {/* form */}
        <div className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                type="email"
                id="email"
                placeholder="이메일을 입력해주세요"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                {...register('email', {
                  required: '이메일을 입력해주세요',
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: '올바른 이메일 형식이 아닙니다.',
                  },
                })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                placeholder="비밀번호를 입력해주세요"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="submit"
                className="flex-1 transform rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                로그인
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-col gap-3">
            <button className="flex-1 transform rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              카카오 로그인
            </button>
            <button className="flex-1 transform rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              네이버 로그인
            </button>
            <button className="flex-1 transform rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              구글 로그인
            </button>
          </div>
        </div>

        {/* 회원가입 링크 */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            계정이 없으신가요?{' '}
            <Link
              to="/signup"
              className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
            >
              회원가입하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
