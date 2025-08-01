import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

/**
 * 채팅 목록 가져오기
 * @param uid 사용자 ID
 * @returns 채팅 목록, 로딩 상태
 */
export const useGetList = (uid: string) => {
  const [chatList, setChatList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    if (!uid) {
      setChatList([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'chats'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc'), // 시간순
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log('채팅 목록 없음');
        setChatList([]);
      } else {
        const chats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChatList(chats);
      }
    } catch (error) {
      console.error('채팅 목록 조회 실패:', error);
      setChatList([]);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return { chatList, loading, refetch: fetchChats }; // refetch 함수 반환
};

/**
 * 채팅 상세 페이지에서 메시지 가져오기
 * @param id 채팅 ID
 * @returns 메시지 목록, 로딩 상태
 */
export const useGetChatDetail = (id: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatDetail = async () => {
      if (!id) {
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        // chats/{chatId}/messages 서브컬렉션에서 메시지들 가져오기
        const q = query(collection(db, 'chats', id, 'message'), orderBy('timestamp', 'asc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          console.log('메시지 없음');
          setMessages([]);
        } else {
          const messageList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          // console.log('메시지 목록:', messageList);
          setMessages(messageList);
        }
      } catch (e) {
        console.error('채팅 상세 조회 실패:', e);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatDetail();
  }, [id]);

  return { messages, loading };
};

/**
 * 채팅 메시지 저장 + AI 답변 저장
 * @param id 채팅 ID
 * @returns 메시지 저장 함수
 */
export const useChatMessage = (id: string) => {
  const navigate = useNavigate();

  const { userProfile } = useUserStore();

  const sendMessage = async (content: string) => {
    // 1. 채팅 세션이 없으면 새로 생성
    let chatId = id; // url의 id

    if (!chatId) {
      console.log('chatId 없음');
      const newChatRef = await addDoc(collection(db, 'chats'), {
        title: content.substring(0, 30) + '...',
        uid: userProfile?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      chatId = newChatRef.id;

      // 이벤트 발생(커스텀)
      window.dispatchEvent(new CustomEvent('chatCreated'));
      navigate(`chat/${chatId}`);
    }

    // 2. Firestore에 질문 저장
    const newMessage = {
      role: 'user',
      content,
      timestamp: serverTimestamp(),
    };

    try {
      const newMessageRef = await addDoc(collection(db, 'chats', chatId, 'message'), newMessage);
      console.log('newMessageRef', newMessageRef);
    } catch (e) {
      console.error('메시지 저장 실패:', e);
    }

    // 3. AI에 질문 POST 요청 (Firebase Functions 사용)
    const functions = getFunctions();
    const chatWithOpenAI = httpsCallable(functions, 'chatWithOpenAI');

    const result = await chatWithOpenAI({
      messages: [{ role: 'user', content }],
    });

    const aiContent = (result.data as any).result;

    const newAiMessage = {
      role: 'assistant',
      content: aiContent,
      timestamp: serverTimestamp(),
    };

    // 4. AI 답변 Firestore에 저장
    try {
      const newAiMessageRef = await addDoc(
        collection(db, 'chats', chatId, 'message'),
        newAiMessage,
      );
      console.log('newAiMessageRef', newAiMessageRef);
    } catch (e) {
      console.log('AI 답변 저장 실패:', e);
    }

    // 5. AI 답변 전달
    return {
      role: 'assistant',
      content: aiContent,
      timestamp: new Date(),
    };
  };

  return { sendMessage };
};
