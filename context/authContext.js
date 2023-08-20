import { auth, firestore } from "@/firebase/firbase";
import { onAuthStateChanged, signOut as accountSignOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

//
const { createContext, useContext, useState, useEffect } = require("react");
const userContext = createContext();

//
export default function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clear = async () => {

        try {
            if (currentUser) {
                await updateDoc(doc(firestore, "userDetails", currentUser.uid), {
                    isOnline: false
                })
            }
            setCurrentUser(null);
            setIsLoading(false);
        } catch (error) {
            console.error(error)
        }
    }

    const signOut = () => {
        accountSignOut(auth).then(() => clear());
    }


    const authStateChange = async (user) => {
        if (!user) {
            clear();
            return;
        }

        const docRef = doc(firestore, "userDetails", user.uid);
        const userObj = await getDoc(docRef)
        const docProfileExist = await getDoc(doc(firestore, "userDetails", user.uid))

        if (docProfileExist.exists()) {
            await updateDoc(doc(firestore, "userDetails", user.uid), {
                isOnline: true
            })
        }
        setCurrentUser(userObj.data())
        setIsLoading(false)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChange)
        return () => unsubscribe();
    } , []);

    return (
        <userContext.Provider value={{ currentUser, setCurrentUser, isLoading, setIsLoading, signOut }}>
            {children}
        </userContext.Provider>
    )
}

export const useAuth = () => useContext(userContext);