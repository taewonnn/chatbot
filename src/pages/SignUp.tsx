import { useForm } from 'react-hook-form';

function SignUp() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <label htmlFor="id">아이디</label>
        <input type="text" placeholder="아이디를 입력해주세요." {...register('id')} />
        <label htmlFor="password">비밀번호</label>
        <input type="text" placeholder="비밀번호를 입력해주세요." />
        <label htmlFor="passwordConfirm">비밀번호 확인</label>
        <input type="text" placeholder="비밀번호를 다시 한 번 입력해주세요." />
        <label htmlFor="email">이메일</label>
        <input type="text" placeholder="이메일을 입력해주세요." />
        <label htmlFor="name">이름</label>
        <input type="text" placeholder="이름을 입력해주세요." />
        <label htmlFor="gender">성별</label>
        <select id="gender" {...register('gender')}>
          <option value="male">남자</option>
          <option value="female">여자</option>
        </select>
        <label htmlFor="phone">전화번호</label>
        <input type="text" placeholder="전화번호를 입력해주세요." />
        <div className="flex flex-row gap-2">
          <button>회원가입</button>
          <button>취소</button>
        </div>
      </form>
    </>
  );
}

export default SignUp;
