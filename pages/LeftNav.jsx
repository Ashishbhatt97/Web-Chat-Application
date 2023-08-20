import React, { useState } from "react";
import { BiCheck, BiEdit } from "react-icons/bi";
import { AiFillCheckCircle } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { MdPhotoCamera, MdAddAPhoto, MdDeleteForever } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Avatar from "../components/Avatar";
import Icon from "@/components/Icon";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useAuth } from "../context/authContext";
import { profileColors } from "@/utils/colours";
import { toast } from "react-toastify";
import ToastPopUp from "@/components/ToastPopUp";
import { doc, updateDoc } from "firebase/firestore";
import { firestore, auth, storage } from "@/firebase/firbase";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import UsersPopUp from "@/components/popup/UsersPopUp";

const LeftNav = () => {
  const [editProfile, setEditProfile] = useState(false);
  const [usersPopUp, setUsersPopUp] = useState(false);
  const { currentUser, signOut, setCurrentUser } = useAuth();
  const [nameEdited, setNameEdited] = useState(false);
  const authUser = auth.currentUser;

  const ProfilePicUpload = (file) => {
    
    try {
      if (file) {
        const storageRef = ref(storage, currentUser.displayName);
        const uploadTask = uploadBytesResumable(storageRef, file);
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
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              profileUpdateHandler("addPhoto", downloadURL);
            });
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editProfileExpand = () => {
    return (
      <div className="w-full h-[100vh]">
        <div className="relative flex flex-col justify-between items-center">
          <div className="ml-[300px] flex justify-end items-end ">
            <Icon
              size="large"
              className=" absolute bg-gray-800 hover:bg-green-400"
              icon={<IoClose size={24} />}
              onClick={() => {
                setEditProfile(false);
                setNameEdited(false);
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center rounded-full relative">
          <Avatar
            size="x-large"
            user={currentUser}
            className={`${currentUser}`}
          />
          <div className="h-14 w-14 absolute group flex justify-center border-none items-center ">
            <label htmlFor="photoEdit" className="relative">
              <input
                id="PhotoEdit"
                name="file"
                type="file"
                className="text-center flex items-center justify-center opacity-0 inset-0 absolute"
                onChange={(e) => {
                  const file = e.target.files[0];
                  ProfilePicUpload(file);
                }}
              />
              {currentUser.photoURL ? (
                <MdPhotoCamera
                  size={24}
                  className=" bg-black/[0.5] rounded-full h-full w-full p-3 hidden group-hover:block hover:cursor-pointer"
                />
              ) : (
                <MdAddAPhoto
                  size={24}
                  className=" bg-black/[0.5] rounded-full h-full w-full p-3 hidden group-hover:block hover:cursor-pointer"
                />
              )}
            </label>
          </div>

          {currentUser.photoURL && (
            <MdDeleteForever
              className="text-red-400 absolute rounded-full bg-black mt-10 ml-7 hover:cursor-pointer"
              onClick={() => profileUpdateHandler("removePhoto")}
            />
          )}
        </div>

        <div
          className="text-center mt-2 text-base text-slate-400 outline-none border-none box-content"
          contentEditable={true}
          suppressContentEditableWarning
          onKeyUp={onkeyup}
          onKeyDown={onkeydown}
          id="editDisplayName"
        >
          {currentUser.displayName}
        </div>

        <div className="text-center mt-1 text-[12px] text-c3">
          {currentUser.email}
        </div>
        <div
          className="text-2xl flex justify-center items-center"
          onClick={() =>
            profileUpdateHandler(
              "Name",
              document.getElementById("editDisplayName").innerText
            )
          }
        >
          {nameEdited && <AiFillCheckCircle className="hover:cursor-pointer" />}
        </div>

        {!currentUser.photoURL && (
          <div className="grid grid-cols-5 gap-2 p-5">
            {profileColors.map((color, index) => (
              <span
                key={index}
                className="w-10 h-10 flex justify-center items-center rounded-full hover:cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => profileUpdateHandler("color", color)}
              >
                {color === currentUser.color && (
                  <BiCheck size={36} className="text-white" />
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const profileUpdateHandler = (type, value) => {
    let userObj = { ...currentUser };

    switch (type) {
      case "Name":
        userObj.displayName = value;
        break;
      case "color":
        userObj.color = value;
        break;
      case "addPhoto":
        userObj.photoURL = value;
        break;
      case "removePhoto":
        userObj.photoURL = null;
        break;
      default:
        break;
    }

    try {
      toast.promise(
        async () => {
          const profileDocRef = doc(firestore, "userDetails", currentUser.uid);
          await updateDoc(profileDocRef, userObj);
          setCurrentUser(userObj);

          if (type === "removePhoto") {
            updateProfile(authUser, {
              photoURL: null,
            });
          }
          if (type === "displayName") {
            updateProfile(authUser, {
              displayName: value,
            });
          }
        },
        {
          pending: "Updating.....",
          success: "Profile Updated Successfully...",
          error: "Profile Updation Failed...",
        },
        {
          autoClose: 3000,
        }
      );
    } catch (error) {
      console.error(error);
    }
    setNameEdited(false);
  };

  const onkeyup = (event) => {
    if (currentUser.displayName !== event.target.innerText.trim()) {
      setNameEdited(true);
    } else {
      setNameEdited(false);
    }
  };
  const onkeydown = (event) => {
    if (event.key === "Enter" && event.keyCode === 13) {
      event.preventDefault();
    }
  };

  return (
    <div
      className={` ${
        editProfile ? "w-[350px]" : "w-[80px]"
      } flex flex-col items-center py-5 gap-8 transition-all overflow-hidden`}
    >
      <ToastPopUp />
      {editProfile ? (
        editProfileExpand()
      ) : (
        <div
          className="relative group cursor-pointer flex justify-center  "
          onClick={() => setEditProfile(true)}
        >
          <Avatar size="large" user={currentUser} />
          <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">
            <BiEdit size={14} />
          </div>
        </div>
      )}
      <div
        className={`flex gap-5 ${
          editProfile ? "ml-5" : "mt-[400px] flex-col items-end"
        }`}
      >
        <Icon
          size="xx-large"
          className="
          bg-gray-800
          
          hover:bg-green-400"
          icon={<FiPlus size={24} />}
          onClick={() => {
            setUsersPopUp(!usersPopUp);
          }}
        />
        <Icon
          size="x-large"
          className="bg-gray-800
          hover:bg-green-400"
          icon={<RiLogoutCircleRLine size={24} />}
          onClick={signOut}
        />
      </div>
      {usersPopUp && (
        <UsersPopUp onHide={() => setUsersPopUp(false)} title="Find Users" />
      )}
    </div>
  );
};

export default LeftNav;
