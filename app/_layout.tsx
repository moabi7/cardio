import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

const InitialLayout = () => {
  const { user, isOnboardingComplete, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || (isOnboardingComplete === null && user)) return;

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
  }, [user, isLoading, segments, isOnboardingComplete]);

  if (isLoading) return null;

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
