import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

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
