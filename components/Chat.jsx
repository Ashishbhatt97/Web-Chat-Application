import React, { useContext } from "react";
import { ChatHeader } from "./ChatHeader";
import { Messages } from "./Messages";
import { useChatContext } from "@/context/chatContext";
import { ChatFooter } from "./ChatFooter";
import { useAuth } from "@/context/authContext";

const Chat = () => {
  const { data, users, selectedChat } = useChatContext();
  const { currentUser } = useAuth();

  const isUserBlock = users[currentUser.uid]?.blockedUsers?.find(
    (u) => u === data.user.uid
  );
  const iamBlocked = users[data.user?.uid]?.blockedUsers?.find(
    (u) => u === currentUser.uid
  );

  return (
    <div className="w-full bg-zinc-900 border-l-2 border-white/40 flex flex-col grow p-5">
      <ChatHeader />
      {data.chatId && <Messages />}
      {!isUserBlock && !iamBlocked && <ChatFooter />}

      {iamBlocked && (
        <div className="w-full text-center text-c3 py-5">
          {`${data.user.displayName} has blocked you`}
        </div>
      )}

      {isUserBlock && (
        <div className="w-full text-center text-c3 py-5">
          This User has been Blocked
        </div>
      )}
    </div>
  );
};

export default Chat;
