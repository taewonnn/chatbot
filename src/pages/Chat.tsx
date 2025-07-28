import { FiSend } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useChatMessage, useGetChatDetail } from '../hooks/useChatData';
import { useState } from 'react';
import MarkdownRenderer from '../components/ReactMarkdownRenderer';
import useAutoScroll from '../hooks/useAutoScroll';

export default function Chat() {
  const { id } = useParams(); // URL에서 채팅 ID 가져오기

  /** 질문 입력 내용 저장*/
  const [question, setQuestion] = useState('');
  const [newMessages, setNewMessages] = useState<any[]>([]); // 새로 추가된 메시지
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 채팅 상세 페이지에서만 동작해야함
  const { messages } = useGetChatDetail(id || '');

  // 메시지 전송 훅
  const { sendMessage } = useChatMessage(id || '');

  // 스크롤 훅

  const { messageEndRef } = useAutoScroll([messages.length, newMessages.length]);

  // 질문 버튼 클릭 시
  const handleSend = async () => {
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

    // 새로운 메시지 추가
    setNewMessages(prev => {
      const updated = [...prev, userMessage];

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

  return (
    <div className="flex h-full flex-col">
      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {isExistingChat ? (
          <div className="space-y-6 p-4">
            {[...messages, ...newMessages].map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-200 bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message.role === 'assistant' ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      message.content
                    )}
                  </div>
                  <div
                    className={`mt-2 text-xs ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp?.toDate?.()?.toLocaleString() || '방금 전'}
                  </div>
                </div>
                {/* 스크롤 타겟 */}
                <div ref={messageEndRef} />
              </div>
            ))}

            {/* 로딩 표시 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                    <span className="text-sm">AI가 답변을 생성하고 있습니다...</span>
                  </div>
                </div>
              </div>
            )}
            {/* 스크롤 타겟 */}
            <div ref={messageEndRef} />
          </div>
        ) : (
          // 새 채팅일 때
          <div className="space-y-6 p-4">
            {newMessages.map(message => (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl bg-blue-500 px-4 py-3 text-white">
                  <div className="text-sm leading-relaxed">{message.content}</div>
                  <div className="mt-2 text-xs text-blue-100">
                    {message.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}

            {/* AI 답변 - 로딩 중 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                    <span className="text-sm">AI가 답변을 생성하고 있습니다...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-end gap-3 rounded-2xl border border-gray-300 bg-white p-3 transition-all focus-within:border-blue-500 focus-within:shadow-lg">
            <textarea
              placeholder="메시지를 입력하세요..."
              className="flex-1 resize-none border-none bg-transparent p-2 text-sm leading-relaxed outline-none"
              rows={1}
              style={{ minHeight: '24px', maxHeight: '120px' }}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              disabled={isLoading}
            />
            <button
              className={`rounded-xl p-2 transition-colors ${
                isLoading
                  ? 'cursor-not-allowed bg-gray-300'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              onClick={handleSend}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <FiSend className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">
            AI는 실수를 할 수 있습니다. 중요한 정보는 확인해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
