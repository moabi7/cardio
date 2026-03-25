import { Text, View, StyleSheet } from "react-native";
import { auth } from "../../utils/firebaseConfig";
import { signOut } from "firebase/auth";
import CustomButton from "../../components/CustomButton";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { clearCachedProfile } from "../../services/userService";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await clearCachedProfile();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>
        Logged in as: {user?.email}
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
