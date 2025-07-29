import { create } from 'zustand';

// 모달 종류
export type ModalType = 'settings' | 'help' | 'confirm' | 'alert' | 'chat' | 'profile';

// 모달 데이터 인터페이스
interface ModalData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  [key: string]: any;
}

interface ModalStore {
  currentModal: ModalType | null; // 현재 열린 모달 타입
  isOpen: boolean; // 모달 열림/닫힘 여부
  modalData: ModalData | null; // 모달 내부 데이터
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  setModalData: (data: ModalData) => void; // 모달 내부 데이터 설정
  openConfirmModal: (data: ModalData) => void;
  openAlertModal: (data: ModalData) => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  currentModal: null,
  isOpen: false,
  modalData: null,

  openModal: (type: ModalType, data?: ModalData) => {
    set({
      currentModal: type,
      isOpen: true,
      modalData: data || null,
    });
  },

  closeModal: () => {
    set({
      currentModal: null,
      isOpen: false,
      modalData: null,
    });
  },

  setModalData: (data: ModalData) => {
    set({ modalData: data });
  },

  // 확인 모달 편의 함수
  openConfirmModal: (data: ModalData) => {
    const defaultData: ModalData = {
      title: '확인',
      message: '정말로 진행하시겠습니까?',
      confirmText: '확인',
      cancelText: '취소',
      ...data, // data 별도 전달 시 덮어쓰기
    };
    get().openModal('confirm', defaultData);
  },

  // 알림 모달 편의 함수
  openAlertModal: (data: ModalData) => {
    const defaultData: ModalData = {
      title: '알림',
      message: '메시지가 없습니다.',
      confirmText: '확인',
      ...data, // data 별도 전달 시 덮어쓰기
    };
    get().openModal('alert', defaultData);
  },
}));
