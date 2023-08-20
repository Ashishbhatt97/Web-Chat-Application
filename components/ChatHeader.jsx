import { useChatContext } from "@/context/chatContext";
import React, { useState } from "react";
import Avatar from "./Avatar";
import Icons from "./Icon";
import { IoClose, IoEllipsisVerticalCircleSharp } from "react-icons/io5";
import { ChatMenu } from "./ChatMenu";

export const ChatHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { users, data } = useChatContext();
  const online = users[data.user?.uid]?.isOnline;
  const user = users[data.user?.uid];

  return (
    <div className="flex justify-between items-center pb-5 border-b border-white/[0.05]">
      {user && (
        <div className="flex items-center gap-3 ">
          {" "}
          <Avatar size="large" user={user} />
          <div className="flex flex-col pl-2 justify-center">
            <div className="font-medium ">{user?.displayName}</div>
            <p className="text-xs text-white/[0.5] mt-1">
              {online ? "online" : "offline"}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 ">

        <Icons
          size="large"
          className={`${showMenu ? "bg-c1" : ""}`}
          onClick={() => {
            setShowMenu(true);
          }}
          icon={
            <IoEllipsisVerticalCircleSharp
              size={35}
              className="text-zinc-500"
            />
          }
        />

        {showMenu && <ChatMenu setShowMenu={setShowMenu} showMenu={showMenu} />}
      </div>
    </div>
  );
};
