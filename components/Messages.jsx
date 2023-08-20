import { useChatContext } from "@/context/chatContext";
import { firestore } from "@/firebase/firbase";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Message } from "./Message";
import { useAuth } from "@/context/authContext";
import { DELETE_FOR_ME } from "@/utils/colours";

export const Messages = () => {
  const [Messages, setMessages] = useState([]);
  const { data, setIsTyping } = useChatContext();
  const { currentUser } = useAuth();
  const ref = useRef();

  //
  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
        setIsTyping(doc.data()?.typing?.[data.user.uid] || false);
      }

      setTimeout(() => {
        scrollToBottom();
      }, 0);
    });
    return () => unsub();
  }, [data.chatId]);

  //
  const scrollToBottom = () => {
    const chatContainer = ref.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };
  return (
    <div ref={ref} className="grow  p-5 overflow-auto scrollbar flex flex-col">
      {Messages?.filter((m) => {
        return (
          m?.deletedInfo?.[currentUser.uid] !== DELETE_FOR_ME &&
          !m?.deletedInfo?.deletedForEveryone &&
          !m?.deleteChatInfo?.[currentUser.uid]
        );
      }).map((m) => {
        return <Message message={m} key={m.id} read={m.read} />;
      })}
    </div>
  );
};
