import { FiSend } from 'react-icons/fi';

export default function Chat() {
  return (
    <div className="flex h-full flex-col">
      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">무엇을 도와드릴까요?</h2>
            <p className="text-gray-500">질문이나 도움이 필요한 내용을 입력해주세요.</p>
          </div>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-end gap-2 rounded-lg border border-gray-300 bg-white p-2 focus-within:border-blue-500">
          <textarea
            placeholder="무엇이든 물어보세요"
            className="flex-1 resize-none border-none bg-transparent p-2 outline-none"
            rows={1}
            style={{ minHeight: '20px', maxHeight: '120px' }}
          />
          <div className="flex items-center gap-1">
            <button className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600">
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
