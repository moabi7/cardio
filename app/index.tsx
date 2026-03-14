import { Text, View, StyleSheet } from "react-native";
import { auth } from "../utils/firebaseConfig";
import { signOut } from "firebase/auth";
import CustomButton from "../components/CustomButton";

export default function Index() {
  const user = auth.currentUser;

  const handleSignOut = () => {
    signOut(auth);
  };

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
    backgroundColor: "#F8FAFC",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
});
