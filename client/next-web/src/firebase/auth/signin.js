import firebase_app from "../config";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

// 此函数用于通过Google账户进行登录
export default async function signIn() {
  let result = null,
    error = null;
  try {
    var provider = new GoogleAuthProvider();
    result = await signInWithPopup(auth, provider);
  } catch (e) {
    error = e;
  }

  return { result, error };
}