import { useState, useEffect } from 'react';
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

/**
 * 채팅 목록 가져오기
 * @param uid 사용자 ID
 * @returns 채팅 목록, 로딩 상태
 */
export const useGetList = (uid: string) => {
  const [chatList, setChatList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!uid) {
        setChatList([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'chats'), where('uid', '==', uid));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          console.log('채팅 목록 없음');
          setChatList([]);
        } else {
          const chats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          // console.log('chatList', chats);

          setChatList(chats);
        }
      } catch (error) {
        console.error('채팅 목록 조회 실패:', error);
        setChatList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [uid]);

  return { chatList, loading };
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

export const useChatMessage = (id: string) => {
  const sendMessage = async (content: string) => {
    // 2. Firestore에 질문 저장
    const newMessage = {
      role: 'user',
      content,
      timestamp: serverTimestamp(),
    };

    try {
      const newMessageRef = await addDoc(collection(db, 'chats', id, 'message'), newMessage);
      console.log('newMessageRef', newMessageRef);
    } catch (e) {
      console.error('메시지 저장 실패:', e);
    }
    // 3. AI에 질문 POST
    // 4. AI 답변 Firestore에 저장
  };

  return { sendMessage };
};
