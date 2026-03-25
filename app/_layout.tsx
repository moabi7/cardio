import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { checkProfileCompletion } from "../services/userService";

const InitialLayout = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const complete = await checkProfileCompletion(currentUser.uid);
        setIsOnboardingComplete(complete);
      } else {
        setIsOnboardingComplete(null);
      }
      setIsLoaded(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isLoaded || isOnboardingComplete === null && user) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    } else if (user) {
      if (!isOnboardingComplete && !inOnboardingGroup) {
        router.replace("/(onboarding)/step-form");
      } else if (isOnboardingComplete && (inAuthGroup || inOnboardingGroup)) {
        router.replace("/");
      }
    }
  }, [user, isLoaded, segments, isOnboardingComplete]);

  if (!isLoaded) return null;

  return <Slot />;
};

export default function RootLayout() {
  return (
    <InitialLayout />
  );
}
