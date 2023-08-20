import React from "react";
import PopupWrapper from "@/components/popup/PopupWrapper";
import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import { RiErrorWarningLine } from "react-icons/ri";
import { DELETE_FOR_EVERYONE, DELETE_FOR_ME } from "@/utils/colours";

const PopDeleteMessage = (props) => {
  const { currentUser } = useAuth();
  const { users, dispatch } = useChatContext();

  return (
    <PopupWrapper {...props}>
      <div className="mt-10 mb-5 ">
        <div className="flex items-center justify-center gap-3 text-base ">
          <RiErrorWarningLine size={24} className="text-red-500" /> Are you sure
          , You want to delete this message ?
        </div>
        <div className="flex gap-3  border-solid mt-6 justify-end pr-7  ">
          {props.self && (
            <button
              className="bg-black border-solid w-full h-10 hover:bg-red-500 transition-all  px-6 rounded-lg "
              onClick={() => props.deleteMessage(DELETE_FOR_ME)}
            >
              Delete for me
            </button>
          )}
          <button
            className="bg-black border-solid h-10 w-full hover:bg-red-500  px-6 rounded-lg"
            onClick={() => props.deleteMessage(DELETE_FOR_EVERYONE)}
          >
            Delete For Everyone
          </button>
          <button
            onClick={props.onHide}
            className="bg-zinc-600 border-solid h-10        px-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default PopDeleteMessage;
