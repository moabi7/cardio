import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  // iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    // Check if we have an idToken
    if (!userInfo.data?.idToken) {
      throw new Error("No ID token found");
    }

    const credential = GoogleAuthProvider.credential(userInfo.data.idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Save user to Firestore if they don't exist
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        fullName: user.displayName || "New User",
        email: user.email,
        createdAt: new Date().toISOString(),
        role: "user",
      });
    }

    return user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};
