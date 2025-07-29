import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useModalStore } from '../store/ModalStore';

export default function Modal() {
  const { isOpen, currentModal, modalData, closeModal } = useModalStore();

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // 모달 닫힐 때 body 스크롤 복원
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeModal]);

  if (!isOpen || !currentModal || !modalData) return null;

  const handleConfirm = () => {
    if (modalData.onConfirm) {
      modalData.onConfirm();
    }
    closeModal();
  };

  const handleCancel = () => {
    if (modalData.onCancel) {
      modalData.onCancel();
    }
    closeModal();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* 모달 컨테이너 */}
      <div className={`relative mx-4 w-full max-w-md rounded-lg bg-white shadow-xl`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{modalData.title || '알림'}</h2>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {modalData.message && (
            <p className="leading-relaxed text-gray-700">{modalData.message}</p>
          )}

          {/* 추가 컨텐츠 영역 */}
          {modalData.children && <div className="mt-4">{modalData.children}</div>}
        </div>

        {/* 푸터 (버튼들) */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
          {/* 취소 버튼 (confirm 모달에서만 표시) */}
          {currentModal === 'confirm' && (
            <button
              onClick={handleCancel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {modalData.cancelText || '취소'}
            </button>
          )}

          {/* 확인/확인 버튼 */}
          <button
            onClick={handleConfirm}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {modalData.confirmText || '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
