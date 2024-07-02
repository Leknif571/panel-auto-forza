import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.config";

export const doSignInWithEmailPass = (email, password) => {
    return signInWithEmailAndPassword(auth, email,password)
}

export const doSignOut = () => {
    return auth.signOut();
}