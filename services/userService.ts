import { db } from "../utils/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { User } from "../models/user";

export const saveUserToFirebase = async (user: User) => {
  try {
    const userData = user.toJSON();
    await setDoc(doc(db, "users", user.uid), userData);
    console.log("User saved to Firestore!");
  } catch (error) {
    console.error("Error saving user to Firestore: ", error);
    throw error;
  }
};
