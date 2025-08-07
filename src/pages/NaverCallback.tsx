import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

export default function NaverCallback() {
  const navigate = useNavigate();
  console.log(navigate);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoadingSpinner size="xl" color="blue" centered={true} text="로그인 처리 중..." />
    </div>
  );
}
