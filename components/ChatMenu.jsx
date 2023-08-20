import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import { firestore } from "@/firebase/firbase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import ClickAwayListener from "react-click-away-listener";
export const ChatMenu = ({ setShowMenu }) => {
  const { currentUser } = useAuth();

  const { users, data, chats, dispatch, setSelectedChat } = useChatContext();

  const isUserBlock = users[currentUser.uid]?.blockedUsers?.find(
    (u) => u === data.user.uid
  );
  const iamBlocked = users[data.user.uid]?.blockedUsers?.find(
    (u) => u === currentUser.uid
  );

  const handleBlock = async (action) => {
    if (action === "block") {
      await updateDoc(doc(firestore, "userDetails", currentUser.uid), {
        blockedUsers: arrayUnion(data.user.uid),
      });
    }

    if (action === "unblock") {
      await updateDoc(doc(firestore, "userDetails", currentUser.uid), {
        blockedUsers: arrayRemove(data.user.uid),
      });
    }
  };

  const handleDeleteChat = async () => {
    try {
      const chatRef = doc(firestore, "chats", data.chatId);
      const chatDoc = await getDoc(chatRef);

      const updateMessages = chatDoc.data().messages.map((message) => {
        message.deleteChatInfo = {
          ...message.deleteChatInfo,
          [currentUser.uid]: true,
        };
        return message;
      });

      await updateDoc(chatRef, {
        messages: updateMessages,
      });

      await updateDoc(doc(firestore, "userChat", currentUser.uid), {
        [data.chatId + ".chatDelete"]: true,
      });

      const chatFiltered = Object.entries(chats || {})
        .filter(([id, chat]) => id !== data.chatId)
        .sort((a, b) => b[1].date - a[1].date);

      if (chatFiltered.length > 0) {
        setSelectedChat(chatFiltered?.[0]?.[1]?.userInfo);
        dispatch({
          type: "CHANGE_USER",
          payload: chatFiltered?.[0]?.[1]?.userInfo,
        });
      } else {
        dispatch({ type: "EMPTY" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setShowMenu(false)}>
      <div className="w-[150px] absolute top-[70px] right-5 bg-c0/[30] z-10 overflow-hidden rounded-md ">
        <ul className="flex flex-col py-2">
          {!iamBlocked && (
            <li
              className="flex flex-col items-center py-3 px-5 hover:bg-black cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleBlock(isUserBlock ? "unblock" : "block");
              }}
            >
              {isUserBlock ? "Unblock" : "Block User"}
            </li>
          )}
          <li
            className="flex flex-col items-center py-3 px-5 hover:bg-black cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteChat();
              setShowMenu(false);
            }}
          >
            Delete Chat
          </li>
        </ul>
      </div>
    </ClickAwayListener>
  );
};
