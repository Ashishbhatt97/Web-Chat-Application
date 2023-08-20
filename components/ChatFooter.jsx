import React, { useState } from "react";
import Icons from "./Icon";
import { MdAttachFile } from "react-icons/md";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import ComposeBar from "./ComposeBar";
import EmojiPicker from "emoji-picker-react";
import ClickAwayListener from "react-click-away-listener";
import { useChatContext } from "@/context/chatContext";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

export const ChatFooter = () => {
  const {
    inputText,
    setInputText,
    setAttachment,
    isTyping,
    editMsg,
    data,
    setEditMsg,
    setAttachmentPreview,
    attachmentPreview,
  } = useChatContext();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    console.log(emojiData);
    let text = inputText;
    setInputText((text += emojiData.emoji));
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setAttachment(file);

    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setAttachmentPreview(blobUrl);
    }
  };

  return (
    <div className="flex bg-c1/[0.5] p-2 rounded-xl relative items-center">
      {attachmentPreview && (
        <div className="absolute w-[100px] h-[100px] bottom-16 left-0 bg-c1  p-2 rounded-md">
          <Image alt="pic" height={100} width={100} src={attachmentPreview} />
          <div
            className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute -right-2 -top-2 cursor-pointer text-black font-semibold "
            onClick={() => {
              setAttachment(null);
              setAttachmentPreview(null);
            }}
          >
            X
          </div>
        </div>
      )}

      <div className="shrink-0">
        <input
          type="file"
          onChange={onFileChange}
          id="fileUpload"
          className="hidden"
        />
        <label htmlFor="fileUpload">
          <Icons
            size="large"
            icon={<MdAttachFile size={20} className="text-c3 " />}
          />
        </label>
      </div>

      <div
        className="shrink-0 relative "
        onClick={() => setShowEmojiPicker(true)}
      >
        <Icons
          size="large"
          icon={<HiOutlineEmojiHappy size={24} className="text-c3 " />}
        />
        {showEmojiPicker && (
          <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
            <div className="absolute bottom-12 left-0 shadow-lg">
              <EmojiPicker
                emojiStyle="native"
                theme="light"
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
              />
            </div>
          </ClickAwayListener>
        )}
      </div>

      {isTyping && (
        <div className="absolute -top-6 overflow-hidden left-6 w-1/2 h-6 ">
          <div className="flex gap-1 w-full h-full opacity-50 text-sm text-white ">
            {`${data?.user?.displayName} is typing`}
            <img src="/typing.svg" alt="" />
          </div>
        </div>
      )}

      {editMsg && (
        <div
          onClick={() => setEditMsg(null)}
          className="absolute -translate-x-1/2 bg-c4 flex items-center gap-2 py-2 px-4 pr-2 rounded-full text-sm font-semibold cursor-pointer shadow-lg -top-12 left-1/2"
        >
          <span>Cancel Edit</span>
          <IoClose size={20} className="text-white" />
        </div>
      )}
      <ComposeBar />
    </div>
  );
};
