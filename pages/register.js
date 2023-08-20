import Link from "next/link";
import React, { useEffect } from "react";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, firestore } from "@/firebase/firbase";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { profileColors } from "@/utils/colours";
import Loader from "@/components/Loader";


const Regsiter = () => {
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && !isLoading) {
      router.push("/");
    }
  }, [currentUser, isLoading, router]);

  //Sign In Using Google
  const signInWithGoogle = () => {
    try {
      signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error(error);
    }
  };

  //Sign In Using Facebook
  const signInWithFacebook = () => {
    try {
      signInWithPopup(auth, facebookProvider)
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target.elements.displayName.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const colourIndex = Math.floor(Math.random() * profileColors.length);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "userDetails", user.uid), {
        uid: user.uid,
        displayName,
        email,
        color: profileColors[colourIndex],
      });

      await setDoc(doc(firestore, "userChat", user.uid), {});

      updateProfile(user, {
        displayName,
      });
      console.log(user);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <div className="h-[100vh] bg-slate-950 flex justify-center items-center ">
      <div className="flex gap-3 flex-col justify-center">
        <div className="flex text-4xl font-bold justify-center bg-gradient-to-r text-transparent bg-clip-text from-purple-500 to-pink-500">
          Register Yourself
        </div>
        <div className="flex text-sm items-center justify-center font-normal text-blue-600 ">
          Chat with Anyone ,Anytime and Anywhere
        </div>

        <div className="flex justify-between mt-4 p-2n gap-6 ">
          <div
            onClick={signInWithGoogle}
            className="border-purple-700 hover:scale-[1.1] hover:transition-all duration-500 ease hover:border-orange-700 rounded-md border cursor-pointer"
          >
            <div className="flex items-center gap-2 justify-center p-[1px] h-[50px] w-[200px]">
              <IoLogoGoogle />
              <span>Login Via Google</span>
            </div>
          </div>
          <div
            onClick={signInWithFacebook}
            className="border-purple-700 hover:scale-[1.1] hover:transition-all duration-500 ease hover:border-orange-700 rounded-md border cursor-pointer"
          >
            <div className="flex gap-2 items-center justify-center p-[1px] h-[50px] w-[230px]">
              <IoLogoFacebook />
              <span>Login Via Facebook</span>
            </div>
          </div>
        </div>

        {/* OR  */}

        <div className="flex justify-center items-center gap-1 text-c3">
          <span className="w-5 bg-c3 h-[1px]"></span>
          <span className="font-semibold">OR</span>
          <span className="w-5 bg-c3 h-[1px]"></span>
        </div>
        <form
          action="#"
          method="GET"
          className="gap-3 flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="flex">
            <input
              type="text"
              placeholder="Display Name"
              autoComplete="none"
              name="displayName"
              className="outline-none border-none bg-slate-800 w-full rounded-lg h-[40px] pl-3 "
            />
          </div>

          <div className="flex ">
            <input
              type="email"
              placeholder="Email"
              autoComplete="none"
              name="email"
              className="outline-none border-none bg-slate-800 w-full rounded-lg h-[40px] pl-3 "
            />
          </div>

          <div className="flex">
            <input
              type="password"
              placeholder="Password"
              autoComplete="none"
              name="password"
              className="outline-none bg-slate-800 border-none w-full rounded-lg h-[40px] pl-3 "
            />
          </div>

          <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center h-11 w-full mt-4 rounded-md">
            Create Your Account
          </button>
        </form>
        <div className="flex text-sm justify-center items-center mt-1">
          <span className="text-blue-500"> Already have an Account?</span>
          <Link href={"/login"}>
            <h3 className="cursor-pointer ">Login Now!</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Regsiter;
