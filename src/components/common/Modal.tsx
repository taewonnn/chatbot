import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useModalStore } from '../../store/useModalStore';

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="theme-overlay absolute inset-0 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* 모달 컨테이너 */}
      <div className="theme-bg-primary theme-border-primary relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border shadow-xl">
        {/* 헤더 */}
        <div className="theme-border-primary flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <h2 className="theme-text-primary text-lg font-semibold">
              {modalData.title || '알림'}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="theme-text-tertiary hover:theme-text-secondary transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {modalData.message && (
            <p className="theme-text-secondary leading-relaxed">{modalData.message}</p>
          )}

          {/* 추가 컨텐츠 영역 */}
          {modalData.children && <div className="mt-4">{modalData.children}</div>}
        </div>

        {/* 푸터 (버튼들) */}
        <div className="theme-border-primary flex items-center justify-end gap-3 border-t p-6">
          {/* 취소 버튼 (confirm 모달에서만 표시) */}
          {currentModal === 'confirm' && (
            <button
              onClick={handleCancel}
              className="theme-border-secondary theme-bg-secondary theme-text-secondary hover:theme-bg-tertiary rounded-md border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {modalData.cancelText || '취소'}
            </button>
          )}

          {/* 확인/확인 버튼 */}
          <button
            onClick={handleConfirm}
            className="theme-accent theme-accent-hover rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {modalData.confirmText || '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
