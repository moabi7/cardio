import { Text, View, StyleSheet } from "react-native";
import { auth } from "../utils/firebaseConfig";
import { signOut } from "firebase/auth";
import CustomButton from "../components/CustomButton";
import Colors from "../constants/Colors";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { checkProfileCompletion } from "../services/userService";

export default function Index() {
  const router = useRouter();
  const user = auth.currentUser;
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (user) {
        const complete = await checkProfileCompletion(user.uid);
        if (!complete) {
          router.replace("/(onboarding)/step-form");
        } else {
          setCheckingProfile(false);
        }
      } else {
        setCheckingProfile(false);
      }
    };
    
    checkOnboarding();
  }, [user]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.replace("/(auth)/sign-in");
    });
  };

  if (checkingProfile) return null; // Show nothing while checking to avoid flicker

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CardioAI</Text>
      <Text style={styles.subtitle}>
        You are signed in as: {user?.email}
      </Text>
      
      <CustomButton 
        title="Sign Out" 
        onPress={handleSignOut} 
        variant="outline" 
        style={{ width: 200, marginTop: 40 }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
