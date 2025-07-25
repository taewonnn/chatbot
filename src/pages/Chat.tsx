import { FiSend } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useGetChatDetail } from '../hooks/useChatData';
import { useState } from 'react';

export default function Chat() {
  const { id } = useParams(); // URL에서 채팅 ID 가져오기

  /** 질문 입력 내용 저장*/
  const [question, setQuestion] = useState('');

  // 질문 버튼 클릭 시
  const handleSend = () => {
    if (question.trim() === '') {
      alert('질문을 입력해주세요.');
      return;
    }

    setQuestion('');
    // @todo AI에 질문 API + firestore에 저장 로직(커스텀훅)
  };

  // id가 있을 때만 메시지 표시
  const isExistingChat = !!id;

  // 채팅 상세 페이지에서만 동작해야함
  const { messages } = useGetChatDetail(id || '');
  console.log('messages', messages);

  return (
    <div className="flex h-full flex-col">
      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto bg-white">
        {isExistingChat ? (
          // 기존 채팅 메시지들 표시
          <div>
            {messages.map(message =>
              message.role === 'assistant' ? (
                <div key={message.id} className="">
                  <strong>{message.role}:</strong> {message.content}
                </div>
              ) : (
                <div key={message.id} className="rounded-lg bg-gray-100 p-2">
                  <strong>{message.role}:</strong> {message.content}
                </div>
              ),
            )}
          </div>
        ) : (
          // 새 채팅 안내 메시지
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-semibold text-gray-700">무엇을 도와드릴까요?</h2>
              <p className="text-gray-500">질문이나 도움이 필요한 내용을 입력해주세요.</p>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-end gap-2 rounded-lg border border-gray-300 bg-white p-2 focus-within:border-blue-500">
          <textarea
            placeholder="무엇이든 물어보세요"
            className="flex-1 resize-none border-none bg-transparent p-2 outline-none"
            rows={1}
            style={{ minHeight: '20px', maxHeight: '120px' }}
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />
          <div className="flex items-center gap-1">
            <button
              className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
              onClick={handleSend}
            >
              <FiSend className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          실수를 할 수 있습니다. 중요한 정보는 확인해주세요.
        </p>
      </div>
    </div>
  );
}
