import { useAuth } from "@/context/authContext";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { useChatContext } from "@/context/chatContext";
import Image from "next/image";
import ImageViewer from "react-simple-image-viewer";
import { formateDate, wrapEmojisInHtmlTag } from "@/utils/helper";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import Icons from "./Icon";
import { GoChevronDown } from "react-icons/go";
import { MessageMenu } from "./MessageMenu";
import PopDeleteMessage from "./popup/PopDeleteMessage";
import { firestore } from "@/firebase/firbase";
import { DELETE_FOR_EVERYONE, DELETE_FOR_ME } from "@/utils/colours";

export const Message = ({ message }) => {
  const { currentUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const { setEditMsg, users, data, setImageViewer, imageViewer } =
    useChatContext();
  const self = message.sender === currentUser.uid;

  const [showDelete, setShowDelete] = useState(false);
  const timeStamp = new Timestamp(
    message.date?.seconds,
    message.date?.nanoseconds
  );
  const date = timeStamp.toDate();
  const showDeletePopHandler = () => {
    setShowDelete(true);
    setShowMenu(false);
  };

  //  const chatRef = doc(firestore, "chats", chatId);
  // const chatDoc = await getDoc(chatRef);
  const deleteMessage = async (action) => {
    try {
      const msgId = message.id;
      const chatRef = doc(firestore, "chats", data.chatId);
      const chatDoc = await getDoc(chatRef);
      const UpdatedMessage = chatDoc.data().messages.map((message) => {
        if (message.id === msgId) {
          if (action === DELETE_FOR_ME) {
            message.deleltedInfo = {
              [currentUser.uid]: DELETE_FOR_ME,
            };
          }

          if (action === DELETE_FOR_EVERYONE) {
            message.deletedInfo = {
              deletedForEveryone: true,
            };
          }
        }
        return message;
      });

      await updateDoc(chatRef, {
        messages: UpdatedMessage,
      });
      setShowDelete(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`mb-5 max-w-[75%] ${self ? "self-end" : " "}`}>
      {showDelete && (
        <PopDeleteMessage
          deleteMessage={deleteMessage}
          setShowDelete={setShowDelete}
          className="deleteMsgPopUp"
          noHeader={true}
          onHide={() => setShowDelete(false)}
          shortHeight={true}
          self={self}
        />
      )}
      <div
        className={` flex gap-1 ${
          self
            ? " flex-row-reverse items-end justify-start gap-1"
            : " items-end gap-1"
        }`}
      >
        <Avatar
          className="mb-4"
          size="small"
          user={self ? currentUser : users[data.user.uid]}
        />
        <div
          className={`group flex flex-col gap-4 p-4 rounded-3xl relative break-all  ${
            self ? "rounded-br-md bg-c5" : "rounded-bl-md bg-c1"
          }`}
        >
          {message.text && (
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: wrapEmojisInHtmlTag(message.text),
              }}
            ></div>
          )}
          {message.img && (
            <>
              <Image
                src={message.img}
                alt={message?.text || ""}
                width={250}
                height={250}
                onClick={() => {
                  setImageViewer({
                    msgId: message.id,
                    url: message.img,
                  });
                }}
              />

              {imageViewer && imageViewer.msgId === message.id && (
                <ImageViewer
                  src={[imageViewer.url]}
                  currentIndex={0}
                  disableScroll={false}
                  closeOnClickOutside={true}
                  onClose={() => {
                    setImageViewer(null);
                  }}
                />
              )}
            </>
          )}

          <div
            className={`${
              showMenu ? "" : "hidden "
            } group-hover:flex absolute top-2 ${
              self ? "left-2 absolute bg-c5" : "right-2 bg-c1"
            } `}
          >
            <Icons
              size="medium"
              className={"hover:bg-inherit  rounded-none "}
              icon={
                <GoChevronDown
                  size={20}
                  onClick={() => setShowMenu(true)}
                  className="text-c3"
                />
              }
            />
            {showMenu && (
              <MessageMenu
                showDeletePopHandler={showDeletePopHandler}
                self={self}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                setEditMsg={() => setEditMsg(message)}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={` flex items-end ${
          self ? "justify-start gap-2 flex-row-reverse mr-12" : "ml-12"
        }`}
      >
        {message?.read && self  && (
          <img src="/seen.png" alt="" width={18} />
        )}
        <div className="text-xs mt-1 text-c3">{formateDate(date)}</div>
      </div>
    </div>
  );
};
