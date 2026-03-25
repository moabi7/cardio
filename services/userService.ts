import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { User } from "../models/user";
import { db } from "../utils/firebaseConfig";

const USER_STORAGE_KEY = "@user_profile";

const cleanObject = (obj: any) => {
  const result = { ...obj };
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) {
      delete result[key];
    }
  });
  return result;
};

export const saveUserToFirebase = async (user: User) => {
  try {
    const userData = cleanObject(user.toJSON());
    await setDoc(doc(db, "users", user.uid), userData);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    console.log("User saved to Firestore and local storage!");
  } catch (error) {
    console.error("Error saving user: ", error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
  try {
    const cleanedData = cleanObject(data);
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, cleanedData);

    // Update local storage
    const cached = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const updated = { ...parsed, ...cleanedData };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error("Error updating profile: ", error);
    throw error;
  }
};

export const getCachedProfile = async () => {
  try {
    const cached = await AsyncStorage.getItem(USER_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    return null;
  }
};

export const fetchUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      return userData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile: ", error);
    return null;
  }
};

export const checkProfileCompletion = async (uid: string) => {
  try {
    const profile = await getCachedProfile();
    if (profile && profile.uid === uid && profile.onboardingComplete) {
      return true;
    }

    // Fallback to Firestore
    const remoteProfile = await fetchUserProfile(uid);
    return !!(remoteProfile && remoteProfile.onboardingComplete);
  } catch (error) {
    return false;
  }
};
export const clearCachedProfile = async () => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing cached profile: ", error);
  }
};
