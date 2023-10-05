import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBLfc5LzXmSKGty7CIlNRrk5vpXgmceLew",
  authDomain: "chatting-e3f82.firebaseapp.com",
  databaseURL: "https://chatting-e3f82-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatting-e3f82",
  storageBucket: "chatting-e3f82.appspot.com",
  messagingSenderId: "246432720523",
  appId: "1:246432720523:web:098781dbbd56655cec568e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);


