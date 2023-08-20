/* eslint-disable react-hooks/exhaustive-deps */
import { useChatContext } from "@/context/chatContext";
import { firestore } from "@/firebase/firbase";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import Avatar from "./Avatar";
import { useAuth } from "@/context/authContext";
import { formateDate } from "@/utils/helper";
import { BiImageAlt } from "react-icons/bi";

const Chats = () => {
  const {
    dispatch,
    users,
    setUsers,
    selectedChat,
    setSelectedChat,
    data,
    chats,
    setChatGotSelected,
    setChats,
    resetFooterState,
  } = useChatContext();
  const [search, setSearch] = useState("");
  const [unreadMsgs, setUnreadMsgs] = useState("");
  const { currentUser } = useAuth();
  const isBlockExecutedRef = useRef(false);
  const isUserFetchedRef = useRef(false);

  useEffect(() => {
    onSnapshot(collection(firestore, "userDetails"), (snapshot) => {
      const UpdatedUser = {};
      snapshot.forEach((doc) => {
        UpdatedUser[doc.id] = doc.data();
      });
      setUsers(UpdatedUser);

      if (!isBlockExecutedRef.current) {
        isUserFetchedRef.current = true;
      }
    });
  }, []);

  useEffect(() => {
    resetFooterState();
  }, [data?.chatId]);

  useEffect(() => {
    const documentIds = Object.keys(chats);
    if (documentIds.length === 0) return;
    const q = query(
      collection(firestore, "chats"),
      where("__name__", "in", documentIds)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      let msgs = {};

      snapshot.forEach((doc) => {
        if (doc.id !== data.chatId) {
          msgs[doc.id] = doc
            .data()
            ?.messages?.filter(
              (m) => m?.read === false && m?.sender !== currentUser.uid
            );
        }

        Object.keys(msgs || {}).map((c) => {
          if (msgs[c]?.length < 1) {
            delete msgs[c];
          }
        });
      });
      setUnreadMsgs(msgs);
    });

    return () => unsub();
  }, [chats, selectedChat]);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(firestore, "userChat", currentUser.uid),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setChats(data);
            if (
              !isBlockExecutedRef.current &&
              isUserFetchedRef.current &&
              users
            ) {
              const firstChat = Object.values(data)
                .filter((chat) => !chat.hasOwnProperty("chatDelete"))
                .sort((a, b) => b.date - a.date)[0];

              if (firstChat) {
                const user = users[firstChat?.userInfo?.uid];
                handleSelect(user);

                if (user) {
                  const chatId =
                    currentUser.uid > user.uid
                      ? currentUser.uid + user.uid
                      : user.uid + currentUser.uid;
                  readChat(chatId);
                }
              }
              isBlockExecutedRef.current = true;
            }
          }
        }
      );
    };
    currentUser.uid && getChats();
  }, [isBlockExecutedRef.current, users]);

  const filteredChats = Object.entries(chats || {})
    .filter(([, chat]) => !chat.hasOwnProperty("chatDelete"))
    .filter(
      ([, chat]) =>
        chat.userInfo?.displayName
          ?.toLowerCase()
          .includes(search.toLocaleLowerCase()) ||
        chat.lastMessage?.text
          ?.toLowerCase()
          ?.includes(search.toLocaleLowerCase())
    )
    .sort((a, b) => b[1].date - a[1].date);

  const readChat = async (chatId) => {
    const chatRef = doc(firestore, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    const updatedMessages = chatDoc.data()?.messages?.map((m) => {
      if (m?.read === false) {
        m.read = true;
      }
      return m;
    });

    await updateDoc(chatRef, {
      messages: updatedMessages,
    });
  };

  const handleSelect = (user, selectedChatId) => {
    setSelectedChat(user);
    setChatGotSelected(false);
    dispatch({ type: "CHANGE_USER", payload: user });

    if (unreadMsgs?.[selectedChatId]?.length > 0) {
      readChat(selectedChatId);
    }
  };

  return (
    <div className="flex flex-col  h-full">
      <div className="shrink-0 sticky -top-[20px] z-10 flex justify-center items-center w-full py-5">
        <RiSearch2Line className="absolute top-8.5 left-11 text-c3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Username"
          className="w-[300px] h-[50px] rounded-xl bg-c1/[0.5] pl-11 pr-5 placeholder:text-c3 outline-none text-base "
        />
      </div>
      <ul className="flex flex-col w-full my-5 gap-[2px]">
        {Object.keys(users || {}).length > 0 &&
          filteredChats?.map((chat) => {
            const timeStamp = new Timestamp(
              chat[1].date?.seconds,
              chat[1].date?.nanoseconds
            );
            const date = timeStamp.toDate();
            const user = users[chat[1].userInfo.uid];
            return (
              <li
                key={chat[0]}
                onClick={() => handleSelect(user, chat[0])}
                className={`h-[90px] flex items-center gap-4 rounded-3xl p-3 cursor-pointer hover:bg-c1  ${
                  selectedChat?.uid === user?.uid ? "bg-c1" : "bg-zinc-700"
                }`}
              >
                <Avatar size={"large"} user={user} />
                <div className="flex gap-1 grow relative flex-col">
                  <span className="text-base text-white flex items-center justify-between">
                    <div className="font-small">{user?.displayName}</div>
                    <div className="text-c3 text-xs">{formateDate(date)}</div>
                  </span>

                  <div className="flex gap-1 items-center">
                    {chat[1].lastMessage?.img && (
                      <BiImageAlt size={20} className="text-c3" />
                    )}
                    <p className="text-sm text-c3 line-clamp-1 break-all pr-10">
                      {chat[1].lastMessage?.text ||
                        (chat[1].lastMessage?.img && "image") ||
                        "Send first Message"}
                    </p>
                  </div>
                  {!!unreadMsgs?.[chat[0]]?.length && (
                    <span className="absolute h-[20px] rounded-full justify-center items-center flex right-0 top-7 min-w-[20px] bg-red-500 text-xs ">
                      {unreadMsgs?.[chat[0]]?.length}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Chats;
