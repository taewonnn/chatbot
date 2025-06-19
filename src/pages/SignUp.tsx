import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';

interface SignUpForm {
  id: string;
  password: string;
  passwordConfirm: string;
  email: string;
  name: string;
  gender: string;
  phone: string;
}

function SignUp() {
  const navigate = useNavigate();

  /**
   * form 상태 관리
   */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>();

  const password = watch('password'); // 비밀번호 / 비밀번호 확인 일치 여부 확인

  /**
   * 제출함수
   */
  const onSubmit = async (data: SignUpForm) => {
    // 제출 data 확인
    // console.log(data);

    // firebase 저장
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    console.log(userCredential.user);

    // 페이지 이동
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">회원가입</h1>
          <p className="text-gray-600">새로운 계정을 만들어보세요</p>
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
                  // minLength: { value: 6, message: '비밀번호는 최소 6자 이상이어야 합니다.' },
                  // maxLength: { value: 12, message: '비밀번호는 최대 20자 이하이어야 합니다.' },
                  // pattern: {
                  //   value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/,
                  //   message: '영문, 숫자, 특수문자를 모두 포함해야 합니다.',
                  // },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label
                htmlFor="passwordConfirm"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                id="passwordConfirm"
                placeholder="비밀번호를 다시 한 번 입력해주세요"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                {...register('passwordConfirm', {
                  required: '비밀번호를 다시 한 번 입력해주세요.',
                  validate: value => value === password || '비밀번호가 일치하지 않습니다.',
                })}
              />
              {errors.passwordConfirm && (
                <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm.message}</p>
              )}
            </div>

            {/* 이름 */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                type="text"
                id="name"
                placeholder="이름을 입력해주세요"
                {...register('name', {
                  required: '이름을 입력해주세요.',
                  minLength: {
                    value: 2,
                    message: '이름은 2자 이상이어야 합니다.',
                  },
                  maxLength: {
                    value: 10,
                    message: '이름은 10자 이하여야 합니다.',
                  },
                  pattern: {
                    value: /^[가-힣a-zA-Z]+$/,
                    message: '이름은 한글 또는 영문만 입력 가능합니다.',
                  },
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* 성별 */}
            <div>
              <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">
                성별
              </label>
              <div className="flex gap-4">
                <label htmlFor="flex cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500">
                  <input
                    type="radio"
                    id="gender"
                    value="male"
                    {...register('gender', { required: '성별을 선택해주세요.' })}
                  />
                  남자
                </label>
                <label htmlFor="flex cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500">
                  <input
                    type="radio"
                    id="gender"
                    value="female"
                    {...register('gender', { required: '성별을 선택해주세요.' })}
                  />
                  여자
                </label>
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                전화번호
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="전화번호를 입력해주세요"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                {...register('phone', {
                  required: '전화번호를 입력해주세요.',
                  pattern: {
                    value: /^01[016789]-?\d{3,4}-?\d{4}$/,
                    message: '올바른 휴대폰 번호 형식이 아닙니다.',
                  },
                })}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            {/* 버튼 */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="submit"
                className="flex-1 transform rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                회원가입
              </button>
              <button
                type="button"
                className="flex-1 transform rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-800 transition-all duration-200 hover:scale-105 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                취소
              </button>
            </div>
          </form>
        </div>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/signin"
              className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
