import { useMutation } from 'react-query';
import { http } from './common/http';

// 타입 정의
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

interface ChatResponse {
  message: string;
  error?: string;
}

const postChat = async (data: ChatRequest): Promise<ChatResponse> => {
  //
  const res = await http.post('/api/chat', data);
  if (!res || res.status >= 400) {
    throw new Error(res?.data?.error || '서버 연결에 실패했습니다');
  }

  return res?.data;
};

export const usePostChat = () => {
  return useMutation<ChatResponse, Error, ChatRequest>({ mutationFn: postChat });
};
