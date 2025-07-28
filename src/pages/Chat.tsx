import { FiSend } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useChatMessage, useGetChatDetail } from '../hooks/useChatData';
import { useState } from 'react';

export default function Chat() {
  const { id } = useParams(); // URL에서 채팅 ID 가져오기

  /** 질문 입력 내용 저장*/
  const [question, setQuestion] = useState('');
  const [newMessages, setNewMessages] = useState<any[]>([]); // 새로 추가된 메시지
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 메시지 전송 훅
  const { sendMessage } = useChatMessage(id || '');

  // 질문 버튼 클릭 시
  const handleSend = async () => {
    console.log('=== handleSend 시작 ===');
    console.log('현재 messages:', messages);
    console.log('현재 newMessages:', newMessages);

    if (question.trim() === '') {
      alert('질문을 입력해주세요.');
      return;
    }

    // 1. UI에 즉시 표시
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    // 입력창 클리어
    setQuestion('');
    setNewMessages(prev => {
      console.log('setNewMessages 실행, prev:', prev);
      const updated = [...prev, userMessage];
      console.log('업데이트된 newMessages:', updated);
      return updated;
    });

    // 로딩 시작
    setIsLoading(true);

    try {
      const aiMessage = await sendMessage(question);

      // 3. AI 답변도 UI에 표시
      setNewMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          ...aiMessage,
        },
      ]);
    } catch (e) {
      console.log('채팅 전송 실패:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // id가 있을 때만 메시지 표시
  const isExistingChat = !!id;

  // 채팅 상세 페이지에서만 동작해야함
  const { messages } = useGetChatDetail(id || '');
  // console.log('messages', messages);

  return (
    <div className="flex h-full flex-col">
      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto bg-white">
        {isExistingChat ? (
          // 기존 채팅 메시지들 + 새로 추가된 메시지들
          <div>
            {[...messages, ...newMessages].map(message => {
              const messageTime = message?.timestamp?.toDate
                ? message.timestamp.toDate()
                : new Date();

              return message.role == 'assistant' ? (
                <div key={message.id} className="">
                  <strong>{message.role}:</strong> {message.content}
                  <span className="text-xs text-gray-500">{messageTime.toLocaleString()}</span>
                </div>
              ) : (
                <div key={message.id} className="rounded-xl border border-gray-200 bg-gray-100 p-2">
                  <strong>{message.role}:</strong> {message.content}
                  <span className="text-xs text-gray-500">{messageTime.toLocaleString()}</span>
                </div>
              );
            })}

            {/* 로딩 표시 - 여기에 추가 */}
            {isLoading && (
              <div className="flex items-center gap-2 p-4 text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
                <span>AI가 답변을 생성하고 있습니다 잠시만 기다려주세요!</span>
              </div>
            )}
          </div>
        ) : (
          // 새 채팅일 때는 새로 입력한 메시지만 표시
          <div>
            {newMessages.map(message => (
              <div key={message.id} className="rounded-lg bg-gray-100 p-2">
                <strong>{message.role}:</strong> {message.content}
                <span className="text-xs text-gray-500">{message.timestamp.toLocaleString()}</span>
              </div>
            ))}

            {/* 로딩 표시 - 여기에도 추가 */}
            {isLoading && (
              <div className="flex items-center gap-2 p-4 text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
                <span>AI가 답변을 생성하고 있습니다...</span>
              </div>
            )}
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
