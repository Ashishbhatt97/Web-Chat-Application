import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "@/firebase/firbase";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ToastPopUp from "@/components/ToastPopUp";
import Loader from "@/components/Loader";
//
const Login = () => {
  const router = useRouter();
  const { isLoading, currentUser } = useAuth();
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const [email, setEmail] = useState("");


  useEffect(() => {
    if (!isLoading && currentUser) {          //It means User Is Logged In Already
      router.push("/");
    }
  }, [isLoading, currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    try {
      await toast.promise(
        signInWithEmailAndPassword(auth, email, password),
        {
          pending: "Loading......",
          success: "Redirecting to HomePage",
          error: "Check Your Email Id and Password",
        },
        {
          autoClose: 5000,
        }
      );
    } catch (error) {
      console.log("Error : Email and Password not Matching");
    }
  };

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
      signInWithPopup(auth, facebookProvider).then(() => console.log("Hello Miya"))
    } catch (error) {
      console.error(error);
    }
  };

  // reseting  Password Using Email Id
  const resetPassword = async () => {
    try {
      await toast.promise(
        sendPasswordResetEmail(auth, email),
        {
          pending: "Reset Link Generating",
          success: "Reset Link Has been Sent to your Email Id",
          error: "Please Enter Valid Email Id",
        },
        {
          autoClose: 5000,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <div className="h-[100vh] bg-slate-950 flex justify-center items-center ">
      <ToastPopUp />
      <div className="flex gap-3 flex-col justify-center">
        <div className="flex text-4xl font-bold justify-center bg-gradient-to-r text-transparent bg-clip-text from-purple-500 to-pink-500">
          Login to Your Account
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

        {/* Form Starting from here */}

        <form
          action="#"
          className="gap-3 flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="flex ">
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="none"
              className="outline-none border-none bg-slate-800 w-full rounded-lg h-[40px] pl-3 "
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex">
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="none"
              className="outline-none bg-slate-800 border-none w-full rounded-lg h-[40px] pl-3"
            />
          </div>

          <div
            onClick={resetPassword}
            className="flex mt-1 justify-end text-sm text-blue-500 cursor-pointer hover:text-green-400"
          >
            forgot your password?
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center h-11 w-full rounded-md"
          >
            Login
          </button>
        </form>
        <div className="flex text-sm justify-center items-center mt-1">
          <span className="text-blue-500">Not have an Account? </span>
          <Link href={"/register"}>
            <h3 className="cursor-pointer "> Register Now!</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
