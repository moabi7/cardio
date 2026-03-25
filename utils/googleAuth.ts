import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { User, UserRole } from "../models/user";
import { fetchUserProfile, saveUserToFirebase } from "../services/userService";

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
      const newUser = new User();
      newUser.uid = user.uid;
      newUser.email = user.email || "";
      newUser.imageUrl = user.photoURL || "";
      newUser.role = UserRole.USER;

      const displayName = user.displayName || "";
      if (displayName.trim()) {
        const nameParts = displayName.trim().split(/\s+/);
        if (nameParts.length > 1) {
          newUser.firstName = nameParts[0];
          newUser.lastName = nameParts.slice(1).join(" ");
        } else {
          newUser.firstName = displayName;
          newUser.lastName = displayName;
        }
      } else {
        newUser.firstName = "New";
        newUser.lastName = "User";
      }

      await saveUserToFirebase(newUser);
    } else {
      // For existing users, ensure profile is in local storage
      await fetchUserProfile(user.uid);
    }

    return user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};
