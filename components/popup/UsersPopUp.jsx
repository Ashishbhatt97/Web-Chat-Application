import React from "react";
import PopupWrapper from "@/components/popup/PopupWrapper";
import { useAuth } from "@/context/authContext";
import Avatar from "../Avatar";
import { useChatContext } from "@/context/chatContext";
import {
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase/firbase";
import { Search } from "../Search";

const UsersPopUp = (props) => {
  const { currentUser } = useAuth();
  const { users, dispatch } = useChatContext();

  const handleSelect = async (user) => {
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

      dispatch({ type: "CHANGE_USER", payload: user });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <PopupWrapper {...props}>
      <Search />
      <div className="flex mt-5 flex-col grow relative scrollbar overflow-auto gap-2">
        <div className="absolute w-full">
          {users &&
            Object.values(users)
              .filter((user) => {
                return user.uid !== currentUser.uid;
              })
              ?.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center gap-4 rounded-xl hover:bg-blue-400 py-2 px-4 cursor-pointer"
                  onClick={() => {
                    handleSelect(user);
                  }}
                >
                  <Avatar size="large" user={user} />
                  <div className="flex flex-col gap-1 grow">
                    <span className="text-base text-white flex items-center justify-start">
                      <div className="font-medium">{user.displayName}</div>
                    </span>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </PopupWrapper>
  );
};

export default UsersPopUp;
