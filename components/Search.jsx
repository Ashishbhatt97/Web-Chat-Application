import { firestore } from "@/firebase/firbase";
import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import Avatar from "./Avatar";
import { useChatContext } from "@/context/chatContext";
import { useAuth } from "@/context/authContext";

export const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useAuth();
  const { dispatch } = useChatContext();

  const onkeyp = async (e) => {
    if (e.code === "Enter" && !!username) {
      try {
        setErr(false);
        const userRef = collection(firestore, "userDetails");
        const q = query(userRef, where("displayName", "==", username));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setErr(true);
          setUser(null);
        } else {
          querySnapshot.forEach((doc) => {
            setUser(doc.data());
          });
        }
      } catch (error) {
        console.log(error);
        setErr(error);
      }
    }
  };

  const handleSelect = async () => {
    try {
      const combinedId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;

      const res = await getDoc(doc(firestore, "chats", combinedId));

      if (!res.exists()) {
        //document doesn't Exists
        await setDoc(doc(firestore, "chats", combinedId), {
          messages: [],
        });

        const currentUserChatRef = await getDoc(
          doc(firestore, "userChat", currentUser.uid)
        );

        const userChatRef = await getDoc(doc(firestore, "userChat", user.uid));

        if (!currentUserChatRef.exists()) {
          await setDoc(doc(firestore, "userChat", currentUser.uid), {});
        }

        await updateDoc(doc(firestore, "userChat", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            color: user.color,
            photoURL: user.photoURL || null,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        if (!userChatRef.exists()) {
          await setDoc(doc(firestore, "userChat", user.uid), {});
        }
        await updateDoc(doc(firestore, "userChat", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            color: currentUser.color,
            photoURL: currentUser.photoURL || null,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(firestore, "userChat", currentUser.uid), {
          [combinedId + ".chatDelete"]: deleteField(),
        });
      }
      setUser(null);
      setUsername("");

      dispatch({ type: "CHANGE_USER", payload: user });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="shrink-0">
      <div className="relative">
        <RiSearch2Line className="absolute top-4 left-4 text-c3" />
        <input
          type="text"
          value={username}
          autoFocus
          onKeyUp={onkeyp}
          placeholder="Search User"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="w-full h-12 rounded-xl bg-c1/[0.5] pl-11 pr-16 placeholder:text-c3 outline-none text-base"
        />

        <span className="absolute top-[14px] right-4 text-sm text-c3 ">
          Enter
        </span>
      </div>

      {err && (
        <>
          <div className="mt-5 w-full text-center text-sm">User Not Found</div>
          <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
        </>
      )}

      {user && (
        <>
          <div
            key={user.uid}
            className="flex items-center mt-5 gap-4 rounded-xl hover:bg-blue-400 py-2 px-4 cursor-pointer"
            onClick={handleSelect}
          >
            <Avatar size="large" user={user} />
            <div className="flex flex-col gap-1 grow">
              <span className="text-base text-white flex items-center justify-start">
                <div className="font-medium">{user.displayName}</div>
              </span>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
        </>
      )}
    </div>
  );
};
