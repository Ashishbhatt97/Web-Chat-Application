import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import { firestore, storage } from "@/firebase/firbase";

import {
  Timestamp,
  arrayUnion,
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect } from "react";
import { TbSend } from "react-icons/tb";
import { v4 as uuid } from "uuid";

let typingTimeOut = null;

const ComposeBar = () => {
  const { currentUser } = useAuth();
  const {
    inputText,
    attachment,
    setInputText,
    data,
    setAttachmentPreview,
    setAttachment,
    editMsg,
    setEditMsg,
  } = useChatContext();

  //
  const keyUp = (e) => {
    if (e.key === "Enter" && (inputText || attachment)) {
      editMsg ? handleEdit() : handleSendMessage();
    }
  };

  //
  useEffect(() => {
    setInputText(editMsg?.text || "");
  }, [editMsg]);

  //

  const handleTyping = async (e) => {
    setInputText(e.target.value);
    await updateDoc(doc(firestore, "chats", data.chatId), {
      [`typing.${currentUser.uid}`]: true,
    });

    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
    }

    typingTimeOut = setTimeout(async () => {
      await updateDoc(doc(firestore, "chats", data.chatId), {
        [`typing.${currentUser.uid}`]: false,
      });

      typingTimeOut = null;
    }, 500);
  };

  //Handle Edit
  const handleEdit = async () => {
    const msgId = editMsg.id;

    const chatRef = doc(firestore, "chats", data.chatId);
    const chatDoc = await getDoc(chatRef);

    if (attachment) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, attachment);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            let updatedMessages = chatDoc.data().messages.map((msg) => {
              if (msg.id === msgId) {
                msg.text = inputText;
                msg.image = downloadURL;
              }
              return msg;
            });
            await updateDoc(chatRef, {
              messages: updatedMessages,
            });
          });
        }
      );
    } else {
      let updatedMessages = chatDoc.data().messages.map((msg) => {
        if (msg.id === msgId) {
          msg.text = inputText;
        }
        return msg;
      });
      await updateDoc(chatRef, {
        messages: updatedMessages,
      });
    }

    setAttachment(null);
    setAttachmentPreview(null);
    setInputText("");
    setEditMsg(null);
  };

  //
  const handleSendMessage = async () => {
    if (attachment) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, attachment);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(firestore, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: inputText,
                sender: currentUser.uid,
                date: Timestamp.now(),
                read: false,
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(firestore, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: inputText,
          sender: currentUser.uid,
          date: Timestamp.now(),
          read: false,
        }),
      });
    }

    const message = { text: inputText };
    if (attachment) {
      message.img = true;
    }

    await updateDoc(doc(firestore, "userChat", currentUser.uid), {
      [data.chatId + ".lastMessage"]: message,
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(firestore, "userChat", data.user.uid), {
      [data.chatId + ".lastMessage"]: message,
      [data.chatId + ".date"]: serverTimestamp(),
      [data.chatId + ".chatDelete"]: deleteField(),
    });

    setAttachment(null);
    setAttachmentPreview(null);
    setInputText("");
  };
  return (
    <div className="flex items-center gap-2 grow">
      <input
        type="text"
        onKeyUp={keyUp}
        className="grow w-full outline-0 px-2 py-2 text-white bg-transparent placeholder:text-c3 outline-none text-base"
        onChange={handleTyping}
        placeholder="Type a message"
        value={inputText}
      />

      <button
        className={`rounded-xl h-10 w-10 shrink-0 flex justify-center items-center mr-5  ${
          inputText.trim().length > 0 ? "bg-green-500" : ""
        }`}
        onClick={editMsg ? handleEdit : handleSendMessage}
      >
        <TbSend size={20} />
      </button>
    </div>
  );
};

export default ComposeBar;
