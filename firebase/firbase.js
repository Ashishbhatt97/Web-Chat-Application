// import { initializeApp } from "firebase/app";
// import {getAuth} from "firebase/auth"
// import {getStorage} from "firebase/storage"
// import {getFirestore} from "firebase/firestore"

// const firebaseConfig = {
//   apiKey: "AIzaSyC_DI1CWRfTE1WhFmVc_ewe-M0j8M0ol4A",
//   authDomain: "book-b3a6f.firebaseapp.com",
//   projectId: "book-b3a6f",
//   storageBucket: "book-b3a6f.appspot.com",
//   messagingSenderId: "691860095734",
//   appId: "1:691860095734:web:6dd477346b1234dac1e2d7"
// };
// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const firestore = getFirestore(app);
// export const storage = getStorage(app);



import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBuCjHYysdf-aoi2uFnJKuxWdAkKikK74c",
  authDomain: "chit-chat-403fc.firebaseapp.com",
  projectId: "chit-chat-403fc",
  storageBucket: "chit-chat-403fc.appspot.com",
  messagingSenderId: "753747236052",
  appId: "1:753747236052:web:bbb9553d179e11517dd741"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);


