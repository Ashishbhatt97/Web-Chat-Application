/* eslint-disable react-hooks/rules-of-hooks */

import NavLeft from "@/pages/LeftNav";
import React, { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import Chats from "@/components/Chats";
import Chat from "@/components/Chat";
import { useChatContext } from "@/context/chatContext";
import Image from "next/image";

const index = () => {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();
  const { data, selectedChats, chatGotSelected, } = useChatContext();
  useEffect(() => {
    if (!isLoading && !currentUser) {
      //It means User Is Logged In Already
      router.push("/login");
    }
  }, [isLoading, currentUser, router]);

  return !currentUser ? (
    <Loader />
  ) : (
    <div className="bg-c1 flex h-[100vh]  ">
      <NavLeft />
      <div className="flex bg-black grow border-none">
        <div className="w-[400px] p-5 overflow-auto  scrollbar  shrink-0">
          <div className="flex flex-col  h-full">
            <Chats />
          </div>
        </div>
        {data.user && <Chat />}
      </div>
    </div>
  );
};

export default index;
